/* =====================================================
   FLAME & CRUST — Cart Page
   ===================================================== */

let coupon = null; /* {code, discount} */

document.addEventListener('DOMContentLoaded', () => {
  /* restore coupon from session */
  try { coupon = JSON.parse(sessionStorage.getItem('fc_coupon')); } catch (e) { coupon = null; }
  document.addEventListener('cart:changed', render);
  render();
  /* live sync: availability/stock/price changes made in the admin panel */
  Store.subscribe(render);
});

function calc() {
  const s = Store.getSettings();
  const items = Cart.items();
  const subtotal = Cart.subtotal();
  let deliveryFee = items.length ? s.deliveryFee : 0;
  if (s.freeThreshold && subtotal >= s.freeThreshold) deliveryFee = 0; /* free delivery threshold from admin settings */
  let discount = 0;
  if (coupon && subtotal >= coupon.minOrder) {
    discount = coupon.type === 'percent'
      ? Math.round(subtotal * coupon.value / 100)
      : coupon.value;
    discount = Math.min(discount, subtotal);
  }
  const total = Math.max(0, subtotal - discount) + deliveryFee;
  return { items, subtotal, deliveryFee, discount, total, minOrder: s.minOrder };
}

/* live availability check against the current store (admin may have changed stock) */
function itemIssue(it) {
  const f = foodById(it.foodId);
  if (!f) return 'No longer on the menu';
  if (f.available === false) return 'Unavailable right now';
  if (f.stock !== null && f.stock !== undefined && f.stock <= 0) return 'Out of stock';
  if (f.stock !== null && f.stock !== undefined && f.stock < it.qty) return 'Only ' + f.stock + ' left in stock';
  return null;
}

function render() {
  const root = document.getElementById('cart-root');
  const c = calc();

  if (!c.items.length) {
    root.innerHTML = emptyState(ICONS.cart, 'Your Cart is Empty',
      'Looks like you haven\'t added anything yet. Explore our menu and treat yourself to something delicious.',
      '<a href="menu.html" class="btn btn-primary btn-lg">Browse Menu</a>');
    return;
  }

  const issues = c.items.map(it => ({ cartId: it.cartId, name: it.name, why: itemIssue(it) }));
  const blocked = issues.filter(x => x.why);
  const canCheckout = !blocked.length && c.subtotal >= c.minOrder;

  root.innerHTML =
    '<div class="cart-layout">' +
      '<div>' +
        '<div class="flex-between mb-16">' +
          '<h2 style="font-size:20px">' + Cart.count() + ' item' + (Cart.count() > 1 ? 's' : '') + ' in cart</h2>' +
          '<button class="btn-link" id="clear-cart" style="color:#ff8a96">' + ICONS.trash.replace('width="2"','width="2"') + ' Clear Cart</button>' +
        '</div>' +
        (blocked.length
          ? '<div class="cart-alert">' + ICONS.x + ' <div><b>' + esc(blocked[0].name) + '</b> — ' + esc(blocked[0].why) +
            '. Please remove or adjust it before checkout.' + (blocked.length > 1 ? ' (' + (blocked.length - 1) + ' more item' + (blocked.length > 2 ? 's' : '') + ' affected)' : '') + '</div></div>'
          : '') +
        '<div class="cart-list">' +
          c.items.map(it => {
            const why = itemIssue(it);
            return '<div class="card cart-item' + (why ? ' ci-blocked' : '') + '">' +
              '<a class="ci-img" href="food-details.html?id=' + it.foodId + '"><img src="' + it.image + '" alt="' + it.name + '">' +
                (why ? '<span class="ci-block-badge">' + esc(why) + '</span>' : '') + '</a>' +
              '<div>' +
                '<div class="ci-name">' + it.name + '</div>' +
                '<div class="ci-meta">' +
                  (it.size ? '<b>Size:</b> ' + it.size + ' &nbsp;•&nbsp; ' : '') +
                  (it.extras && it.extras.length ? '<b>Extras:</b> ' + it.extras.join(', ') + ' &nbsp;•&nbsp; ' : '') +
                  (it.note ? '<b>Note:</b> ' + it.note : '') +
                '</div>' +
                '<div class="ci-price">' + fmtPrice(it.unitPrice * it.qty) + '</div>' +
              '</div>' +
              '<div class="ci-right">' +
                '<button class="remove-btn" data-remove="' + it.cartId + '" aria-label="Remove">' + ICONS.trash + '</button>' +
                '<div class="qty-box">' +
                  '<button data-dec="' + it.cartId + '" aria-label="Decrease">' + ICONS.minus + '</button>' +
                  '<span class="qty-val">' + it.qty + '</span>' +
                  '<button data-inc="' + it.cartId + '" aria-label="Increase">' + ICONS.plus + '</button>' +
                '</div>' +
              '</div>' +
            '</div>';
          }).join('') +
        '</div>' +
        '<div class="mt-16 flex-between">' +
          '<a href="menu.html" class="btn btn-ghost">Continue Shopping</a>' +
          (c.subtotal < c.minOrder ? '<span class="badge red">Minimum order ' + fmtPrice(c.minOrder) + '</span>' : '') +
        '</div>' +
      '</div>' +

      '<div class="card summary-card">' +
        '<h3>Order Summary</h3>' +
        '<div class="sum-row"><span>Subtotal</span><b>' + fmtPrice(c.subtotal) + '</b></div>' +
        '<div class="sum-row"><span>Delivery Fee</span><b>' + (c.deliveryFee ? fmtPrice(c.deliveryFee) : '<span class="red">FREE</span>') + '</b></div>' +
        '<div class="sum-row discount"><span>Discount ' + (coupon ? '(' + coupon.code + ')' : '') + '</span><b>' + (c.discount ? '- ' + fmtPrice(c.discount) : fmtPrice(0)) + '</b></div>' +
        '<hr class="sum-divider">' +
        '<div class="sum-total"><span>Total</span><b>' + fmtPrice(c.total) + '</b></div>' +

        (coupon
          ? '<div class="coupon-applied"><span>Coupon <b>' + coupon.code + '</b> applied</span><button id="remove-coupon" aria-label="Remove coupon">' + ICONS.x + '</button></div>'
          : '<div class="coupon-box">' +
              '<input type="text" class="input" id="coupon-input" placeholder="Coupon code">' +
              '<button class="btn btn-ghost" id="apply-coupon">Apply</button>' +
            '</div>' +
            couponHintHTML()) +

        '<button class="btn btn-primary btn-lg btn-block" id="go-checkout"' + (canCheckout ? '' : ' disabled') + '>Proceed to Checkout ' + ICONS.arrowRight + '</button>' +
        (blocked.length ? '<p class="muted text-center" style="font-size:11.5px;margin-top:10px">Resolve unavailable items to continue.</p>' : '') +
      '</div>' +
    '</div>';

  bindCartEvents();
}

