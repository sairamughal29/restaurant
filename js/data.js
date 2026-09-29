/* =====================================================
   FLAME & CRUST — Data Layer
   Minimal starter data + localStorage-backed store.
   The admin panel manages everything you see here —
   every change made in the admin panel appears on the
   website instantly (cross-tab live sync).
   Swap `Store` internals with Firebase/Supabase later
   without changing any UI code.
   ===================================================== */

const DB_KEY = 'fc_db_v3';

/* ---------- STARTER DATA ----------
   8 categories & 25 menu items to fill the website from
   day one. NO dummy reviews, orders or customers — those
   build up from real website activity and are managed in
   the admin panel. Everything here is editable in
   Admin → Food Menu / Categories. */
const SEED = {
  settings: {
    name: 'Flame & Crust',
    tagline: 'Fresh Food. Bold Taste.',
    description: 'Premium fast food crafted with fresh ingredients, bold flavours and a passion for great taste. Order online and enjoy hot meals delivered to your door.',
    phone: '+92 300 1234567',
    whatsapp: '+92 300 1234567',
    email: 'hello@flamecrust.com',
    address: '24 Food Street, Gulberg III, Lahore',
    mapsUrl: 'https://maps.google.com/?q=Gulberg+III+Lahore',
    openTime: '11:00 AM',
    closeTime: '01:00 AM',
    deliveryFee: 99,
    freeThreshold: 2000,
    minOrder: 300,
    estTime: '30-40 min',
    areas: 'Gulberg, DHA Phase 1-6, Model Town, Johar Town, Bahria Town',
    currency: 'Rs.',
    social: { facebook: 'https://facebook.com/flamecrust', instagram: 'https://instagram.com/flamecrust', twitter: '' },
    payment: { cod: true, online: false, autoPaid: true, note: 'Pay cash when your order arrives.' },
    schedule: [
      { day: 'Monday',    open: '11:00 AM', close: '01:00 AM', closed: false },
      { day: 'Tuesday',   open: '11:00 AM', close: '01:00 AM', closed: false },
      { day: 'Wednesday', open: '11:00 AM', close: '01:00 AM', closed: false },
      { day: 'Thursday',  open: '11:00 AM', close: '01:00 AM', closed: false },
      { day: 'Friday',    open: '11:00 AM', close: '02:00 AM', closed: false },
      { day: 'Saturday',  open: '11:00 AM', close: '02:00 AM', closed: false },
      { day: 'Sunday',    open: '12:00 PM', close: '01:00 AM', closed: false }
    ],
    homepage: {
      hero: {
        eyebrow: 'Welcome To Our Restaurant',
        titlePlain: 'Taste the', titleRed: 'Difference',
        desc: 'Fresh ingredients, bold flavors, and delicious meals delivered straight to your door. Grilled, baked and crafted with passion every single day.',
        image: 'images/hero.jpg',
        cta1Text: 'Order Now', cta1Link: 'menu.html',
        cta2Text: 'View Menu', cta2Link: 'menu.html',
        stats: [
          { v: '30 min', l: 'Avg. Delivery' },
          { v: '100%',   l: 'Fresh Ingredients' },
          { v: 'COD',    l: 'Cash on Delivery' },
          { v: 'Free',   l: 'Delivery Rs. 2000+' }
        ]
      },
      strip: 'Hot & Fresh • Free Delivery Over Rs. 2000 • Use Code FOOD20 — 20% OFF • Open Daily 11:00 AM – 1:00 AM',
      offer: {
        active: true,
        tag: 'Special Offer',
        titlePlain: 'Get', titleRed: '20% OFF', titleRest: 'On Selected Meals',
        desc: 'Celebrate with mouth-watering deals on your favourite dishes. Dine in, take away or get it delivered — the discount applies either way.',
        btnText: 'Order Now', btnLink: 'menu.html',
        code: 'FOOD20', codeNote: 'Use coupon at checkout', minNote: 'min. order Rs. 1,000'
      },
      features: [
        { icon: 'leaf',  title: 'Fresh Ingredients', text: 'Quality ingredients prepared fresh every morning in our kitchen.' },
        { icon: 'truck', title: 'Fast Delivery',     text: 'Quick and reliable delivery — hot food at your door in 30 minutes.' },
        { icon: 'cart',  title: 'Easy Ordering',     text: 'Simple online ordering process with secure cash on delivery.' },
        { icon: 'fire',  title: 'Great Taste',       text: 'Food prepared with care by chefs who love what they do.' }
      ],
      featuredIds: [],
      footerAbout: 'Premium fast food crafted with fresh ingredients, bold flavours and a passion for great taste. Order online and enjoy hot meals delivered to your door.'
    },
    admin: {
      name: 'Admin User',
      email: 'admin@flamecrust.com',
      passHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9' /* sha256('admin123') */
    }
  },

  categories: [
    { id: 'c1', name: 'Burgers',        image: 'images/burger-2.jpg',  active: true, order: 0 },
    { id: 'c2', name: 'Pizza',          image: 'images/pizza-1.jpg',   active: true, order: 1 },
    { id: 'c3', name: 'Chicken',        image: 'images/chicken-1.jpg', active: true, order: 2 },
    { id: 'c7', name: 'Wings',          image: 'images/wings-1.jpg',   active: true, order: 3 },
    { id: 'c8', name: 'Wraps & Rolls',  image: 'images/wrap-1.jpg',    active: true, order: 4 },
    { id: 'c4', name: 'Fries',          image: 'images/fries-1.jpg',   active: true, order: 5 },
    { id: 'c5', name: 'Drinks',         image: 'images/drinks-1.jpg',  active: true, order: 6 },
    { id: 'c6', name: 'Desserts',       image: 'images/dessert-1.jpg', active: true, order: 7 }
  ],

  /* ratings are NOT stored on items — they are computed
     live from approved customer reviews (see foodRating) */
  foods: [
    /* ---- BURGERS ---- */
    { id: 'f1', name: 'Classic Chicken Burger', categoryId: 'c1', price: 650,
      desc: 'Juicy grilled chicken patty, fresh lettuce, tomato and our signature mayo in a toasted brioche bun.',
      image: 'images/burger-1.jpg', available: true, popular: true,
      sizes: [{ name: 'Regular', delta: 0 }, { name: 'Large', delta: 150 }],
      extras: [{ name: 'Extra Cheese', price: 100 }, { name: 'Fried Egg', price: 80 }, { name: 'Jalapenos', price: 60 }] },
    { id: 'f2', name: 'Zinger Burger', categoryId: 'c1', price: 750, oldPrice: 900, featured: true,
      desc: 'Crispy fried chicken fillet with a fiery kick, topped with cool ranch sauce and crunchy slaw.',
      image: 'images/burger-3.jpg', available: true, popular: true,
      sizes: [{ name: 'Regular', delta: 0 }, { name: 'Large', delta: 150 }],
      extras: [{ name: 'Extra Cheese', price: 100 }, { name: 'Hot Sauce', price: 50 }, { name: 'Onion Rings', price: 120 }] },

    /* ---- PIZZA ---- */
    { id: 'f5', name: 'Margherita Pizza', categoryId: 'c2', price: 950,
      desc: 'Hand-stretched dough, rich tomato sauce, fresh mozzarella and fragrant basil leaves.',
      image: 'images/pizza-2.jpg', available: true, popular: false,
      sizes: [{ name: 'Medium 10"', delta: 0 }, { name: 'Large 13"', delta: 300 }, { name: 'XLarge 16"', delta: 550 }],
      extras: [{ name: 'Extra Cheese', price: 150 }, { name: 'Olives', price: 80 }, { name: 'Mushrooms', price: 100 }] },
    { id: 'f6', name: 'Pepperoni Feast', categoryId: 'c2', price: 1250, oldPrice: 1500, featured: true,
      desc: 'Loaded with double pepperoni, mozzarella blend and a hint of chili honey drizzle.',
      image: 'images/pizza-1.jpg', available: true, popular: true,
      sizes: [{ name: 'Medium 10"', delta: 0 }, { name: 'Large 13"', delta: 300 }, { name: 'XLarge 16"', delta: 550 }],
      extras: [{ name: 'Extra Pepperoni', price: 200 }, { name: 'Extra Cheese', price: 150 }, { name: 'Stuffed Crust', price: 250 }] },

    /* ---- CHICKEN ---- */
    { id: 'f9', name: 'Fried Chicken Bucket', categoryId: 'c3', price: 1400,
      desc: '8 pcs of our secret-recipe crispy fried chicken. Crunchy outside, juicy inside.',
      image: 'images/chicken-1.jpg', available: true, popular: true,
      sizes: [{ name: '8 Pcs', delta: 0 }, { name: '12 Pcs', delta: 700 }],
      extras: [{ name: 'Dips (2)', price: 100 }, { name: 'Extra Spicy Rub', price: 60 }] },
    { id: 'f10', name: 'Crispy Chicken Tenders', categoryId: 'c3', price: 600,
      desc: 'Golden hand-breaded chicken tenders, seasoned and fried crispy. Served with dips.',
      image: 'images/chicken-2.jpg', available: true, popular: false,
      sizes: [{ name: '5 Pcs', delta: 0 }, { name: '8 Pcs', delta: 350 }],
      extras: [{ name: 'Extra Buffalo Sauce', price: 60 }, { name: 'Blue Cheese Dip', price: 90 }] },

    /* ---- FRIES ---- */
    { id: 'f12', name: 'Classic Salted Fries', categoryId: 'c4', price: 250,
      desc: 'Golden crispy fries tossed in sea salt. Simple, perfect, addictive.',
      image: 'images/fries-1.jpg', available: true, popular: false,
      sizes: [{ name: 'Regular', delta: 0 }, { name: 'Large', delta: 100 }],
      extras: [{ name: 'Cheese Sauce', price: 80 }, { name: 'Ketchup Pack', price: 20 }] },
    { id: 'f13', name: 'Loaded Cheese Fries', categoryId: 'c4', price: 450,
      desc: 'Crispy fries drowned in molten cheddar sauce, topped with herbs and crispy onions.',
      image: 'images/fries-2.jpg', available: true, popular: false,
      sizes: [{ name: 'Regular', delta: 0 }, { name: 'Large', delta: 120 }],
      extras: [{ name: 'Extra Cheese', price: 80 }, { name: 'Jalapenos', price: 50 }] },

    /* ---- DRINKS ---- */
    { id: 'f16', name: 'Fresh Lime Mojito', categoryId: 'c5', price: 280,
      desc: 'Zesty lime, fresh mint and sparkling soda — a refreshing citrus cooler.',
      image: 'images/drinks-2.jpg', available: true, popular: false,
      sizes: [{ name: 'Regular', delta: 0 }, { name: 'Large', delta: 80 }],
      extras: [{ name: 'Extra Mint', price: 20 }, { name: 'Soda Top-up', price: 40 }] },
    { id: 'f17', name: 'Chocolate Thick Shake', categoryId: 'c5', price: 350,
      desc: 'Ultra-thick Belgian chocolate shake crowned with whipped cream and shavings.',
      image: 'images/drinks-4.jpg', available: true, popular: true,
      sizes: [{ name: 'Regular', delta: 0 }, { name: 'Large', delta: 100 }],
      extras: [{ name: 'Chocolate Chips', price: 50 }, { name: 'Extra Cream', price: 60 }] },

    /* ---- DESSERTS ---- */
    { id: 'f18', name: 'Chocolate Lava Cake', categoryId: 'c6', price: 550,
      desc: 'Warm molten-center chocolate cake with a scoop of vanilla ice cream.',
      image: 'images/dessert-1.jpg', available: true, popular: false,
      sizes: [{ name: 'Single', delta: 0 }],
      extras: [{ name: 'Extra Ice Cream Scoop', price: 120 }, { name: 'Chocolate Sauce', price: 60 }] },
    { id: 'f19', name: 'New York Cheesecake', categoryId: 'c6', price: 650,
      desc: 'Silky baked cheesecake on a buttery biscuit base with berry compote.',
      image: 'images/dessert-2.jpg', available: true, popular: false,
      sizes: [{ name: 'Single', delta: 0 }],
      extras: [{ name: 'Berry Topping', price: 90 }] },

    /* ---- BURGERS (extended) ---- */
    { id: 'f20', name: 'Double Beef Smash Burger', categoryId: 'c1', price: 950, featured: true,
      desc: 'Two flame-grilled beef patties with double cheddar, crisp lettuce and smoky house sauce in a sesame bun.',
      image: 'images/burger-4.jpg', available: true, popular: true,
      sizes: [{ name: 'Regular', delta: 0 }, { name: 'Large', delta: 150 }],
      extras: [{ name: 'Extra Patty', price: 250 }, { name: 'Extra Cheese', price: 100 }, { name: 'Caramelized Onions', price: 80 }] },
    { id: 'f21', name: 'Classic Beef Burger', categoryId: 'c1', price: 700,
      desc: 'A juicy char-grilled beef patty, melted cheese, tomato and pickles with our classic burger sauce.',
      image: 'images/burger-5.jpg', available: true, popular: false,
      sizes: [{ name: 'Regular', delta: 0 }, { name: 'Large', delta: 150 }],
      extras: [{ name: 'Extra Patty', price: 250 }, { name: 'Bacon Strips', price: 150 }, { name: 'Extra Cheese', price: 100 }] },
    { id: 'f22', name: 'Avocado Chicken Burger', categoryId: 'c1', price: 850,
      desc: 'Grilled chicken patty topped with fresh avocado, melted mozzarella and roasted peppers in a toasted bun.',
      image: 'images/burger-6.jpg', available: true, popular: false,
      sizes: [{ name: 'Regular', delta: 0 }, { name: 'Large', delta: 150 }],
      extras: [{ name: 'Extra Avocado', price: 120 }, { name: 'Fried Egg', price: 80 }, { name: 'Garlic Mayo', price: 50 }] },

    /* ---- PIZZA (extended) ---- */
    { id: 'f23', name: "Cheese Lover's Pizza", categoryId: 'c2', price: 1050,
      desc: 'A mountain of mozzarella, cheddar and parmesan over our slow-simmered tomato sauce.',
      image: 'images/pizza-4.jpg', available: true, popular: false,
      sizes: [{ name: 'Medium 10"', delta: 0 }, { name: 'Large 13"', delta: 300 }, { name: 'XLarge 16"', delta: 550 }],
      extras: [{ name: 'Extra Cheese', price: 150 }, { name: 'Stuffed Crust', price: 250 }, { name: 'Olives', price: 80 }] },

    /* ---- CHICKEN (extended) ---- */
    { id: 'f24', name: 'Grilled Herb Chicken', categoryId: 'c3', price: 850,
      desc: 'Tender chicken breast marinated in garden herbs and olive oil, flame-grilled and finished with lemon.',
      image: 'images/chicken-3.jpg', available: true, popular: false,
      sizes: [{ name: '2 Pcs', delta: 0 }, { name: '4 Pcs', delta: 500 }],
      extras: [{ name: 'Mashed Potatoes', price: 200 }, { name: 'Garden Salad', price: 180 }, { name: 'Garlic Sauce', price: 60 }] },

    /* ---- WINGS ---- */
    { id: 'f25', name: 'Buffalo Wings', categoryId: 'c7', price: 750, oldPrice: 900, featured: true,
      desc: 'Crispy wings tossed in classic fiery buffalo sauce, served with celery sticks and cool ranch dip.',
      image: 'images/wings-1.jpg', available: true, popular: true,
      sizes: [{ name: '6 Pcs', delta: 0 }, { name: '12 Pcs', delta: 600 }],
      extras: [{ name: 'Extra Buffalo Sauce', price: 80 }, { name: 'Blue Cheese Dip', price: 90 }, { name: 'Ranch Dip', price: 90 }] },
    { id: 'f26', name: 'Honey BBQ Wings', categoryId: 'c7', price: 800,
      desc: 'Sticky wings glazed in smoky-sweet honey BBQ sauce, finished with toasted sesame seeds.',
      image: 'images/wings-2.jpg', available: true, popular: false,
      sizes: [{ name: '6 Pcs', delta: 0 }, { name: '12 Pcs', delta: 650 }],
      extras: [{ name: 'Extra BBQ Glaze', price: 80 }, { name: 'Sesame Sprinkle', price: 30 }] },

    /* ---- WRAPS & ROLLS ---- */
    { id: 'f27', name: 'Chicken Shawarma Wrap', categoryId: 'c8', price: 480, featured: true,
      desc: 'Flame-grilled shawarma chicken with garlic sauce, tomatoes and pickles rolled in warm flatbread.',
      image: 'images/wrap-1.jpg', available: true, popular: true,
      sizes: [{ name: 'Regular', delta: 0 }, { name: 'Large', delta: 150 }],
      extras: [{ name: 'Extra Chicken', price: 200 }, { name: 'Extra Garlic Sauce', price: 50 }, { name: 'Cheese', price: 100 }] },
    { id: 'f28', name: 'Grilled Chicken Wrap', categoryId: 'c8', price: 520,
      desc: 'Grilled chicken strips with cheddar, crisp lettuce and creamy dressing in a soft tortilla.',
      image: 'images/wrap-2.jpg', available: true, popular: false,
      sizes: [{ name: 'Regular', delta: 0 }, { name: 'Large', delta: 150 }],
      extras: [{ name: 'Extra Cheese', price: 100 }, { name: 'Jalapenos', price: 50 }, { name: 'Chipotle Sauce', price: 60 }] },

    /* ---- FRIES (extended) ---- */
    { id: 'f29', name: 'Peri Peri Fries', categoryId: 'c4', price: 350,
      desc: 'Crispy golden fries dusted in our fiery peri peri seasoning with a hint of citrus.',
      image: 'images/fries-3.jpg', available: true, popular: false,
      sizes: [{ name: 'Regular', delta: 0 }, { name: 'Large', delta: 120 }],
      extras: [{ name: 'Cheese Sauce', price: 80 }, { name: 'Peri Dust', price: 40 }] },
    { id: 'f30', name: 'Sweet Potato Fries', categoryId: 'c4', price: 400,
      desc: 'Oven-crisped sweet potato wedges with smoked paprika salt and a side of ketchup.',
      image: 'images/fries-4.jpg', available: true, popular: false,
      sizes: [{ name: 'Regular', delta: 0 }, { name: 'Large', delta: 130 }],
      extras: [{ name: 'Chipotle Mayo', price: 80 }, { name: 'Honey Dip', price: 60 }] },

    /* ---- DRINKS (extended) ---- */
    { id: 'f31', name: 'Fresh Mint Lemonade', categoryId: 'c5', price: 320,
      desc: 'Hand-squeezed lemons with crushed mint and ice — sparkling, tangy and ultra refreshing.',
      image: 'images/drinks-5.jpg', available: true, popular: false,
      sizes: [{ name: 'Regular', delta: 0 }, { name: 'Large', delta: 80 }],
      extras: [{ name: 'Extra Mint', price: 20 }, { name: 'Sparkling Top-up', price: 40 }] },

    /* ---- DESSERTS (extended) ---- */
    { id: 'f32', name: 'Molten Choco Fondant', categoryId: 'c6', price: 600,
      desc: 'Dark chocolate fondant with a gooey molten center, dusted with cocoa and served warm.',
      image: 'images/dessert-3.jpg', available: true, popular: false,
      sizes: [{ name: 'Single', delta: 0 }],
      extras: [{ name: 'Vanilla Ice Cream Scoop', price: 120 }, { name: 'Chocolate Sauce', price: 60 }] }
  ],

  /* starter coupon powering the homepage offer banner —
     add / remove real coupons in Admin → Offers & Coupons */
  coupons: [
    { code: 'FOOD20', type: 'percent', value: 20, minOrder: 1000, maxDiscount: 500, expiry: '2027-12-31', usageLimit: 100, used: 0, active: true }
  ],

  /* real activity — starts empty, grows from the website */
  reviews: [],
  customers: [],
  orders: [],
  history: []
};

