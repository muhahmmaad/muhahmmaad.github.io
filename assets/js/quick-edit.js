/**
 * If this browser is logged into /admin/, show per-section Edit
 * buttons and a small admin bar on the live site.
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

  var adminRoot = document.documentElement.getAttribute("data-admin") || "/admin/";

  function entryUrl(spec) {
    var parts = spec.split("/");
    return adminRoot + "#/collections/" + parts[0] + "/entries/" + parts[1];
  }

  var bar = document.createElement("div");
  bar.className = "quick-edit-bar";
  bar.innerHTML =
    '<span class="quick-edit-bar__label">Admin</span>' +
    '<a href="' + entryUrl("homepage/identity") + '">Name &amp; settings</a>' +
    '<a href="' + entryUrl("appearance/theme") + '">Theme</a>' +
    '<a href="' + adminRoot + '#/collections/posts">Blog</a>' +
    '<a href="' + adminRoot + '">Open CMS</a>' +
    '<button type="button" class="quick-edit-bar__logout" id="quick-edit-logout">Log out</button>';
  document.body.insertBefore(bar, document.body.firstChild);

  document.querySelectorAll("[data-cms]").forEach(function (section) {
    var spec = section.getAttribute("data-cms");
    if (!spec) return;
    var link = document.createElement("a");
    link.className = "quick-edit";
    link.href = entryUrl(spec);
    link.textContent = "Edit";
    link.setAttribute("aria-label", "Edit this section in admin");
    section.appendChild(link);
  });

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
