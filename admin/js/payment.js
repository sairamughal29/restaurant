/* =====================================================
   ADMIN — Payment Settings
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;
  renderAdminLayout('payment');
  const p = Store.getSettings().payment || {};

  document.getElementById('py-cod').checked = p.cod !== false;
  document.getElementById('py-online').checked = !!p.online;
  document.getElementById('py-autopaid').checked = p.autoPaid !== false;
  document.getElementById('py-note').value = p.note || 'Pay cash when your order arrives.';

  document.getElementById('py-save').addEventListener('click', () => {
    if (!document.getElementById('py-cod').checked && !document.getElementById('py-online').checked) {
      toast('At least one payment method must stay enabled', 'error');
      return;
    }
    Store.saveSettings({ payment: {
      cod: document.getElementById('py-cod').checked,
      online: document.getElementById('py-online').checked,
      autoPaid: document.getElementById('py-autopaid').checked,
      note: document.getElementById('py-note').value.trim() || 'Pay cash when your order arrives.'
    } });
    toast('Payment settings saved — checkout updated');
    render();
  });

  render();
});

function render() {
  const orders = Store.all('orders');
  const paid = orders.filter(o => o.paymentStatus === 'paid');
  const unpaid = orders.filter(o => (o.paymentStatus || 'unpaid') !== 'paid');
  const codPaid = paid.filter(o => o.payment === 'COD').length;
  const onlinePaid = paid.filter(o => o.payment === 'Online').length;
  const revenue = paid.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const pendingCash = unpaid.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

  document.getElementById('py-overview').innerHTML =
    '<div class="helper-cards" style="margin-bottom:0">' +
      '<div class="mini-card"><h4>Collected (Paid)</h4><b style="color:var(--ok)">' + fmtPrice(revenue) + '</b><div class="td-muted" style="font-size:11.5px">' + paid.length + ' orders</div></div>' +
      '<div class="mini-card"><h4>Awaiting Cash (COD)</h4><b style="color:var(--warn)">' + fmtPrice(pendingCash) + '</b><div class="td-muted" style="font-size:11.5px">' + unpaid.length + ' orders</div></div>' +
      '<div class="mini-card"><h4>Paid via COD</h4><b>' + codPaid + '</b></div>' +
      '<div class="mini-card"><h4>Paid Online</h4><b>' + onlinePaid + '</b></div>' +
    '</div>';
}
