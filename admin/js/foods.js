/* =====================================================
   ADMIN — Food Management (full CRUD + images + stock)
   ===================================================== */

let foodState = { q: '', cat: 'all', status: 'all' };

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;
  renderAdminLayout('foods');

  const urlQ = new URLSearchParams(location.search).get('q');
  if (urlQ) { foodState.q = urlQ.toLowerCase(); document.getElementById('food-search').value = foodState.q; }

  const fillCats = () => {
    document.getElementById('food-cat-filter').innerHTML =
      '<option value="all">All Categories</option>' +
      Store.all('categories').map(c => '<option value="' + c.id + '"' + (foodState.cat === c.id ? ' selected' : '') + '>' + esc(c.name) + '</option>').join('');
  };
  fillCats();

  document.getElementById('food-cat-filter').addEventListener('change', e => { foodState.cat = e.target.value; render(); });
  document.getElementById('food-status-filter').addEventListener('change', e => { foodState.status = e.target.value; render(); });
  document.getElementById('food-search').addEventListener('input', e => { foodState.q = e.target.value.trim().toLowerCase(); render(); });
  document.getElementById('add-food').addEventListener('click', () => openFoodModal());

  render();
  startOrderWatch();
});

function filteredFoods() {
  let foods = Store.all('foods');
  if (foodState.cat !== 'all') foods = foods.filter(f => f.categoryId === foodState.cat);
  if (foodState.status === 'available') foods = foods.filter(f => f.available);
  if (foodState.status === 'unavailable') foods = foods.filter(f => !f.available);
  if (foodState.status === 'lowstock') foods = foods.filter(f => typeof f.stock === 'number' && f.stock > 0 && f.stock <= 5);
  if (foodState.q) foods = foods.filter(f => f.name.toLowerCase().includes(foodState.q) || (f.tags || []).some(t => t.toLowerCase().includes(foodState.q)));
  return foods;
}

function render() {
  const foods = filteredFoods();
  const el = document.getElementById('foods-table');
  document.getElementById('food-count').textContent = foods.length + ' items';

  if (!foods.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">' + AI.foods + '</div>' +
      '<h3>No food items</h3><p>Add your first menu item to get started.</p>' +
      '<button class="btn btn-primary" id="empty-add">Add Food</button></div>';
    const ea = document.getElementById('empty-add');
    if (ea) ea.addEventListener('click', () => openFoodModal());
    return;
  }

  el.innerHTML = '<table class="tbl"><thead><tr>' +
    '<th>Item</th><th>Category</th><th>Price</th><th>Stock</th><th>Flags</th><th>Status</th><th>Actions</th>' +
    '</tr></thead><tbody>' +
    foods.map(f => {
      const cat = categoryById(f.categoryId);
      const price = f.oldPrice ? '<span style="text-decoration:line-through;color:var(--text-3);font-size:11px;margin-right:6px">' + fmtPrice(f.oldPrice) + '</span>' : '';
      return '<tr>' +
        '<td data-label="Item"><div class="td-food"><img src="../' + f.image + '" alt="">' +
          '<div><div class="td-bold">' + esc(f.name) + '</div><div class="tf-sub">' + esc((f.desc || '').slice(0, 44)) + '…</div></div></div></td>' +
        '<td data-label="Category"><span class="badge gray">' + (cat ? esc(cat.name) : '—') + '</span></td>' +
        '<td data-label="Price" class="td-red">' + price + fmtPrice(f.price) + '</td>' +
        '<td data-label="Stock">' + stockBadge(f) + '</td>' +
        '<td data-label="Flags"><div style="display:flex;gap:4px;flex-wrap:wrap">' +
          (f.popular ? '<span class="badge red">Popular</span>' : '') +
          (f.featured ? '<span class="badge st-ready">Featured</span>' : '') +
        '</div></td>' +
        '<td data-label="Status">' + (f.available ? '<span class="badge st-delivered">Enabled</span>' : '<span class="badge st-cancelled">Disabled</span>') + '</td>' +
        '<td data-label="" class="actions-cell"><div class="actions">' +
          '<button class="icon-btn" data-edit="' + f.id + '" title="Edit">' + AI.edit + '</button>' +
          '<button class="icon-btn" data-dup="' + f.id + '" title="Duplicate">' + AI.copy + '</button>' +
          '<button class="icon-btn" data-toggle="' + f.id + '" title="' + (f.available ? 'Disable' : 'Enable') + ' ordering">' + (f.available ? AI.eye : AI.eyeOff) + '</button>' +
          '<button class="icon-btn" data-del="' + f.id + '" title="Delete">' + AI.trash + '</button>' +
        '</div></td>' +
      '</tr>';
    }).join('') +
    '</tbody></table>';

  bindFoodActions(el);
}

