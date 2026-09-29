/* =====================================================
   FLAME & CRUST — Menu Page
   Renders from the shared Store and re-renders live
   when the admin panel changes menu / categories.
   ===================================================== */

let state = { cat: 'all', q: '' };

function renderChips() {
  const chips = [{ id: 'all', name: 'All' }].concat(activeCategories());
  const wrap = document.getElementById('menu-chips');
  wrap.innerHTML = chips.map(c =>
    '<button class="chip' + (state.cat === c.name.toLowerCase() ? ' active' : '') + '" data-cat="' + c.name.toLowerCase() + '">' + c.name + '</button>'
  ).join('');

  wrap.querySelectorAll('[data-cat]').forEach(ch => {
    ch.addEventListener('click', () => {
      state.cat = ch.dataset.cat;
      wrap.querySelectorAll('[data-cat]').forEach(x => x.classList.remove('active'));
      ch.classList.add('active');
      render();
    });
  });
}

function render() {
  const grid = document.getElementById('menu-grid');
  const count = document.getElementById('menu-count');

  let foods = Store.all('foods');
  if (state.cat !== 'all') {
    const cat = activeCategories().find(c => c.name.toLowerCase() === state.cat);
    if (cat) foods = foods.filter(f => f.categoryId === cat.id);
  }
  if (state.q) {
    foods = foods.filter(f => (f.name + ' ' + f.desc).toLowerCase().includes(state.q));
  }

  count.textContent = foods.length + (foods.length === 1 ? ' item found' : ' items found');

  if (!foods.length) {
    grid.style.display = 'block';
    grid.innerHTML = emptyState(ICONS.search,
      'No Results Found',
      state.q ? 'We could not find anything matching "' + esc(state.q) + '". Try a different keyword or category.'
              : 'This category has no items yet. Please check back later.',
      '<button class="btn btn-primary" onclick="resetFilters()">Clear Filters</button>');
    return;
  }

  grid.style.display = '';
  grid.innerHTML = foods.map(foodCardHTML).join('');
  bindCards(grid);
  observeReveals();
}

function resetFilters() {
  state = { cat: 'all', q: '' };
  document.getElementById('menu-search').value = '';
  renderChips();
  render();
}

document.addEventListener('DOMContentLoaded', () => {
  const urlCat = new URLSearchParams(location.search).get('cat');
  if (urlCat) state.cat = urlCat.toLowerCase();

  renderChips();

  /* search */
  const search = document.getElementById('menu-search');
  search.addEventListener('input', () => { state.q = search.value.trim().toLowerCase(); render(); });

  /* initial skeleton then render */
  const grid = document.getElementById('menu-grid');
  grid.innerHTML = skeletonCards(6);
  setTimeout(render, 400);

  /* live sync with the admin panel */
  Store.subscribe(() => { renderChips(); render(); });
});
