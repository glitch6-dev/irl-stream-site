/* TG6 Signal Check — tier picker types a diagnostic line and spotlights the matching card */
(function () {
  "use strict";
  var TIERS = {
    city:        { product: "metro",  line: "> MATCH: TG6_METRO · T-MOBILE 5G · $2,100 · PRE-ORDER" },
    backcountry: { product: "roamer", line: "> MATCH: TG6_ROAMER · DUAL-SIM BONDED · $5,000 · PRE-ORDER" },
    offgrid:     { product: "nomad",  line: "> MATCH: TG6_NOMAD · STARLINK ROAM · $3,000 · PRE-ORDER" }
  };
  var tiles = document.querySelectorAll(".finder-tile");
  var out = document.querySelector(".finder-line");
  var section = document.querySelector(".lineup");
  if (!tiles.length || !out || !section) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var typeTimer = null;

  function typeLine(text) {
    if (typeTimer) clearInterval(typeTimer);
    if (reduced) { out.textContent = text; return; }
    var i = 0;
    out.innerHTML = "";
    typeTimer = setInterval(function () {
      i++;
      out.innerHTML = text.slice(0, i).replace(/</g, "&lt;") + '<span class="caret">_</span>';
      if (i >= text.length) { clearInterval(typeTimer); typeTimer = null; }
    }, 14);
  }

  function clearPick() {
    section.classList.remove("has-pick");
    if (typeTimer) { clearInterval(typeTimer); typeTimer = null; }
    out.textContent = "";
    tiles.forEach(function (t) { t.classList.remove("is-active"); });
    section.querySelectorAll("[data-product]").forEach(function (c) { c.classList.remove("is-rec"); });
  }

  tiles.forEach(function (tile) {
    tile.addEventListener("click", function () {
      var tier = TIERS[tile.dataset.tier];
      if (!tier) return;
      tiles.forEach(function (t) { t.classList.remove("is-active"); });
      tile.classList.add("is-active");
      typeLine(tier.line);
      section.classList.add("has-pick");
      section.querySelectorAll("[data-product]").forEach(function (card) {
        card.classList.toggle("is-rec", card.dataset.product === tier.product);
      });
    });
  });

  // Outside click clears the pick (preserved behavior)
  document.addEventListener("click", function (e) {
    if (!section.classList.contains("has-pick")) return;
    if (e.target.closest(".finder-tile") || e.target.closest(".finder-line") || e.target.closest(".pcard.is-rec")) return;
    clearPick();
  });
})();
