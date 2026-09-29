/* =====================================================
   ADMIN — Order Management (search / filters / workflow)
   ===================================================== */

let ordState = { q: '', status: 'all', from: '', to: '', pay: 'all' };

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;
  renderAdminLayout('orders');

  /* deep-link from global search: orders.html?q=1024 */
  const urlQ = new URLSearchParams(location.search).get('q');
  if (urlQ) { ordState.q = urlQ.replace('#', ''); document.getElementById('ord-search').value = ordState.q; }

  const counts = {};
  Store.all('orders').forEach(o => { counts[o.status] = (counts[o.status] || 0) + 1; });
  const filters = ['all', 'pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'];
  document.getElementById('ord-filters').innerHTML = filters.map(f =>
    '<button class="chip' + (f === 'all' ? ' active' : '') + '" data-f="' + f + '">' +
    (f === 'all' ? 'All Orders' : STATUS_META[f].label) +
    ' <span class="c-count">' + (f === 'all' ? Store.all('orders').length : (counts[f] || 0)) + '</span></button>').join('');

  document.querySelectorAll('#ord-filters [data-f]').forEach(ch => ch.addEventListener('click', () => {
    ordState.status = ch.dataset.f;
    document.querySelectorAll('#ord-filters [data-f]').forEach(x => x.classList.remove('active'));
    ch.classList.add('active');
    render();
  }));

  document.getElementById('ord-search').addEventListener('input', e => { ordState.q = e.target.value.trim().toLowerCase(); render(); });
  document.getElementById('ord-from').addEventListener('change', e => { ordState.from = e.target.value; render(); });
  document.getElementById('ord-to').addEventListener('change', e => { ordState.to = e.target.value; render(); });
  document.getElementById('ord-pay').addEventListener('change', e => { ordState.pay = e.target.value; render(); });
  document.getElementById('ord-clear').addEventListener('click', () => {
    ordState = { q: '', status: 'all', from: '', to: '', pay: 'all' };
    document.getElementById('ord-search').value = '';
    document.getElementById('ord-from').value = '';
    document.getElementById('ord-to').value = '';
    document.getElementById('ord-pay').value = 'all';
    document.querySelectorAll('#ord-filters [data-f]').forEach(x => x.classList.toggle('active', x.dataset.f === 'all'));
    render();
  });
  document.getElementById('ord-export').addEventListener('click', exportOrders);

  render();
  startOrderWatch(() => { render(); });
});

function filtered() {
  let orders = Store.all('orders');
  if (ordState.status !== 'all') orders = orders.filter(o => o.status === ordState.status);
  if (ordState.from) orders = orders.filter(o => localDateKey(o.createdAt) >= ordState.from);
  if (ordState.to) orders = orders.filter(o => localDateKey(o.createdAt) <= ordState.to);
  if (ordState.pay !== 'all') {
    if (ordState.pay === 'paid' || ordState.pay === 'unpaid') orders = orders.filter(o => (o.paymentStatus || 'unpaid') === ordState.pay);
    else orders = orders.filter(o => o.payment === ordState.pay);
  }
  if (ordState.q) {
    orders = orders.filter(o =>
      ('#' + o.id).includes(ordState.q.replace('#', '')) ||
      o.customerName.toLowerCase().includes(ordState.q) ||
      (o.phone || '').replace(/\s/g, '').includes(ordState.q.replace(/\s/g, '')) ||
      (o.email || '').toLowerCase().includes(ordState.q));
  }
  return orders;
}

