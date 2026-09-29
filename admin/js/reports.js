/* =====================================================
   ADMIN — Reports & Analytics (computed from real orders)
   ===================================================== */

let repState = { range: '30', from: '', to: '' };

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;
  renderAdminLayout('reports');

  document.querySelectorAll('#rep-range [data-r]').forEach(ch => ch.addEventListener('click', () => {
    repState.range = ch.dataset.r;
    document.querySelectorAll('#rep-range [data-r]').forEach(x => x.classList.remove('active'));
    ch.classList.add('active');
    document.getElementById('rep-custom').style.display = repState.range === 'custom' ? 'flex' : 'none';
    if (repState.range === 'custom') {
      document.getElementById('rep-from').value = repState.from || localDateKey(Date.now() - 29 * 86400000);
      document.getElementById('rep-to').value = repState.to || localDateKey();
    }
    render();
  }));
  document.getElementById('rep-apply').addEventListener('click', () => {
    repState.from = document.getElementById('rep-from').value;
    repState.to = document.getElementById('rep-to').value;
    if (repState.from && repState.to) render();
    else toast('Pick both dates', 'error');
  });

  document.getElementById('rep-csv').addEventListener('click', exportCSV);
  document.getElementById('rep-pdf').addEventListener('click', () => window.print());

  render();
  let rT; window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(render, 250); });
});

function rangeDates() {
  const now = new Date();
  const y = new Date(now); y.setDate(now.getDate() - 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);
  switch (repState.range) {
    case 'today':      return [localDateKey(now), localDateKey(now)];
    case 'yesterday':  return [localDateKey(y), localDateKey(y)];
    case '7':          { const a = new Date(now); a.setDate(now.getDate() - 6); return [localDateKey(a), localDateKey(now)]; }
    case '30':         { const a = new Date(now); a.setDate(now.getDate() - 29); return [localDateKey(a), localDateKey(now)]; }
    case 'month':      return [localDateKey(monthStart), localDateKey(now)];
    case 'year':       return [localDateKey(yearStart), localDateKey(now)];
    case 'custom':     return [repState.from || localDateKey(now), repState.to || localDateKey(now)];
    default:           { const a = new Date(now); a.setDate(now.getDate() - 29); return [localDateKey(a), localDateKey(now)]; }
  }
}

function rangeOrders() {
  const [from, to] = rangeDates();
  return Store.all('orders').filter(o => {
    const d = localDateKey(o.createdAt);
    return d >= from && d <= to;
  });
}