/* ---------- STORE (localStorage persistence + live sync) ---------- */
const Store = {
  _db: null,
  _listeners: [],

  load(force) {
    if (this._db && !force) return this._db;
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) { this._db = JSON.parse(raw); migrateDB(this._db); return this._db; }
    } catch (e) { /* corrupted -> reseed */ }
    this._db = JSON.parse(JSON.stringify(SEED));
    this._db.nextOrderId = 1001;
    this._db.nextReviewId = 1;
    this._db.nextCustomerId = 1;
    this._db.nextFoodId = 33;
    this._db.nextCatId = 9;
    this._db.nextCouponCount = SEED.coupons.length + 1;
    migrateDB(this._db);
    this.save();
    return this._db;
  },

  save() {
    try {
      const raw = JSON.stringify(this._db);
      localStorage.setItem(DB_KEY, raw);
      _fcSync.snap = raw; /* don't flag our own write as an external change */
      /* same-tab live update (other tabs get the native `storage` event) */
      window.dispatchEvent(new CustomEvent('fc:db'));
    } catch (e) { console.warn('Storage full', e); }
  },

  /* register a callback fired whenever the database changes
     (own saves, other tabs, or the polling watchdog) */
  subscribe(fn) { window.addEventListener('fc:db', fn); },

  /* collections — items may be keyed by `id` (string or number) or by `code` (e.g. coupons) */
  _find(list, id) { return list.find(x => String(x.id) === String(id) || (x.code && x.code === id)); },
  all(name) { return this.load()[name] || []; },
  get(name, id) { const list = this.all(name); return this._find(list, id); },
  insert(name, item) {
    const db = this.load();
    item.id = item.id || (name === 'orders' ? (db.nextOrderId++) : name + '_' + Date.now());
    db[name].unshift(item);
    this.save();
    return item;
  },
  update(name, id, patch) {
    const db = this.load();
    const item = this._find(db[name], id);
    if (item) Object.assign(item, patch);
    this.save();
    return item;
  },
  remove(name, id) {
    const db = this.load();
    db[name] = db[name].filter(x => !(String(x.id) === String(id) || (x.code && x.code === id)));
    this.save();
  },

  /* settings singleton */
  getSettings() { return this.load().settings; },
  saveSettings(patch) { Object.assign(this.load().settings, patch); this.save(); },

  /* counters */
  nextId(kind) {
    const db = this.load();
    const key = 'next' + kind;
    if (db[key] == null) db[key] = 1;
    return db[key]++;
  },

  reset() { localStorage.removeItem(DB_KEY); this._db = null; }
};

