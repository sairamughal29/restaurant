/* =====================================================
   FLAME & CRUST — Shared UI (navbar, footer, cart, toast)
   ===================================================== */

/* ---------- SVG ICONS ---------- */
const ICONS = {
  logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3v7c0 1.66-1.34 3-3 3s-3-1.34-3-3V3"/><path d="M4 3v18"/><path d="M17 3c-1.66 0-3 1.34-3 3v4c0 1.66 1.34 3 3 3s3-1.34 3-3V6c0-1.66-1.34-3-3-3z"/><path d="M17 13v8"/><path d="M20 21h-6"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  starOutline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  heartFill: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  fire: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 22c4.42 0 8-3.58 8-8 0-3.28-1.84-5.61-3.44-7.11C15.4 5.85 14 4.6 14 2c-2.5 1.5-4 3.5-4 6 0 1.5.5 2.5.5 2.5S9 9.5 8 7.5C6 9.5 4 12 4 14c0 4.42 3.58 8 8 8z"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  thumbsUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  chevLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  chevRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>'
};

/* ---------- SMALL RENDER HELPERS ---------- */
function starsHTML(rating, cls) {
  let out = '<span class="stars ' + (cls || '') + '" aria-label="' + rating + ' stars">';
  for (let i = 1; i <= 5; i++) {
    out += '<span class="star' + (i <= Math.round(rating) ? ' filled' : '') + '">' +
           (i <= Math.round(rating) ? ICONS.star : ICONS.starOutline) + '</span>';
  }
  return out + '</span>';
}

/* real rating from approved reviews — falls back to a subtle "New" tag */
function ratingHTML(f) {
  const r = foodRating(f.id);
  if (!r.count) return '<span class="rating rating-new">New</span>';
  return '<span class="rating"><span class="rating-star">' + ICONS.star + '</span> ' + r.avg.toFixed(1) +
         ' <span class="muted">(' + r.count + ')</span></span>';
}

function initialsAvatar(name, size) {
  const s = size || 44;
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return '<span class="avatar" style="width:' + s + 'px;height:' + s + 'px;font-size:' + Math.round(s * 0.38) + 'px">' + initials + '</span>';
}

function badgeHTML(status) {
  const m = STATUS_META[status] || { label: status, step: 0 };
  return '<span class="badge st-' + status + '">' + m.label + '</span>';
}

function emptyState(icon, title, text, btnHTML) {
  return '<div class="empty-state">' +
    '<div class="empty-icon">' + icon + '</div>' +
    '<h3>' + title + '</h3><p>' + text + '</p>' + (btnHTML || '') + '</div>';
}

/* ---------- CART ---------- */
const Cart = {
  KEY: 'fc_cart_v1',
  items() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch (e) { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:changed')); },
  count() { return this.items().reduce((n, i) => n + i.qty, 0); },
  subtotal() { return this.items().reduce((n, i) => n + i.unitPrice * i.qty, 0); },
  add(entry) {
    const items = this.items();
    /* merge identical: same food, same size, same extras, same note */
    const sig = e => e.foodId + '|' + (e.size || '') + '|' + (e.extras || []).join(',') + '|' + (e.note || '');
    const found = items.find(i => sig(i) === sig(entry));
    if (found) found.qty += entry.qty;
    else { entry.cartId = Date.now() + '_' + Math.random().toString(36).slice(2, 7); items.push(entry); }
    this.save(items);
  },
  setQty(cartId, qty) {
    let items = this.items();
    if (qty <= 0) items = items.filter(i => i.cartId !== cartId);
    else { const it = items.find(i => i.cartId === cartId); if (it) it.qty = qty; }
    this.save(items);
  },
  remove(cartId) { this.save(this.items().filter(i => i.cartId !== cartId)); },
  clear() { this.save([]); }
};

/* ---------- FAVORITES ---------- */
const Favs = {
  KEY: 'fc_favs_v1',
  all() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch (e) { return []; } },
  has(id) { return this.all().includes(id); },
  toggle(id) {
    let a = this.all();
    if (a.includes(id)) a = a.filter(x => x !== id);
    else a.push(id);
    localStorage.setItem(this.KEY, JSON.stringify(a));
    return a.includes(id);
  }
};

