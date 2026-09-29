/* =====================================================
   FLAME & CRUST ADMIN — Shell, Auth, Shared Helpers
   ===================================================== */

/* ---------- ICONS ---------- */
const AI = {
  fire: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 22c4.42 0 8-3.58 8-8 0-3.28-1.84-5.61-3.44-7.11C15.4 5.85 14 4.6 14 2c-2.5 1.5-4 3.5-4 6 0 1.5.5 2.5.5 2.5S9 9.5 8 7.5C6 9.5 4 12 4 14c0 4.42 3.58 8 8 8z"/></svg>',
  dash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>',
  orders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  foods: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3v7c0 1.66-1.34 3-3 3s-3-1.34-3-3V3"/><path d="M4 3v18"/><path d="M17 3c-1.66 0-3 1.34-3 3v4c0 1.66 1.34 3 3 3s3-1.34 3-3V6c0-1.66-1.34-3-3-3z"/><path d="M17 13v8"/></svg>',
  cats: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  inventory: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  coupon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><line x1="13" y1="5" x2="13" y2="19" stroke-dasharray="2 3"/></svg>',
  cms: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 9h20"/><path d="M9 21V9"/></svg>',
  report: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-6 4 3 5-8"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  chevUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>',
  chevDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  chevLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  chevRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  printer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  money: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  restore: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
  external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
  panel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>'
};

/* ---------- NAV DEFINITION (15 items) ---------- */
const ADMIN_NAV = [
  { sec: 'Main' },
  { id: 'dashboard',  href: 'index.html',      label: 'Dashboard',           ic: 'dash' },
  { id: 'orders',     href: 'orders.html',     label: 'Orders',              ic: 'orders', badge: 'orders' },
  { sec: 'Catalog' },
  { id: 'foods',      href: 'foods.html',      label: 'Food Menu',           ic: 'foods' },
  { id: 'categories', href: 'categories.html', label: 'Categories',          ic: 'cats' },
  { id: 'inventory',  href: 'inventory.html',  label: 'Inventory',           ic: 'inventory', badge: 'stock' },
  { sec: 'People' },
  { id: 'customers',  href: 'customers.html',  label: 'Customers',           ic: 'users' },
  { id: 'reviews',    href: 'reviews.html',    label: 'Reviews',             ic: 'star', badge: 'reviews' },
  { sec: 'Marketing' },
  { id: 'coupons',    href: 'coupons.html',    label: 'Offers & Coupons',    ic: 'coupon' },
  { id: 'homepage',   href: 'homepage.html',   label: 'Homepage Content',    ic: 'cms' },
  { sec: 'Insights' },
  { id: 'reports',    href: 'reports.html',    label: 'Reports & Analytics', ic: 'report' },
  { sec: 'System' },
  { id: 'settings',   href: 'settings.html',   label: 'Restaurant Settings', ic: 'gear' },
  { id: 'delivery',   href: 'delivery.html',   label: 'Delivery Settings',   ic: 'truck' },
  { id: 'payment',    href: 'payment.html',    label: 'Payment Settings',    ic: 'wallet' },
  { id: 'profile',    href: 'profile.html',    label: 'Admin Profile',       ic: 'user' }
];

const PAGE_TITLES = {
  dashboard: ['Dashboard', 'Overview of your restaurant'], orders: ['Orders', 'Manage incoming customer orders'],
  foods: ['Food Menu', 'Add, edit and organize your dishes'], categories: ['Categories', 'Menu sections shown on the website'],
  inventory: ['Inventory', 'Stock levels and availability'], customers: ['Customers', 'People who order from you'],
  reviews: ['Reviews', 'Moderate customer testimonials'], coupons: ['Offers & Coupons', 'Discount codes and promotions'],
  homepage: ['Homepage Content', 'Edit what visitors see on the homepage'], reports: ['Reports & Analytics', 'Sales insights and trends'],
  settings: ['Restaurant Settings', 'Your restaurant information'], delivery: ['Delivery Settings', 'Charges, areas and timing'],
  payment: ['Payment Settings', 'Payment methods and status'], profile: ['Admin Profile', 'Your account and security']
};

