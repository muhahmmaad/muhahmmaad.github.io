(function () {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("contact-status");
  var button = document.getElementById("contact-submit");

  function show(message, ok) {
    if (!status) return;
    status.hidden = false;
    status.textContent = message;
    status.className = "contact__status " + (ok ? "contact__status--ok" : "contact__status--err");
  }

  form.addEventListener("submit", function () {
    if (button) {
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
    }
    show("Sending… check Gmail if FormSubmit asks you to activate the form.", true);
  });
})();