function render() {
  const [from, to] = rangeDates();
  const orders = rangeOrders();
  const ok = orders.filter(o => o.status !== 'cancelled');
  const cancelled = orders.filter(o => o.status === 'cancelled');
  const revenue = ok.reduce((s, o) => s + o.total, 0);
  const aov = ok.length ? Math.round(revenue / ok.length) : 0;
  const cancelRate = orders.length ? Math.round(cancelled.length / orders.length * 100) : 0;
  const paidCount = orders.filter(o => o.paymentStatus === 'paid').length;
  const itemsSold = ok.reduce((n, o) => n + o.items.reduce((m, i) => m + i.qty, 0), 0);

  document.getElementById('rep-stats').innerHTML = [
    { l: 'Revenue', v: fmtPrice(revenue), ic: AI.money },
    { l: 'Orders', v: ok.length, ic: AI.orders },
    { l: 'Avg. Order Value', v: fmtPrice(aov), ic: AI.cal },
    { l: 'Items Sold', v: itemsSold, ic: AI.foods },
    { l: 'Paid Orders', v: paidCount + '/' + orders.length, ic: AI.wallet },
    { l: 'Cancelled', v: cancelled.length + ' (' + cancelRate + '%)', ic: AI.warn }
  ].map(c =>
    '<div class="stat-card"><div class="stat-top">' +
    '<div><div class="stat-label">' + c.l + '</div><div class="stat-value">' + c.v + '</div></div>' +
    '<div class="stat-ic ' + (c.l === 'Cancelled' ? 'ic-warn' : '') + '">' + c.ic + '</div></div></div>').join('');

  document.getElementById('rep-sub').textContent = fmtDate(from) + ' → ' + fmtDate(to);

  /* daily chart data within range */
  const days = Math.max(1, Math.round((new Date(to) - new Date(from)) / 86400000) + 1);
  const series = dailySeries(Math.min(days, 90)).filter(s => s.date >= from && s.date <= to);
  const labels = series.map(s => new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }));
  CH.line(document.getElementById('rep-revenue'), labels, series.map(s => s.sales), { height: 260 });
  const step = Math.ceil(labels.length / 14);
  CH.bar(document.getElementById('rep-orders'),
    labels.filter((_, i) => i % step === 0),
    series.filter((_, i) => i % step === 0).map(s => s.orders), { height: 260 });

  /* payment methods donut */
  const payCounts = {};
  orders.forEach(o => { const k = o.payment + (o.paymentStatus === 'paid' ? ' (paid)' : ' (unpaid)'); payCounts[k] = (payCounts[k] || 0) + 1; });
  const paySegs = Object.keys(payCounts).map((k, i) => ({
    label: k, value: payCounts[k], color: ['#e11d2e', '#ff5a6e', '#3884ff', '#2fbf71', '#f5a524', '#666'][i % 6]
  }));
  CH.donut(document.getElementById('rep-pay'), paySegs.length ? paySegs : [{ label: 'No orders', value: 1, color: '#333' }],
    { height: 260, centerValue: orders.length, centerLabel: 'Orders' });

  /* most ordered foods */
  const counts = {};
  ok.forEach(o => o.items.forEach(it => { counts[it.name] = (counts[it.name] || 0) + it.qty; }));
  let pairs = Object.keys(counts).map(k => [k, counts[k]]).sort((a, b) => b[1] - a[1]).slice(0, 6);
  CH.hbar(document.getElementById('rep-foods'), pairs.length ? pairs.map(p => p[0]) : ['No data'], pairs.length ? pairs.map(p => p[1]) : [0], { height: 260 });

  /* revenue by category */
  const catRevenue = {};
  ok.forEach(o => o.items.forEach(it => {
    const f = foodById(it.foodId);
    const cat = f ? categoryById(f.categoryId) : null;
    const k = cat ? cat.name : 'Other';
    catRevenue[k] = (catRevenue[k] || 0) + it.lineTotal;
  }));
  const catSegs = Object.keys(catRevenue).map((k, i) => ({ label: k, value: catRevenue[k], color: ['#e11d2e', '#ff5a6e', '#a3121f', '#ff8a96', '#7f1d1d', '#c084fc', '#3884ff'][i % 7] }));
  CH.donut(document.getElementById('rep-cats'), catSegs.length ? catSegs : [{ label: 'No data', value: 1, color: '#333' }],
    { height: 260, centerValue: Object.values(catRevenue).reduce((a, b) => a + b, 0).toLocaleString(), centerLabel: 'Revenue (Rs.)' });

  /* customer growth (cumulative, monthly) */
  const joins = {};
  Store.all('customers').forEach(c => { const k = (c.joined || '').slice(0, 7); if (k) joins[k] = (joins[k] || 0) + 1; });
  const months = Object.keys(joins).sort().slice(-6);
  let cum = 0;
  const cumVals = months.map(m => { cum += joins[m]; return cum; });
  CH.line(document.getElementById('rep-customers'),
    months.map(m => new Date(m + '-01').toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })),
    cumVals.length ? cumVals : [0], { height: 260 });

  /* cancelled table */
  document.getElementById('rep-cancel-sub').textContent = cancelled.length + ' in range';
  document.getElementById('rep-cancelled').innerHTML = cancelled.length
    ? '<table class="tbl"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Date</th><th>Status</th></tr></thead><tbody>' +
      cancelled.map(o =>
        '<tr><td data-label="Order" class="td-red">#' + o.id + '</td>' +
        '<td data-label="Customer" class="td-bold">' + esc(o.customerName) + '</td>' +
        '<td data-label="Total" class="td-bold">' + fmtPrice(o.total) + '</td>' +
        '<td data-label="Date" class="td-muted">' + fmtDateTime(o.createdAt) + '</td>' +
        '<td data-label="Status">' + badgeHTML(o.status) + '</td></tr>').join('') +
      '</tbody></table>'
    : '<div class="empty-state"><div class="empty-icon">' + AI.check + '</div><h3>No cancellations</h3><p>Zero cancelled orders in this period.</p></div>';
}

function exportCSV() {
  const [from, to] = rangeDates();
  const orders = rangeOrders();
  if (!orders.length) { toast('No orders in this range', 'error'); return; }
  const rows = [['Order ID', 'Date', 'Customer', 'Phone', 'Items', 'Subtotal', 'Delivery', 'Discount', 'Total', 'Payment', 'Payment Status', 'Status']];
  orders.forEach(o => rows.push(['#' + o.id, fmtDateTime(o.createdAt), o.customerName, o.phone,
    o.items.map(i => i.qty + 'x ' + i.name).join('; '), o.subtotal, o.deliveryFee, o.discount, o.total,
    o.payment, o.paymentStatus || 'unpaid', o.status]));
  downloadFile('flamecrust-report-' + from + '_to_' + to + '.csv', toCSV(rows), 'text/csv');
  toast(rows.length - 1 + ' rows exported');
}