/* ---------- LAYOUT RENDER ---------- */
let _activePage = null, _adminName = 'Admin';

function renderAdminLayout(active) {
  _activePage = active;
  const title = (PAGE_TITLES[active] || [active || 'Dashboard', ''])[0];
  const sub = (PAGE_TITLES[active] || ['', ''])[1];
  const s = AdminAuth.session() || {};
  const admin = Store.getSettings().admin || {};
  _adminName = s.name || admin.name || 'Admin User';

  renderSidebar(active, _adminName);
  renderTopbar(title, sub, _adminName);

  document.getElementById('admin-burger').addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('admin-overlay').classList.add('show');
  });
  document.getElementById('admin-overlay').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
}

function renderSidebar(active, adminName) {
  const pendingOrders = Store.all('orders').filter(o => o.status === 'pending').length;
  const pendingReviews = Store.all('reviews').filter(r => r.status === 'pending').length;
  const lowStock = Store.all('foods').filter(f => f.available && typeof f.stock === 'number' && f.stock > 0 && f.stock <= 5).length;
  const outCount = Store.all('foods').filter(f => !isOrderable(f)).length;
  const badges = { orders: pendingOrders, reviews: pendingReviews, stock: lowStock + outCount };

  const sb = document.getElementById('sidebar');
  sb.innerHTML =
    '<div class="sidebar-head">' +
      '<a href="index.html" class="logo"><span class="logo-ic">' + AI.fire + '</span>' +
      '<span class="logo-txt-wrap"><span class="logo-txt" style="font-size:15px;font-weight:900;display:block;line-height:1.2">FLAME<span class="red">&amp;</span>CRUST</span>' +
      '<span class="logo-sub">Admin Panel</span></span></a>' +
    '</div>' +
    '<nav class="sidebar-nav">' +
      ADMIN_NAV.map(item => {
        if (item.sec) return '<div class="side-label">' + item.sec + '</div>';
        const n = badges[item.badge] || 0;
        const badge = n ? '<span class="count-pill">' + n + '</span>' : '';
        return '<a href="' + item.href + '" class="side-link' + (item.id === active ? ' active' : '') + '" title="' + item.label + '">' +
          AI[item.ic] + '<span>' + item.label + '</span>' + badge + '</a>';
      }).join('') +
      '<div class="side-label">Account</div>' +
      '<a href="#" class="side-link" id="side-logout">' + AI.logout + '<span>Logout</span></a>' +
    '</nav>' +
    '<div class="sidebar-foot"><div class="side-user" id="side-user">' +
      initialAvatar(adminName, 36) +
      '<div><div class="su-name">' + esc(adminName) + '</div><div class="su-role">Administrator</div></div>' +
    '</div>' +
    '<button class="collapse-btn" id="collapse-btn">' + AI.panel + '<span>Collapse</span></button></div>';

  document.getElementById('side-logout').addEventListener('click', e => { e.preventDefault(); doLogout(); });
  document.getElementById('side-user').addEventListener('click', () => location.href = 'profile.html');

  const saved = localStorage.getItem('fc_admin_side');
  if (saved === '1') document.querySelector('.admin-shell').classList.add('side-collapsed');
  document.getElementById('collapse-btn').addEventListener('click', () => {
    const sh = document.querySelector('.admin-shell');
    sh.classList.toggle('side-collapsed');
    localStorage.setItem('fc_admin_side', sh.classList.contains('side-collapsed') ? '1' : '0');
  });
}

