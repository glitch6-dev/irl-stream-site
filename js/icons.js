/* TG6 shared inline-SVG icon set. White line icons, 24x24, stroke 1.5.
   Usage: element.innerHTML = TG6_ICONS.city; */
(function () {
  function svg(inner) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" ' +
      'width="100%" height="100%" aria-hidden="true">' + inner + '</svg>';
  }
  window.TG6_ICONS = {
    city: svg('<path d="M3 21h18"/><rect x="4" y="9" width="6" height="12"/><rect x="14" y="4" width="6" height="17"/><path d="M6.5 12.5h1M6.5 15.5h1M16.5 8h1M16.5 11.5h1M16.5 15h1"/>'),
    backcountry: svg('<path d="M3 20h18"/><path d="M3 20l6-12 3.5 5 2.5-3.5L21 20"/><path d="M9 8l1.2 2"/>'),
    offgrid: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18"/>'),
    camera: svg('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7l1.5-2h5L16 7"/><circle cx="12" cy="13" r="3.2"/>'),
    signal: svg('<path d="M5 18a10 10 0 0 1 14 0"/><path d="M8 15a6 6 0 0 1 8 0"/><circle cx="12" cy="18.5" r="1.4" fill="currentColor"/>'),
    battery: svg('<rect x="3" y="8" width="15" height="9" rx="2"/><path d="M21 11v3"/><path d="M7 12.5h4"/>'),
    chip: svg('<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 4v3M14 4v3M10 17v3M14 17v3M4 10h3M4 14h3M17 10h3M17 14h3"/>'),
    external: svg('<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>'),
    twitch: svg('<path d="M4 3h16v11l-4 4h-4l-3 3H7v-3H4z"/><path d="M11 8v4M15 8v4"/>'),
    youtube: svg('<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M11 9.5l4 2.5-4 2.5z" fill="currentColor"/>'),
    kick: svg('<path d="M5 4h4v5l4-5h5l-6 8 6 8h-5l-4-5v5H5z" fill="currentColor" stroke="none"/>')
  };
})();