function bindFoodActions(scope) {
  scope.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () =>
    openFoodModal(Store.get('foods', b.dataset.edit))));
  scope.querySelectorAll('[data-dup]').forEach(b => b.addEventListener('click', () => {
    const f = Store.get('foods', b.dataset.dup);
    const copy = JSON.parse(JSON.stringify(f));
    delete copy.id;
    copy.name = f.name + ' (Copy)';
    copy.popular = false; copy.featured = false;
    const c = Store.insert('foods', copy);
    toast('Duplicated as "' + c.name + '"');
    render();
  }));
  scope.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', () => {
    const f = Store.get('foods', b.dataset.toggle);
    Store.update('foods', f.id, { available: !f.available });
    toast(f.name + (f.available ? ' disabled — hidden from ordering' : ' enabled'), f.available ? 'error' : 'success');
    render();
  }));
  scope.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
    const f = Store.get('foods', b.dataset.del);
    confirmDialog('Delete "' + esc(f.name) + '"?', 'This permanently removes the item from the website menu.', () => {
      Store.remove('foods', f.id);
      toast('Food deleted', 'error');
      render();
    });
  }));
}

/* images available in /images to pick from */
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

let _draftImages = []; /* uploaded extra images for current modal */

function openFoodModal(food) {
  const isEdit = !!food;
  const cats = Store.all('categories');
  const imgOptions = listImages();
  _draftImages = isEdit ? (food.images || []).slice() : [];

  openModal(
    modalHead(isEdit ? 'Edit Food — ' + esc(food.name) : 'Add New Food') +
    '<div class="modal-body">' +
      '<div class="field"><label>Food Name <span class="req">*</span></label>' +
        '<input class="input" id="ff-name" value="' + (isEdit ? esc(food.name) : '') + '" placeholder="e.g. Zinger Burger"></div>' +
      '<div class="form-row">' +
        '<div class="field"><label>Category</label><select class="input" id="ff-cat">' +
          cats.map(c => '<option value="' + c.id + '"' + (isEdit && food.categoryId === c.id ? ' selected' : '') + '>' + esc(c.name) + '</option>').join('') +
        '</select></div>' +
        '<div class="field"><label>Preparation Time (min)</label>' +
          '<input class="input" type="number" id="ff-prep" min="1" value="' + (isEdit ? (food.prepTime || 20) : 20) + '"></div>' +
      '</div>' +
      '<div class="form-row-3">' +
        '<div class="field"><label>Price (Rs.) <span class="req">*</span></label>' +
          '<input class="input" type="number" id="ff-price" min="1" value="' + (isEdit ? food.price : '') + '" placeholder="650"></div>' +
        '<div class="field"><label>Discount Price (Rs.)</label>' +
          '<input class="input" type="number" id="ff-oldprice" min="0" value="' + (isEdit ? (food.oldPrice || '') : '') + '" placeholder="shown struck-through"></div>' +
        '<div class="field"><label>Stock Qty</label>' +
          '<input class="input" type="number" id="ff-stock" min="0" value="' + (isEdit && food.stock !== null && food.stock !== undefined ? food.stock : '') + '" placeholder="empty = unlimited"></div>' +
      '</div>' +
      '<div class="field"><label>Description <span class="req">*</span></label>' +
        '<textarea class="input" id="ff-desc" rows="2" placeholder="Short tasty description...">' + (isEdit ? esc(food.desc) : '') + '</textarea></div>' +
      '<div class="field"><label>Tags (comma separated)</label>' +
        '<input class="input" id="ff-tags" value="' + (isEdit ? esc((food.tags || []).join(', ')) : '') + '" placeholder="spicy, bestseller, new"></div>' +
      '<div class="form-row">' +
        '<div class="field"><label>Main Image</label><select class="input" id="ff-image">' +
          imgOptions.map(i => '<option value="' + i + '"' + (isEdit && food.image === i ? ' selected' : '') + '>' + i.replace('images/', '') + '</option>').join('') +
        '</select></div>' +
        '<div class="field"><label>Rating (0-5)</label><input class="input" type="number" id="ff-rating" min="0" max="5" step="0.1" value="' + (isEdit ? food.rating : 4.5) + '"></div>' +
      '</div>' +
      '<div class="field"><label>More Images (gallery) — upload or leave empty</label>' +
        '<div class="upload-drop" id="ff-upload">Drop or <b>click to upload</b> an image (JPG/PNG, under 900 KB)</div>' +
        '<input type="file" id="ff-file" accept="image/*" hidden>' +
        '<div class="img-pick" id="ff-gallery" style="margin-top:9px"></div></div>' +
      '<div class="field"><label>Sizes — comma separated, "+100" for price delta</label>' +
        '<input class="input" id="ff-sizes" value="' + (isEdit ? esc(food.sizes.map(s => s.name + (s.delta ? ' +' + s.delta : '')).join(', ')) : 'Regular, Large +150') + '" placeholder="Regular, Large +150"></div>' +
      '<div class="field"><label>Extras — comma separated, "+100" for price</label>' +
        '<input class="input" id="ff-extras" value="' + (isEdit ? esc(food.extras.map(e => e.name + ' +' + e.price).join(', ')) : 'Extra Cheese +100') + '" placeholder="Extra Cheese +100, Egg +80"></div>' +
      '<div style="display:flex;gap:22px;flex-wrap:wrap;margin-top:2px">' +
        '<label style="display:flex;align-items:center;gap:9px"><label class="switch"><input type="checkbox" id="ff-avail"' + (!isEdit || food.available ? ' checked' : '') + '><span class="slider"></span></label><span style="font-size:13px;font-weight:600">Available for ordering</span></label>' +
        '<label style="display:flex;align-items:center;gap:9px"><label class="switch"><input type="checkbox" id="ff-pop"' + (isEdit && food.popular ? ' checked' : '') + '><span class="slider"></span></label><span style="font-size:13px;font-weight:600">Popular</span></label>' +
        '<label style="display:flex;align-items:center;gap:9px"><label class="switch"><input type="checkbox" id="ff-feat"' + (isEdit && food.featured ? ' checked' : '') + '><span class="slider"></span></label><span style="font-size:13px;font-weight:600">Featured</span></label>' +
      '</div>' +
    '</div>' +
    '<div class="modal-foot">' +
      '<button class="btn btn-ghost" data-close>Cancel</button>' +
      '<button class="btn btn-primary" id="ff-save">' + (isEdit ? 'Save Changes' : 'Add Food') + '</button>' +
    '</div>', 'lg');

  drawGallery();
  const drop = document.getElementById('ff-upload'), file = document.getElementById('ff-file');
  drop.addEventListener('click', () => file.click());
  file.addEventListener('change', () => readImage(file, url => {
    _draftImages.push(url);
    drawGallery();
    toast('Image added to gallery');
  }));

  document.getElementById('ff-save').addEventListener('click', () => {
    const name = document.getElementById('ff-name').value.trim();
    const price = parseFloat(document.getElementById('ff-price').value);
    const desc = document.getElementById('ff-desc').value.trim();
    let ok = true;
    [['ff-name', name.length >= 3], ['ff-price', !isNaN(price) && price > 0], ['ff-desc', desc.length >= 10]]
      .forEach(([id, valid]) => { document.getElementById(id).classList.toggle('error', !valid); if (!valid) ok = false; });
    if (!ok) { toast('Please fill the required fields', 'error'); return; }

    const parseList = (str, isExtra) => str.split(',').map(s => s.trim()).filter(Boolean).map(s => {
      const m = s.match(/\+\s*(\d+)/);
      return isExtra
        ? { name: s.replace(/\+\s*\d+/, '').trim(), price: m ? parseInt(m[1]) : 0 }
        : { name: s.replace(/\+\s*\d+/, '').trim() || 'Regular', delta: m ? parseInt(m[1]) : 0 };
    });

    const stockRaw = document.getElementById('ff-stock').value.trim();
    const data = {
      name, price, desc,
      categoryId: document.getElementById('ff-cat').value,
      prepTime: parseInt(document.getElementById('ff-prep').value) || 20,
      oldPrice: parseFloat(document.getElementById('ff-oldprice').value) || 0,
      stock: stockRaw === '' ? null : Math.max(0, parseInt(stockRaw) || 0),
      tags: document.getElementById('ff-tags').value.split(',').map(s => s.trim()).filter(Boolean),
      image: document.getElementById('ff-image').value,
      images: _draftImages.slice(),
      rating: Math.min(5, Math.max(0, parseFloat(document.getElementById('ff-rating').value) || 4.5)),
      sizes: parseList(document.getElementById('ff-sizes').value, false),
      extras: parseList(document.getElementById('ff-extras').value, true),
      available: document.getElementById('ff-avail').checked,
      popular: document.getElementById('ff-pop').checked,
      featured: document.getElementById('ff-feat').checked
    };

    if (isEdit) {
      Store.update('foods', food.id, data);
      toast('Food updated — live on the website');
    } else {
      data.reviews = 0;
      Store.insert('foods', data);
      toast('Food added — live on the website');
    }
    closeModal();
    render();
  });

  function drawGallery() {
    const g = document.getElementById('ff-gallery');
    if (!g) return;
    g.innerHTML = _draftImages.map((src, i) =>
      '<div style="position:relative"><img src="' + src + '" style="width:56px;height:48px;object-fit:cover;border-radius:8px;border:2px solid var(--border)">' +
      '<button class="icon-btn" data-rmimg="' + i + '" style="position:absolute;top:-7px;right:-7px;width:20px;height:20px;background:var(--red);border-color:var(--red);color:#fff">' + AI.x + '</button></div>').join('') ||
      '<span class="td-muted" style="font-size:12px">No extra images yet.</span>';
    g.querySelectorAll('[data-rmimg]').forEach(b => b.addEventListener('click', () => {
      _draftImages.splice(parseInt(b.dataset.rmimg), 1);
      drawGallery();
    }));
  }
}

/* live refresh when the website (another tab) changes data */
window.onDBChange = render;
