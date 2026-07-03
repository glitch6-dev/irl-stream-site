/* TG6 main — nav, mobile menu, reveal, count-ups, sticky product bar */
(function () {
  "use strict";

  // Nav blur on scroll
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 4); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      menu.setAttribute("aria-hidden", String(!open));
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", function (e) { if (e.target.tagName === "A") toggle.click(); });
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal on scroll
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && !reduced && "IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // Loadout rows: stagger-reveal + bar animation
  var rows = document.querySelectorAll(".load-row");
  if (rows.length && !reduced && "IntersectionObserver" in window) {
    var lo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); lo.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    rows.forEach(function (r, i) {
      r.classList.add("reveal");
      r.style.transitionDelay = (i * 60) + "ms";
      lo.observe(r);
    });
  } else {
    rows.forEach(function (r) { r.classList.add("in", "reveal"); });
  }

  // Count-ups: <span data-count="12" data-prefix="" data-suffix="H">0</span>
  var counters = document.querySelectorAll("[data-count]");
  function runCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduced) { el.textContent = prefix + target.toLocaleString() + suffix; return; }
    var t0 = null, dur = 1200;
    function tick(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (counters.length && "IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCount(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(runCount);
  }

  // Terminal decode: scramble glyphs resolve left-to-right into the real text
  var GLYPHS = "▓▒░<>/\\|=+*_01";
  function decode(el, delay) {
    var target = el.getAttribute("data-decode") || el.textContent;
    el.setAttribute("data-decode", target);
    if (el._decodeTimer) clearTimeout(el._decodeTimer);
    if (el._decodeRaf) cancelAnimationFrame(el._decodeRaf);
    el._decodeTimer = setTimeout(function () {
      var t0 = null, dur = 520;
      function tick(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var solved = Math.floor(target.length * p);
        var out = target.slice(0, solved);
        for (var i = solved; i < target.length; i++) {
          out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
        if (p < 1) el._decodeRaf = requestAnimationFrame(tick);
        else el.textContent = target;
      }
      el._decodeRaf = requestAnimationFrame(tick);
    }, delay);
  }

  // Sticky product bar + tier rail (product pages): show shortly after scrolling begins
  var bar = document.querySelector(".sticky-bar");
  var rail = document.querySelector(".tier-rail");
  var hero = document.querySelector(".product-hero");
  if ((bar || rail) && hero) {
    var updateBar = function () {
      // reveal once the hero is ~halfway scrolled past, not only when fully gone
      var trigger = Math.max(120, hero.offsetHeight * 0.45);
      var past = window.scrollY > trigger;
      if (bar) bar.classList.toggle("visible", past);
      if (rail) {
        var wasVisible = rail.classList.contains("visible");
        rail.classList.toggle("visible", past);
        // decode the tier names/metas on each slide-in (desktop only; rail is display:none below 1200px)
        if (past && !wasVisible && !reduced && getComputedStyle(rail).display !== "none") {
          rail.querySelectorAll(".tier-rail-item").forEach(function (item, i) {
            var name = item.querySelector(".t-name");
            // current item: decode only the VIEWING word so the ● dot stays intact
            var meta = item.querySelector(".t-meta .t-blink") || item.querySelector(".t-meta");
            if (name) decode(name, 150 + i * 100);
            if (meta) decode(meta, 250 + i * 100);
          });
        }
      }
    };
    window.addEventListener("scroll", updateBar, { passive: true });
    window.addEventListener("resize", updateBar, { passive: true });
    updateBar();
  }
})();
