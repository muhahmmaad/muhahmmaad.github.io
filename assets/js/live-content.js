/**
 * After admin Publish, GitHub has the new YAML immediately.
 * GitHub Pages HTML can stay cached for a few minutes, so this
 * pulls identity from the repo and patches the visible name.
 */
(function () {
  var REPO = "muhahmmaad/muhahmmaad.github.io";

  function yamlScalar(text, key) {
    var re = new RegExp("^" + key + ":\\s*(?:\"([^\"]*)\"|'([^']*)'|(.+))$", "m");
    var m = text && text.match(re);
    if (!m) return null;
    return (m[1] || m[2] || m[3] || "").trim();
  }

  function fill(attr, value) {
    if (!value) return;
    document.querySelectorAll('[data-live="' + attr + '"]').forEach(function (el) {
      el.textContent = value;
    });
  }

  function applyIdentity(identity, home) {
    var name = yamlScalar(identity, "name");
    var tagline = yamlScalar(identity, "tagline");
    var greeting = yamlScalar(home, "greeting");
    fill("name", name);
    fill("tagline", tagline);
    fill("greeting", greeting);
    if (name) {
      var parts = document.title.split("|");
      document.title = parts.length > 1 ? name + " |" + parts.slice(1).join("|") : name;
    }
  }

  function load(path) {
    var url =
      "https://raw.githubusercontent.com/" + REPO + "/main/" + path + "?t=" + Date.now();
    return fetch(url, { cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error(String(res.status));
      return res.text();
    });
  }

  function refresh() {
    return load("_data/identity.yml")
      .then(function (identity) {
        return load("_data/home.yml")
          .then(function (home) {
            applyIdentity(identity, home);
          })
          .catch(function () {
            applyIdentity(identity, "");
          });
      })
      .catch(function () {
        /* keep the HTML GitHub Pages already built */
      });
  }

  window.refreshLiveContent = refresh;
  refresh();
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") refresh();
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(function () {});
  }
})();
