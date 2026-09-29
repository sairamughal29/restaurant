/* =====================================================
   FLAME & CRUST — Food Details Page
   ===================================================== */

const D = { food: null, size: 0, extras: new Set(), qty: 1 };

document.addEventListener('DOMContentLoaded', () => {
  const id = new URLSearchParams(location.search).get('id');
  D.food = foodById(id) || Store.all('foods')[0];

  if (!D.food) {
    document.getElementById('details-wrap').innerHTML =
      emptyState(ICONS.search, 'Item Not Found', 'This item does not exist or was removed.',
        '<a href="menu.html" class="btn btn-primary">Back to Menu</a>');
    return;
  }

  document.getElementById('crumb-name').textContent = D.food.name;
  document.title = D.food.name + ' — Flame & Crust';
  render();
  renderReviewsSection();

  /* live sync with the admin panel (price/stock/edits) + new approved reviews */
  Store.subscribe(() => {
    if (!Store.get('foods', D.food.id)) return; /* item was deleted — keep last view */
    D.food = Store.get('foods', D.food.id);
    render();
    renderReviewsSection();
  });
});

function unitPrice() {
  const f = D.food;
  let p = f.price + ((f.sizes && f.sizes[D.size]) ? f.sizes[D.size].delta : 0);
  D.extras.forEach(name => {
    const ex = f.extras.find(e => e.name === name);
    if (ex) p += ex.price;
  });
  return p;
}

function render() {
  const f = D.food;
  const cat = categoryById(f.categoryId);
  const wrap = document.getElementById('details-wrap');
  const reviews = Store.all('reviews').filter(r => r.foodId === f.id && r.status === 'approved');

  wrap.innerHTML =
    '<div class="details-img reveal in">' +
      '<img src="' + f.image + '" alt="' + f.name + '">' +
    '</div>' +
    '<div class="details-info">' +
      '<div class="flex items-center gap-8 mb-8">' +
        '<span class="badge red">' + (cat ? cat.name : 'Menu') + '</span>' +
        (isOrderable(f) ? '' : '<span class="badge st-cancelled">Out of Stock</span>') +
      '</div>' +
      '<h1>' + f.name + '</h1>' +
      '<div class="flex items-center gap-16 mt-8">' + ratingHTML(f) + '</div>' +
      '<p class="desc">' + f.desc + '</p>' +
      '<div class="details-price"><span id="d-unit">' + fmtPrice(f.price) + '</span> <small>/ item</small></div>' +

      (f.sizes && f.sizes.length
        ? '<div class="opt-group"><h4>Choose Size</h4><div class="opt-rows" id="size-rows">' +
            f.sizes.map((s, i) =>
              '<label class="opt-row' + (i === D.size ? ' selected' : '') + '">' +
                '<input type="radio" name="size" value="' + i + '"' + (i === D.size ? ' checked' : '') + '>' +
                '<span>' + s.name + '</span>' +
                '<span class="opt-price">' + (s.delta > 0 ? '+ ' + fmtPrice(s.delta) : 'Included') + '</span>' +
              '</label>').join('') +
          '</div></div>'
        : '') +

      (f.extras && f.extras.length
        ? '<div class="opt-group"><h4>Add Extras</h4><div class="opt-rows" id="extra-rows">' +
            f.extras.map(e =>
              '<label class="opt-row' + (D.extras.has(e.name) ? ' selected' : '') + '">' +
                '<input type="checkbox" value="' + e.name + '"' + (D.extras.has(e.name) ? ' checked' : '') + '>' +
                '<span>' + e.name + '</span>' +
                '<span class="opt-price">+ ' + fmtPrice(e.price) + '</span>' +
              '</label>').join('') +
          '</div></div>'
        : '') +

      '<div class="qty-row">' +
        '<span style="font-weight:700;font-size:14px">Quantity</span>' +
        '<div class="qty-box">' +
          '<button id="qty-minus" aria-label="Decrease">' + ICONS.minus + '</button>' +
          '<span class="qty-val" id="qty-val">1</span>' +
          '<button id="qty-plus" aria-label="Increase">' + ICONS.plus + '</button>' +
        '</div>' +
      '</div>' +

      '<div class="field">' +
        '<label for="d-note">Special Instructions <span class="muted">(optional)</span></label>' +
        '<textarea id="d-note" class="input" rows="2" placeholder="e.g. extra spicy, no onions, cut in half..."></textarea>' +
      '</div>' +

      '<div class="details-total"><b>Total</b><span class="price" id="d-total">' + fmtPrice(f.price) + '</span></div>' +
      '<button class="btn btn-primary btn-lg btn-block" id="d-add"' + (isOrderable(f) ? '' : ' disabled') + '>' +
        ICONS.cart + (isOrderable(f) ? ' Add to Cart' : ' Out of Stock') + '</button>' +
    '</div>';

  bindOptionEvents();
  updateTotal();
  observeReveals();
}