function render() {
  const orders = filtered();
  const el = document.getElementById('orders-table');
  document.getElementById('ord-count').textContent = orders.length + ' orders found';

  if (!orders.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">' + AI.orders + '</div>' +
      '<h3>No orders found</h3><p>Try changing the filters, dates or search term.</p></div>';
    return;
  }

  const seen = Store.load()._lastSeenOrderId || 0;
  el.innerHTML = '<table class="tbl"><thead><tr>' +
    '<th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date & Time</th><th>Actions</th>' +
    '</tr></thead><tbody>' +
    orders.map(o => {
      const next = nextStatus(o.status);
      const isNew = o.status === 'pending' && o.id > seen;
      return '<tr' + (isNew ? ' class="row-new"' : '') + '>' +
        '<td data-label="Order" class="td-red">#' + o.id + (isNew ? ' <span class="badge red">NEW</span>' : '') + '</td>' +
        '<td data-label="Customer"><div style="display:flex;align-items:center;gap:10px">' + initialAvatar(o.customerName, 30) +
          '<div><div class="td-bold">' + esc(o.customerName) + '</div><div class="tf-sub">' + esc(o.phone) + '</div></div></div></td>' +
        '<td data-label="Items" class="td-muted">' + o.items.reduce((n, i) => n + i.qty, 0) + ' items<br>' + esc(o.items[0].name) + (o.items.length > 1 ? ' +' + (o.items.length - 1) : '') + '</td>' +
        '<td data-label="Total" class="td-bold">' + fmtPrice(o.total) + '</td>' +
        '<td data-label="Payment">' + payBadge(o) + '</td>' +
        '<td data-label="Status">' + badgeHTML(o.status) + '</td>' +
        '<td data-label="Date" class="td-muted">' + fmtDateTime(o.createdAt) + '</td>' +
        '<td data-label="" class="actions-cell"><div class="actions">' +
          '<button class="icon-btn" data-view="' + o.id + '" title="Open full details">' + AI.eye + '</button>' +
          (next ? '<button class="icon-btn ok" data-advance="' + o.id + '" title="Advance to ' + STATUS_META[next].label + '">' + AI.check + '</button>' : '') +
          (o.status !== 'cancelled' && o.status !== 'delivered' ? '<button class="icon-btn" data-cancel="' + o.id + '" title="Cancel order">' + AI.x + '</button>' : '') +
          '<button class="icon-btn" data-print="' + o.id + '" title="Print invoice">' + AI.printer + '</button>' +
        '</div></td>' +
      '</tr>';
    }).join('') +
    '</tbody></table>';

  bindActions(el);
}

function bindActions(scope) {
  scope.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () =>
    openOrderModal(Store.get('orders', b.dataset.view), render)));

  scope.querySelectorAll('[data-advance]').forEach(b => b.addEventListener('click', () => {
    const o = Store.get('orders', b.dataset.advance);
    const next = nextStatus(o.status);
    if (next) {
      Store.update('orders', o.id, { status: next });
      toast('Order #' + o.id + ' → ' + STATUS_META[next].label);
      render();
    }
  }));

  scope.querySelectorAll('[data-cancel]').forEach(b => b.addEventListener('click', () => {
    const id = parseInt(b.dataset.cancel);
    confirmDialog('Cancel order #' + id + '?', 'The customer will see this order as cancelled. It can be restored later.', () => {
      Store.update('orders', id, { status: 'cancelled' });
      toast('Order #' + id + ' cancelled', 'error');
      render();
    }, 'Yes, Cancel It');
  }));

  scope.querySelectorAll('[data-print]').forEach(b => b.addEventListener('click', () => printInvoice(b.dataset.print)));
}

function exportOrders() {
  const orders = filtered();
  if (!orders.length) { toast('No orders to export', 'error'); return; }
  const rows = [['Order ID', 'Date', 'Customer', 'Phone', 'Email', 'Address', 'Items', 'Subtotal', 'Delivery', 'Discount', 'Coupon', 'Total', 'Payment', 'Payment Status', 'Order Status', 'Notes']];
  orders.forEach(o => rows.push([
    '#' + o.id, fmtDateTime(o.createdAt), o.customerName, o.phone, o.email || '',
    o.address + (o.city ? ', ' + o.city : ''),
    o.items.map(i => i.qty + 'x ' + i.name).join('; '),
    o.subtotal, o.deliveryFee, o.discount, o.coupon || '', o.total, o.payment,
    o.paymentStatus || 'unpaid', o.status, o.notes || ''
  ]));
  downloadFile('flamecrust-orders-' + localDateKey() + '.csv', toCSV(rows), 'text/csv');
  toast(rows.length - 1 + ' orders exported to CSV');
}

/* live refresh when the website (another tab) changes data */
window.onDBChange = render;
