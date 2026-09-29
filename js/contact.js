/* =====================================================
   FLAME & CRUST — Contact Page
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const s = Store.getSettings();

  const cards = [
    { ic: ICONS.phone, t: 'Phone Number', v: s.phone + '<br><span class="muted">Available 11:00 AM – 1:00 AM</span>' },
    { ic: ICONS.mail,  t: 'Email Address', v: s.email + '<br><span class="muted">We reply within a few hours</span>' },
    { ic: ICONS.pin,   t: 'Visit Us',      v: s.address + '<br><span class="muted">Free parking for diners</span>' },
    { ic: ICONS.clock, t: 'Opening Hours', v: s.openTime + ' – ' + s.closeTime + '<br><span class="muted">Open 7 days a week</span>' }
  ];

  document.getElementById('contact-info').innerHTML = cards.map(c =>
    '<div class="card info-card" style="padding:20px 22px">' +
      '<div style="display:flex;gap:16px;align-items:flex-start">' +
        '<div class="ic" style="margin-bottom:0">' + c.ic + '</div>' +
        '<div><h4>' + c.t + '</h4><p>' + c.v + '</p></div>' +
      '</div>' +
    '</div>').join('');

  document.getElementById('contact-form').addEventListener('submit', e => {
    e.preventDefault();
    if (validateContact()) sendContact();
  });
});

function mark(id, on) {
  const inp = document.getElementById(id);
  const f = inp.closest('.field');
  inp.classList.toggle('error', on);
  if (f) f.classList.toggle('has-error', on);
}

function validateContact() {
  const name = document.getElementById('ct-name').value.trim();
  const phone = document.getElementById('ct-phone').value.trim();
  const email = document.getElementById('ct-email').value.trim();
  const msg = document.getElementById('ct-msg').value.trim();

  const checks = [
    ['ct-name', name.length >= 3],
    ['ct-phone', phone.replace(/\D/g, '').length >= 10],
    ['ct-email', /^\S+@\S+\.\S+$/.test(email)],
    ['ct-msg', msg.length >= 10]
  ];
  checks.forEach(([id, ok]) => mark(id, !ok));
  if (checks.some(c => !c[1])) { toast('Please fill in all fields correctly', 'error'); return false; }
  return true;
}

function sendContact() {
  const btn = document.getElementById('ct-send');
  btn.disabled = true;
  btn.textContent = 'Sending...';
  setTimeout(() => {
    document.getElementById('contact-form').reset();
    btn.disabled = false;
    btn.textContent = 'Send Message';
    toast('Message sent! We will get back to you soon.');
  }, 700);
}