/* ---------- CROSS-TAB LIVE SYNC ----------
   1. native `storage` event fires instantly in other tabs
   2. a polling watchdog covers environments where it doesn't */
const _fcSync = { snap: null };
function _fcExternalChange() {
  Store._db = null;
  Store.load();
  window.dispatchEvent(new CustomEvent('fc:db'));
}
window.addEventListener('storage', e => {
  if (e.key === DB_KEY && e.newValue !== e.oldValue && e.newValue !== null) _fcExternalChange();
});
_fcSync.snap = localStorage.getItem(DB_KEY);
setInterval(() => {
  const raw = localStorage.getItem(DB_KEY);
  if (raw !== _fcSync.snap) { _fcSync.snap = raw; _fcExternalChange(); }
}, 4000);

/* ---------- SCHEMA MIGRATION (keeps older stored data compatible) ---------- */
function _deepDefaults(target, defaults) {
  Object.keys(defaults).forEach(k => {
    if (target[k] === undefined || target[k] === null) {
      target[k] = JSON.parse(JSON.stringify(defaults[k]));
    } else if (typeof defaults[k] === 'object' && !Array.isArray(defaults[k]) && typeof target[k] === 'object' && !Array.isArray(target[k])) {
      _deepDefaults(target[k], defaults[k]);
    }
  });
}