/* ---------- AUTH ---------- */
const Auth = {
  KEY: 'fc_user_v1',
  user() { try { return JSON.parse(localStorage.getItem(this.KEY)); } catch (e) { return null; } },
  login(u) { localStorage.setItem(this.KEY, JSON.stringify(u)); },
  logout() { localStorage.removeItem(this.KEY); },
  isLogged() { return !!this.user(); }
};

const AdminAuth = {
  KEY: 'fc_admin_v1',
  TTL: 12 * 60 * 60 * 1000, /* 12h session */
  session() {
    try {
      const s = JSON.parse(localStorage.getItem(this.KEY));
      if (s && s.email && s.exp > Date.now()) return s;
    } catch (e) {}
    return null;
  },
  isLogged() { return !!this.session(); },
  login(profile) {
    localStorage.setItem(this.KEY, JSON.stringify({
      name: profile.name || 'Admin', email: profile.email || 'admin', loginAt: Date.now(), exp: Date.now() + this.TTL
    }));
  },
  logout() { localStorage.removeItem(this.KEY); }
};

/* ---------- TOASTS ---------- */
function toast(msg, type) {
  type = type || 'success';
  let holder = document.getElementById('toast-holder');
  if (!holder) { holder = document.createElement('div'); holder.id = 'toast-holder'; document.body.appendChild(holder); }
  const el = document.createElement('div');
  el.className = 'toast toast-' + type;
  el.innerHTML = '<span class="toast-ic">' + (type === 'success' ? ICONS.check : ICONS.x) + '</span><span>' + msg + '</span>';
  holder.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2600);
}

/* ---------- NAVBAR & FOOTER COMPONENTS ---------- */
const NAV_LINKS = [
  { href: 'index.html', label: 'Home' },
  { href: 'menu.html',  label: 'Menu' },
  { href: 'about.html', label: 'About' },
  { href: 'contact.html', label: 'Contact' }
];

function logoHTML(prefix) {
  const p = prefix || '';
  return '<a href="' + p + 'index.html" class="logo">' +
    '<span class="logo-ic">' + ICONS.fire + '</span>' +
    '<span class="logo-txt">FLAME<span class="red">&amp;</span>CRUST</span></a>';
}

function renderNavbar() {
  const el = document.getElementById('navbar');
  if (!el) return;
  const path = location.pathname;
  const prefix = path.includes('/admin/') ? '../' : '';
  const page = path.split('/').pop() || 'index.html';
  const user = Auth.user();
  const cartCount = Cart.count();

  let links = NAV_LINKS.map(l =>
    '<a href="' + prefix + l.href + '" class="nav-link' + (page === l.href ? ' active' : '') + '">' + l.label + '</a>'
  ).join('');

  const userHTML = user
    ? '<a href="' + prefix + 'profile.html" class="btn btn-ghost btn-sm nav-user' + (page === 'profile.html' || page === 'orders.html' ? ' active' : '') + '">' +
        initialsAvatar(user.name, 28) + '<span class="nav-user-name">' + user.name.split(' ')[0] + '</span></a>'
    : '<a href="' + prefix + 'login.html" class="btn btn-outline btn-sm">Login</a>';

  el.innerHTML =
    '<div class="nav-inner container">' +
      logoHTML(prefix) +
      '<nav class="nav-links" id="nav-links">' + links + '</nav>' +
      '<div class="nav-actions">' +
        '<a href="' + prefix + 'cart.html" class="nav-cart' + (page === 'cart.html' ? ' active' : '') + '" aria-label="Cart">' +
          ICONS.cart + '<span class="cart-badge' + (cartCount ? ' on' : '') + '" id="cart-badge">' + cartCount + '</span></a>' +
        userHTML +
        '<button class="nav-burger" id="nav-burger" aria-label="Menu">' + ICONS.menu + '</button>' +
      '</div>' +
    '</div>';

  /* mobile menu */
  const burger = document.getElementById('nav-burger');
  const panel = document.getElementById('nav-links');
  burger.addEventListener('click', () => {
    panel.classList.toggle('open');
    burger.classList.toggle('open');
  });
}

