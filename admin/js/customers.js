/* =====================================================
   ADMIN — Customer Management (real order history)
   ===================================================== */

let custState = { q: '', status: 'all' };

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;
  renderAdminLayout('customers');

  const urlQ = new URLSearchParams(location.search).get('q');
  if (urlQ) { custState.q = urlQ.toLowerCase(); document.getElementById('cust-search').value = custState.q; }

  document.getElementById('cust-search').addEventListener('input', e => { custState.q = e.target.value.trim().toLowerCase(); render(); });
  document.querySelectorAll('#cust-filters [data-s]').forEach(ch => ch.addEventListener('click', () => {
    custState.status = ch.dataset.s;
    document.querySelectorAll('#cust-filters [data-s]').forEach(x => x.classList.remove('active'));
    ch.classList.add('active');
    render();
  }));
  document.getElementById('cust-export').addEventListener('click', () => {
    const rows = [['Name', 'Email', 'Phone', 'Address', 'Orders', 'Total Spent', 'Last Order', 'Joined', 'Status']];
    customerStats(Store.all('customers')).forEach(c => rows.push([c.name, c.email, c.phone || '', c.address || '', c.realOrders, c.realSpent, c.lastOrder ? fmtDate(c.lastOrder) : '—', fmtDate(c.joined), c.status]));
    downloadFile('flamecrust-customers-' + localDateKey() + '.csv', toCSV(rows), 'text/csv');
    toast('Customers exported');
  });

  render();
});

/* real stats computed from orders */
function customerStats(customers) {
  const orders = Store.all('orders');
  return customers.map(c => {
    const mine = orders.filter(o =>
      (o.email && c.email && o.email.toLowerCase() === c.email.toLowerCase()) ||
      o.customerName.toLowerCase() === c.name.toLowerCase());
    const sorted = mine.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return {
      ...c,
      realOrders: mine.length,
      realSpent: mine.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
      lastOrder: sorted.length ? sorted[0].createdAt : null
    };
  });
}

function render() {
  let customers = Store.all('customers');
  if (custState.status !== 'all') customers = customers.filter(c => c.status === custState.status);
  if (custState.q) customers = customers.filter(c =>
    c.name.toLowerCase().includes(custState.q) || c.email.toLowerCase().includes(custState.q) ||
    (c.phone || '').includes(custState.q));

  const stats = customerStats(customers);
  const el = document.getElementById('cust-table');
  document.getElementById('cust-count').textContent = stats.length + ' customers';

  if (!stats.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">' + AI.users + '</div>' +
      '<h3>No customers found</h3><p>Customer accounts will appear here as people register.</p></div>';
    return;
  }

  el.innerHTML = '<table class="tbl"><thead><tr>' +
    '<th>Customer</th><th>Contact</th><th>Orders</th><th>Total Spent</th><th>Last Order</th><th>Joined</th><th>Status</th><th>Actions</th>' +
    '</tr></thead><tbody>' +
    stats.map(c =>
      '<tr>' +
        '<td data-label="Customer"><div style="display:flex;align-items:center;gap:11px">' + initialAvatar(c.name, 34) +
          '<div><div class="td-bold">' + esc(c.name) + '</div><div class="tf-sub">' + esc(c.email) + '</div></div></div></td>' +
        '<td data-label="Contact" class="td-muted">' + esc(c.phone || '—') + '<div class="tf-sub">' + esc(c.address || 'No address') + '</div></td>' +
        '<td data-label="Orders" class="td-bold">' + c.realOrders + '</td>' +
        '<td data-label="Spent" class="td-red">' + fmtPrice(c.realSpent) + '</td>' +
        '<td data-label="Last Order" class="td-muted">' + (c.lastOrder ? fmtDate(c.lastOrder) : '—') + '</td>' +
        '<td data-label="Joined" class="td-muted">' + fmtDate(c.joined) + '</td>' +
        '<td data-label="Status">' + (c.status === 'active' ? '<span class="badge st-delivered">Active</span>' : '<span class="badge st-cancelled">Blocked</span>') + '</td>' +
        '<td data-label="" class="actions-cell"><div class="actions">' +
          '<button class="icon-btn" data-view="' + c.id + '" title="View & order history">' + AI.eye + '</button>' +
          '<button class="icon-btn" data-block="' + c.id + '" title="' + (c.status === 'active' ? 'Block' : 'Unblock') + '">' + (c.status === 'active' ? AI.x : AI.check) + '</button>' +
        '</div></td>' +
      '</tr>').join('') +
    '</tbody></table>';

  el.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () =>
    openCustomerModal(Store.get('customers', b.dataset.view))));
  el.querySelectorAll('[data-block]').forEach(b => b.addEventListener('click', () => {
    const c = Store.get('customers', b.dataset.block);
    const ns = c.status === 'active' ? 'blocked' : 'active';
    Store.update('customers', c.id, { status: ns });
    toast(c.name + (ns === 'blocked' ? ' blocked' : ' unblocked'), ns === 'blocked' ? 'error' : 'success');
    render();
  }));
}

function openCustomerModal(c) {
  if (!c) return;
  const orders = Store.all('orders').filter(o =>
    (o.email && c.email && o.email.toLowerCase() === c.email.toLowerCase()) ||
    o.customerName.toLowerCase() === c.name.toLowerCase())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const spent = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

  openModal(
    modalHead('Customer — ' + esc(c.name)) +
    '<div class="modal-body">' +
      '<div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">' + initialAvatar(c.name, 56) +
        '<div><b style="font-size:16px">' + esc(c.name) + '</b>' +
        '<div class="td-muted">' + esc(c.email) + ' • ' + esc(c.phone || 'no phone') + '</div>' +
        '<div class="td-muted">' + esc(c.address || 'No address on file') + '</div>' +
        '<div class="td-muted">Member since ' + fmtDate(c.joined) + '</div></div></div>' +
      '<div class="od-grid" style="grid-template-columns:1fr 1fr 1fr">' +
        '<div class="kv"><span class="k">Orders</span><b>' + orders.length + '</b></div>' +
        '<div class="kv"><span class="k">Total Spent</span><b class="td-red">' + fmtPrice(spent) + '</b></div>' +
        '<div class="kv"><span class="k">Avg. Order</span><b>' + fmtPrice(orders.length ? Math.round(spent / Math.max(1, orders.filter(o => o.status !== 'cancelled').length)) : 0) + '</b></div>' +
      '</div>' +
      '<h4 style="font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:var(--text-2);margin-bottom:10px">Complete Order History</h4>' +
      (orders.length
        ? '<div class="od-items">' + orders.map(o =>
            '<div class="od-item" data-open="' + o.id + '" style="cursor:pointer"><span class="td-red" style="font-weight:800">#' + o.id + '</span>' +
            '<span class="td-muted">' + fmtDate(o.createdAt) + '</span>' +
            '<span style="margin-left:auto">' + badgeHTML(o.status) + '</span>' +
            '<span class="od-line">' + fmtPrice(o.total) + '</span></div>').join('') + '</div>'
        : '<p class="td-muted">No orders on record yet.</p>') +
    '</div>' +
    '<div class="modal-foot"><button class="btn btn-ghost" data-close>Close</button></div>', 'lg');

  document.querySelectorAll('[data-open]').forEach(el => el.addEventListener('click', () =>
    openOrderModal(Store.get('orders', el.dataset.open), render)));
}

/* live refresh when the website (another tab) changes data */
window.onDBChange = render;