function migrateDB(db) {
  let dirty = false;
  const mark = () => { dirty = true; };
  _deepDefaults(db.settings || (db.settings = {}), SEED.settings);
  (db.foods || []).forEach(f => {
    if (f.stock === undefined)      { f.stock = null; mark(); }
    if (f.featured === undefined)   { f.featured = false; mark(); }
    if (f.prepTime === undefined)   { f.prepTime = 20; mark(); }
    if (!Array.isArray(f.tags))     { f.tags = []; mark(); }
    if (!Array.isArray(f.images))   { f.images = []; mark(); }
    if (f.oldPrice === undefined)   { f.oldPrice = 0; mark(); }
    /* ratings now come from real reviews — drop legacy hardcoded values */
    if (f.rating !== undefined)   { delete f.rating; mark(); }
    if (f.reviews !== undefined)  { delete f.reviews; mark(); }
  });
  (db.categories || []).forEach((c, i) => {
    if (c.order === undefined)   { c.order = i; mark(); }
    if (c.active === undefined)  { c.active = true; mark(); }
  });
  (db.orders || []).forEach(o => {
    if (!o.paymentStatus) { o.paymentStatus = (o.status === 'delivered') ? 'paid' : 'unpaid'; mark(); }
    if (o.notes === undefined) { o.notes = ''; mark(); }
  });
  (db.coupons || []).forEach(c => {
    if (c.maxDiscount === undefined) { c.maxDiscount = 0; mark(); }
    if (c.startDate === undefined)   { c.startDate = ''; mark(); }
  });
  (db.reviews || []).forEach(r => {
    if (r.featured === undefined) { r.featured = false; mark(); }
  });
  if (dirty) { try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch (e) {} }
}

