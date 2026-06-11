/* TG6 forms — posts to Apps Script endpoint (opaque no-cors response, optimistic success) */
(function () {
  "use strict";
  window.TG6_FORMS_ENDPOINT = "https://script.google.com/macros/s/AKfycbwykb0OnOAnyIWFHjm8ZpRj0Pc0ZQlBvnes2K-SPMqwVQlO0bq9mzghWsUa_J2nFsqd-g/exec";

  function post(payload) {
    return fetch(window.TG6_FORMS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
  }

  var EMAIL_RE = /.+@.+\..+/;

  // Subscribe (homepage)
  var form = document.getElementById("subscribe-form");
  if (form) {
    var status = document.getElementById("form-status");
    var emailEl = document.getElementById("email");
    var honeypot = document.getElementById("sub-company");
    var btn = form.querySelector("button[type='submit']");

    var setBusy = function (busy) {
      btn.disabled = busy;
      btn.textContent = busy ? "Subscribing..." : "Subscribe";
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = emailEl.value.trim();
      if (!email || !EMAIL_RE.test(email)) {
        status.classList.add("err");
        status.textContent = "> INVALID EMAIL. TRY AGAIN.";
        return;
      }
      setBusy(true);
      status.classList.remove("err");
      status.textContent = "";
      post({
        formType: "subscribe",
        email: email,
        page: location.pathname,
        company: honeypot ? honeypot.value : ""
      }).then(function () {
        status.textContent = "> SUBSCRIBED. WE'LL PING YOU WHEN IT DROPS.";
        form.reset();
      }).catch(function () {
        status.classList.add("err");
        status.textContent = "> TRANSMISSION FAILED. TRY AGAIN.";
      }).finally(function () { setBusy(false); });
    });
  }

  // Contact page — same endpoint contract as the old inline script
  var cform = document.getElementById("contactForm");
  if (cform) {
    var cstatus = document.getElementById("contact-status");
    var cbtn = document.getElementById("submitButton");

    var setCBusy = function (busy) {
      cbtn.disabled = busy;
      cbtn.textContent = busy ? "Sending..." : "Send message";
    };

    cform.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = cform.elements.email.value.trim();
      var message = cform.elements.message.value.trim();
      if (!email || !EMAIL_RE.test(email) || !message) {
        cstatus.classList.add("err");
        cstatus.textContent = "> CHECK EMAIL + MESSAGE. TRY AGAIN.";
        return;
      }
      setCBusy(true);
      cstatus.classList.remove("err");
      cstatus.textContent = "";
      post({
        formType: "contact",
        name: cform.elements.name.value.trim(),
        email: email,
        subject: cform.elements.subject.value,
        message: message,
        userAgent: navigator.userAgent || "",
        referer: document.referrer || "",
        company: cform.elements.company ? cform.elements.company.value : ""
      }).then(function () {
        cstatus.textContent = "> MESSAGE SENT. WE'LL GET BACK TO YOU.";
        cform.reset();
      }).catch(function () {
        cstatus.classList.add("err");
        cstatus.textContent = "> TRANSMISSION FAILED. TRY AGAIN.";
      }).finally(function () { setCBusy(false); });
    });
  }
})();
