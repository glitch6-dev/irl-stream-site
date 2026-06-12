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

  // Sticky product bar (product pages): show shortly after scrolling begins
  var bar = document.querySelector(".sticky-bar");
  var hero = document.querySelector(".product-hero");
  if (bar && hero) {
    var updateBar = function () {
      // reveal once the hero is ~halfway scrolled past, not only when fully gone
      var trigger = Math.max(120, hero.offsetHeight * 0.45);
      bar.classList.toggle("visible", window.scrollY > trigger);
    };
    window.addEventListener("scroll", updateBar, { passive: true });
    window.addEventListener("resize", updateBar, { passive: true });
    updateBar();
  }
})();
