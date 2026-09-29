/* =====================================================
   ADMIN — Dashboard (all numbers computed from real data)
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;
  renderAdminLayout('dashboard');
  renderAll();

  /* live refresh: new orders from other tabs trigger toast + re-render */
  startOrderWatch(renderAll);
  /* keep charts crisp on resize */
  let rT; window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(renderCharts, 250); });
});

function renderAll() {
  renderStats();
  renderCharts();
  renderRecent();
  renderAdminLayout('dashboard'); /* refresh badges */
}

function statsData() {
  const orders = Store.all('orders');
  const today = localDateKey();
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 6);
  const monthStart = new Date(); monthStart.setDate(monthStart.getDate() - 29);
  const notCancelled = orders.filter(o => o.status !== 'cancelled');
  const sum = arr => arr.reduce((s, o) => s + (o.total || 0), 0);

  return {
    orders,
    totalOrders: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    outForDelivery: orders.filter(o => o.status === 'out-for-delivery').length,
    completed: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: sum(notCancelled),
    todayRevenue: sum(notCancelled.filter(o => localDateKey(o.createdAt) === today)),
    weekRevenue: sum(notCancelled.filter(o => new Date(o.createdAt) >= weekStart)),
    monthRevenue: sum(notCancelled.filter(o => new Date(o.createdAt) >= monthStart)),
    customers: Store.all('customers').length,
    foods: Store.all('foods').length,
    categories: Store.all('categories').length
  };
}

function renderStats() {
  const d = statsData();
  const series = dailySeries(7);
  const sales7 = series.map(s => s.sales);
  const orders7 = series.map(s => s.orders);

  const cards = [
    { ic: AI.orders, cls: 'ic-dim',   label: 'Total Orders',        val: d.totalOrders,                       spark: orders7 },
    { ic: AI.clock,  cls: '',         label: 'Pending',             val: d.pending,     sub: d.pending ? 'action needed' : 'all caught up' },
    { ic: AI.check,  cls: 'ic-ok',    label: 'Confirmed',           val: d.confirmed },
    { ic: AI.foods,  cls: '',         label: 'Preparing',           val: d.preparing },
    { ic: AI.truck,  cls: '',         label: 'Out for Delivery',    val: d.outForDelivery },
    { ic: AI.check,  cls: 'ic-ok',    label: 'Completed',           val: d.completed },
    { ic: AI.x,      cls: 'ic-dim',   label: 'Cancelled',           val: d.cancelled },
    { ic: AI.money,  cls: '',         label: 'Total Revenue',       val: fmtPrice(d.totalRevenue),   spark: sales7 },
    { ic: AI.money,  cls: '',         label: "Today's Revenue",     val: fmtPrice(d.todayRevenue),   sub: 'live', spark: sales7.slice(-3) },
    { ic: AI.cal,    cls: '',         label: 'Weekly Revenue',      val: fmtPrice(d.weekRevenue),    sub: 'last 7 days', spark: sales7 },
    { ic: AI.report, cls: '',         label: 'Monthly Revenue',     val: fmtPrice(d.monthRevenue),   sub: 'last 30 days' },
    { ic: AI.users,  cls: 'ic-dim',   label: 'Total Customers',     val: d.customers },
    { ic: AI.foods,  cls: 'ic-dim',   label: 'Food Items',          val: d.foods },
    { ic: AI.cats,   cls: 'ic-dim',   label: 'Categories',          val: d.categories }
  ];

  const grid = document.getElementById('stat-grid');
  grid.innerHTML = cards.map(c =>
    '<div class="stat-card">' +
      '<div class="stat-top">' +
        '<div><div class="stat-label">' + c.label + '</div>' +
        '<div class="stat-value">' + c.val + '</div>' +
        (c.sub ? '<div class="stat-sub">' + c.sub + '</div>' : '') + '</div>' +
        '<div class="stat-ic ' + (c.cls || '') + '">' + c.ic + '</div>' +
      '</div>' +
      (c.spark ? '<div class="stat-spark"><canvas data-spark="' + esc(c.label) + '"></canvas></div>' : '') +
    '</div>').join('');

  grid.querySelectorAll('canvas[data-spark]').forEach(cv => {
    const key = cv.dataset.spark;
    const src = key.includes('Orders') ? orders7 : key.includes('Today') ? sales7.slice(-3) : sales7;
    CH.spark(cv, src, { type: 'bar', height: 30 });
  });
}