function renderFooter() {
  const el = document.getElementById('footer');
  if (!el) return;
  const prefix = location.pathname.includes('/admin/') ? '../' : '';
  const s = Store.getSettings();
  const cats = activeCategories();

  el.innerHTML =
    '<div class="container footer-grid">' +
      '<div class="footer-brand">' +
        logoHTML(prefix) +
        '<p>' + esc((Store.getSettings().homepage || {}).footerAbout || s.description || '') + '</p>' +
        '<div class="socials">' +
          '<a href="#" aria-label="Facebook">' + ICONS.facebook + '</a>' +
          '<a href="#" aria-label="Instagram">' + ICONS.instagram + '</a>' +
          '<a href="#" aria-label="Twitter">' + ICONS.twitter + '</a>' +
        '</div>' +
      '</div>' +
      '<div class="footer-col"><h4>Quick Links</h4>' +
        '<a href="' + prefix + 'index.html">Home</a>' +
        '<a href="' + prefix + 'menu.html">Menu</a>' +
        '<a href="' + prefix + 'about.html">About Us</a>' +
        '<a href="' + prefix + 'contact.html">Contact</a>' +
        '<a href="' + prefix + 'orders.html">Track Order</a>' +
      '</div>' +
      '<div class="footer-col"><h4>Our Menu</h4>' +
        cats.map(c => '<a href="' + prefix + 'menu.html?cat=' + c.name.toLowerCase() + '">' + c.name + '</a>').join('') +
      '</div>' +
      '<div class="footer-col"><h4>Contact</h4>' +
        '<span class="f-item">' + ICONS.pin + s.address + '</span>' +
        '<span class="f-item">' + ICONS.phone + s.phone + '</span>' +
        '<span class="f-item">' + ICONS.mail + s.email + '</span>' +
        '<span class="f-item">' + ICONS.clock + s.openTime + ' – ' + s.closeTime + ' (Daily)</span>' +
      '</div>' +
    '</div>' +
    '<div class="footer-bottom"><div class="container">© 2026 ' + s.name +
      '. All rights reserved. &nbsp;•&nbsp; Fresh Food. Bold Taste.</div></div>';
}

/* ---------- SHARED FOOD CARDS ---------- */
function foodCardHTML(f) {
  const cat = categoryById(f.categoryId);
  return '<article class="card card-hover food-card reveal">' +
    '<div class="food-img">' +
      '<div class="food-badges">' + (f.popular ? '<span class="tag-popular">Popular</span>' : '') + '</div>' +
      '<button class="fav-btn' + (Favs.has(f.id) ? ' on' : '') + '" data-fav="' + f.id + '" aria-label="Add to favorites">' +
        (Favs.has(f.id) ? ICONS.heartFill : ICONS.heart) + '</button>' +
      '<a href="food-details.html?id=' + f.id + '"><img src="' + f.image + '" alt="' + f.name + '" loading="lazy"></a>' +
    '</div>' +
    '<div class="food-body">' +
      '<span class="badge gray" style="align-self:flex-start">' + (cat ? cat.name : '') + '</span>' +
      '<h3 class="food-name"><a href="food-details.html?id=' + f.id + '">' + f.name + '</a></h3>' +
      '<p class="food-desc">' + f.desc + '</p>' +
      '<div class="food-meta">' + ratingHTML(f) + '<span class="food-price">' + fmtPrice(f.price) + '</span></div>' +
      '<div class="food-actions">' +
        (isOrderable(f)
          ? '<button class="btn btn-primary btn-sm" data-add="' + f.id + '">' + ICONS.cart + ' Add to Cart</button>'
          : '<button class="btn btn-ghost btn-sm" disabled>Out of Stock</button>') +
      '</div>' +
    '</div>' +
  '</article>';
}

