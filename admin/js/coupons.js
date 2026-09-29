/* =====================================================
   ADMIN — Offers & Coupons (enhanced)
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;
  renderAdminLayout('coupons');
  document.getElementById('add-coupon').addEventListener('click', () => openCouponModal());
  render();
});

function couponLive(c) {
  const now = new Date();
  const startOk = !c.startDate || new Date(c.startDate) <= now;
  const endOk = new Date(c.expiry + 'T23:59:59') >= now;
  return c.active && startOk && endOk && (c.used || 0) < (c.usageLimit || Infinity);
}

function render() {
  const coupons = Store.all('coupons');
  const el = document.getElementById('cp-table');
  document.getElementById('cp-count').textContent = coupons.length + ' coupons';

  if (!coupons.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">' + AI.coupon + '</div>' +
      '<h3>No coupons yet</h3><p>Create your first discount code.</p></div>';
    return;
  }

  el.innerHTML = '<table class="tbl"><thead><tr>' +
    '<th>Code</th><th>Discount</th><th>Min Order</th><th>Max Cap</th><th>Validity</th><th>Usage</th><th>Status</th><th>Actions</th>' +
    '</tr></thead><tbody>' +
    coupons.map(c => {
      const live = couponLive(c);
      return '<tr>' +
        '<td data-label="Code"><span class="td-red" style="font-weight:900;letter-spacing:.08em;font-size:14.5px">' + esc(c.code) + '</span></td>' +
        '<td data-label="Discount" class="td-bold">' + (c.type === 'percent' ? c.value + '% OFF' : fmtPrice(c.value) + ' OFF') +
          (c.maxDiscount ? '<div class="tf-sub">up to ' + fmtPrice(c.maxDiscount) + '</div>' : '') + '</td>' +
        '<td data-label="Min Order" class="td-muted">' + fmtPrice(c.minOrder) + '</td>' +
        '<td data-label="Max Cap" class="td-muted">' + (c.maxDiscount ? fmtPrice(c.maxDiscount) : '—') + '</td>' +
        '<td data-label="Validity" class="td-muted">' + (c.startDate ? fmtDate(c.startDate) : 'start of time') + ' → ' + fmtDate(c.expiry) + '</td>' +
        '<td data-label="Usage">' +
          '<div style="display:flex;align-items:center;gap:8px">' +
            '<div style="width:80px;height:7px;border-radius:5px;background:#222;overflow:hidden">' +
              '<div style="width:' + Math.min(100, Math.round((c.used || 0) / (c.usageLimit || 1) * 100)) + '%;height:100%;background:var(--red)"></div></div>' +
            '<span class="td-muted" style="font-size:11.5px">' + (c.used || 0) + '/' + c.usageLimit + '</span></div></td>' +
        '<td data-label="Status">' + (live ? '<span class="badge st-delivered">Active</span>' : '<span class="badge st-cancelled">' + (c.active ? 'Expired / Limit' : 'Disabled') + '</span>') + '</td>' +
        '<td data-label="" class="actions-cell"><div class="actions">' +
          '<button class="icon-btn" data-edit="' + esc(c.code) + '" title="Edit">' + AI.edit + '</button>' +
          '<button class="icon-btn" data-toggle="' + esc(c.code) + '" title="' + (c.active ? 'Disable' : 'Enable') + '">' + (c.active ? AI.eyeOff : AI.eye) + '</button>' +
          '<button class="icon-btn" data-del="' + esc(c.code) + '" title="Delete">' + AI.trash + '</button>' +
        '</div></td>' +
      '</tr>';
    }).join('') +
    '</tbody></table>';

  el.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', () => {
    const c = Store.all('coupons').find(x => x.code === b.dataset.toggle);
    Store.update('coupons', c.code, { active: !c.active });
    toast('Coupon ' + c.code + (c.active ? ' disabled' : ' enabled'));
    render();
  }));
  el.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () =>
    openCouponModal(Store.all('coupons').find(x => x.code === b.dataset.edit))));
  el.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
    const c = Store.all('coupons').find(x => x.code === b.dataset.del);
    confirmDialog('Delete coupon ' + c.code + '?', 'Customers will no longer be able to use this code.', () => {
      Store.remove('coupons', c.code);
      toast('Coupon deleted', 'error');
      render();
    });
  }));
}

function openCouponModal(coupon) {
  const isEdit = !!coupon;
  const c = coupon || {};
  openModal(
    modalHead(isEdit ? 'Edit Coupon — ' + esc(c.code) : 'Create Coupon') +
    '<div class="modal-body">' +
      '<div class="form-row">' +
        '<div class="field"><label>Code <span class="req">*</span></label>' +
          '<input class="input" id="cp-code" value="' + (isEdit ? esc(c.code) : '') + '" placeholder="FOOD20" style="text-transform:uppercase;letter-spacing:.08em"' + (isEdit ? ' readonly' : '') + '></div>' +
        '<div class="field"><label>Discount Type</label>' +
          '<select class="input" id="cp-type"><option value="percent"' + (c.type === 'percent' ? ' selected' : '') + '>Percentage (%)</option><option value="fixed"' + (c.type === 'fixed' ? ' selected' : '') + '>Fixed Amount (Rs.)</option></select></div>' +
      '</div>' +
      '<div class="form-row-3">' +
        '<div class="field"><label>Discount Value <span class="req">*</span></label>' +
          '<input class="input" type="number" id="cp-value" min="1" value="' + (c.value || '') + '" placeholder="20"></div>' +
        '<div class="field"><label>Max Discount (Rs.)</label>' +
          '<input class="input" type="number" id="cp-max" min="0" value="' + (c.maxDiscount || '') + '" placeholder="0 = no cap"></div>' +
        '<div class="field"><label>Minimum Order (Rs.)</label>' +
          '<input class="input" type="number" id="cp-min" min="0" value="' + (c.minOrder != null ? c.minOrder : 500) + '"></div>' +
      '</div>' +
      '<div class="form-row-3">' +
        '<div class="field"><label>Start Date</label><input class="input" type="date" id="cp-start" value="' + (c.startDate || '') + '"></div>' +
        '<div class="field"><label>Expiry Date <span class="req">*</span></label>' +
          '<input class="input" type="date" id="cp-expiry" value="' + (c.expiry || '2026-12-31') + '"></div>' +
        '<div class="field"><label>Usage Limit</label>' +
          '<input class="input" type="number" id="cp-limit" min="1" value="' + (c.usageLimit || 100) + '"></div>' +
      '</div>' +
    '</div>' +
    '<div class="modal-foot">' +
      '<button class="btn btn-ghost" data-close>Cancel</button>' +
      '<button class="btn btn-primary" id="cp-save">' + (isEdit ? 'Save Changes' : 'Create Coupon') + '</button>' +
    '</div>');

  document.getElementById('cp-save').addEventListener('click', () => {
    const code = document.getElementById('cp-code').value.trim().toUpperCase();
    const value = parseFloat(document.getElementById('cp-value').value);
    const expiry = document.getElementById('cp-expiry').value;
    let ok = true;
    [['cp-code', code.length >= 3], ['cp-value', !isNaN(value) && value > 0], ['cp-expiry', !!expiry]]
      .forEach(([id, valid]) => { document.getElementById(id).classList.toggle('error', !valid); if (!valid) ok = false; });
    if (!ok) { toast('Please fill all required fields', 'error'); return; }

    if (!isEdit && Store.all('coupons').some(x => x.code === code)) {
      toast('A coupon with this code already exists', 'error');
      return;
    }

    const data = {
      code,
      type: document.getElementById('cp-type').value,
      value,
      maxDiscount: parseFloat(document.getElementById('cp-max').value) || 0,
      minOrder: parseFloat(document.getElementById('cp-min').value) || 0,
      startDate: document.getElementById('cp-start').value || '',
      expiry,
      usageLimit: parseInt(document.getElementById('cp-limit').value) || 100
    };

    if (isEdit) {
      Store.update('coupons', c.code, data);
      toast('Coupon ' + code + ' updated');
    } else {
      data.used = 0;
      data.active = true;
      Store.insert('coupons', data);
      toast('Coupon ' + code + ' created — usable at checkout now');
    }
    closeModal();
    render();
  });
}

/* live refresh when the website (another tab) changes data */
window.onDBChange = render;