function renderCharts() {
  /* revenue last 14 days (real orders + compact history) */
  const s14 = dailySeries(14);
  CH.line(document.getElementById('ch-sales'),
    s14.map(s => new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })),
    s14.map(s => s.sales), { height: 250 });

  /* status donut */
  const orders = Store.all('orders');
  const statusCounts = {};
  orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
  const colors = { pending: '#f5a524', confirmed: '#e11d2e', preparing: '#ff5a6e', ready: '#c084fc', 'out-for-delivery': '#3884ff', delivered: '#2fbf71', cancelled: '#3a3a3a' };
  const segs = Object.keys(statusCounts).map(st => ({ label: STATUS_META[st].label, value: statusCounts[st], color: colors[st] || '#666' }));
  CH.donut(document.getElementById('ch-status'), segs.length ? segs : [{ label: 'No orders', value: 1, color: '#333' }],
    { height: 250, centerValue: orders.length, centerLabel: 'Orders' });

  /* popular foods from real order items */
  const counts = {};
  orders.forEach(o => { if (o.status === 'cancelled') return; o.items.forEach(it => { counts[it.name] = (counts[it.name] || 0) + it.qty; }); });
  let pairs = Object.keys(counts).map(k => [k, counts[k]]).sort((a, b) => b[1] - a[1]).slice(0, 5);
  CH.hbar(document.getElementById('ch-popular'), pairs.length ? pairs.map(p => p[0]) : ['No data'], pairs.length ? pairs.map(p => p[1]) : [0], { height: 250 });

  /* orders per day last 7 */
  const s7 = dailySeries(7);
  CH.bar(document.getElementById('ch-orders'),
    s7.map(s => new Date(s.date).toLocaleDateString('en-GB', { weekday: 'short' })),
    s7.map(s => s.orders), { height: 250 });
}

function renderRecent() {
  const orders = Store.all('orders').slice(0, 7);
  const el = document.getElementById('recent-orders');
  if (!orders.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">' + AI.orders + '</div><h3>No orders yet</h3><p>New orders will appear here in real time.</p></div>';
    return;
  }
  const seen = Store.load()._lastSeenOrderId || 0;
  el.innerHTML = '<table class="tbl"><thead><tr>' +
    '<th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th>' +
    '</tr></thead><tbody>' +
    orders.map(o => {
      const next = nextStatus(o.status);
      const isNew = o.status === 'pending' && o.id > seen;
      return '<tr' + (isNew ? ' class="row-new"' : '') + '>' +
        '<td data-label="Order" class="td-red">#' + o.id + (isNew ? ' <span class="badge red">NEW</span>' : '') + '</td>' +
        '<td data-label="Customer"><div style="display:flex;align-items:center;gap:10px">' + initialAvatar(o.customerName, 30) +
          '<span class="td-bold">' + esc(o.customerName) + '</span></div></td>' +
        '<td data-label="Items" class="td-muted">' + o.items.reduce((n, i) => n + i.qty, 0) + ' items • ' + esc(o.items[0].name) + (o.items.length > 1 ? ' +' + (o.items.length - 1) : '') + '</td>' +
        '<td data-label="Total" class="td-bold">' + fmtPrice(o.total) + '</td>' +
        '<td data-label="Payment">' + payBadge(o) + '</td>' +
        '<td data-label="Status">' + badgeHTML(o.status) + '</td>' +
        '<td data-label="Date" class="td-muted">' + fmtDateTime(o.createdAt) + '</td>' +
        '<td data-label="" class="actions-cell"><div class="actions">' +
          '<button class="icon-btn" data-view="' + o.id + '" title="View details">' + AI.eye + '</button>' +
          (next ? '<button class="icon-btn ok" data-advance="' + o.id + '" title="Mark ' + STATUS_META[next].label + '">' + AI.check + '</button>' : '') +
        '</div></td>' +
      '</tr>';
    }).join('') +
    '</tbody></table>';

  el.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => openOrderModal(Store.get('orders', b.dataset.view), renderAll)));
  el.querySelectorAll('[data-advance]').forEach(b => b.addEventListener('click', () => {
    const o = Store.get('orders', b.dataset.advance);
    const next = nextStatus(o.status);
    if (next) {
      Store.update('orders', o.id, { status: next });
      toast('Order #' + o.id + ' → ' + STATUS_META[next].label);
      renderAll();
    }
  }));
}

/* live refresh when the website (another tab) changes data */
window.onDBChange = renderAll;
