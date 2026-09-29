/* =====================================================
   ADMIN — Inventory / Availability
   ===================================================== */

let invState = { q: '', filter: 'all' };

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;
  renderAdminLayout('inventory');
  document.getElementById('inv-search').addEventListener('input', e => { invState.q = e.target.value.trim().toLowerCase(); render(); });
  document.getElementById('inv-filter').addEventListener('change', e => { invState.filter = e.target.value; render(); });
  render();
  startOrderWatch();
});

function render() {
  const foods = Store.all('foods');
  const out = foods.filter(f => !isOrderable(f)).length;
  const low = foods.filter(f => f.available && typeof f.stock === 'number' && f.stock > 0 && f.stock <= 5).length;
  const tracked = foods.filter(f => typeof f.stock === 'number').length;
  document.getElementById('inv-summary').innerHTML =
    '<div class="mini-card"><h4>Total Items</h4><b>' + foods.length + '</b></div>' +
    '<div class="mini-card"><h4>Tracked Stock</h4><b>' + tracked + '</b></div>' +
    '<div class="mini-card"><h4 style="color:var(--warn)">Low Stock (≤5)</h4><b style="color:var(--warn)">' + low + '</b></div>' +
    '<div class="mini-card"><h4 style="color:#ff8a96">Not Orderable</h4><b style="color:#ff8a96">' + out + '</b></div>';

  let list = foods.slice();
  if (invState.filter === 'tracked') list = list.filter(f => typeof f.stock === 'number');
  if (invState.filter === 'low') list = list.filter(f => f.available && typeof f.stock === 'number' && f.stock > 0 && f.stock <= 5);
  if (invState.filter === 'out') list = list.filter(f => !isOrderable(f));
  if (invState.filter === 'disabled') list = list.filter(f => !f.available);
  if (invState.q) list = list.filter(f => f.name.toLowerCase().includes(invState.q));

  const el = document.getElementById('inv-table');
  document.getElementById('inv-count').textContent = list.length + ' items';
  if (!list.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">' + AI.inventory + '</div><h3>Nothing here</h3><p>No items match this filter.</p></div>';
    return;
  }

  el.innerHTML = '<table class="tbl"><thead><tr>' +
    '<th>Item</th><th>Availability</th><th>Stock Level</th><th>Adjust</th><th>Status</th>' +
    '</tr></thead><tbody>' +
    list.map(f =>
      '<tr' + (!isOrderable(f) ? ' class="row-new"' : '') + '>' +
        '<td data-label="Item"><div class="td-food"><img src="../' + f.image + '" alt="">' +
          '<div><div class="td-bold">' + esc(f.name) + '</div><div class="tf-sub">' + (categoryById(f.categoryId) || { name: '—' }).name + '</div></div></div></td>' +
        '<td data-label="Availability"><label class="switch"><input type="checkbox" data-avail="' + f.id + '"' + (f.available ? ' checked' : '') + '><span class="slider"></span></label></td>' +
        '<td data-label="Stock">' + stockBadge(f) + '</td>' +
        '<td data-label="Adjust"><div style="display:flex;align-items:center;gap:6px">' +
          '<button class="icon-btn" data-dec="' + f.id + '" title="-1">' + AI.minus + '</button>' +
          '<input class="input input-sm" style="width:64px;text-align:center" type="number" min="0" value="' + (f.stock === null || f.stock === undefined ? '' : f.stock) + '" placeholder="∞" data-stock="' + f.id + '">' +
          '<button class="icon-btn" data-inc="' + f.id + '" title="+1">' + AI.plus + '</button></div></td>' +
        '<td data-label="Status">' + (isOrderable(f) ? '<span class="badge st-delivered">Orderable</span>' : '<span class="badge st-cancelled">Blocked</span>') + '</td>' +
      '</tr>').join('') +
    '</tbody></table>';

  el.querySelectorAll('[data-avail]').forEach(sw => sw.addEventListener('change', () => {
    const f = Store.get('foods', sw.dataset.avail);
    Store.update('foods', f.id, { available: sw.checked });
    toast(f.name + (sw.checked ? ' enabled for ordering' : ' disabled — customers cannot order it'), sw.checked ? 'success' : 'error');
    render();
  }));
  el.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => bump(b.dataset.inc, 1)));
  el.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => bump(b.dataset.dec, -1)));
  el.querySelectorAll('[data-stock]').forEach(inp => inp.addEventListener('change', () => {
    const f = Store.get('foods', inp.dataset.stock);
    const v = inp.value.trim();
    Store.update('foods', f.id, { stock: v === '' ? null : Math.max(0, parseInt(v) || 0) });
    toast(f.name + ' stock updated');
    render();
  }));
}

function bump(id, d) {
  const f = Store.get('foods', id);
  const cur = (f.stock === null || f.stock === undefined) ? 0 : f.stock;
  Store.update('foods', id, { stock: Math.max(0, cur + d) });
  render();
}

/* live refresh when the website (another tab) changes data */
window.onDBChange = render;
