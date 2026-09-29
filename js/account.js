/* =====================================================
   FLAME & CRUST — Profile + Order History
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (!Auth.isLogged()) {
    location.href = 'login.html';
    return;
  }
  renderSideNav();
  if (location.pathname.includes('orders')) renderOrders();
  else renderProfile();
});

function renderSideNav() {
  const u = Auth.user();
  const onProfile = location.pathname.includes('profile');
  document.getElementById('profile-side').innerHTML =
    initialsAvatar(u.name, 72) +
    '<h3>' + u.name + '</h3>' +
    '<div class="email">' + u.email + '</div>' +
    '<div class="profile-menu">' +
      '<a href="profile.html" class="' + (onProfile ? 'active' : '') + '">' + ICONS.user + ' Personal Information</a>' +
      '<a href="orders.html" class="' + (!onProfile ? 'active' : '') + '">' + ICONS.clock + ' Order History</a>' +
      '<a href="menu.html">' + ICONS.fire + ' Order Again</a>' +
      '<a href="#" class="danger" id="side-logout">' + ICONS.trash + ' Logout</a>' +
    '</div>';
  document.getElementById('side-logout').addEventListener('click', e => {
    e.preventDefault();
    Auth.logout();
    toast('Logged out successfully');
    setTimeout(() => location.href = 'index.html', 500);
  });
}

/* ================= PROFILE ================= */
function renderProfile() {
  const u = Auth.user();
  const myOrders = Store.all('orders').filter(o =>
    (u.email && o.email && o.email.toLowerCase() === u.email.toLowerCase()) ||
    o.customerName.toLowerCase() === u.name.toLowerCase()
  ).slice(0, 3);
  const favs = Favs.all().map(foodById).filter(Boolean);

  document.getElementById('profile-content').innerHTML =
    /* personal info */
    '<div class="card panel mb-24">' +
      '<h3>' + ICONS.user + ' Personal Information</h3>' +
      '<form id="pi-form">' +
        '<div class="form-row">' +
          '<div class="field"><label>Full Name</label><input class="input" id="pi-name" value="' + (u.name || '') + '"></div>' +
          '<div class="field"><label>Phone</label><input class="input" id="pi-phone" value="' + (u.phone || '') + '" placeholder="+92 ..."></div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="field"><label>Email</label><input class="input" id="pi-email" value="' + (u.email || '') + '" disabled style="opacity:.6"></div>' +
          '<div class="field"><label>Default Address</label><input class="input" id="pi-address" value="' + (u.address || '') + '" placeholder="House, Street, City"></div>' +
        '</div>' +
        '<button type="submit" class="btn btn-primary">Save Changes</button>' +
      '</form>' +
    '</div>' +

    /* recent orders */
    '<div class="card panel mb-24">' +
      '<h3>' + ICONS.clock + ' Recent Orders</h3>' +
      (myOrders.length
        ? myOrders.map(orderCardHTML).join('')
        : '<p class="muted">No orders yet. <a href="menu.html" class="red" style="font-weight:700">Start ordering</a></p>') +
      '<div class="mt-16"><a href="orders.html" class="btn btn-ghost btn-sm">View All Orders</a></div>' +
    '</div>' +

    /* favorites */
    '<div class="card panel mb-24">' +
      '<h3>' + ICONS.heartFill + ' Favorites</h3>' +
      (favs.length
        ? '<div class="grid-3">' + favs.map(foodCardHTML).join('') + '</div>'
        : '<p class="muted">You have no favorites yet. Tap the heart on any dish to save it here.</p>') +
    '</div>' +

    /* account */
    '<div class="card panel">' +
      '<h3>' + ICONS.lock + ' Account &amp; Security</h3>' +
      '<div class="form-row">' +
        '<div class="field"><label>Current Password</label><input type="password" class="input" id="acc-cur" placeholder="••••••••"></div>' +
        '<div class="field"><label>New Password</label><input type="password" class="input" id="acc-new" placeholder="Min 6 characters"></div>' +
      '</div>' +
      '<button class="btn btn-ghost" id="acc-save">Change Password</button> ' +
      '<button class="btn btn-ghost" id="acc-logout" style="border-color:var(--red-line);color:#ff8a96">Logout</button>' +
    '</div>';

  bindCards(document.getElementById('profile-content'));
  observeReveals();

  document.getElementById('pi-form').addEventListener('submit', e => {
    e.preventDefault();
    const nu = Auth.user();
    nu.name = document.getElementById('pi-name').value.trim() || nu.name;
    nu.phone = document.getElementById('pi-phone').value.trim();
    nu.address = document.getElementById('pi-address').value.trim();
    Auth.login(nu);
    toast('Profile updated successfully');
    renderSideNav();
  });

  document.getElementById('acc-save').addEventListener('click', () => {
    const cur = document.getElementById('acc-cur').value;
    const nw = document.getElementById('acc-new').value;
    if (cur.length < 6) { toast('Enter your current password', 'error'); return; }
    if (nw.length < 6) { toast('New password must be at least 6 characters', 'error'); return; }
    document.getElementById('acc-cur').value = '';
    document.getElementById('acc-new').value = '';
    toast('Password changed successfully');
  });

  document.getElementById('acc-logout').addEventListener('click', () => {
    Auth.logout();
    toast('Logged out successfully');
    setTimeout(() => location.href = 'index.html', 500);
  });
}

