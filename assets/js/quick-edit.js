/**
 * If this browser is logged into /admin/, show Edit on the live page.
 * Editing stays on this page — a drawer, not a redirect.
 */
(function () {
  function isCmsAdmin() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!key || !/cms/i.test(key)) continue;
        var value = localStorage.getItem(key) || "";
        if (value.indexOf("token") !== -1) return true;
      }
    } catch (err) {
      return false;
    }
    return false;
  }

  if (!isCmsAdmin()) return;

  document.documentElement.classList.add("is-admin");
  document.documentElement.classList.add("is-admin-editing");

  var adminRoot = document.documentElement.getAttribute("data-admin") || "/admin/";

  function entryUrl(spec) {
    if (!spec) return adminRoot;
    if (spec.indexOf("#") === 0) return adminRoot + spec;
    var parts = spec.split("/");
    if (parts.length < 2) return adminRoot + "#/collections/" + spec;
    return adminRoot + "#/collections/" + parts[0] + "/entries/" + parts[1];
  }

  var overlay = document.createElement("div");
  overlay.className = "quick-edit-overlay";
  overlay.innerHTML =
    '<div class="quick-edit-drawer" role="dialog" aria-modal="true" aria-label="Edit on this page">' +
      '<div class="quick-edit-drawer__bar">' +
        '<span class="quick-edit-drawer__title">Edit</span>' +
        '<button type="button" class="quick-edit-drawer__done" id="quick-edit-done">Done</button>' +
      "</div>" +
      '<iframe class="quick-edit-drawer__frame" title="Section editor"></iframe>' +
    "</div>";
  document.body.appendChild(overlay);

  var iframe = overlay.querySelector("iframe");
  var titleEl = overlay.querySelector(".quick-edit-drawer__title");

  function closeEditor() {
    overlay.classList.remove("is-open");
    document.body.classList.remove("quick-edit-open");
    iframe.src = "about:blank";
    if (window.refreshLiveContent) window.refreshLiveContent();
    window.location.reload();
  }

  function openEditor(spec, label) {
    titleEl.textContent = label ? "Edit · " + label : "Edit";
    iframe.src = entryUrl(spec);
    overlay.classList.add("is-open");
    document.body.classList.add("quick-edit-open");
  }

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) closeEditor();
  });
  document.getElementById("quick-edit-done").addEventListener("click", closeEditor);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) closeEditor();
  });

  var bar = document.createElement("div");
  bar.className = "quick-edit-bar";
  bar.innerHTML =
    '<span class="quick-edit-bar__label">Edit</span>' +
    '<button type="button" data-edit="homepage/identity" data-edit-label="Name">Name</button>' +
    '<button type="button" data-edit="appearance/theme" data-edit-label="Theme">Theme</button>' +
    '<button type="button" data-edit="#/collections/posts" data-edit-label="Blog">Blog</button>' +
    '<button type="button" id="quick-edit-browse">Browse</button>' +
    '<button type="button" class="quick-edit-bar__logout" id="quick-edit-logout">Out</button>';
  document.body.insertBefore(bar, document.body.firstChild);

  bar.querySelectorAll("[data-edit]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openEditor(btn.getAttribute("data-edit"), btn.getAttribute("data-edit-label"));
    });
  });

  document.querySelectorAll("[data-cms]").forEach(function (section) {
    var spec = section.getAttribute("data-cms");
    if (!spec) return;
    var heading = section.querySelector(".section__title, .home__title, .project__title, .post-card__title");
    var label =
      section.getAttribute("data-cms-label") ||
      (heading ? heading.textContent.trim().slice(0, 40) : spec.split("/")[1]);
    var button = document.createElement("button");
    button.type = "button";
    button.className = "quick-edit";
    button.textContent = "Edit";
    button.setAttribute("aria-label", "Edit this section here");
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      openEditor(spec, label);
    });
    section.appendChild(button);
  });

  document.addEventListener(
    "click",
    function (event) {
      if (!document.documentElement.classList.contains("is-admin-editing")) return;
      if (event.target.closest(".quick-edit-overlay, .quick-edit-bar, .quick-edit, .nav__toggle, .nav__close, .change-theme, .scrollup, .contact__form, .gram-tab, .blog-filter__chip")) return;
      var target = event.target.closest("[data-cms]");
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      var spec = target.getAttribute("data-cms");
      var label = target.getAttribute("data-cms-label") || spec;
      openEditor(spec, label);
    },
    true
  );

  var browse = document.getElementById("quick-edit-browse");
  if (browse) {
    browse.addEventListener("click", function () {
      document.documentElement.classList.toggle("is-admin-editing");
      browse.textContent = document.documentElement.classList.contains("is-admin-editing")
        ? "Browse site"
        : "Click to edit";
    });
  }

  var logout = document.getElementById("quick-edit-logout");
  if (logout) {
    logout.addEventListener("click", function () {
      try {
        var remove = [];
        for (var i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i);
          if (key && /cms/i.test(key)) remove.push(key);
        }
        remove.forEach(function (key) {
          localStorage.removeItem(key);
        });
      } catch (err) {}
      window.location.reload();
    });
  }
})();
