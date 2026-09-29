/* =====================================================
   FLAME & CRUST — Order Confirmation + Tracking
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page || '';
  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('id'));

  if (location.pathname.includes('order-confirmation')) renderConfirmation(id);
  else renderTracking(id);
});

function getOrder(id) {
  return Store.all('orders').find(o => o.id === id) || Store.all('orders')[0];
}

/* ================= CONFIRMATION ================= */
function renderConfirmation(id) {
  const root = document.getElementById('confirm-root');
  const o = getOrder(id);

  if (!o) {
    root.innerHTML = emptyState(ICONS.search, 'Order Not Found',
      'We could not find this order.',
      '<a href="index.html" class="btn btn-primary">Back to Home</a>');
    return;
  }

  root.innerHTML =
    '<div class="confirm-check">' + ICONS.check + '</div>' +
    '<h1>Order <span class="red">Confirmed</span></h1>' +
    '<p class="sub">Thank you, <b>' + o.customerName.split(' ')[0] + '</b>! Your order has been received and our kitchen is getting started.</p>' +
    '<div class="order-no-pill">Order Number <b>#' + o.id + '</b></div>' +
    '<div class="confirm-boxes">' +
      '<div class="card confirm-box"><div class="ic">' + ICONS.clock + '</div><b>Estimated Delivery</b><span>' + o.estimated + '</span></div>' +
      '<div class="card confirm-box"><div class="ic">' + ICONS.truck + '</div><b>Delivery To</b><span>' + o.address.slice(0, 40) + (o.address.length > 40 ? '…' : '') + '</span></div>' +
      '<div class="card confirm-box"><div class="ic">' + ICONS.cart + '</div><b>Total Amount</b><span>' + fmtPrice(o.total) + ' (' + o.payment + ')</span></div>' +
    '</div>' +
    '<div class="flex gap-12" style="justify-content:center;flex-wrap:wrap">' +
      '<a href="order-tracking.html?id=' + o.id + '" class="btn btn-primary btn-lg">' + ICONS.truck + ' Track Order</a>' +
      '<a href="index.html" class="btn btn-outline btn-lg">Back to Home</a>' +
    '</div>';
}

/* ================= TRACKING ================= */
const STEP_DESC = [
  'We have received your order and sent it to the kitchen.',
  'Our team confirmed your order. Getting things ready!',
  'Our chefs are cooking your food fresh right now.',
  'Your order is packed and ready for pickup by the rider.',
  'Your rider is on the way to your address.',
  'Order delivered. Enjoy your meal — and don\'t forget to review it!'
];

function renderTracking(id) {
  const root = document.getElementById('track-root');
  const o = getOrder(id);

  if (!o) {
    root.innerHTML = emptyState(ICONS.search, 'Order Not Found',
      'We could not find this order. It may have been placed on another device.',
      '<a href="orders.html" class="btn btn-primary">My Orders</a>');
    return;
  }

  const meta = STATUS_META[o.status] || STATUS_META.pending;
  const cancelled = o.status === 'cancelled';
  const currentStep = meta.step;

  let steps = '';
  ORDER_FLOW.forEach((st, i) => {
    let cls = '';
    if (cancelled) { if (i <= currentStep) cls = 'done'; }
    else if (i < currentStep) cls = 'done';
    else if (i === currentStep) cls = 'current';
    steps += '<div class="t-step ' + cls + '">' +
      '<div class="t-dot">' + (i < currentStep || (cancelled && i < currentStep) ? ICONS.check : (i + 1)) + '</div>' +
      '<h4>' + STATUS_META[st].label + '</h4>' +
      '<p>' + (cls === 'current' ? STEP_DESC[i] : cls === 'done' ? 'Completed' : 'Waiting') + '</p>' +
    '</div>';
  });

  if (cancelled) {
    steps += '<div class="t-step done"><div class="t-dot" style="background:#3a3a3a;border-color:#4a4a4a">' + ICONS.x + '</div>' +
      '<h4>Cancelled</h4><p>This order was cancelled.</p></div>';
  }

  root.innerHTML =
    '<div class="card track-card">' +
      '<div class="track-head">' +
        '<div><div class="tno">Order <b>#' + o.id + '</b></div>' +
        '<span class="muted" style="font-size:13px">Placed ' + fmtDateTime(o.createdAt) + '</span></div>' +
        badgeHTML(o.status) +
      '</div>' +
      '<div class="timeline">' + steps + '</div>' +
      '<div class="track-meta">' +
        '<div class="tb"><span>Items</span><b>' + o.items.reduce((n, i) => n + i.qty, 0) + ' items • ' + fmtPrice(o.total) + '</b></div>' +
        '<div class="tb"><span>Delivering To</span><b>' + o.address.slice(0, 34) + (o.address.length > 34 ? '…' : '') + '</b></div>' +
        '<div class="tb"><span>Estimated Delivery</span><b>' + (cancelled ? '—' : o.estimated) + '</b></div>' +
      '</div>' +
      (o.status === 'delivered'
        ? '<button class="btn btn-primary btn-block mt-24" id="review-btn">' + ICONS.star + ' Rate Your Order</button>'
        : (!cancelled
          ? '<div class="mt-24 flex gap-12" style="flex-wrap:wrap">' +
              '<button class="btn btn-ghost btn-block" id="advance-btn">Simulate Next Step (Demo)</button>' +
            '</div>'
          : '')) +
    '</div>';

  const adv = document.getElementById('advance-btn');
  if (adv) adv.addEventListener('click', () => {
    const idx = STATUS_META[o.status].step;
    const next = ORDER_FLOW[Math.min(idx + 1, ORDER_FLOW.length - 1)];
    Store.update('orders', o.id, { status: next });
    toast('Status updated to ' + STATUS_META[next].label);
    renderTracking(o.id);
  });

  const rb = document.getElementById('review-btn');
  if (rb) rb.addEventListener('click', () => openReviewModal(o)); /* shared modal (app.js) — review goes to admin for approval */
}