function skeletonCards(n) {
  let html = '';
  for (let i = 0; i < n; i++) {
    html += '<div class="skel-card"><div class="skel skel-img"></div><div class="skel-body">' +
      '<div class="skel" style="height:14px;width:40%"></div>' +
      '<div class="skel" style="height:16px;width:70%"></div>' +
      '<div class="skel" style="height:12px;width:90%"></div>' +
      '<div class="skel" style="height:34px;width:100%;border-radius:9px;margin-top:6px"></div>' +
    '</div></div>';
  }
  return html;
}

function bindCards(scope) {
  (scope || document).querySelectorAll('[data-add]').forEach(btn => {
    if (btn._bound) return; btn._bound = true;
    btn.addEventListener('click', e => {
      e.preventDefault();
      const f = foodById(btn.dataset.add);
      if (!f || !isOrderable(f)) return;
      Cart.add({ foodId: f.id, name: f.name, image: f.image, size: f.sizes ? f.sizes[0].name : '', extras: [], qty: 1, unitPrice: f.price, note: '' });
      toast(f.name + ' added to cart');
    });
  });
  (scope || document).querySelectorAll('[data-fav]').forEach(btn => {
    if (btn._bound) return; btn._bound = true;
    btn.addEventListener('click', e => {
      e.preventDefault();
      const on = Favs.toggle(btn.dataset.fav);
      btn.classList.toggle('on', on);
      btn.innerHTML = on ? ICONS.heartFill : ICONS.heart;
      toast(on ? 'Added to favorites' : 'Removed from favorites');
    });
  });
}

function observeReveals() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
}

/* ---------- HOMEPAGE CMS (admin-editable content) ---------- */
function applyCMS() {
  const h = (Store.getSettings().homepage || {});
  const hero = h.hero || {};
  const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  const setHTML = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

  /* hero */
  const heroSec = document.getElementById('cms-hero');
  if (heroSec && hero.image) heroSec.style.backgroundImage = "url('" + hero.image + "'), #0a0a0a";
  set('cms-hero-eyebrow', hero.eyebrow || '');
  setHTML('cms-hero-title', esc(hero.titlePlain || '') + ' <span class="red">' + esc(hero.titleRed || '') + '</span>');
  set('cms-hero-desc', hero.desc || '');
  const cta1 = document.getElementById('cms-hero-cta1');
  if (cta1) { cta1.href = hero.cta1Link || 'menu.html'; cta1.firstChild.textContent = ' ' + (hero.cta1Text || 'Order Now') + ' '; }
  const cta2 = document.getElementById('cms-hero-cta2');
  if (cta2) { cta2.href = hero.cta2Link || 'menu.html'; cta2.textContent = hero.cta2Text || 'View Menu'; }
  if (hero.stats && hero.stats.length) setHTML('cms-hero-stats',
    hero.stats.map(s => '<div class="hero-stat"><b>' + esc(s.v) + '</b><span>' + esc(s.l) + '</span></div>').join(''));

  /* marquee strip */
  if (h.strip) setHTML('cms-strip', '<span>' + esc(h.strip) + ' <i class="dot"></i> </span><span>' + esc(h.strip) + ' <i class="dot"></i> </span>');

  /* offer banner */
  const offerSec = document.getElementById('cms-offer');
  const off = h.offer || {};
  if (offerSec) {
    offerSec.style.display = off.active === false ? 'none' : '';
    set('cms-offer-tag', off.tag || '');
    setHTML('cms-offer-title', esc(off.titlePlain || '') + ' <span class="red">' + esc(off.titleRed || '') + '</span><br>' + esc(off.titleRest || ''));
    set('cms-offer-desc', off.desc || '');
    const ob = document.getElementById('cms-offer-btn');
    if (ob) { ob.href = off.btnLink || 'menu.html'; ob.textContent = off.btnText || 'Order Now'; }
    set('cms-offer-codenote', off.codeNote || '');
    set('cms-offer-code', off.code || '');
    set('cms-offer-minnote', off.minNote || '');
  }
}

/* ---------- WRITE-A-REVIEW MODAL (shared) ----------
   Accepts either an order object (rating items from an order)
   or { foodId } (rating a specific dish) or {} (general). */