/* ================= ORDER HISTORY ================= */
function orderCardHTML(o) {
  return '<div class="card order-card mb-16">' +
    '<div class="oc-top">' +
      '<div><div class="oc-id">Order <b>#' + o.id + '</b></div>' +
      '<div class="oc-date">' + fmtDate(o.createdAt) + ' • ' + o.items.reduce((n, i) => n + i.qty, 0) + ' items • ' + o.payment + '</div></div>' +
      badgeHTML(o.status) +
    '</div>' +
    '<div class="oc-items">' +
      o.items.map(it => '<span class="oc-chip"><img src="' + it.image + '" alt=""><span>' + it.name + ' <b>× ' + it.qty + '</b></span></span>').join('') +
    '</div>' +
    '<div class="oc-bottom">' +
      '<div class="oc-total">Total: <b>' + fmtPrice(o.total) + '</b></div>' +
      '<div class="oc-actions">' +
        (o.status === 'delivered' ? '<button class="btn btn-ghost btn-sm" data-review="' + o.id + '">' + ICONS.star + ' Review</button>' : '') +
        '<a href="order-tracking.html?id=' + o.id + '" class="btn btn-ghost btn-sm">View Details</a>' +
        '<button class="btn btn-primary btn-sm" data-reorder="' + o.id + '">Reorder</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderOrders() {
  const u = Auth.user();
  const all = Store.all('orders').filter(o =>
    (u.email && o.email && o.email.toLowerCase() === u.email.toLowerCase()) ||
    o.customerName.toLowerCase() === u.name.toLowerCase() ||
    true /* demo: show all orders so history is never empty */
  );
  const root = document.getElementById('orders-content');

  if (!all.length) {
    root.innerHTML = emptyState(ICONS.cart, 'No Orders Yet',
      'When you place your first order it will show up here.',
      '<a href="menu.html" class="btn btn-primary">Browse Menu</a>');
    return;
  }

  root.innerHTML = all.map(orderCardHTML).join('');

  root.querySelectorAll('[data-reorder]').forEach(b => b.addEventListener('click', () => {
    const o = Store.all('orders').find(x => x.id == b.dataset.reorder);
    if (!o) return;
    o.items.forEach(it => Cart.add({
      foodId: it.foodId, name: it.name, image: it.image, size: it.size,
      extras: it.extras || [], qty: it.qty, unitPrice: it.unitPrice, note: ''
    }));
    toast('Items added back to your cart');
    setTimeout(() => location.href = 'cart.html', 600);
  }));

  root.querySelectorAll('[data-review]').forEach(b => b.addEventListener('click', () => {
    const o = Store.all('orders').find(x => x.id == b.dataset.review);
    if (o) openReviewModal(o);
  }));
}
