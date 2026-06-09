/* Data-driven product hotspots. Coords are % of the image box (x=left, y=top).
   Swap flat-photo coords for component-shot coords later without code changes. */
(function () {
  window.TG6_HOTSPOTS = {
    metro: [
      { x: 50, y: 20, icon: 'camera',  label: 'Sony ZV-1 II 4K camera', blurb: 'Compact 4K camera with a flip screen and clean HDMI out — broadcast-grade picture in a run-and-gun body.' },
      { x: 70, y: 46, icon: 'signal',  label: 'T-Mobile 5G gateway',     blurb: 'Plug-and-play 5G home internet. In dense city coverage it just works — no bonding, no fuss.' },
      { x: 32, y: 60, icon: 'battery', label: 'Hot-swap battery',        blurb: 'Swap power mid-stream without going dark. Runs the full kit for hours on a single pack.' },
      { x: 58, y: 78, icon: 'chip',    label: 'Elgato Cam Link 4K',      blurb: 'Turns the camera HDMI into a clean USB capture feed the encoder can push to Twitch/YouTube/Kick.' }
    ],
    roamer: [
      { x: 50, y: 20, icon: 'camera',  label: 'Sony ZV-1 II 4K camera', blurb: 'Same broadcast-grade 4K camera and clean HDMI capture as the Metro.' },
      { x: 70, y: 46, icon: 'signal',  label: 'Peplink MAX Transit Duo', blurb: 'Dual-SIM bonding (T-Mobile + Verizon). When one carrier drops on the backroads, the stream rides the other.' },
      { x: 32, y: 60, icon: 'battery', label: 'Hot-swap battery',        blurb: 'Hours of mobile power; swap packs without dropping the broadcast.' },
      { x: 58, y: 78, icon: 'chip',    label: 'Bonded encoder',          blurb: 'Combines both carriers into one stable uplink so bitrate stays steady through patchy coverage.' }
    ],
    nomad: [
      { x: 50, y: 20, icon: 'camera',  label: 'Sony ZV-1 II 4K camera', blurb: 'Broadcast-grade 4K in a travel-light body for off-grid shoots.' },
      { x: 70, y: 46, icon: 'signal',  label: 'Starlink portable',       blurb: 'Low-earth-orbit satellite uplink. Stream from anywhere on earth — no cell towers required.' },
      { x: 32, y: 60, icon: 'battery', label: 'Expedition power',        blurb: 'High-capacity, hot-swappable power sized for long off-grid sessions.' },
      { x: 58, y: 78, icon: 'chip',    label: 'Encoder + failover',      blurb: 'Pushes a clean feed over satellite with cellular failover when any coverage exists.' }
    ]
  };

  function show(root, productKey, i) {
    var h = TG6_HOTSPOTS[productKey][i];
    root.querySelector('.hs-label').textContent = h.label;
    root.querySelector('.hs-blurb').textContent = h.blurb;
    root.querySelectorAll('.hs-dot').forEach(function (d) {
      d.classList.toggle('is-active', +d.dataset.index === i);
    });
  }

  window.initHotspots = function (rootSelector, productKey) {
    var root = document.querySelector(rootSelector);
    if (!root || !TG6_HOTSPOTS[productKey]) return;
    var layer = root.querySelector('.hs-layer');
    TG6_HOTSPOTS[productKey].forEach(function (h, i) {
      var dot = document.createElement('button');
      dot.className = 'hs-dot';
      dot.type = 'button';
      dot.style.left = h.x + '%';
      dot.style.top = h.y + '%';
      dot.dataset.index = i;
      dot.setAttribute('aria-label', h.label);
      dot.innerHTML = (window.TG6_ICONS && TG6_ICONS[h.icon]) || '';
      dot.addEventListener('click', function () { show(root, productKey, i); });
      layer.appendChild(dot);
    });
    show(root, productKey, 0); // default to first component
  };
})();
