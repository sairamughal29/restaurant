/* =====================================================
   FLAME & CRUST — Checkout Page
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const items = Cart.items();
  if (!items.length) {
    document.querySelector('.checkout-layout').innerHTML = emptyState(ICONS.cart,
      'Nothing to Checkout', 'Your cart is empty. Add some delicious items first.',
      '<a href="menu.html" class="btn btn-primary">Browse Menu</a>');
    return;
  }

  /* prefill from logged-in user */
  const u = Auth.user();
  if (u) {
    document.getElementById('co-name').value = u.name || '';
    document.getElementById('co-email').value = u.email || '';
    document.getElementById('co-phone').value = u.phone || '';
    document.getElementById('co-address').value = u.address || '';
    document.getElementById('co-city').value = 'Lahore';
  }

  /* delivery zones */
  const zones = Store.getSettings().areas.split(',').map(x => x.trim());
  document.getElementById('co-areas').innerHTML = zones.map(z => '<option>' + z + '</option>').join('');

  /* payment methods from admin settings */
  const pay = Store.getSettings().payment || {};
  const cod = document.getElementById('pm-cod'), codIn = document.getElementById('pay-cod');
  if (cod && codIn) {
    if (pay.cod === false) { cod.style.opacity = .55; cod.style.cursor = 'not-allowed'; codIn.disabled = true; codIn.checked = false; }
    else if (pay.note) document.getElementById('pm-cod-desc').textContent = pay.note;
  }
  const card = document.getElementById('pm-card'), cardIn = document.getElementById('pay-card');
  if (card && cardIn && pay.online) {
    card.style.opacity = 1; card.style.cursor = 'pointer';
    cardIn.disabled = false;
    const soon = document.getElementById('pm-card-soon'); if (soon) soon.remove();
    document.getElementById('pm-card-desc').textContent = 'Pay online — demo gateway (real integration ready)';
  }

  renderSummary();

  /* pay method highlight */
  document.querySelectorAll('.pay-method input:not([disabled])').forEach(r => {
    r.addEventListener('change', () => {
      document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('selected'));
      r.closest('.pay-method').classList.add('selected');
    });
  });

  document.getElementById('checkout-form').addEventListener('submit', e => e.preventDefault());
  document.getElementById('co-summary').addEventListener('click', e => {
    if (e.target.closest('#place-order')) placeOrder();
  });
});

function totals() {
  const s = Store.getSettings();
  const subtotal = Cart.subtotal();
  let deliveryFee = s.deliveryFee;
  if (s.freeThreshold && subtotal >= s.freeThreshold) deliveryFee = 0;
  let discount = 0, couponCode = null;
  try {
    const cp = JSON.parse(sessionStorage.getItem('fc_coupon'));
    if (cp && subtotal >= cp.minOrder) {
      couponCode = cp.code;
      discount = cp.type === 'percent' ? Math.round(subtotal * cp.value / 100) : cp.value;
      if (cp.maxDiscount && cp.maxDiscount > 0) discount = Math.min(discount, cp.maxDiscount);
      discount = Math.min(discount, subtotal);
    }
  } catch (e) {}
  return { subtotal, deliveryFee, discount, couponCode, total: Math.max(0, subtotal - discount) + deliveryFee };
}

function renderSummary() {
  const t = totals();
  document.getElementById('co-summary').innerHTML =
    '<h3>Order Summary</h3>' +
    Cart.items().map(it =>
      '<div class="co-item">' +
        '<img src="' + it.image + '" alt="' + it.name + '">' +
        '<div><b class="co-qty">' + it.qty + '×</b> ' + it.name +
          '<div class="muted" style="font-size:11.5px">' + (it.size || '') + (it.extras && it.extras.length ? ' + ' + it.extras.join(', ') : '') + '</div>' +
        '</div>' +
        '<span class="co-line">' + fmtPrice(it.unitPrice * it.qty) + '</span>' +
      '</div>').join('') +
    '<div class="mt-16">' +
      '<div class="sum-row"><span>Subtotal</span><b>' + fmtPrice(t.subtotal) + '</b></div>' +
      '<div class="sum-row"><span>Delivery Fee</span><b>' + (t.deliveryFee ? fmtPrice(t.deliveryFee) : '<span class="red">FREE</span>') + '</b></div>' +
      '<div class="sum-row discount"><span>Discount ' + (t.couponCode ? '(' + t.couponCode + ')' : '') + '</span><b>' + (t.discount ? '- ' + fmtPrice(t.discount) : fmtPrice(0)) + '</b></div>' +
      '<hr class="sum-divider">' +
      '<div class="sum-total"><span>Total</span><b>' + fmtPrice(t.total) + '</b></div>' +
    '</div>' +
    '<button class="btn btn-primary btn-lg btn-block mt-24" id="place-order">Place Order • ' + fmtPrice(t.total) + '</button>' +
    '<p class="muted text-center" style="font-size:12px;margin-top:12px">By placing your order you agree to our terms of service.</p>';
}

