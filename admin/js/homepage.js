/* =====================================================
   ADMIN — Homepage Content (CMS)
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;
  renderAdminLayout('homepage');
  const h = Store.getSettings().homepage || {};
  const hero = h.hero || {};

  /* ---- hero image library ---- */
  document.getElementById('hm-hero-img').innerHTML = listImages().map(i =>
    '<option value="' + i + '"' + (hero.image === i ? ' selected' : '') + '>' + i.replace('images/', '') + '</option>').join('');

  /* ---- featured foods picker ---- */
  const featured = h.featuredIds || [];
  const fp = document.getElementById('hm-featured');
  fp.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:9px;width:100%">' +
    Store.all('foods').map(f =>
      '<label style="display:flex;align-items:center;gap:10px;border:1px solid var(--border);border-radius:10px;padding:8px 10px;cursor:pointer;background:var(--card-2)">' +
        '<input type="checkbox" data-feat="' + f.id + '"' + (featured.includes(f.id) ? ' checked' : '') + ' style="accent-color:var(--red);width:16px;height:16px">' +
        '<img src="../' + f.image + '" style="width:42px;height:36px;border-radius:7px;object-fit:cover">' +
        '<span style="font-size:12.5px;font-weight:600">' + esc(f.name) + '</span></label>').join('') + '</div>';

  /* ---- why choose us editor ---- */
  const iconOptions = ['leaf', 'truck', 'cart', 'fire', 'clock', 'star', 'user', 'money', 'thumbsUp'];
  const feats = h.features && h.features.length ? h.features : (SEED.settings.homepage.features || []);
  document.getElementById('hm-features').innerHTML = feats.map((f, i) =>
    '<div class="form-row" style="margin-bottom:10px;align-items:end">' +
      '<div class="field" style="margin-bottom:0"><label>Icon ' + (i + 1) + '</label>' +
        '<select class="input" data-feat-ic="' + i + '">' +
          iconOptions.map(ic => '<option value="' + ic + '"' + (f.icon === ic ? ' selected' : '') + '>' + ic + '</option>').join('') + '</select></div>' +
      '<div class="field" style="margin-bottom:0"><label>Title ' + (i + 1) + '</label>' +
        '<input class="input" data-feat-title="' + i + '" value="' + esc(f.title) + '"></div>' +
      '<div class="field" style="margin-bottom:0;grid-column:1/-1"><label>Text ' + (i + 1) + '</label>' +
        '<input class="input" data-feat-text="' + i + '" value="' + esc(f.text) + '"></div>' +
    '</div>').join('') +
    '<button class="btn btn-primary" id="save-features">Save Why Choose Us</button>';

  /* ---- fill values ---- */
  const v = (id, val) => document.getElementById(id).value = val == null ? '' : val;
  v('hm-eyebrow', hero.eyebrow); v('hm-title-plain', hero.titlePlain); v('hm-title-red', hero.titleRed);
  v('hm-desc', hero.desc); v('hm-cta1-text', hero.cta1Text); v('hm-cta1-link', hero.cta1Link);
  v('hm-cta2-text', hero.cta2Text); v('hm-cta2-link', hero.cta2Link);
  v('hm-stats', (hero.stats || []).map(s => s.v + ' | ' + s.l).join(', '));
  v('hm-strip', h.strip);
  const off = h.offer || {};
  document.getElementById('hm-offer-active').checked = off.active !== false;
  v('hm-offer-tag', off.tag); v('hm-offer-code', off.code);
  v('hm-offer-plain', off.titlePlain); v('hm-offer-red', off.titleRed); v('hm-offer-rest', off.titleRest);
  v('hm-offer-desc', off.desc); v('hm-offer-btn', off.btnText);
  v('hm-offer-codenote', off.codeNote); v('hm-offer-minnote', off.minNote);
  v('hm-footer', h.footerAbout);

  const flash = () => { toast('Saved — refresh the website to see it live'); };

  /* ---- saves ---- */
  document.getElementById('save-hero').addEventListener('click', () => {
    const stats = document.getElementById('hm-stats').value.split(',').map(s => s.trim()).filter(Boolean).map(s => {
      const [a, b] = s.split('|');
      return { v: (a || '').trim(), l: (b || '').trim() };
    }).filter(s => s.v);
    Store.saveSettings({ homepage: Object.assign(Store.getSettings().homepage || {}, {
      hero: {
        eyebrow: document.getElementById('hm-eyebrow').value.trim(),
        titlePlain: document.getElementById('hm-title-plain').value.trim(),
        titleRed: document.getElementById('hm-title-red').value.trim(),
        desc: document.getElementById('hm-desc').value.trim(),
        image: document.getElementById('hm-hero-img').value,
        cta1Text: document.getElementById('hm-cta1-text').value.trim(),
        cta1Link: document.getElementById('hm-cta1-link').value.trim() || 'menu.html',
        cta2Text: document.getElementById('hm-cta2-text').value.trim(),
        cta2Link: document.getElementById('hm-cta2-link').value.trim() || 'menu.html',
        stats
      }
    }) });
    flash();
  });

  document.getElementById('save-strip').addEventListener('click', () => {
    Store.saveSettings({ homepage: Object.assign(Store.getSettings().homepage || {}, {
      strip: document.getElementById('hm-strip').value.trim()
    }) });
    flash();
  });

  document.getElementById('save-offer').addEventListener('click', () => {
    Store.saveSettings({ homepage: Object.assign(Store.getSettings().homepage || {}, {
      offer: {
        active: document.getElementById('hm-offer-active').checked,
        tag: document.getElementById('hm-offer-tag').value.trim(),
        titlePlain: document.getElementById('hm-offer-plain').value.trim(),
        titleRed: document.getElementById('hm-offer-red').value.trim(),
        titleRest: document.getElementById('hm-offer-rest').value.trim(),
        desc: document.getElementById('hm-offer-desc').value.trim(),
        btnText: document.getElementById('hm-offer-btn').value.trim(),
        btnLink: 'menu.html',
        code: document.getElementById('hm-offer-code').value.trim().toUpperCase(),
        codeNote: document.getElementById('hm-offer-codenote').value.trim(),
        minNote: document.getElementById('hm-offer-minnote').value.trim()
      }
    }) });
    flash();
  });

  document.getElementById('save-featured').addEventListener('click', () => {
    const ids = Array.from(document.querySelectorAll('[data-feat]:checked')).map(x => x.dataset.feat);
    Store.saveSettings({ homepage: Object.assign(Store.getSettings().homepage || {}, { featuredIds: ids }) });
    flash();
  });

  document.getElementById('save-features').addEventListener('click', () => {
    const feats = [0, 1, 2, 3].map(i => ({
      icon: document.querySelector('[data-feat-ic="' + i + '"]').value,
      title: document.querySelector('[data-feat-title="' + i + '"]').value.trim(),
      text: document.querySelector('[data-feat-text="' + i + '"]').value.trim()
    }));
    Store.saveSettings({ homepage: Object.assign(Store.getSettings().homepage || {}, { features: feats }) });
    flash();
  });

  document.getElementById('save-footer').addEventListener('click', () => {
    Store.saveSettings({ homepage: Object.assign(Store.getSettings().homepage || {}, {
      footerAbout: document.getElementById('hm-footer').value.trim()
    }) });
    flash();
  });
});
