/* TG6 camera picker — swaps the pre-order checkout link + shown total to match the selected camera */
(function () {
  "use strict";
  var radios = document.querySelectorAll(".cam-radio");
  if (!radios.length) return;
  var links = document.querySelectorAll("[data-preorder-link]");
  var totals = document.querySelectorAll("[data-preorder-total]");

  function apply(radio) {
    var url = radio.getAttribute("data-link");
    var total = radio.getAttribute("data-total");
    if (!url) return;
    links.forEach(function (a) { a.href = url; });
    totals.forEach(function (el) { el.textContent = total; });
  }

  radios.forEach(function (radio) {
    radio.addEventListener("change", function () { apply(radio); });
    if (radio.checked) apply(radio);
  });
})();
