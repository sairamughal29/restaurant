============================================================
 FLAME & CRUST — RESTAURANT ORDERING & MANAGEMENT SYSTEM
============================================================
Pure HTML / CSS / JavaScript. No frameworks. No build step.
No database required — data persists in the browser via
localStorage, structured so it can later be swapped with
Firebase or Supabase.

------------------------------------------------------------
HOW TO RUN
------------------------------------------------------------
OPTION A — Easiest (works offline):
  1. Extract this folder anywhere.
  2. Double-click  index.html
  3. Use the site. That's it.

OPTION B — Local server (recommended, closest to production):
  1. Open a terminal inside this folder.
  2. Run ONE of the following:
       Python:      python -m http.server 3000
       Node.js:     npx serve -l 3000
  3. Open  http://localhost:3000  in your browser.

------------------------------------------------------------
ADMIN PANEL
------------------------------------------------------------
  URL:      admin/login.html   (or http://localhost:3000/admin/login.html)
  Email:    admin@flamecrust.com
  Password: admin123

  (You can change the email/password inside the admin panel:
   Admin Profile -> Security.)

------------------------------------------------------------
WHAT'S INSIDE
------------------------------------------------------------
CUSTOMER WEBSITE
  Landing page (hero, categories, popular items, offer,
  features, reviews), menu with live search & filters,
  food details with sizes/extras, cart, coupons, checkout,
  order confirmation, order tracking, write-a-review
  system, login, register, profile, order history, about,
  contact.

ADMIN PANEL (15 sections)
  Dashboard (live KPIs + charts), Orders (status workflow,
  invoices, CSV), Food Menu CRUD, Categories CRUD,
  Inventory (stock control — out-of-stock items are blocked
  on the website automatically), Customers, Reviews
  moderation, Offers & Coupons, Homepage CMS, Reports &
  Analytics (charts + CSV/print), Restaurant Settings,
  Delivery Settings, Payment Settings, Admin Profile &
  Security.

STARTER MENU (editable in the admin panel)
  8 categories — Burgers, Pizza, Chicken, Wings,
  Wraps & Rolls, Fries, Drinks, Desserts — with 25 menu
  items, each with sizes, extras and photos. The landing
  page fills with this data from day one; edit, hide or
  delete any of it in Admin -> Food Menu / Categories and
  the website updates instantly.

------------------------------------------------------------
WEBSITE <-> ADMIN INTEGRATION (LIVE SYNC)
------------------------------------------------------------
  * Admin adds/edits/hides a food item, category, price,
    stock, or homepage content  ->  the customer website
    updates instantly (no reload needed).
  * Customer places an order / submits a review / checks out
    ->  it appears in the admin panel instantly.
  * Customer reviews always start as "pending" and only go
    live on the website after the admin approves them.
  * Everything is stored in the browser (localStorage),
    shared between the website and the admin panel.

------------------------------------------------------------
NOTES
------------------------------------------------------------
  * Orders, reviews and customers start EMPTY and build up
    from real website activity — no fake numbers anywhere.
    To reset everything, clear the site data in your
    browser (DevTools -> Application -> Local Storage) or
    simply open the site in a private window.
  * Works on desktop, tablet and mobile (320px and up).
  * All charts are hand-drawn on canvas — zero libraries.

============================================================
