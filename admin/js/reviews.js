/* =====================================================
   ADMIN — Review Moderation (approve / hide / feature)
   ===================================================== */

let revState = 'all';

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;
  renderAdminLayout('reviews');

  document.querySelectorAll('#rev-filters [data-s]').forEach(ch => ch.addEventListener('click', () => {
    revState = ch.dataset.s;
    document.querySelectorAll('#rev-filters [data-s]').forEach(x => x.classList.remove('active'));
    ch.classList.add('active');
    render();
  }));

  render();
});

function render() {
  let reviews = Store.all('reviews');
  if (revState === 'featured') reviews = reviews.filter(r => r.featured);
  else if (revState !== 'all') reviews = reviews.filter(r => r.status === revState);
  const el = document.getElementById('rev-table');
  document.getElementById('rev-count').textContent = reviews.length + ' reviews';

  if (!reviews.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">' + AI.star + '</div>' +
      '<h3>No reviews here</h3><p>Customer reviews will show up for moderation.</p></div>';
    return;
  }

  el.innerHTML = '<table class="tbl"><thead><tr>' +
    '<th>Customer</th><th>Food</th><th>Rating</th><th>Review</th><th>Date</th><th>Status</th><th>Actions</th>' +
    '</tr></thead><tbody>' +
    reviews.map(r => {
      const food = foodById(r.foodId);
      return '<tr>' +
        '<td data-label="Customer"><div style="display:flex;align-items:center;gap:10px">' + initialAvatar(r.customer, 30) +
          '<span class="td-bold">' + esc(r.customer) + '</span></div></td>' +
        '<td data-label="Food" class="td-muted">' + (food ? esc(food.name) : '—') + '</td>' +
        '<td data-label="Rating"><span class="star-cell">' + '★'.repeat(r.rating) + '<span style="color:#3a3a3a">' + '★'.repeat(5 - r.rating) + '</span></span></td>' +
        '<td data-label="Review" style="max-width:300px"><span class="td-muted" style="font-style:italic">"' + esc(r.text) + '"</span></td>' +
        '<td data-label="Date" class="td-muted">' + fmtDate(r.date) + '</td>' +
        '<td data-label="Status">' +
          (r.status === 'approved' ? '<span class="badge st-delivered">Approved</span>'
           : r.status === 'pending' ? '<span class="badge st-pending">Pending</span>'
           : '<span class="badge st-cancelled">Hidden</span>') +
          (r.featured ? ' <span class="badge red" style="margin-top:4px">★ Featured</span>' : '') + '</td>' +
        '<td data-label="" class="actions-cell"><div class="actions">' +
          (r.status !== 'approved' ? '<button class="icon-btn ok" data-ok="' + r.id + '" title="Approve — visible on website">' + AI.check + '</button>' : '') +
          (r.status !== 'rejected' ? '<button class="icon-btn" data-no="' + r.id + '" title="Hide from website">' + AI.eyeOff + '</button>' : '') +
          '<button class="icon-btn' + (r.featured ? ' on' : '') + '" data-feat="' + r.id + '" title="' + (r.featured ? 'Unfeature' : 'Mark as featured') + '">' + AI.star + '</button>' +
          '<button class="icon-btn" data-del="' + r.id + '" title="Delete">' + AI.trash + '</button>' +
        '</div></td>' +
      '</tr>';
    }).join('') +
    '</tbody></table>';

  el.querySelectorAll('[data-ok]').forEach(b => b.addEventListener('click', () => {
    Store.update('reviews', b.dataset.ok, { status: 'approved' });
    toast('Review approved — now visible on the website');
    render();
  }));
  el.querySelectorAll('[data-no]').forEach(b => b.addEventListener('click', () => {
    Store.update('reviews', b.dataset.no, { status: 'rejected' });
    toast('Review hidden from the website', 'error');
    render();
  }));
  el.querySelectorAll('[data-feat]').forEach(b => b.addEventListener('click', () => {
    const r = Store.get('reviews', b.dataset.feat);
    Store.update('reviews', r.id, { featured: !r.featured });
    toast(r.featured ? 'Removed from featured' : 'Marked as featured — shows first on website');
    render();
  }));
  el.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
    confirmDialog('Delete this review?', 'This cannot be undone.', () => {
      Store.remove('reviews', b.dataset.del);
      toast('Review deleted', 'error');
      render();
    });
  }));
}

/* live refresh when the website (another tab) changes data */
window.onDBChange = render;
