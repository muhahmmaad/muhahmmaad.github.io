(function () {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("contact-status");
  var button = document.getElementById("contact-submit");
  var inbox = form.getAttribute("data-inbox") || "";

  function show(message, ok) {
    if (!status) return;
    status.hidden = false;
    status.textContent = message;
    status.className = "contact__status " + (ok ? "contact__status--ok" : "contact__status--err");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (button) button.disabled = true;

    var action = form.getAttribute("action") || "";
    var ajaxUrl = action.replace("formsubmit.co/", "formsubmit.co/ajax/");
    var payload = new FormData(form);

    fetch(ajaxUrl, {
      method: "POST",
      body: payload,
      headers: { Accept: "application/json" },
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        var data = result.data || {};
        if (result.ok && data.success !== "false" && data.success !== false) {
          form.reset();
          show("Sent. I’ll reply to you by email.", true);
        } else {
          show(
            data.message ||
              "If this is the first message, open the confirmation email sent to " +
                inbox +
                " and click Activate.",
            false
          );
        }
      })
      .catch(function () {
        form.submit();
      })
      .finally(function () {
        if (button) button.disabled = false;
      });
  });
})();