/* suggest real, currently-active coupons from the admin panel */
function couponHintHTML() {
  const hints = Store.all('coupons')
    .filter(cp => cp.active && (!cp.expiry || new Date(cp.expiry) >= new Date()))
    .slice(0, 3).map(cp => '<b class="red">' + cp.code + '</b>');
  return hints.length
    ? '<p class="muted" style="font-size:12px;margin-bottom:14px">Try ' + hints.join(', ') + '</p>'
    : '';
}

function bindCartEvents() {
  document.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => {
    const it = Cart.items().find(i => i.cartId === b.dataset.inc);
    if (it) Cart.setQty(it.cartId, it.qty + 1);
  }));
  document.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => {
    const it = Cart.items().find(i => i.cartId === b.dataset.dec);
    if (it) Cart.setQty(it.cartId, it.qty - 1);
  }));
  document.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => {
    Cart.remove(b.dataset.remove);
    toast('Item removed from cart');
  }));
  document.getElementById('clear-cart').addEventListener('click', () => {
    if (confirm('Remove all items from your cart?')) { Cart.clear(); toast('Cart cleared'); }
  });

  const applyBtn = document.getElementById('apply-coupon');
  if (applyBtn) applyBtn.addEventListener('click', applyCoupon);
  const removeBtn = document.getElementById('remove-coupon');
  if (removeBtn) removeBtn.addEventListener('click', () => {
    coupon = null; sessionStorage.removeItem('fc_coupon'); render(); toast('Coupon removed');
  });

  document.getElementById('go-checkout').addEventListener('click', () => {
    location.href = 'checkout.html';
  });
}

function applyCoupon() {
  const input = document.getElementById('coupon-input');
  const code = input.value.trim().toUpperCase();
  if (!code) { input.classList.add('error'); return; }
  const cp = Store.all('coupons').find(c => c.code === code);
  if (!cp) { toast('Invalid coupon code', 'error'); input.classList.add('error'); return; }
  if (!cp.active) { toast('This coupon is inactive', 'error'); return; }
  if (new Date(cp.expiry) < new Date()) { toast('This coupon has expired', 'error'); return; }
  if (Cart.subtotal() < cp.minOrder) { toast('Minimum order of ' + fmtPrice(cp.minOrder) + ' required', 'error'); return; }

  coupon = { code: cp.code, type: cp.type, value: cp.value, minOrder: cp.minOrder };
  sessionStorage.setItem('fc_coupon', JSON.stringify(coupon));
  toast('Coupon ' + cp.code + ' applied!');
  render();
}
