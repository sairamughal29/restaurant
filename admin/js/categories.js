/* =====================================================
   ADMIN — Category Management (CRUD + ordering + image)
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;
  renderAdminLayout('categories');
  document.getElementById('add-cat').addEventListener('click', () => openCatModal());
  render();
  startOrderWatch();
});

function sortedCats() {
  return Store.all('categories').slice().sort((a, b) => (a.order || 0) - (b.order || 0));
}

function render() {
  const cats = sortedCats();
  const el = document.getElementById('cats-table');
  document.getElementById('cat-count').textContent = cats.length + ' categories';

  const foods = Store.all('foods');
  el.innerHTML = '<table class="tbl"><thead><tr>' +
    '<th>Position</th><th>Image</th><th>Name</th><th>Foods</th><th>Visible on Site</th><th>Actions</th>' +
    '</tr></thead><tbody>' +
    cats.map((c, idx) => {
      const count = foods.filter(f => f.categoryId === c.id).length;
      return '<tr>' +
        '<td data-label="Position"><div style="display:flex;align-items:center;gap:7px">' +
          '<button class="icon-btn" data-up="' + c.id + '" ' + (idx === 0 ? 'disabled' : '') + ' title="Move up">' + AI.chevUp + '</button>' +
          '<span class="td-bold">' + (idx + 1) + '</span>' +
          '<button class="icon-btn" data-down="' + c.id + '" ' + (idx === cats.length - 1 ? 'disabled' : '') + ' title="Move down">' + AI.chevDown + '</button></div></td>' +
        '<td data-label="Image"><img src="../' + c.image + '" alt="" style="width:60px;height:46px;border-radius:9px;object-fit:cover;border:1px solid var(--border)"></td>' +
        '<td data-label="Name" class="td-bold" style="font-size:14px">' + esc(c.name) + '</td>' +
        '<td data-label="Foods" class="td-muted">' + count + ' items</td>' +
        '<td data-label="Visible"><label class="switch"><input type="checkbox" data-act="' + c.id + '"' + (c.active ? ' checked' : '') + '><span class="slider"></span></label></td>' +
        '<td data-label="" class="actions-cell"><div class="actions">' +
          '<button class="icon-btn" data-edit="' + c.id + '" title="Edit">' + AI.edit + '</button>' +
          '<button class="icon-btn" data-del="' + c.id + '" title="Delete">' + AI.trash + '</button>' +
        '</div></td>' +
      '</tr>';
    }).join('') +
    '</tbody></table>';

  el.querySelectorAll('[data-act]').forEach(sw => sw.addEventListener('change', () => {
    const c = Store.get('categories', sw.dataset.act);
    Store.update('categories', c.id, { active: sw.checked });
    toast('Category "' + c.name + '" ' + (sw.checked ? 'visible' : 'hidden') + ' on the website');
  }));
  el.querySelectorAll('[data-up]').forEach(b => b.addEventListener('click', () => move(b.dataset.up, -1)));
  el.querySelectorAll('[data-down]').forEach(b => b.addEventListener('click', () => move(b.dataset.down, 1)));
  el.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () =>
    openCatModal(Store.get('categories', b.dataset.edit))));
  el.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
    const c = Store.get('categories', b.dataset.del);
    const inUse = Store.all('foods').some(f => f.categoryId === c.id);
    if (inUse) { toast('Cannot delete — foods are still assigned to this category', 'error'); return; }
    confirmDialog('Delete "' + esc(c.name) + '"?', 'The category will disappear from the website menu filters.', () => {
      Store.remove('categories', c.id);
      toast('Category deleted', 'error');
      render();
    });
  }));
}

function move(id, dir) {
  const cats = sortedCats();
  const i = cats.findIndex(c => c.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= cats.length) return;
  const a = cats[i], b = cats[j];
  Store.update('categories', a.id, { order: b.order || j });
  Store.update('categories', b.id, { order: a.order || i });
  render();
}

function openCatModal(cat) {
  const isEdit = !!cat;
  const imgs = listImages();
  openModal(
    modalHead(isEdit ? 'Edit Category' : 'Add Category') +
    '<div class="modal-body">' +
      '<div class="field"><label>Category Name <span class="req">*</span></label>' +
        '<input class="input" id="cc-name" value="' + (isEdit ? esc(cat.name) : '') + '" placeholder="e.g. Seafood"></div>' +
      '<div class="field"><label>Category Image</label><select class="input" id="cc-image">' +
        imgs.map(i => '<option value="' + i + '"' + (isEdit && cat.image === i ? ' selected' : '') + '>' + i.replace('images/', '') + '</option>').join('') +
      '</select></div>' +
      '<div class="field"><label>…or upload your own</label>' +
        '<div class="upload-drop" id="cc-drop">Drop or <b>click to upload</b> an image</div>' +
        '<input type="file" id="cc-file" accept="image/*" hidden></div>' +
    '</div>' +
    '<div class="modal-foot">' +
      '<button class="btn btn-ghost" data-close>Cancel</button>' +
      '<button class="btn btn-primary" id="cc-save">' + (isEdit ? 'Save Changes' : 'Add Category') + '</button>' +
    '</div>');

  let customImg = isEdit ? cat.image : '';
  const drop = document.getElementById('cc-drop'), file = document.getElementById('cc-file');
  drop.addEventListener('click', () => file.click());
  file.addEventListener('change', () => readImage(file, url => {
    customImg = url;
    drop.innerHTML = '<div class="form-preview"><img src="' + url + '"><span>Uploaded — will be saved with this category</span></div>';
  }));

  document.getElementById('cc-save').addEventListener('click', () => {
    const name = document.getElementById('cc-name').value.trim();
    if (name.length < 3) { document.getElementById('cc-name').classList.add('error'); toast('Name too short', 'error'); return; }
    const sel = document.getElementById('cc-image').value;
    const data = { name, image: customImg && customImg !== sel ? customImg : sel };
    if (isEdit) {
      Store.update('categories', cat.id, data);
      toast('Category updated — live on the website');
    } else {
      data.active = true;
      const all = Store.all('categories');
      data.order = all.reduce((m, c) => Math.max(m, (c.order || 0) + 1), 0);
      Store.insert('categories', data);
      toast('Category added — live on the website');
    }
    closeModal();
    render();
  });
}

/* live refresh when the website (another tab) changes data */
window.onDBChange = render;