function renderTopbar(title, sub, adminName) {
  const pendingOrders = Store.all('orders').filter(o => o.status === 'pending');
  const pendingReviews = Store.all('reviews').filter(r => r.status === 'pending');
  const tb = document.getElementById('topbar');
  tb.innerHTML =
    '<button class="top-btn admin-burger" id="admin-burger" aria-label="Toggle menu">' + AI.menu + '</button>' +
    '<div><h1>' + esc(title) + '</h1><span class="crumb">' + esc(sub) + '</span></div>' +
    '<div class="topbar-right">' +
      '<div class="top-search">' + AI.search +
        '<input id="global-search" type="text" placeholder="Search orders, customers, foods..." autocomplete="off">' +
        '<div class="search-results" id="search-results"></div>' +
      '</div>' +
      '<div class="dd" id="bell-dd">' +
        '<button class="top-btn" id="tb-bell" aria-label="Notifications">' + AI.bell +
          ((pendingOrders.length || pendingReviews.length) ? '<span class="dot"></span>' : '') + '</button>' +
        '<div class="dd-menu" id="bell-menu"></div>' +
      '</div>' +
      '<a class="top-btn" href="../index.html" target="_blank" title="View Website">' + AI.external + '</a>' +
      '<div class="dd" id="avatar-dd">' +
        '<button class="top-btn" id="tb-avatar" style="width:auto;padding:0 10px 0 4px;gap:8px;font-size:12.5px;font-weight:700" aria-label="Account">' +
          initialAvatar(adminName, 28) + '<span class="avatar-name">' + esc(adminName.split(' ')[0]) + '</span></button>' +
        '<div class="dd-menu avatar-menu" id="avatar-menu">' +
          '<div class="dd-head">' + esc(adminName) + '</div>' +
          '<div class="dd-list">' +
            '<div class="dd-item" data-nav="profile.html">' + AI.user + 'Admin Profile</div>' +
            '<div class="dd-item" data-nav="settings.html">' + AI.gear + 'Restaurant Settings</div>' +
            '<div class="dd-item" data-nav="../index.html">' + AI.external + 'View Website</div>' +
            '<div class="dd-item" id="dd-logout" style="color:#ff8a96">' + AI.logout + 'Logout</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  /* bell dropdown */
  const bellMenu = document.getElementById('bell-menu');
  bellMenu.innerHTML =
    '<div class="dd-head">Notifications <span class="badge red">' + (pendingOrders.length + pendingReviews.length) + '</span></div>' +
    '<div class="dd-list">' +
      (pendingOrders.length
        ? pendingOrders.slice(0, 4).map(o =>
            '<div class="dd-item" data-nav="orders.html">' + AI.orders +
            '<div><b>New order #' + o.id + '</b><div class="td-muted">' + esc(o.customerName) + ' • ' + fmtPrice(o.total) + '</div></div></div>').join('')
        : '<div class="dd-empty">No new orders</div>') +
      (pendingReviews.length
        ? '<div class="dd-item" data-nav="reviews.html">' + AI.star +
          '<div><b>' + pendingReviews.length + ' review' + (pendingReviews.length > 1 ? 's' : '') + ' awaiting approval</b><div class="td-muted">Moderate now</div></div></div>'
        : '') +
    '</div>' +
    '<div class="dd-foot"><a href="orders.html">View all orders</a></div>';

  /* dropdown toggles */
  bindDropdown('tb-bell', 'bell-menu');
  bindDropdown('tb-avatar', 'avatar-menu');
  bellMenu.querySelectorAll('[data-nav]').forEach(el => el.addEventListener('click', () => location.href = el.dataset.nav));
  document.getElementById('dd-logout').addEventListener('click', doLogout);

  /* global search */
  const gs = document.getElementById('global-search');
  const sr = document.getElementById('search-results');
  gs.addEventListener('input', () => {
    const q = gs.value.trim().toLowerCase();
    if (q.length < 2) { sr.classList.remove('open'); return; }
    sr.innerHTML = globalSearch(q);
    sr.classList.add('open');
    sr.querySelectorAll('[data-nav]').forEach(el => el.addEventListener('click', () => location.href = el.dataset.nav));
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.top-search')) sr.classList.remove('open');
    if (!e.target.closest('.dd')) { document.querySelectorAll('.dd-menu.open').forEach(m => m.classList.remove('open')); }
  });
}

function bindDropdown(btnId, menuId) {
  const btn = document.getElementById(btnId), menu = document.getElementById(menuId);
  if (!btn || !menu) return;
  btn.addEventListener('click', e => {
    e.stopPropagation();
    document.querySelectorAll('.dd-menu.open').forEach(m => { if (m !== menu) m.classList.remove('open'); });
    menu.classList.toggle('open');
  });
}