function bindOptionEvents() {
  document.querySelectorAll('#size-rows input').forEach(r => {
    r.addEventListener('change', () => {
      D.size = parseInt(r.value);
      document.querySelectorAll('#size-rows .opt-row').forEach((row, i) => row.classList.toggle('selected', i === D.size));
      updateTotal();
    });
  });
  document.querySelectorAll('#extra-rows input').forEach(c => {
    c.addEventListener('change', () => {
      if (c.checked) D.extras.add(c.value); else D.extras.delete(c.value);
      c.closest('.opt-row').classList.toggle('selected', c.checked);
      updateTotal();
    });
  });
  document.getElementById('qty-minus').addEventListener('click', () => { D.qty = Math.max(1, D.qty - 1); updateTotal(); });
  document.getElementById('qty-plus').addEventListener('click', () => { D.qty = Math.min(20, D.qty + 1); updateTotal(); });
  document.getElementById('d-add').addEventListener('click', addToCart);
}

function updateTotal() {
  const up = unitPrice();
  document.getElementById('qty-val').textContent = D.qty;
  document.getElementById('d-unit').textContent = fmtPrice(up);
  document.getElementById('d-total').textContent = fmtPrice(up * D.qty);
}

function addToCart() {
  const f = D.food;
  if (!isOrderable(f)) return;
  const sizeName = f.sizes ? f.sizes[D.size].name : '';
  Cart.add({
    foodId: f.id, name: f.name, image: f.image,
    size: sizeName, extras: [...D.extras], qty: D.qty,
    unitPrice: unitPrice(),
    note: document.getElementById('d-note').value.trim()
  });
  toast(f.name + ' added to cart');
  setTimeout(() => { location.href = 'cart.html'; }, 700);
}

/* ================= ITEM REVIEWS (real, approved only) ================= */
function renderReviewsSection() {
  const sec = document.getElementById('fd-reviews-section');
  const el = document.getElementById('fd-reviews');
  if (!sec || !el) return;

  const reviews = Store.all('reviews')
    .filter(r => String(r.foodId) === String(D.food.id) && r.status === 'approved')
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || new Date(b.date) - new Date(a.date));
  const r = foodRating(D.food.id);

  sec.style.display = '';
  el.innerHTML =
    '<div class="section-head left reveal in">' +
      '<span class="eyebrow">Customer Feedback</span>' +
      '<h2>Reviews For This <span class="red">Item</span></h2>' +
      '<p>Only genuine reviews from customers like you, approved by the restaurant.</p>' +
    '</div>' +
    '<div class="fd-summary card reveal in">' +
      '<div class="fd-avg">' + (r.count ? r.avg.toFixed(1) : '—') + '</div>' +
      '<div class="fd-sum-meta">' +
        starsHTML(r.count ? r.avg : 0) +
        '<span class="muted">' + (r.count ? r.count + ' verified review' + (r.count > 1 ? 's' : '') : 'No reviews yet') + '</span>' +
      '</div>' +
      '<button class="btn btn-primary fd-write" data-open-review data-food="' + D.food.id + '">' + ICONS.star + ' Write a Review</button>' +
    '</div>' +
    (reviews.length
      ? '<div class="fd-list">' + reviews.map(rv =>
          '<div class="card fd-review-item reveal in">' +
            '<div class="review-top">' + initialsAvatar(rv.customer, 42) +
              '<div><div class="review-name">' + esc(rv.customer) + '</div>' +
              '<div class="review-date">' + fmtDate(rv.date) + (rv.featured ? ' • <span class="red">Featured</span>' : '') + '</div></div>' +
            '</div>' +
            starsHTML(rv.rating) +
            '<p class="review-text">' + esc(rv.text) + '</p>' +
          '</div>').join('') + '</div>'
      : '<div class="card fd-review-item fd-none reveal in">' +
          '<p class="muted" style="margin:0">No reviews yet for this item — be the first to review it!</p>' +
        '</div>');
  observeReveals();
}
