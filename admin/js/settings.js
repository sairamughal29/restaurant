/* =====================================================
   ADMIN — Restaurant Settings (info, schedule, branding)
   ===================================================== */

let _logoData = null, _favData = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;
  renderAdminLayout('settings');
  const s = Store.getSettings();

  const v = (id, val) => document.getElementById(id).value = val == null ? '' : val;
  v('st-name', s.name); v('st-tagline', s.tagline); v('st-desc', s.description);
  v('st-phone', s.phone); v('st-wa', s.whatsapp); v('st-email', s.email);
  v('st-address', s.address); v('st-maps', s.mapsUrl);
  v('st-open', s.openTime); v('st-close', s.closeTime); v('st-currency', s.currency);
  v('st-fb', (s.social || {}).facebook); v('st-ig', (s.social || {}).instagram); v('st-tw', (s.social || {}).twitter);

  /* weekly schedule rows */
  const sch = s.schedule || SEED.settings.schedule;
  document.getElementById('st-schedule').innerHTML = sch.map((r, i) =>
    '<div class="form-row" style="grid-template-columns:1.2fr 1fr 1fr auto;align-items:center;margin-bottom:8px">' +
      '<b style="font-size:13px">' + r.day + '</b>' +
      '<input class="input input-sm" value="' + esc(r.open) + '" data-sch-open="' + i + '" placeholder="11:00 AM">' +
      '<input class="input input-sm" value="' + esc(r.close) + '" data-sch-close="' + i + '" placeholder="01:00 AM">' +
      '<label style="display:flex;align-items:center;gap:7px;font-size:11.5px;color:var(--text-2);white-space:nowrap">' +
        '<input type="checkbox" data-sch-closed="' + i + '"' + (r.closed ? ' checked' : '') + ' style="accent-color:var(--red)"> Closed</label>' +
    '</div>').join('');

  /* branding uploads */
  if (s.logo) document.getElementById('st-logo-prev').innerHTML = '<img src="' + s.logo + '">';
  if (s.favicon) document.getElementById('st-fav-prev').innerHTML = '<img src="' + s.favicon + '">';
  bindUpload('st-logo-drop', 'st-logo', url => { _logoData = url; document.getElementById('st-logo-prev').innerHTML = '<img src="' + url + '">'; });
  bindUpload('st-fav-drop', 'st-fav', url => { _favData = url; document.getElementById('st-fav-prev').innerHTML = '<img src="' + url + '">'; });

  document.getElementById('st-save').addEventListener('click', () => {
    const name = document.getElementById('st-name').value.trim();
    if (!name) { document.getElementById('st-name').classList.add('error'); toast('Restaurant name is required', 'error'); return; }
    const patch = {
      name,
      tagline: document.getElementById('st-tagline').value.trim(),
      description: document.getElementById('st-desc').value.trim(),
      phone: document.getElementById('st-phone').value.trim(),
      whatsapp: document.getElementById('st-wa').value.trim(),
      email: document.getElementById('st-email').value.trim(),
      address: document.getElementById('st-address').value.trim(),
      mapsUrl: document.getElementById('st-maps').value.trim(),
      openTime: document.getElementById('st-open').value.trim() || s.openTime,
      closeTime: document.getElementById('st-close').value.trim() || s.closeTime,
      currency: document.getElementById('st-currency').value.trim() || 'Rs.',
      social: {
        facebook: document.getElementById('st-fb').value.trim(),
        instagram: document.getElementById('st-ig').value.trim(),
        twitter: document.getElementById('st-tw').value.trim()
      },
      schedule: sch.map((r, i) => ({
        day: r.day,
        open: document.querySelector('[data-sch-open="' + i + '"]').value.trim(),
        close: document.querySelector('[data-sch-close="' + i + '"]').value.trim(),
        closed: document.querySelector('[data-sch-closed="' + i + '"]').checked
      }))
    };
    if (_logoData) patch.logo = _logoData;
    if (_favData) patch.favicon = _favData;
    Store.saveSettings(patch);
    toast('Settings saved — live across the website');
    renderAdminLayout('settings'); /* refresh sidebar user */
  });
});

function bindUpload(dropId, inputId, cb) {
  const drop = document.getElementById(dropId), input = document.getElementById(inputId);
  drop.addEventListener('click', () => input.click());
  input.addEventListener('change', () => readImage(input, url => {
    cb(url);
    toast('Image ready — press Save to apply');
  }));
}
