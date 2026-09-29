/* =====================================================
   ADMIN — Delivery Settings
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;
  renderAdminLayout('delivery');
  const s = Store.getSettings();

  const v = (id, val) => document.getElementById(id).value = val == null ? '' : val;
  v('dv-fee', s.deliveryFee); v('dv-free', s.freeThreshold); v('dv-min', s.minOrder);
  v('dv-est', s.estTime); v('dv-areas', s.areas);

  const areas = (s.areas || '').split(',').map(x => x.trim()).filter(Boolean);
  document.getElementById('dv-summary').innerHTML =
    '<div class="mini-card"><h4>Delivery Fee</h4><b>' + fmtPrice(s.deliveryFee) + '</b></div>' +
    '<div class="mini-card"><h4>Free Above</h4><b>' + (s.freeThreshold ? fmtPrice(s.freeThreshold) : 'Never') + '</b></div>' +
    '<div class="mini-card"><h4>Min. Order</h4><b>' + fmtPrice(s.minOrder) + '</b></div>' +
    '<div class="mini-card"><h4>Est. Time</h4><b>' + esc(s.estTime || '—') + '</b></div>' +
    '<div class="mini-card"><h4>Zones</h4><b>' + areas.length + '</b></div>';

  document.getElementById('dv-save').addEventListener('click', () => {
    Store.saveSettings({
      deliveryFee: parseFloat(document.getElementById('dv-fee').value) || 0,
      freeThreshold: parseFloat(document.getElementById('dv-free').value) || 0,
      minOrder: parseFloat(document.getElementById('dv-min').value) || 0,
      estTime: document.getElementById('dv-est').value.trim() || '30-40 min',
      areas: document.getElementById('dv-areas').value.trim()
    });
    toast('Delivery settings saved — checkout uses them immediately');
  });
});