function globalSearch(q) {
  const orders = Store.all('orders').filter(o => ('#' + o.id).includes(q.replace('#', '')) || o.customerName.toLowerCase().includes(q)).slice(0, 4);
  const customers = Store.all('customers').filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)).slice(0, 3);
  const foods = Store.all('foods').filter(f => f.name.toLowerCase().includes(q)).slice(0, 3);
  if (!orders.length && !customers.length && !foods.length) return '<div class="sr-empty">No matches for "' + esc(q) + '"</div>';
  let out = '';
  if (orders.length) {
    out += '<div class="sr-group">Orders</div>' + orders.map(o =>
      '<div class="sr-item" data-nav="orders.html?q=' + o.id + '">' + AI.orders + '<b>#' + o.id + ' ' + esc(o.customerName) + '</b><span class="sr-sub">' + fmtPrice(o.total) + '</span></div>').join('');
  }
  if (customers.length) {
    out += '<div class="sr-group">Customers</div>' + customers.map(c =>
      '<div class="sr-item" data-nav="customers.html?q=' + encodeURIComponent(c.name) + '">' + AI.users + '<b>' + esc(c.name) + '</b><span class="sr-sub">' + esc(c.email) + '</span></div>').join('');
  }
  if (foods.length) {
    out += '<div class="sr-group">Foods</div>' + foods.map(f =>
      '<div class="sr-item" data-nav="foods.html?q=' + encodeURIComponent(f.name) + '">' + AI.foods + '<b>' + esc(f.name) + '</b><span class="sr-sub">' + fmtPrice(f.price) + '</span></div>').join('');
  }
  return out;
}

function closeDrawer() {
  const sb = document.getElementById('sidebar');
  if (sb) sb.classList.remove('open');
  const ov = document.getElementById('admin-overlay');
  if (ov) ov.classList.remove('show');
}

function doLogout() {
  AdminAuth.logout();
  location.href = 'login.html';
}

/* ---------- GUARD ---------- */
function requireAdmin() {
  if (!AdminAuth.isLogged()) { location.href = 'login.html'; return false; }
  return true;
}

/* ---------- NEW-ORDER WATCHDOG (cross-tab live updates) ---------- */
let _lastMaxOrderId = null;
function startOrderWatch(onChange) {
  const orders = Store.all('orders');
  _lastMaxOrderId = orders.reduce((m, o) => Math.max(m, Number(o.id) || 0), 0);
  setInterval(() => {
    Store.load(true); /* re-read localStorage (another tab may have new data) */
    const list = Store.all('orders');
    const maxId = list.reduce((m, o) => Math.max(m, Number(o.id) || 0), 0);
    if (maxId > _lastMaxOrderId) {
      const fresh = list.find(o => Number(o.id) === maxId);
      _lastMaxOrderId = maxId;
      if (fresh) toast('New order #' + fresh.id + ' — ' + fresh.customerName + ' (' + fmtPrice(fresh.total) + ')', 'info');
      if (onChange) onChange();
    }
  }, 8000);
}

/* ---------- LIVE SYNC (website ⇄ admin, all tabs) ----------
   data.js re-dispatches `fc:db` for both same-tab saves and
   cross-tab `storage` events, so this one hook covers:
   - customer places an order / writes a review on the website
   - admin updates data (sidebar badges stay fresh) */
Store.subscribe(() => {
  if (!AdminAuth.isLogged()) return;
  renderSidebar(_activePage, _adminName);
  if (typeof window.onDBChange === 'function') window.onDBChange();
});

/* ---------- TOAST ---------- */
function toast(msg, type) {
  type = type || 'success';
  let holder = document.getElementById('toast-holder');
  if (!holder) { holder = document.createElement('div'); holder.id = 'toast-holder'; document.body.appendChild(holder); }
  const el = document.createElement('div');
  el.className = 'toast toast-' + type;
  const ic = type === 'error' ? AI.x : type === 'info' ? AI.bell : AI.check;
  el.innerHTML = '<span class="toast-ic">' + ic + '</span><span>' + msg + '</span>';
  holder.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 3200);
}

