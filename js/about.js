/* =====================================================
   FLAME & CRUST — About Page
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const quality = [
    { ic: ICONS.leaf, t: 'Fresh Daily', p: 'Vegetables, buns and meats delivered fresh every morning — never frozen for long.' },
    { ic: ICONS.fire, t: 'Real Fire Cooking', p: 'Flame-grilled patties and stone-baked pizza for that unmistakable smoky char.' },
    { ic: ICONS.star, t: 'Signature Recipes', p: 'House-made sauces and spice blends you will not find anywhere else.' },
    { ic: ICONS.thumbsUp, t: 'Checked Twice', p: 'Every order is quality-checked before it leaves the kitchen.' }
  ];
  document.getElementById('about-quality').innerHTML = quality.map(q =>
    '<div class="card feature-card reveal">' +
      '<div class="feature-ic">' + q.ic + '</div>' +
      '<h3>' + q.t + '</h3><p>' + q.p + '</p>' +
    '</div>').join('');

  const team = [
    { img: 'images/chef-1.jpg', n: 'Chef Omar Farooq', r: 'Head Chef • Founder', d: '18 years behind the fire. Creator of our signature smash burger.' },
    { img: 'images/chef-2.jpg', n: 'Chef Zara Ahmed', r: 'Pizza & Pasta Chef', d: 'Trained in Naples. Obsessed with the perfect crust and stretch.' },
    { img: 'images/chef-1.jpg', n: 'Bilal Mahmood', r: 'Grill Master', d: 'The wing and peri-peri specialist. Keeps the grill honest.' }
  ];
  document.getElementById('about-team').innerHTML = team.map(t =>
    '<div class="card card-hover chef-card reveal">' +
      '<div class="chef-img"><img src="' + t.img + '" alt="' + t.n + '" loading="lazy"></div>' +
      '<div class="chef-body"><h3>' + t.n + '</h3><div class="role">' + t.r + '</div>' +
      '<p class="muted" style="font-size:13px;margin-top:8px">' + t.d + '</p></div>' +
    '</div>').join('');

  const why = [
    { ic: ICONS.leaf, t: 'Quality First', p: 'We never compromise on ingredients — even when costs rise.' },
    { ic: ICONS.truck, t: 'On-Time Delivery', p: 'Hot food, fast. Average delivery under 35 minutes.' },
    { ic: ICONS.cart, t: 'Fair Prices', p: 'Premium taste without the premium price tag.' },
    { ic: ICONS.star, t: 'Loved by 10k+', p: 'A 4.8 average rating across thousands of reviews.' }
  ];
  document.getElementById('about-why').innerHTML = why.map(q =>
    '<div class="card feature-card reveal">' +
      '<div class="feature-ic">' + q.ic + '</div>' +
      '<h3>' + q.t + '</h3><p>' + q.p + '</p>' +
    '</div>').join('');

  observeReveals();
});
