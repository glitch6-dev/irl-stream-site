/* "Find your backpack" — maps where-you-stream to a tier recommendation. */
(function () {
  window.TG6_TIERS = {
    city:        { name: 'TG6 Metro',  href: 'products/metro.html',  blurb: 'City streets, dense coverage. Plug-and-play 5G — the simplest setup, lowest price.' },
    backcountry: { name: 'TG6 Roamer', href: 'products/roamer.html', blurb: 'Trails, backroads, events — patchy single-carrier coverage. Dual-SIM bonding keeps you live.' },
    offgrid:     { name: 'TG6 Nomad',  href: 'products/nomad.html',  blurb: 'Truly remote, off-grid, international. Starlink streams where there is no cell at all.' }
  };

  window.initFinder = function () {
    var tiles = document.querySelectorAll('.finder-tile');
    var result = document.querySelector('.finder-result');
    if (!tiles.length || !result) return;
    tiles.forEach(function (tile) {
      tile.addEventListener('click', function () {
        tiles.forEach(function (t) { t.classList.remove('is-active'); });
        tile.classList.add('is-active');
        var tier = TG6_TIERS[tile.dataset.tier];
        if (!tier) return;
        result.querySelector('.finder-rec').textContent = tier.name;
        result.querySelector('.finder-blurb').textContent = tier.blurb;
        var cta = result.querySelector('.finder-cta');
        cta.setAttribute('href', tier.href);
        result.classList.add('is-visible');
      });
    });
  };
})();