/* ---------- ORDER STATUS FLOW ---------- */
const ORDER_FLOW = ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered'];

const STATUS_META = {
  'pending':           { label: 'Pending',        step: 0 },
  'confirmed':         { label: 'Confirmed',      step: 1 },
  'preparing':         { label: 'Preparing',      step: 2 },
  'ready':             { label: 'Ready',          step: 3 },
  'out-for-delivery':  { label: 'Out for Delivery', step: 4 },
  'delivered':         { label: 'Delivered',      step: 5 },
  'cancelled':         { label: 'Cancelled',      step: -1 }
};

/* ---------- HELPERS ---------- */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function fmtPrice(n) {
  const s = Store.getSettings ? Store.getSettings().currency || 'Rs.' : 'Rs.';
  return s + ' ' + Number(n || 0).toLocaleString('en-US');
}

function fmtDate(d) {
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtDateTime(d) {
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ', ' +
         dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function foodById(id) { return Store.get('foods', id); }
function categoryById(id) { return Store.get('categories', id); }
function activeCategories() {
  return Store.all('categories').filter(c => c.active).sort((a, b) => (a.order || 0) - (b.order || 0));
}
function isOrderable(f) {
  return !!f && f.available !== false && (f.stock === null || f.stock === undefined || f.stock > 0);
}
function availableFoods() { return Store.all('foods').filter(isOrderable); }
function popularFoods() { return Store.all('foods').filter(f => f.popular && isOrderable(f)); }

/* real item rating — computed from approved customer reviews */
function foodRating(foodId) {
  const list = Store.all('reviews').filter(r => String(r.foodId) === String(foodId) && r.status === 'approved');
  if (!list.length) return { avg: 0, count: 0 };
  return { avg: list.reduce((s, r) => s + Number(r.rating || 0), 0) / list.length, count: list.length };
}

/* approved website reviews (featured first) */
function approvedReviews(limit) {
  const list = Store.all('reviews')
    .filter(r => r.status === 'approved')
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  return limit ? list.slice(0, limit) : list;
}

/* local (not UTC) YYYY-MM-DD key */
function localDateKey(d) {
  d = d ? new Date(d) : new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

/* continuous daily series for charts: live orders (+ optional compact history) */
function dailySeries(days) {
  const db = Store.load();
  const map = {};
  (db.history || []).forEach(h => { map[h.date] = { orders: h.orders, sales: h.sales }; });
  Store.all('orders').forEach(o => {
    const k = localDateKey(o.createdAt);
    if (!map[k]) map[k] = { orders: 0, sales: 0 };
    map[k].orders++;
    if (o.status !== 'cancelled') map[k].sales += o.total;
  });
  const out = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const k = localDateKey(dt);
    out.push({ date: k, orders: (map[k] || { orders: 0, sales: 0 }).orders, sales: (map[k] || { sales: 0, orders: 0 }).sales });
  }
  return out;
}

/* password hashing (async, graceful fallback) */
function sha256(str) {
  if (window.crypto && crypto.subtle && window.TextEncoder) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(buf =>
      Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));
  }
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return Promise.resolve('f' + (h2 >>> 0).toString(16) + (h1 >>> 0).toString(16));
}
