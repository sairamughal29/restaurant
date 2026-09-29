/* =====================================================
   ADMIN — Profile & Security
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;
  renderAdminLayout('profile');
  const s = Store.getSettings().admin || {};
  const session = AdminAuth.session() || {};

  document.getElementById('pf-card').innerHTML =
    '<div style="display:flex;align-items:center;gap:15px;margin-bottom:18px">' + initialAvatar(session.name || s.name || 'Admin', 58) +
      '<div><b style="font-size:16px">' + esc(session.name || s.name || 'Admin') + '</b>' +
      '<div class="td-muted">' + esc(session.email || s.email || '') + '</div>' +
      '<span class="badge red" style="margin-top:5px">Administrator</span></div></div>' +
    '<div class="field"><label>Display Name</label><input class="input" id="pf-name" value="' + esc(s.name || '') + '"></div>' +
    '<div class="field"><label>Login Email</label><input class="input" id="pf-email" value="' + esc(s.email || '') + '"></div>' +
    '<button class="btn btn-primary" id="pf-save">Save Profile</button>' +
    '<button class="btn btn-danger" id="pf-logout" style="margin-left:8px">Logout</button>';

  document.getElementById('pf-session').innerHTML =
    '<div class="kv" style="margin-bottom:10px"><span class="k">Logged in since</span><b>' + fmtDateTime(session.loginAt || Date.now()) + '</b></div>' +
    '<div class="kv" style="margin-bottom:10px"><span class="k">Session expires</span><b>' + fmtDateTime(session.exp || Date.now()) + '</b></div>' +
    '<div class="kv"><span class="k">Session validity</span><b>12 hours • protected pages redirect to login</b></div>';

  /* password visibility toggles */
  const eyeIc = AI.eye, eyeOffIc = AI.eyeOff;
  document.querySelectorAll('.pass-toggle').forEach(b => {
    b.innerHTML = eyeIc;
    b.addEventListener('click', () => {
      const inp = document.getElementById(b.dataset.for);
      const show = inp.type === 'password';
      inp.type = show ? 'text' : 'password';
      b.innerHTML = show ? eyeOffIc : eyeIc;
    });
  });

  document.getElementById('pf-save').addEventListener('click', () => {
    const name = document.getElementById('pf-name').value.trim();
    const email = document.getElementById('pf-email').value.trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) { toast('Enter a valid name and email', 'error'); return; }
    Store.saveSettings({ admin: { ...s, name, email } });
    AdminAuth.login({ name, email });
    toast('Profile updated');
    renderAdminLayout('profile');
  });

  document.getElementById('pf-logout').addEventListener('click', doLogout);

  document.getElementById('pw-save').addEventListener('click', async () => {
    const cur = document.getElementById('pw-cur').value;
    const nw = document.getElementById('pw-new').value;
    const conf = document.getElementById('pw-conf').value;
    const adm = Store.getSettings().admin || {};
    const curHash = await sha256(cur);
    if (curHash !== adm.passHash) { toast('Current password is incorrect', 'error'); return; }
    if (nw.length < 6) { toast('New password must be at least 6 characters', 'error'); return; }
    if (nw !== conf) { toast('Passwords do not match', 'error'); return; }
    Store.saveSettings({ admin: { ...adm, passHash: await sha256(nw) } });
    document.getElementById('pw-cur').value = document.getElementById('pw-new').value = document.getElementById('pw-conf').value = '';
    toast('Password updated — use it at next login');
  });
});