function setErr(id, on) {
  const inp = document.getElementById(id);
  const field = inp.closest('.field');
  inp.classList.toggle('error', on);
  if (field) field.classList.toggle('has-error', on);
}

function validate() {
  let ok = true;
  const name = document.getElementById('co-name').value.trim();
  const phone = document.getElementById('co-phone').value.trim();
  const email = document.getElementById('co-email').value.trim();
  const address = document.getElementById('co-address').value.trim();
  const city = document.getElementById('co-city').value.trim();

  const checks = [
    ['co-name', name.length >= 3],
    ['co-phone', phone.replace(/\D/g, '').length >= 10],
    ['co-email', /^\S+@\S+\.\S+$/.test(email)],
    ['co-address', address.length >= 6],
    ['co-city', city.length >= 2]
  ];
  checks.forEach(([id, valid]) => { setErr(id, !valid); if (!valid) ok = false; });

  if (!ok) {
    const first = document.querySelector('.input.error');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast('Please fill all required fields correctly', 'error');
  }
  return ok;
}

function placeOrder() {
  if (!validate()) return;

  /* final availability check — the admin panel may have changed stock/availability */
  const blocked = Cart.items().find(it => {
    const f = foodById(it.foodId);
    return !f || !isOrderable(f) || (f.stock !== null && f.stock !== undefined && f.stock < it.qty);
  });
  if (blocked) {
    toast(blocked.name + ' is no longer available in this quantity', 'error');
    setTimeout(() => { location.href = 'cart.html'; }, 1200);
    return;
  }

  const t = totals();
  const btn = document.getElementById('place-order');
  btn.disabled = true;
  btn.textContent = 'Placing your order...';

  const payMethodEl = document.querySelector('input[name="pay"]:checked');
  const payMethod = payMethodEl ? payMethodEl.value : 'COD';
  const payOnline = payMethod === 'Online';
  const autoPaid = (Store.getSettings().payment || {}).autoPaid !== false;

  const order = {
    customerName: document.getElementById('co-name').value.trim(),
    phone: document.getElementById('co-phone').value.trim(),
    email: document.getElementById('co-email').value.trim(),
    address: document.getElementById('co-address').value.trim(),
    city: document.getElementById('co-city').value.trim(),
    instructions: document.getElementById('co-note').value.trim(),
    items: Cart.items().map(it => ({
      foodId: it.foodId, name: it.name, image: it.image, size: it.size,
      extras: it.extras || [], qty: it.qty, unitPrice: it.unitPrice, lineTotal: it.unitPrice * it.qty
    })),
    subtotal: t.subtotal, deliveryFee: t.deliveryFee, discount: t.discount,
    coupon: t.couponCode, total: t.total, payment: payMethod,
    paymentStatus: payOnline && autoPaid ? 'paid' : 'unpaid',
    notes: '',
    status: 'pending', createdAt: new Date().toISOString(),
    estimated: Store.getSettings().estTime || '30-40 min'
  };

  /* simulate processing delay */
  setTimeout(() => {
    const saved = Store.insert('orders', order);

    /* upsert the customer record so the admin panel has real customer data */
    upsertCustomer(order);

    /* decrement stock for tracked items */
    order.items.forEach(it => {
      const f = foodById(it.foodId);
      if (f && f.stock !== null && f.stock !== undefined) {
        Store.update('foods', f.id, { stock: Math.max(0, f.stock - it.qty) });
      }
    });
    if (t.couponCode) {
      const cp = Store.get('coupons', t.couponCode);
      if (cp) Store.update('coupons', cp.code, { used: (cp.used || 0) + 1 });
    }
    Cart.clear();
    sessionStorage.removeItem('fc_coupon');
    location.href = 'order-confirmation.html?id=' + saved.id;
  }, 800);
}

/* create or update the customer in the admin panel (matched by email, then phone) */
function upsertCustomer(order) {
  const addr = order.address + (order.city ? ', ' + order.city : '');
  const phoneDigits = (order.phone || '').replace(/\D/g, '');
  let cu = Store.all('customers').find(c =>
    (order.email && c.email && c.email.toLowerCase() === order.email.toLowerCase()) ||
    (phoneDigits && c.phone && c.phone.replace(/\D/g, '') === phoneDigits));
  if (cu) {
    Store.update('customers', cu.id, { name: order.customerName, phone: order.phone, address: addr });
  } else {
    Store.insert('customers', {
      name: order.customerName, email: order.email, phone: order.phone,
      address: addr, joined: new Date().toISOString().slice(0, 10),
      orders: 0, spent: 0, status: 'active'
    });
  }
  localStorage.setItem('fc_reviewer_name', order.customerName);
}