function openReviewModal(opts) {
  opts = opts || {};
  if (opts && opts.items && opts.id) opts = { order: opts }; /* order object passed directly */
  const order = opts.order || null;

  const holder = document.getElementById('modal-holder') || (() => {
    const d = document.createElement('div'); d.id = 'modal-holder'; document.body.appendChild(d); return d;
  })();

  const foods = Store.all('foods');
  const u = Auth.user();
  const preName = localStorage.getItem('fc_reviewer_name') || (u ? u.name : '');
  const itemOpts = order
    ? order.items.map(it => '<option value="' + it.foodId + '">' + esc(it.name) + '</option>').join('')
    : '<option value="">General feedback — whole menu</option>' +
      foods.map(f => '<option value="' + f.id + '"' + (String(opts.foodId) === String(f.id) ? ' selected' : '') + '>' + esc(f.name) + '</option>').join('');

  holder.innerHTML =
    '<div class="modal-overlay open" id="review-overlay">' +
      '<div class="modal modal-review">' +
        '<div class="modal-head"><h3>' + (order ? 'Rate Order #' + order.id : 'Write a Review') + '</h3>' +
          '<button class="modal-close" id="review-close" aria-label="Close">' + ICONS.x + '</button></div>' +
        (order ? '' :
          '<div class="field"><label>Your Name</label>' +
            '<input class="input" id="rev-name" value="' + esc(preName) + '" placeholder="e.g. Ahmed Khan"></div>') +
        '<div class="field"><label>' + (order ? 'Which item are you rating?' : 'Which item?') + '</label>' +
          '<select class="input" id="rev-food">' + itemOpts + '</select></div>' +
        '<div class="field"><label>Your Rating</label><div id="rev-stars" class="stars-input" style="display:flex;gap:6px"></div></div>' +
        '<div class="field"><label>Your Review</label>' +
          '<textarea class="input" id="rev-text" rows="3" placeholder="Tell us about the food, packaging, delivery..."></textarea></div>' +
        '<button class="btn btn-primary btn-block" id="rev-submit">Submit Review</button>' +
        '<p class="muted text-center" style="font-size:11.5px;margin-top:10px">Reviews appear on the website after the restaurant approves them.</p>' +
      '</div>' +
    '</div>';

  let rating = 5;
  const starsEl = document.getElementById('rev-stars');
  function drawStars() {
    starsEl.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.style.cssText = 'background:none;border:none;cursor:pointer;color:' + (i <= rating ? '#e11d2e' : '#4a4a4a') + ';padding:2px';
      b.innerHTML = ICONS.star.replace('<svg', '<svg width="30" height="30"');
      b.addEventListener('click', () => { rating = i; drawStars(); });
      starsEl.appendChild(b);
    }
  }
  drawStars();

  const close = () => { holder.innerHTML = ''; };
  document.getElementById('review-close').addEventListener('click', close);
  document.getElementById('review-overlay').addEventListener('click', e => {
    if (e.target.id === 'review-overlay') close();
  });
  document.getElementById('rev-submit').addEventListener('click', () => {
    const name = order ? (order.customerName || 'Guest') : document.getElementById('rev-name').value.trim();
    const text = document.getElementById('rev-text').value.trim();
    if (!order && name.length < 2) { toast('Please tell us your name', 'error'); return; }
    if (text.length < 5) { toast('Please write a short review first', 'error'); return; }
    Store.insert('reviews', {
      customer: name,
      foodId: document.getElementById('rev-food').value || null,
      rating: rating, text: text,
      date: new Date().toISOString().slice(0, 10),
      status: 'pending', featured: false
    });
    if (!order) localStorage.setItem('fc_reviewer_name', name);
    close();
    toast('Thank you! Your review is pending approval');
  });
}

/* ---------- GLOBAL INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();
  applyCMS();
  document.addEventListener('cart:changed', renderNavbar);

  /* "Write a Review" buttons anywhere on the site */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-open-review]');
    if (t) { e.preventDefault(); openReviewModal(t.dataset.food ? { foodId: t.dataset.food } : {}); }
  });

  /* live sync: admin panel changes reflect instantly on the website */
  Store.subscribe(() => {
    renderNavbar();
    renderFooter();
    applyCMS();
  });
});
