/* "Find your backpack" — maps where-you-stream to a tier recommendation
   and spotlights the matching product card in the merged #shop section. */
(function () {
  window.TG6_TIERS = {
    city:        { name: 'TG6 Metro',  product: 'metro',  blurb: 'City streets, dense coverage. Plug-and-play 5G — the simplest setup, lowest price.' },
    backcountry: { name: 'TG6 Roamer', product: 'roamer', blurb: 'Trails, backroads, events — patchy single-carrier coverage. Dual-SIM bonding keeps you live.' },
    offgrid:     { name: 'TG6 Nomad',  product: 'nomad',  blurb: 'Truly remote, off-grid, international. Starlink streams where there is no cell at all.' }
  };

  window.initFinder = function () {
    var tiles = document.querySelectorAll('.finder-tile');
    var result = document.querySelector('.finder-result');
    var shop = document.getElementById('shop');
    if (!tiles.length || !result || !shop) return;
    tiles.forEach(function (tile) {
      tile.addEventListener('click', function () {
        tiles.forEach(function (t) { t.classList.remove('is-active'); });
        tile.classList.add('is-active');
        var tier = TG6_TIERS[tile.dataset.tier];
        if (!tier) return;
        result.querySelector('.finder-rec').textContent = tier.name;
        result.querySelector('.finder-blurb').textContent = tier.blurb;
        result.classList.add('is-visible');
        shop.classList.add('has-pick');
        shop.querySelectorAll('[data-product]').forEach(function (card) {
          card.classList.toggle('is-rec', card.dataset.product === tier.product);
        });
      });
    });

    // Clicking outside the highlight (tiles, result, or the spotlit card) resets the pick.
    document.addEventListener('click', function (e) {
      if (!shop.classList.contains('has-pick')) return;
      if (e.target.closest('.finder-tile') || e.target.closest('.finder-result') || e.target.closest('.product.is-rec')) return;
      shop.classList.remove('has-pick');
      result.classList.remove('is-visible');
      tiles.forEach(function (t) { t.classList.remove('is-active'); });
      shop.querySelectorAll('[data-product]').forEach(function (card) { card.classList.remove('is-rec'); });
    });
  };
})();
