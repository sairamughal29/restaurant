/* =====================================================
   FLAME & CRUST — Login / Register
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* if already logged in, go to profile */
  if (Auth.isLogged() && (location.pathname.includes('login') || location.pathname.includes('register'))) {
    location.href = 'profile.html';
    return;
  }

  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', e => { e.preventDefault(); doLogin(); });

  const regForm = document.getElementById('register-form');
  if (regForm) regForm.addEventListener('submit', e => { e.preventDefault(); doRegister(); });
});

function markErr(id, on) {
  const inp = document.getElementById(id);
  const f = inp.closest('.field');
  inp.classList.toggle('error', on);
  if (f) f.classList.toggle('has-error', on);
}

function doLogin() {
  const email = document.getElementById('lg-email').value.trim();
  const pass = document.getElementById('lg-pass').value;

  const eOk = /^\S+@\S+\.\S+$/.test(email);
  const pOk = pass.length >= 6;
  markErr('lg-email', !eOk); markErr('lg-pass', !pOk);
  if (!eOk || !pOk) { toast('Please check your credentials', 'error'); return; }

  /* demo: look up existing customer or create session from entered email */
  const existing = Store.all('customers').find(c => c.email.toLowerCase() === email.toLowerCase());
  const user = existing
    ? { id: existing.id, name: existing.name, email: existing.email, phone: existing.phone, address: existing.address }
    : { id: 'guest_' + Date.now(), name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, m => m.toUpperCase()), email: email, phone: '', address: '' };

  const btn = document.querySelector('#login-form button[type="submit"]');
  btn.disabled = true; btn.textContent = 'Logging in...';
  setTimeout(() => {
    Auth.login(user);
    toast('Welcome back, ' + user.name.split(' ')[0] + '!');
    location.href = 'profile.html';
  }, 600);
}

function doRegister() {
  const name = document.getElementById('rg-name').value.trim();
  const email = document.getElementById('rg-email').value.trim();
  const phone = document.getElementById('rg-phone').value.trim();
  const pass = document.getElementById('rg-pass').value;
  const pass2 = document.getElementById('rg-pass2').value;

  const checks = [
    ['rg-name', name.length >= 3],
    ['rg-email', /^\S+@\S+\.\S+$/.test(email)],
    ['rg-phone', phone.replace(/\D/g, '').length >= 10],
    ['rg-pass', pass.length >= 6],
    ['rg-pass2', pass2 === pass && pass.length >= 6]
  ];
  checks.forEach(([id, ok]) => markErr(id, !ok));
  if (checks.some(c => !c[1])) { toast('Please fix the highlighted fields', 'error'); return; }

  /* save as customer (demo persistence) */
  const cu = Store.insert('customers', {
    name: name, email: email, phone: phone,
    address: '', joined: new Date().toISOString().slice(0, 10),
    orders: 0, spent: 0, status: 'active'
  });

  const btn = document.querySelector('#register-form button[type="submit"]');
  btn.disabled = true; btn.textContent = 'Creating account...';
  setTimeout(() => {
    Auth.login({ id: cu.id, name: name, email: email, phone: phone, address: '' });
    toast('Account created. Welcome, ' + name.split(' ')[0] + '!');
    location.href = 'profile.html';
  }, 600);
}