/* ---------- MODAL ---------- */
function openModal(html, size) {
  let holder = document.getElementById('modal-holder');
  if (!holder) { holder = document.createElement('div'); holder.id = 'modal-holder'; document.body.appendChild(holder); }
  const cls = size === 'lg' ? ' modal-lg' : size === 'sm' ? ' modal-sm' : '';
  holder.innerHTML = '<div class="modal-overlay open" id="modal-ov"><div class="modal' + cls + '">' + html + '</div></div>';
  document.getElementById('modal-ov').addEventListener('click', e => { if (e.target.id === 'modal-ov') closeModal(); });
  holder.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeModal));
  return holder;
}
function closeModal() {
  const h = document.getElementById('modal-holder');
  if (h) h.innerHTML = '';
}
function modalHead(title) {
  return '<div class="modal-head"><h3>' + title + '</h3><button class="modal-close" data-close>' + AI.x + '</button></div>';
}

/* confirm dialog (replaces native confirm) */
function confirmDialog(title, text, onYes, yesLabel) {
  openModal(
    '<div class="confirm-body">' +
      '<div class="confirm-ic">' + AI.warn + '</div>' +
      '<h3>' + esc(title) + '</h3><p>' + text + '</p>' +
    '</div>' +
    '<div class="modal-foot" style="border-top:none;justify-content:center;padding-top:8px">' +
      '<button class="btn btn-ghost" data-close style="min-width:110px">Cancel</button>' +
      '<button class="btn btn-danger" id="confirm-yes" style="min-width:110px">' + (yesLabel || 'Yes, Delete') + '</button>' +
    '</div>', 'sm');
  document.getElementById('confirm-yes').addEventListener('click', () => { closeModal(); onYes(); });
}

