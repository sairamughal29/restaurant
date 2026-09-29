/* =====================================================
   FLAME & CRUST — Home Page
   All sections render from the shared Store and
   re-render live when the admin panel changes data.
   ===================================================== */

function renderCats() {
  const catsEl = document.getElementById('home-cats');
  if (!catsEl) return;
  catsEl.innerHTML = activeCategories().map(c =>
    '<a href="menu.html?cat=' + encodeURIComponent(c.name.toLowerCase()) + '" class="cat-card reveal in">' +
      '<img src="' + c.image + '" alt="' + c.name + '" loading="lazy">' +
      '<span class="cat-label">' + c.name + '</span>' +
    '</a>'
  ).join('');
}

function renderPopular() {
  const popEl = document.getElementById('home-popular');
  if (!popEl) return;
  const cms = Store.getSettings().homepage || {};
  let picks;
  if (Array.isArray(cms.featuredIds) && cms.featuredIds.length) {
    picks = cms.featuredIds.map(id => Store.get('foods', id)).filter(f => f && isOrderable(f));
  }
  if (!picks || !picks.length) picks = popularFoods();
  popEl.innerHTML = picks.length
    ? picks.slice(0, 8).map(foodCardHTML).join('')
    : emptyState(ICONS.search, 'No Items Yet', 'Menu items added in the admin panel will appear here.',
        '<a href="admin/login.html" class="btn btn-ghost">Admin Panel</a>');
  bindCards(popEl);
  observeReveals(); /* cards render 450ms after boot — without this they stay opacity:0 on first load */
}

function renderFeatures() {
  const el = document.getElementById('home-features');
  if (!el) return;
  const features = ((Store.getSettings().homepage || {}).features) || [];
  el.innerHTML = features.map(f =>
    '<div class="card feature-card reveal in">' +
      '<div class="feature-ic">' + (ICONS[f.icon] || ICONS.fire) + '</div>' +
      '<h3>' + esc(f.title) + '</h3><p>' + esc(f.text) + '</p>' +
    '</div>'
  ).join('');
}

function renderReviews() {
  const track = document.getElementById('home-reviews');
  if (!track) return;

  /* drop the old slider chrome + listeners: replace track with a fresh clone */
  const oldNav = track.parentElement.querySelector('.reviews-nav');
  if (oldNav) oldNav.remove();
  const revEl = track.cloneNode(false);
  track.replaceWith(revEl);

  const reviews = approvedReviews(9);

  if (!reviews.length) {
    revEl.style.display = 'block';
    revEl.innerHTML = emptyState(ICONS.star, 'No Reviews Yet',
      'Be the first to share your experience — your review will appear here after approval.',
      '<button class="btn btn-primary" data-open-review>' + ICONS.star + ' Write a Review</button>');
    return;
  }
  revEl.style.display = '';

  revEl.innerHTML = reviews.map(r => {
    const food = r.foodId ? foodById(r.foodId) : null;
    return '<div class="card card-hover review-card reveal in">' +
      '<span class="review-quote">&ldquo;</span>' +
      '<div class="review-top">' +
        initialsAvatar(r.customer, 44) +
        '<div><div class="review-name">' + esc(r.customer) + '</div>' +
        '<div class="review-date">' + fmtDate(r.date) + ' • ' + (food ? esc(food.name) : 'Menu') + '</div></div>' +
      '</div>' +
      starsHTML(r.rating) +
      '<p class="review-text">' + esc(r.text) + '</p>' +
    '</div>';
  }).join('');

  initReviewsSlider(revEl, Array.from(revEl.children));
}

