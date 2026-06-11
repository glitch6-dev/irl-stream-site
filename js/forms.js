/* TG6 forms — posts to Apps Script endpoint (opaque no-cors response, optimistic success) */
(function () {
  "use strict";
  window.TG6_FORMS_ENDPOINT = "https://script.google.com/macros/s/AKfycbwykb0OnOAnyIWFHjm8ZpRj0Pc0ZQlBvnes2K-SPMqwVQlO0bq9mzghWsUa_J2nFsqd-g/exec";

  var form = document.getElementById("subscribe-form");
  if (!form) return;
  var status = document.getElementById("form-status");
  var emailEl = document.getElementById("email");
  var honeypot = document.getElementById("sub-company");
  var btn = form.querySelector("button[type='submit']");

  function setBusy(busy) {
    btn.disabled = busy;
    btn.textContent = busy ? "Subscribing..." : "Subscribe";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = emailEl.value.trim();
    if (!email || !/.+@.+\..+/.test(email)) {
      status.classList.add("err");
      status.textContent = "> INVALID EMAIL. TRY AGAIN.";
      return;
    }
    setBusy(true);
    status.classList.remove("err");
    status.textContent = "";
    fetch(window.TG6_FORMS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        formType: "subscribe",
        email: email,
        page: location.pathname,
        company: honeypot ? honeypot.value : ""
      })
    }).then(function () {
      status.textContent = "> SUBSCRIBED. WE'LL PING YOU WHEN IT DROPS.";
      form.reset();
    }).catch(function () {
      status.classList.add("err");
      status.textContent = "> TRANSMISSION FAILED. TRY AGAIN.";
    }).finally(function () { setBusy(false); });
  });
})();
