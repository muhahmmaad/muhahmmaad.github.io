/**
 * Decap collapses list rows (publications, stats, skills…).
 * Open every row so title, text, photo and dates can be edited in place.
 */
(function () {
  function fieldsVisible(item) {
    return !!item.querySelector(
      'input, textarea, select, [class*="crop-widget"], [data-slate-editor], [class*="ControlPane"]'
    );
  }

  function expandRow(item) {
    if (fieldsVisible(item)) return;
    var buttons = item.querySelectorAll("button");
    if (buttons.length < 2) return;
    var first = buttons[0];
    var last = buttons[buttons.length - 1];
    if (first === last) return;
    var label = ((first.getAttribute("aria-label") || "") + " " + (first.title || "")).toLowerCase();
    if (label.indexOf("delete") !== -1 || label.indexOf("remove") !== -1) return;
    first.click();
  }

  function expandAll() {
    document.querySelectorAll('[class*="ListItem"]').forEach(expandRow);
  }

  var scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      expandAll();
    });
  }

  var observer = new MutationObserver(schedule);
  function start() {
    if (!document.body) return;
    observer.observe(document.body, { childList: true, subtree: true });
    expandAll();
    setTimeout(expandAll, 400);
    setTimeout(expandAll, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