/* ---- reviews slider: arrows + dots + touch swipe + mouse drag ---- */
function initReviewsSlider(revEl, ritems) {
  if (ritems.length > 1 && revEl.scrollWidth > revEl.clientWidth + 8) {
    const stride = () => ritems[1].offsetLeft - ritems[0].offsetLeft;
    const gapPx = () => parseFloat(getComputedStyle(revEl).columnGap || getComputedStyle(revEl).gap) || 0;
    const maxScroll = () => revEl.scrollWidth - revEl.clientWidth;
    const curIdx = () => Math.round(revEl.scrollLeft / stride());
    const perView = () => Math.max(1, Math.round((revEl.clientWidth + gapPx()) / stride()));
    let targetIdx = 0, lockUntil = 0; /* lock: ignore scroll-sync while a programmatic slide is running */
    const goTo = i => {
      targetIdx = Math.min(Math.max(i, 0), ritems.length - 1);
      lockUntil = Date.now() + 800;
      revEl.scrollTo({ left: Math.min(targetIdx * stride(), maxScroll()), behavior: 'smooth' });
    };

    /* nav row: [prev] dots [next] */
    const nav = document.createElement('div');
    nav.className = 'reviews-nav';

    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'reviews-arrow';
    prev.setAttribute('aria-label', 'Previous reviews');
    prev.innerHTML = ICONS.chevLeft;

    const dots = document.createElement('div');
    dots.className = 'slider-dots';
    const dotBtns = ritems.map((_, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'slider-dot' + (i ? '' : ' active');
      d.setAttribute('aria-label', 'Go to review ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      dots.appendChild(d);
      return d;
    });

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'reviews-arrow';
    next.setAttribute('aria-label', 'Next reviews');
    next.innerHTML = ICONS.chevRight;

    prev.addEventListener('click', () => goTo(targetIdx - perView()));
    next.addEventListener('click', () => goTo(targetIdx + perView()));
    nav.append(prev, dots, next);
    revEl.parentElement.appendChild(nav);

    /* keep dots + arrow states in sync while sliding */
    const sync = () => {
      if (Date.now() > lockUntil) targetIdx = Math.min(ritems.length - 1, Math.max(0, curIdx()));
      const idx = Math.min(ritems.length - 1, Math.max(0, curIdx()));
      dotBtns.forEach((d, i) => d.classList.toggle('active', i === idx));
      prev.disabled = revEl.scrollLeft <= 2;
      next.disabled = revEl.scrollLeft >= maxScroll() - 2;
    };
    let rtick = false;
    revEl.addEventListener('scroll', () => {
      if (rtick) return; rtick = true;
      requestAnimationFrame(() => { sync(); rtick = false; });
    });
    window.addEventListener('resize', sync);

    /* mouse drag (desktop): grab the track and slide it */
    let dragging = false, dragMoved = false, startX = 0, startLeft = 0;
    revEl.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse') return; /* touch devices use native swipe */
      dragging = true; dragMoved = false;
      startX = e.clientX; startLeft = revEl.scrollLeft;
      revEl.classList.add('dragging');
    });
    window.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) dragMoved = true;
      revEl.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;
      revEl.classList.remove('dragging');
      if (dragMoved) goTo(Math.round(revEl.scrollLeft / stride()));
    });
    revEl.addEventListener('click', e => {
      if (dragMoved) { e.preventDefault(); e.stopPropagation(); dragMoved = false; }
    }, true);

    sync();
  }
}

function renderInfo() {
  const el = document.getElementById('home-info');
  if (!el) return;
  const s = Store.getSettings();
  const infos = [
    { ic: ICONS.clock, t: 'Opening Hours', v: s.openTime + ' – ' + s.closeTime + '<br>Open all 7 days' },
    { ic: ICONS.phone, t: 'Phone Number',  v: esc(s.phone) + '<br>Call us any time' },
    { ic: ICONS.mail,  t: 'Email Address', v: esc(s.email) + '<br>We reply within hours' },
    { ic: ICONS.pin,   t: 'Our Address',   v: esc(s.address) + '<br>Free parking available' }
  ];
  el.innerHTML = infos.map(i =>
    '<div class="card info-card">' +
      '<div class="ic">' + i.ic + '</div>' +
      '<h4>' + i.t + '</h4><p>' + i.v + '</p>' +
    '</div>'
  ).join('');
}

function renderAll() {
  renderCats();
  renderPopular();
  renderFeatures();
  renderReviews();
  renderInfo();
  bindCards(document);
  observeReveals();
}

document.addEventListener('DOMContentLoaded', () => {
  /* skeletons while first paint settles */
  const popEl = document.getElementById('home-popular');
  if (popEl) popEl.innerHTML = skeletonCards(4);

  renderCats();
  renderFeatures();
  renderInfo();
  renderReviews();
  setTimeout(renderPopular, 450);

  /* live sync with the admin panel */
  Store.subscribe(() => { renderAll(); });
});