/* ---------- TABLE HELPERS ---------- */
function initialAvatar(name, size) {
  const s = size || 34;
  const init = String(name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return '<span class="avatar" style="width:' + s + 'px;height:' + s + 'px;font-size:' + Math.round(s * 0.36) + 'px">' + init + '</span>';
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function fmtPrice(n) {
  return 'Rs. ' + Number(n || 0).toLocaleString('en-US');
}
function fmtDate(d) {
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtDateTime(d) {
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ', ' +
         dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function badgeHTML(status, isNew) {
  const m = STATUS_META[status] || { label: status };
  return '<span class="badge st-' + status + (isNew ? ' new-dot' : '') + '">' + m.label + '</span>';
}

function payBadge(o) {
  if (o.payment === 'Online' && o.paymentStatus === 'paid') return '<span class="badge paid">Paid • Online</span>';
  return o.paymentStatus === 'paid'
    ? '<span class="badge paid">Paid • ' + esc(o.payment) + '</span>'
    : '<span class="badge unpaid">Unpaid • ' + esc(o.payment) + '</span>';
}

function nextStatus(status) {
  const i = STATUS_META[status].step;
  if (i < 0 || i >= ORDER_FLOW.length - 1) return null;
  return ORDER_FLOW[i + 1];
}

/* stock helpers */
function stockBadge(f) {
  if (f.stock === null || f.stock === undefined) return '<span class="stock-badge stock-in">∞ Stock</span>';
  if (f.stock <= 0) return '<span class="stock-badge stock-out">Out of stock</span>';
  if (f.stock <= 5) return '<span class="stock-badge stock-low">Low • ' + f.stock + ' left</span>';
  return '<span class="stock-badge stock-in">' + f.stock + ' in stock</span>';
}

/* images available in /images to pick from (shared by foods/categories/homepage) */
function listImages() {
  return [
    'images/burger-1.jpg', 'images/burger-2.jpg', 'images/burger-3.jpg', 'images/burger-4.jpg', 'images/burger-5.jpg', 'images/burger-6.jpg',
    'images/pizza-1.jpg', 'images/pizza-2.jpg', 'images/pizza-3.jpg', 'images/pizza-4.jpg',
    'images/chicken-1.jpg', 'images/chicken-2.jpg', 'images/chicken-3.jpg', 'images/chicken-4.jpg',
    'images/fries-1.jpg', 'images/fries-2.jpg', 'images/fries-3.jpg', 'images/fries-4.jpg',
    'images/drinks-1.jpg', 'images/drinks-2.jpg', 'images/drinks-3.jpg', 'images/drinks-4.jpg',
    'images/dessert-1.jpg', 'images/dessert-2.jpg', 'images/dessert-3.jpg', 'images/dessert-4.jpg',
    'images/hero.jpg'
  ];
}

/* ---------- FILE / DOWNLOAD HELPERS ---------- */
function downloadFile(name, content, mime) {
  const blob = new Blob([content], { type: mime || 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 400);
}

function toCSV(rows) {
  return rows.map(r => r.map(c => {
    const s = String(c == null ? '' : c);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }).join(',')).join('\n');
}

/* read a file input as dataURL */
function readImage(input, cb) {
  const file = input.files && input.files[0];
  if (!file) return;
  if (file.size > 900 * 1024) { toast('Image too large — use an image under 900 KB', 'error'); input.value = ''; return; }
  const rd = new FileReader();
  rd.onload = () => cb(rd.result);
  rd.readAsDataURL(file);
}

/* ---------- PRINT INVOICE ---------- */
function printInvoice(orderId) {
  const o = Store.get('orders', orderId);
  if (!o) return;
  const s = Store.getSettings();
  const rows = o.items.map(it =>
    '<tr><td>' + esc(it.name) + '<div style="font-size:11px;color:#777">' + esc(it.size || '') + (it.extras && it.extras.length ? ' + ' + it.extras.map(esc).join(', ') : '') + '</div></td>' +
    '<td style="text-align:center">' + it.qty + '</td>' +
    '<td style="text-align:right">' + fmtPrice(it.unitPrice) + '</td>' +
    '<td style="text-align:right">' + fmtPrice(it.lineTotal) + '</td></tr>').join('');

  const win = document.createElement('iframe');
  win.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
  document.body.appendChild(win);
  const doc = win.contentDocument;
  doc.open();
  doc.write(
    '<html><head><title>Invoice #' + o.id + ' — ' + esc(s.name) + '</title><style>' +
    'body{font-family:Arial,Helvetica,sans-serif;color:#111;padding:34px;max-width:720px;margin:auto}' +
    '.hd{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #e11d2e;padding-bottom:16px;margin-bottom:20px}' +
    '.hd h1{font-size:22px;margin:0 0 4px}.hd .tag{color:#e11d2e;font-weight:bold;font-size:12px;letter-spacing:2px}' +
    '.inv{text-align:right}.inv h2{margin:0 0 4px;font-size:19px}.inv div{font-size:12px;color:#555}' +
    'table{width:100%;border-collapse:collapse;margin:18px 0;font-size:13px}' +
    'th{background:#111;color:#fff;text-align:left;padding:9px 10px;font-size:11px;letter-spacing:1px;text-transform:uppercase}' +
    'td{padding:9px 10px;border-bottom:1px solid #eee}' +
    '.totals{margin-left:auto;width:270px;font-size:13px}.totals .r{display:flex;justify-content:space-between;padding:4px 0;color:#444}' +
    '.totals .r.big{border-top:2px solid #111;margin-top:6px;padding-top:9px;font-weight:bold;font-size:15px;color:#111}' +
    '.meta{display:flex;gap:34px;font-size:12px;color:#444;margin-bottom:6px}.meta b{display:block;color:#111}' +
    '.note{margin-top:26px;padding:11px 14px;background:#f7f7f7;border-left:3px solid #e11d2e;font-size:12px;color:#555}' +
    '.foot{margin-top:30px;text-align:center;font-size:11.5px;color:#888;border-top:1px solid #eee;padding-top:14px}' +
    '</style></head><body>' +
    '<div class="hd"><div><h1>' + esc(s.name) + '</h1><span class="tag">RESTAURANT INVOICE</span>' +
    '<div style="font-size:12px;color:#555;margin-top:8px">' + esc(s.address) + '<br>' + esc(s.phone) + ' • ' + esc(s.email) + '</div></div>' +
    '<div class="inv"><h2>Invoice #' + o.id + '</h2><div>' + fmtDateTime(o.createdAt) + '</div><div>' + STATUS_META[o.status].label + '</div></div></div>' +
    '<div class="meta"><div><b>Billed To</b>' + esc(o.customerName) + '<br>' + esc(o.phone) + '<br>' + esc(o.email || '') + '</div>' +
    '<div><b>Delivery Address</b>' + esc(o.address) + ', ' + esc(o.city || '') + '</div>' +
    '<div><b>Payment</b>' + esc(o.payment) + ' — ' + (o.paymentStatus === 'paid' ? 'PAID' : 'UNPAID') + '</div></div>' +
    '<table><thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Amount</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table>' +
    '<div class="totals">' +
    '<div class="r"><span>Subtotal</span><span>' + fmtPrice(o.subtotal) + '</span></div>' +
    '<div class="r"><span>Delivery Fee</span><span>' + fmtPrice(o.deliveryFee) + '</span></div>' +
    (o.discount ? '<div class="r"><span>Discount ' + (o.coupon ? '(' + esc(o.coupon) + ')' : '') + '</span><span>- ' + fmtPrice(o.discount) + '</span></div>' : '') +
    '<div class="r big"><span>TOTAL</span><span>' + fmtPrice(o.total) + '</span></div></div>' +
    (o.instructions ? '<div class="note"><b>Note:</b> ' + esc(o.instructions) + (o.notes ? '<br><b>Admin note:</b> ' + esc(o.notes) : '') + '</div>' : '') +
    '<div class="foot">Thank you for ordering from ' + esc(s.name) + '! • ' + esc(s.openTime) + ' – ' + esc(s.closeTime) + ' • Open all 7 days</div>' +
    '</body></html>');
  doc.close();
  setTimeout(() => { win.contentWindow.focus(); win.contentWindow.print(); }, 250);
}

/* ---------- ORDER DETAIL MODAL (shared) ---------- */
function openOrderModal(o, onChange) {
  if (!o) return;
  const step = STATUS_META[o.status].step;
  const isNew = Store.load()._lastSeenOrderId ? o.id > Store.load()._lastSeenOrderId : false;
  const flow = o.status === 'cancelled'
    ? '<div style="margin:4px 0 16px"><span class="badge st-cancelled">Order was cancelled</span>' +
      (o.status === 'cancelled' ? ' <button class="btn btn-ghost btn-sm" id="od-restore">' + AI.restore + ' Restore to Pending</button>' : '') + '</div>'
    : '<div class="status-flow">' +
        ORDER_FLOW.map((st, i) => {
          let cls = i < step ? 'done' : (i === step ? 'current' : '');
          return '<span class="sf-step ' + cls + '">' + STATUS_META[st].label + '</span>' +
                 (i < ORDER_FLOW.length - 1 ? '<span class="sf-arrow">→</span>' : '');
        }).join('') +
      '</div>';

  const next = nextStatus(o.status);
  openModal(
    modalHead('Order #' + o.id + ' ' + badgeHTML(o.status, isNew)) +
    '<div class="modal-body">' +
      flow +
      '<div class="od-grid">' +
        '<div class="kv"><span class="k">Customer</span><b>' + esc(o.customerName) + '</b></div>' +
        '<div class="kv"><span class="k">Phone</span><b>' + esc(o.phone) + '</b></div>' +
        '<div class="kv" style="grid-column:1/-1"><span class="k">Delivery Address</span><b>' + esc(o.address) + (o.city ? ', ' + esc(o.city) : '') + '</b></div>' +
        (o.email ? '<div class="kv"><span class="k">Email</span><b>' + esc(o.email) + '</b></div>' : '') +
        '<div class="kv"><span class="k">Placed</span><b>' + fmtDateTime(o.createdAt) + '</b></div>' +
        '<div class="kv"><span class="k">Payment</span><b>' + payBadge(o) + '</b></div>' +
        '<div class="kv"><span class="k">Estimated Time</span><b>' + esc(o.estimated || '—') + '</b></div>' +
        (o.instructions ? '<div class="kv" style="grid-column:1/-1"><span class="k">Customer Instructions</span><b>' + esc(o.instructions) + '</b></div>' : '') +
        '<div class="kv" style="grid-column:1/-1"><span class="k">Order Notes (internal)</span>' +
          '<textarea class="input" id="od-notes" rows="2" placeholder="Add an internal note about this order..." style="margin-top:4px">' + esc(o.notes || '') + '</textarea>' +
          '<button class="btn btn-ghost btn-sm" id="od-save-notes" style="margin-top:7px">' + AI.save + ' Save Note</button></div>' +
      '</div>' +
      '<div class="od-items">' +
        o.items.map(it =>
          '<div class="od-item"><img src="../' + it.image + '" alt="">' +
          '<div><b>' + esc(it.name) + '</b> × ' + it.qty +
          '<div class="td-muted">' + fmtPrice(it.unitPrice) + ' each' + (it.size ? ' • ' + esc(it.size) : '') + (it.extras && it.extras.length ? ' + ' + it.extras.map(esc).join(', ') : '') + '</div></div>' +
          '<span class="od-line">' + fmtPrice(it.lineTotal) + '</span></div>').join('') +
      '</div>' +
      '<div class="od-totals">' +
        '<div class="row"><span>Subtotal (' + o.items.reduce((n, i) => n + i.qty, 0) + ' items)</span><b>' + fmtPrice(o.subtotal) + '</b></div>' +
        '<div class="row"><span>Delivery Charges</span><b>' + (o.deliveryFee ? fmtPrice(o.deliveryFee) : 'FREE') + '</b></div>' +
        (o.discount ? '<div class="row"><span>Discount ' + (o.coupon ? '(' + esc(o.coupon) + ')' : '') + '</span><b style="color:var(--ok)">- ' + fmtPrice(o.discount) + '</b></div>' : '') +
        '<div class="row total"><span>Final Total</span><b>' + fmtPrice(o.total) + '</b></div>' +
      '</div>' +
    '</div>' +
    '<div class="modal-foot">' +
      '<button class="btn btn-ghost" id="od-print">' + AI.printer + ' Print Invoice</button>' +
      (o.status !== 'cancelled' && o.status !== 'delivered' && o.paymentStatus !== 'paid'
        ? '<button class="btn btn-ok" id="od-paid">' + AI.check + ' Mark Paid</button>' : '') +
      (o.status !== 'cancelled' && o.status !== 'delivered'
        ? '<button class="btn btn-danger" id="od-reject">' + AI.x + ' Cancel Order</button>' : '') +
      (next
        ? '<button class="btn btn-primary" id="od-advance">Mark as ' + STATUS_META[next].label + ' ' + AI.arrow + '</button>'
        : '<button class="btn btn-ghost" data-close>Close</button>') +
    '</div>', 'lg');

  const rerender = () => { closeModal(); if (onChange) onChange(); };

  const adv = document.getElementById('od-advance');
  if (adv) adv.addEventListener('click', () => {
    Store.update('orders', o.id, { status: next });
    toast('Order #' + o.id + ' → ' + STATUS_META[next].label);
    rerender();
  });
  const rej = document.getElementById('od-reject');
  if (rej) rej.addEventListener('click', () => {
    confirmDialog('Cancel order #' + o.id + '?', 'The customer will see this order as cancelled. This can be restored later.', () => {
      Store.update('orders', o.id, { status: 'cancelled' });
      toast('Order #' + o.id + ' cancelled', 'error');
      rerender();
    }, 'Yes, Cancel It');
  });
  const restore = document.getElementById('od-restore');
  if (restore) restore.addEventListener('click', () => {
    Store.update('orders', o.id, { status: 'pending' });
    toast('Order #' + o.id + ' restored to Pending');
    rerender();
  });
  const paid = document.getElementById('od-paid');
  if (paid) paid.addEventListener('click', () => {
    Store.update('orders', o.id, { paymentStatus: 'paid' });
    toast('Order #' + o.id + ' marked as paid');
    rerender();
  });
  document.getElementById('od-print').addEventListener('click', () => printInvoice(o.id));
  document.getElementById('od-save-notes').addEventListener('click', () => {
    Store.update('orders', o.id, { notes: document.getElementById('od-notes').value.trim() });
    toast('Note saved for order #' + o.id);
  });
}
