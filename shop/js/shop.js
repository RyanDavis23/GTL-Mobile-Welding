/* I ♥ Julia — storefront
   Static single-page shop: catalog, collections, product pages, cart
   drawer, multi-step checkout and order history. State lives in
   localStorage; routing uses the URL hash so it works on GitHub Pages. */
(function () {
  "use strict";

  /* ================= Catalog ================= */

  var COLORS = {
    white:   { name: "White",          hex: "#ffffff", ink: "#141414", heart: "#d61f3c" },
    black:   { name: "Black",          hex: "#1c1c1c", ink: "#ffffff", heart: "#e8304d" },
    heather: { name: "Heather Grey",   hex: "#b8b8b4", ink: "#141414", heart: "#d61f3c" },
    red:     { name: "Cherry Red",     hex: "#c8102e", ink: "#ffffff", heart: "#ffc7d2" },
    pink:    { name: "Ballet Pink",    hex: "#f6c3cd", ink: "#141414", heart: "#d61f3c" },
    navy:    { name: "Navy",           hex: "#1f2a44", ink: "#ffffff", heart: "#ef3f5c" },
    sand:    { name: "Sand",           hex: "#e2d4bb", ink: "#141414", heart: "#d61f3c" },
    cream:   { name: "Cream",          hex: "#f4ebd9", ink: "#141414", heart: "#d61f3c" },
    sky:     { name: "Baby Blue",      hex: "#bcd7ee", ink: "#141414", heart: "#d61f3c" },
    forest:  { name: "Forest",         hex: "#2e4a3b", ink: "#ffffff", heart: "#ef3f5c" },
    "ringer-red":   { name: "White / Red",   hex: "#ffffff", trim: "#c8102e", ink: "#141414", heart: "#d61f3c" },
    "ringer-navy":  { name: "Cream / Navy",  hex: "#f4ebd9", trim: "#1f2a44", ink: "#1f2a44", heart: "#d61f3c" },
    "ringer-black": { name: "White / Black", hex: "#ffffff", trim: "#1c1c1c", ink: "#141414", heart: "#d61f3c" }
  };

  var ADULT = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
  var KIDS = ["2T", "4T", "6", "8", "10", "12"];

  var PRODUCTS = [
    {
      id: "classic-tee", title: "I ♥ Julia Classic Tee", type: "tee", cat: "tees", price: 28,
      colors: ["white", "black", "heather", "red", "pink", "navy"], sizes: ADULT, badge: "Bestseller",
      soldOut: ["navy:XS", "red:3XL"], added: 1,
      blurb: "The one that started it all. Our heavyweight cotton tee with the big, bold I ♥ Julia print front and center — a love letter you can wear.",
      details: ["6 oz. 100% ring-spun combed cotton (Heather Grey is 90/10 cotton/poly)", "Garment-dyed for a broken-in feel from day one", "Water-based screen print that softens, not cracks", "Relaxed classic fit, shoulder-to-shoulder taping", "Printed to order and shipped in 1–3 business days"]
    },
    {
      id: "ringer-tee", title: "Vintage Ringer Tee", type: "ringer", cat: "tees", price: 32,
      colors: ["ringer-red", "ringer-navy", "ringer-black"], sizes: ADULT, badge: "New", added: 9,
      blurb: "A '70s-style ringer with contrast collar and cuffs. Pairs perfectly with flared denim and a heart full of Julia.",
      details: ["5.5 oz. 100% combed cotton jersey", "Contrast rib-knit collar and sleeve cuffs", "Slightly cropped, true-to-size retro fit", "Water-based screen print", "Printed to order and shipped in 1–3 business days"]
    },
    {
      id: "pocket-tee", title: "Little Heart Pocket Tee", type: "tee", print: "pocket", cat: "tees", price: 30,
      colors: ["white", "heather", "sand", "black"], sizes: ADULT, added: 7,
      blurb: "For the understated romantic. A small I ♥ Julia over the heart — right where it belongs.",
      details: ["6 oz. 100% ring-spun cotton", "Left-chest print, sized 3.5\"", "Relaxed fit with a slightly dropped shoulder", "Pre-shrunk", "Printed to order and shipped in 1–3 business days"]
    },
    {
      id: "long-sleeve", title: "I ♥ Julia Long Sleeve", type: "longsleeve", cat: "tees", price: 36,
      colors: ["white", "black", "heather", "sand"], sizes: ADULT, badge: "New", added: 8,
      blurb: "The classic print on our long-sleeve heavyweight. Ribbed cuffs, roomy fit, made for layering through every season of love.",
      details: ["6.5 oz. 100% ring-spun cotton", "1x1 ribbed cuffs", "Relaxed fit", "Water-based screen print", "Printed to order and shipped in 1–3 business days"]
    },
    {
      id: "baby-tee", title: "Cropped Baby Tee", type: "crop", cat: "tees", price: 26, compareAt: 32,
      colors: ["white", "pink", "sky", "black"], sizes: ["XS", "S", "M", "L", "XL"], added: 6,
      blurb: "A fitted, cropped '90s baby tee with a slightly smaller print. Cute with everything, especially Julia.",
      details: ["4.5 oz. 95% cotton / 5% spandex rib", "Fitted, cropped silhouette (hits at the natural waist)", "Water-based screen print", "Consider sizing up for a relaxed fit", "Printed to order and shipped in 1–3 business days"]
    },
    {
      id: "muscle-tank", title: "Muscle Tank", type: "tank", cat: "tees", price: 24,
      colors: ["white", "black", "red"], sizes: ADULT, added: 4,
      blurb: "Deep armholes, big heart. Built for summer, beach days and showing off how much you love Julia.",
      details: ["5 oz. 100% combed cotton", "Dropped armholes, relaxed fit", "Water-based screen print", "Printed to order and shipped in 1–3 business days"]
    },
    {
      id: "hoodie", title: "Heavyweight Hoodie", type: "hoodie", cat: "sweats", price: 58, compareAt: 68,
      colors: ["black", "heather", "red", "forest"], sizes: ADULT, badge: "Bestseller", soldOut: ["forest:XS", "red:XS"], added: 3,
      blurb: "Our coziest piece. A 12 oz. brushed-fleece hoodie with the full I ♥ Julia print, double-lined hood and a kangaroo pocket for cold hands.",
      details: ["12 oz. 80/20 cotton/poly brushed fleece", "Double-lined hood with flat drawcords", "Kangaroo pocket, ribbed cuffs and waistband", "Puff-free water-based print", "Printed to order and shipped in 1–3 business days"]
    },
    {
      id: "crewneck", title: "Everyday Crewneck", type: "crew", cat: "sweats", price: 48,
      colors: ["heather", "cream", "navy", "pink"], sizes: ADULT, added: 5,
      blurb: "A heritage-style crewneck sweatshirt. Heavy, soft and made to be worn on repeat — like any good love story.",
      details: ["10 oz. 80/20 cotton/poly fleece", "Ribbed collar, cuffs and waistband", "Classic fit", "Water-based screen print", "Printed to order and shipped in 1–3 business days"]
    },
    {
      id: "kids-tee", title: "Kids' I ♥ Julia Tee", type: "kids", cat: "kids", price: 22,
      colors: ["white", "pink", "sky", "red"], sizes: KIDS, badge: "New", added: 10,
      blurb: "Mini-sized for the littlest fans. Soft, durable and machine-wash friendly for every adventure.",
      details: ["4.5 oz. 100% combed cotton", "Tag-free neck label", "Lead- and phthalate-free water-based print", "Sizes 2T through Youth 12", "Printed to order and shipped in 1–3 business days"]
    }
  ];
  PRODUCTS.forEach(function (p, i) { p.order = i; });

  var COLLECTIONS = {
    all:    { title: "Shop All", blurb: "Every way to say it. Tees, sweats and more, all with the heart." },
    tees:   { title: "Tees & Tanks", blurb: "Classic tees, ringers, long sleeves and tanks." },
    sweats: { title: "Sweats", blurb: "Hoodies and crewnecks for cozy, cold-weather devotion." },
    kids:   { title: "Kids", blurb: "Little shirts for little fans." },
    sale:   { title: "Sale", blurb: "Same love, lower price." }
  };

  var TYPE_LABEL = { tee: "Tee", ringer: "Ringer", longsleeve: "Long sleeve", crop: "Baby tee", tank: "Tank", hoodie: "Hoodie", crew: "Crewneck", kids: "Kids" };

  var DISCOUNTS = {
    JULIA10: { label: "10% off", pct: 10 },
    LOVE20: { label: "20% off orders $100+", pct: 20, min: 100 },
    FREESHIP: { label: "Free standard shipping", freeShip: true }
  };

  var FREE_SHIP = 75;
  var TAX_RATE = 0.07;
  var SHIPPING = [
    { id: "standard", name: "Standard", eta: "3–6 business days", price: 5.99 },
    { id: "express", name: "Express", eta: "2–3 business days", price: 14.99 },
    { id: "overnight", name: "Overnight", eta: "Next business day", price: 24.99 }
  ];

  /* ================= Utilities ================= */

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function money(n) { return "$" + (Math.round(n * 100) / 100).toFixed(2); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function byId(id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; return null; }
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("ihj:" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("ihj:" + k, JSON.stringify(v)); } catch (e) {} }
  };
  var sess = {
    get: function (k, d) { try { var v = sessionStorage.getItem("ihj:" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { sessionStorage.setItem("ihj:" + k, JSON.stringify(v)); } catch (e) {} }
  };
  function isSoldOut(p, color, size) { return (p.soldOut || []).indexOf(color + ":" + size) !== -1; }
  function heartIcon(on) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5 4.2 12.8a4.9 4.9 0 0 1 7.8-5.9 4.9 4.9 0 0 1 7.8 5.9Z" fill="' + (on ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
  }
  function stars(n) { var r = Math.round(n); return "★★★★★".slice(0, r) + "☆☆☆☆☆".slice(0, 5 - r); }

  /* ================= Garment artwork (SVG mockups) ================= */

  var HEART = "M16 29 2.7 15.6A8.3 8.3 0 0 1 16 4.4a8.3 8.3 0 0 1 13.3 11.2Z";
  var uid = 0;

  var SHAPES = {
    tee: "M152 78 Q200 112 248 78 L318 98 L382 166 L338 210 L320 190 L320 440 Q200 452 80 440 L80 190 L62 210 L18 166 L82 98 Z",
    long: "M152 78 Q200 112 248 78 L318 98 L352 150 L388 362 L350 372 L322 220 L320 440 Q200 452 80 440 L78 220 L50 372 L12 362 L48 150 L82 98 Z",
    crop: "M154 80 Q200 112 246 80 L312 98 L368 160 L330 196 L314 182 L316 330 Q200 340 84 330 L86 182 L70 196 L32 160 L88 98 Z",
    tank: "M162 70 Q200 128 238 70 L268 70 Q274 160 318 184 L320 440 Q200 452 80 440 L82 184 Q126 160 132 70 Z",
    hood: "M146 92 Q132 22 200 18 Q268 22 254 92 Q200 128 146 92 Z"
  };

  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    var f = function (c) { return Math.max(0, Math.min(255, Math.round(c + amt))); };
    return "#" + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
  }

  function printArt(c, scale, cx, cy) {
    // Classic stacked layout: "I ♥" over "JULIA"
    return '<g transform="translate(' + cx + " " + cy + ") scale(" + scale + ') translate(-200 -268)">' +
      '<text x="156" y="256" font-family="Archivo Black, Arial Black, sans-serif" font-size="58" fill="' + c.ink + '">I</text>' +
      '<path d="' + HEART + '" transform="translate(194 210) scale(1.62)" fill="' + c.heart + '"/>' +
      '<text x="122" y="320" textLength="156" lengthAdjust="spacingAndGlyphs" font-family="Archivo Black, Arial Black, sans-serif" font-size="60" fill="' + c.ink + '">JULIA</text>' +
      "</g>";
  }

  function garment(p, colorKey, view, opts) {
    opts = opts || {};
    var c = COLORS[colorKey];
    var id = "g" + (++uid);
    var body = c.hex, dark = shade(c.hex, -28), line = shade(c.hex, -48);
    var type = p.type, kids = type === "kids";
    var shapeKey = { tee: "tee", ringer: "tee", kids: "tee", pocket: "tee", longsleeve: "long", hoodie: "long", crew: "long", crop: "crop", tank: "tank" }[type];
    var path = SHAPES[shapeKey];
    var back = view === "back";
    var bg = opts.bg != null ? opts.bg : (view === "lifestyle" ? "#fbe2e7" : "#f1ede7");
    var vb = view === "detail" ? (type === "crop" ? "112 126 176 220" : p.print === "pocket" ? "197 89 110 137.5" : "100 162 200 250") : "0 0 400 500";
    var s = '<svg class="art" viewBox="' + vb + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + esc(p.title + " in " + c.name + (back ? ", back" : "")) + '">';
    s += "<defs>" +
      '<linearGradient id="' + id + 's" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>' +
      '<linearGradient id="' + id + 'v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".07"/></linearGradient>' +
      '<filter id="' + id + 'd" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000" flood-opacity=".14"/></filter>' +
      "</defs>";
    if (bg) s += '<rect x="0" y="0" width="400" height="500" fill="' + bg + '"/>';
    if (view === "lifestyle") {
      var hs = [[40, 60, .9, -12], [330, 40, .7, 14], [350, 420, 1.1, -8], [24, 400, .8, 10], [300, 230, .5, 0], [70, 240, .45, 20]];
      hs.forEach(function (h) { s += '<path d="' + HEART + '" transform="translate(' + h[0] + " " + h[1] + ") rotate(" + h[3] + ") scale(" + h[2] + ')" fill="#d61f3c" opacity=".14"/>'; });
    }
    var tf = kids ? "translate(46 64) scale(.77)" : "";
    if (view === "lifestyle") tf = "rotate(-4 200 260) translate(20 26) scale(.9)" + (kids ? " translate(46 64) scale(.77)" : "");
    s += '<g transform="' + tf + '" filter="url(#' + id + 'd)">';
    if (type === "hoodie") s += '<path d="' + SHAPES.hood + '" fill="' + dark + '"/>';
    s += '<path d="' + path + '" fill="' + body + '" stroke="' + line + '" stroke-opacity=".35" stroke-width="1.5" stroke-linejoin="round"/>';
    s += '<path d="' + path + '" fill="url(#' + id + 's)"/><path d="' + path + '" fill="url(#' + id + 'v)"/>';
    // folds
    s += '<path d="M128 300 Q140 380 120 436M272 260 Q262 340 282 436M200 410 Q206 425 198 444" fill="none" stroke="#000" stroke-opacity=".05" stroke-width="3" stroke-linecap="round"/>';
    // necklines / trims
    if (type === "hoodie") {
      s += '<path d="M160 86 Q200 128 240 86 Q200 100 160 86Z" fill="' + line + '"/>';
      s += '<path d="M186 112 L183 178M214 112 L217 172" stroke="' + shade(c.hex, c.ink === "#ffffff" ? 60 : -70) + '" stroke-width="3.5" stroke-linecap="round"/>';
      s += '<path d="M128 352 L272 352 L292 420 L108 420 Z" fill="none" stroke="' + line + '" stroke-opacity=".5" stroke-width="2"/>';
    } else if (type === "tank") {
      s += '<path d="M162 70 Q200 128 238 70" fill="none" stroke="' + dark + '" stroke-width="6"/>';
    } else {
      var collar = back ? "M152 78 Q200 92 248 78" : (shapeKey === "crop" ? "M154 80 Q200 112 246 80" : "M152 78 Q200 112 248 78");
      var cw = type === "crew" ? 13 : 8;
      s += '<path d="' + collar + '" fill="none" stroke="' + (c.trim || dark) + '" stroke-width="' + (c.trim ? 11 : cw) + '" stroke-linecap="round"/>';
      if (type === "crew") s += '<path d="' + collar + '" fill="none" stroke="' + line + '" stroke-opacity=".25" stroke-width="2" stroke-dasharray="2 3"/>';
    }
    if (c.trim) s += '<path d="M382 166 L338 210M18 166 L62 210" stroke="' + c.trim + '" stroke-width="11" stroke-linecap="round"/>';
    if (shapeKey === "long") s += '<path d="M388 362 L350 372M12 362 L50 372" stroke="' + dark + '" stroke-width="12" stroke-linecap="round"/>';
    if (type === "hoodie" || type === "crew") s += '<path d="M82 434 Q200 446 318 434" fill="none" stroke="' + dark + '" stroke-width="14" stroke-linecap="round"/>';
    // print
    if (!back) {
      if (p.print === "pocket") s += printArt(c, 0.3, 252, 158);
      else if (type === "crop") s += printArt(c, 0.78, 200, 236);
      else if (type === "hoodie") s += printArt(c, 0.88, 200, 262);
      else if (type === "tank") s += printArt(c, 0.92, 200, 272);
      else s += printArt(c, 1, 200, 268);
    } else {
      s += '<path d="' + HEART + '" transform="translate(194 100) scale(.36)" fill="' + c.heart + '"/>';
    }
    s += "</g></svg>";
    return s;
  }

  var VIEWS = [["front", "Front"], ["lifestyle", "Styled"], ["detail", "Print detail"], ["back", "Back"]];

  /* ================= State ================= */

  var cart = store.get("cart", []);
  var wish = store.get("wish", []);
  var orders = store.get("orders", []);
  var reviews = store.get("reviews", {});
  var recent = store.get("recent", []);
  var code = store.get("code", "");

  function cartKey(id, color, size) { return id + "|" + color + "|" + size; }
  function cartCount() { return cart.reduce(function (a, l) { return a + l.qty; }, 0); }
  function subtotal(lines) { return (lines || cart).reduce(function (a, l) { var p = byId(l.id); return a + (p ? p.price * l.qty : 0); }, 0); }
  function saveCart() { cart = cart.filter(function (l) { return byId(l.id) && l.qty > 0; }); store.set("cart", cart); updateBadges(); }

  function totals(shipId) {
    var sub = subtotal();
    var d = DISCOUNTS[code];
    var disc = 0, freeShip = false;
    if (d) {
      if (d.min && sub < d.min) d = null;
      else { if (d.pct) disc = Math.round(sub * d.pct) / 100; if (d.freeShip) freeShip = true; }
    }
    var after = sub - disc;
    var ship = null;
    if (shipId) {
      var m = SHIPPING.filter(function (x) { return x.id === shipId; })[0] || SHIPPING[0];
      ship = (m.id === "standard" && (freeShip || after >= FREE_SHIP)) ? 0 : m.price;
    }
    var tax = Math.round(after * TAX_RATE * 100) / 100;
    return { sub: sub, disc: disc, discount: d ? code : "", ship: ship, tax: tax, total: after + (ship || 0) + tax, freeShipBy: freeShip || after >= FREE_SHIP };
  }

  function addToCart(id, color, size, qty) {
    var p = byId(id);
    if (!p || isSoldOut(p, color, size)) return;
    var k = cartKey(id, color, size);
    var line = cart.filter(function (l) { return l.key === k; })[0];
    if (line) line.qty = Math.min(20, line.qty + qty);
    else cart.push({ key: k, id: id, color: color, size: size, qty: qty });
    saveCart();
    renderCart();
    openCart();
  }

  function updateBadges() {
    var n = cartCount(), cb = $("#cartCount");
    cb.textContent = n; cb.hidden = n === 0;
    $("#cartBtn").setAttribute("aria-label", "Open cart, " + n + " item" + (n === 1 ? "" : "s"));
    var w = $("#wishCount"); w.textContent = wish.length; w.hidden = wish.length === 0;
  }

  function toggleWish(id) {
    var i = wish.indexOf(id);
    if (i === -1) { wish.push(id); toast("Saved to your wishlist ♥"); } else { wish.splice(i, 1); toast("Removed from wishlist"); }
    store.set("wish", wish);
    updateBadges();
    $$('[data-wish="' + id + '"]').forEach(function (b) {
      var on = wish.indexOf(id) !== -1;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on);
      b.innerHTML = heartIcon(on);
    });
    if (currentRoute === "wishlist") route();
  }

  function rating(id) {
    var r = reviews[id] || [];
    if (!r.length) return null;
    return { avg: r.reduce(function (a, x) { return a + x.rating; }, 0) / r.length, n: r.length };
  }

  /* ================= Toast ================= */

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-on"); }, 2600);
  }

  /* ================= Cart drawer ================= */

  var lastFocus;
  function openCart() {
    lastFocus = document.activeElement;
    renderCart();
    $("#overlay").hidden = false;
    var d = $("#cartDrawer");
    d.classList.add("is-open");
    d.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(function () { $("#cartClose").focus(); }, 50);
  }
  function closeCart() {
    if (!$("#cartDrawer").classList.contains("is-open")) return;
    $("#overlay").hidden = true;
    var d = $("#cartDrawer");
    d.classList.remove("is-open");
    d.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function shipBar() {
    var t = totals();
    var left = FREE_SHIP - (t.sub - t.disc);
    var pct = Math.min(100, ((t.sub - t.disc) / FREE_SHIP) * 100);
    var msg = t.freeShipBy ? "🎉 You've unlocked <strong>free shipping</strong>!" : "You're <strong>" + money(left) + "</strong> away from free shipping";
    return '<div class="ship-bar">' + msg + '<div class="ship-bar__track"><div class="ship-bar__fill" style="width:' + (t.freeShipBy ? 100 : pct) + '%"></div></div></div>';
  }

  function lineHTML(l, big) {
    var p = byId(l.id), c = COLORS[l.color];
    return '<div class="line">' +
      '<a class="line__img" href="#/products/' + p.id + "?color=" + l.color + '" tabindex="-1" aria-hidden="true">' + garment(p, l.color, "front") + "</a>" +
      "<div>" +
      '<div class="line__top"><a class="line__title" href="#/products/' + p.id + "?color=" + l.color + '">' + esc(p.title) + "</a><span>" + money(p.price * l.qty) + "</span></div>" +
      '<div class="line__meta">' + esc(c.name) + " / " + esc(l.size) + (p.compareAt ? ' · <s>' + money(p.compareAt) + "</s> " + money(p.price) : " · " + money(p.price)) + "</div>" +
      '<div class="line__row">' +
      '<div class="qty qty--sm"><button type="button" data-line-dec="' + l.key + '" aria-label="Decrease quantity">−</button><input type="number" min="0" max="20" value="' + l.qty + '" data-line-qty="' + l.key + '" aria-label="Quantity"><button type="button" data-line-inc="' + l.key + '" aria-label="Increase quantity">+</button></div>' +
      '<button class="link-btn" type="button" data-line-remove="' + l.key + '">Remove</button>' +
      "</div></div></div>";
  }

  function renderCart() {
    var body = $("#cartBody"), foot = $("#cartFoot");
    if (!cart.length) {
      body.innerHTML = '<div class="drawer-empty"><div class="big-heart">♥</div><h3>Your cart is empty</h3><p class="muted">Julia deserves better than an empty cart.</p><a class="btn btn--red" href="#/collections/all" data-close-cart>Start shopping</a></div>';
      foot.innerHTML = "";
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    var inCart = cart.map(function (l) { return l.id; });
    var up = PRODUCTS.filter(function (p) { return inCart.indexOf(p.id) === -1; })[0];
    body.innerHTML = shipBar() + cart.map(function (l) { return lineHTML(l); }).join("") +
      (up ? '<div class="upsell"><h4>Pairs well with</h4><div class="upsell__item"><a class="line__img" href="#/products/' + up.id + '" data-close-cart aria-hidden="true" tabindex="-1">' + garment(up, up.colors[0], "front") + '</a><div><a href="#/products/' + up.id + '" data-close-cart class="line__title">' + esc(up.title) + "</a><div class=\"muted\">" + money(up.price) + '</div></div><button class="btn btn--outline" type="button" data-quick="' + up.id + '">Add</button></div></div>' : "");
    var t = totals();
    foot.innerHTML =
      (t.disc ? '<div class="summary__row"><span>Discount (' + esc(t.discount) + ")</span><span>−" + money(t.disc) + "</span></div>" : "") +
      '<div class="subtotal"><span>Subtotal</span><span>' + money(t.sub - t.disc) + "</span></div>" +
      '<p class="drawer__note">Taxes and shipping calculated at checkout.</p>' +
      '<a class="btn btn--red btn--block" href="#/checkout" data-close-cart>Check out · ' + money(t.sub - t.disc) + "</a>" +
      '<a class="btn btn--outline btn--block" href="#/cart" data-close-cart>View cart</a>';
  }

  function changeLine(key, qty) {
    cart.forEach(function (l) { if (l.key === key) l.qty = Math.max(0, Math.min(20, qty)); });
    saveCart();
    renderCart();
    if (currentRoute === "cart") route();
  }

  /* ================= Product card ================= */

  function priceHTML(p) {
    return p.compareAt
      ? '<div class="price price--sale"><span>' + money(p.price) + "</span><s>" + money(p.compareAt) + "</s></div>"
      : '<div class="price"><span>' + money(p.price) + "</span></div>";
  }

  function cardHTML(p, colorKey) {
    colorKey = colorKey || p.colors[0];
    var on = wish.indexOf(p.id) !== -1;
    var r = rating(p.id);
    var badges = "";
    if (p.compareAt) badges += '<span class="pill pill--sale">Save ' + Math.round((1 - p.price / p.compareAt) * 100) + "%</span>";
    if (p.badge) badges += '<span class="pill' + (p.badge === "Bestseller" ? " pill--dark" : "") + '">' + p.badge + "</span>";
    return '<div class="card" data-card="' + p.id + '"><div class="card__mediawrap">' +
      '<a class="card__media" href="#/products/' + p.id + "?color=" + colorKey + '" aria-label="' + esc(p.title) + '">' +
      '<span class="card__badges">' + badges + "</span>" +
      '<span class="art-main">' + garment(p, colorKey, "front").replace('class="art"', 'class="art art--main"') + "</span>" +
      '<span class="art-alt">' + garment(p, colorKey, "lifestyle").replace('class="art"', 'class="art art--alt"') + "</span>" +
      "</a>" +
      '<button class="icon-btn card__wish' + (on ? " is-on" : "") + '" type="button" data-wish="' + p.id + '" aria-pressed="' + on + '" aria-label="Save ' + esc(p.title) + ' to wishlist">' + heartIcon(on) + "</button>" +
      '<button class="btn card__quick" type="button" data-quick="' + p.id + '" data-quick-color="' + colorKey + '">Quick add</button></div>' +
      '<div class="card__info">' +
      '<a class="card__title" href="#/products/' + p.id + "?color=" + colorKey + '">' + esc(p.title) + "</a>" +
      (r ? '<div class="stars" aria-label="Rated ' + r.avg.toFixed(1) + ' out of 5">' + stars(r.avg) + ' <span class="muted">(' + r.n + ")</span></div>" : "") +
      priceHTML(p) +
      '<div class="card__swatches">' + p.colors.map(function (k) {
        return '<button type="button" class="dot' + (k === colorKey ? " is-on" : "") + '" style="background:' + swatchBg(k) + '" data-card-color="' + k + '" aria-label="' + esc(COLORS[k].name) + '"></button>';
      }).join("") + "</div>" +
      "</div></div>";
  }

  function swatchBg(k) {
    var c = COLORS[k];
    return c.trim ? "linear-gradient(135deg," + c.hex + " 50%," + c.trim + " 50%)" : c.hex;
  }

  /* ================= Pages ================= */

  function homePage() {
    var classic = byId("classic-tee"), hoodie = byId("hoodie");
    var featured = ["classic-tee", "hoodie", "ringer-tee", "baby-tee"].map(byId);
    var cats = [
      ["tees", "Tees", byId("classic-tee"), "red"],
      ["sweats", "Sweats", byId("crewneck"), "heather"],
      ["kids", "Kids", byId("kids-tee"), "sky"],
      ["sale", "Sale", byId("baby-tee"), "pink"]
    ];
    var marq = "";
    for (var i = 0; i < 8; i++) marq += "<span>I ♥ JULIA</span><span>✦</span>";
    return '<section class="hero"><div class="container hero__inner">' +
      "<div>" +
      '<span class="hero__eyebrow">The official collection</span>' +
      "<h1>Wear your heart on your <em>chest.</em></h1>" +
      '<p class="hero__lead">Bold, soft, screen-printed shirts that say exactly one thing — and say it loud. For the people who love Julia (Julia included).</p>' +
      '<div class="hero__ctas"><a class="btn btn--red" href="#/collections/all">Shop the collection</a><a class="btn btn--outline" href="#/products/classic-tee">Get the Classic Tee</a></div>' +
      "</div>" +
      '<div class="hero__art" aria-hidden="true">' +
      '<div class="hero__hearts"><span style="left:4%;top:8%">♥</span><span style="right:6%;top:2%;animation-delay:-2s">♥</span><span style="left:12%;bottom:6%;animation-delay:-4s">♥</span></div>' +
      '<div class="float float--a">' + garment(classic, "white", "front", { bg: "" }) + "</div>" +
      '<div class="float float--b">' + garment(hoodie, "black", "front", { bg: "" }) + "</div>" +
      "</div></div></section>" +
      '<section class="trust"><div class="container trust__grid">' +
      '<div class="trust__item"><span class="trust__icon">🚚</span><div><b>Free shipping</b>On orders over $75</div></div>' +
      '<div class="trust__item"><span class="trust__icon">↺</span><div><b>Easy returns</b>Free within 30 days</div></div>' +
      '<div class="trust__item"><span class="trust__icon">🌱</span><div><b>Water-based inks</b>Soft, no-crack prints</div></div>' +
      '<div class="trust__item"><span class="trust__icon">🔒</span><div><b>Secure checkout</b>Encrypted end to end</div></div>' +
      "</div></section>" +
      '<section class="section"><div class="container">' +
      '<div class="section__head"><h2>Bestsellers</h2><a href="#/collections/all">View all</a></div>' +
      '<div class="grid grid--4">' + featured.map(function (p) { return cardHTML(p); }).join("") + "</div>" +
      "</div></section>" +
      '<div class="marquee" aria-hidden="true"><div class="marquee__track">' + marq + marq + "</div></div>" +
      '<section class="section"><div class="container">' +
      '<div class="section__head"><h2>Shop by category</h2></div>' +
      '<div class="cats">' + cats.map(function (c) {
        return '<a class="cat" href="#/collections/' + c[0] + '">' + garment(c[2], c[3], "lifestyle") + '<span class="cat__label">' + c[1] + " →</span></a>";
      }).join("") + "</div>" +
      "</div></section>" +
      '<section class="section section--cream"><div class="container split">' +
      '<div class="split__art">' + garment(byId("ringer-tee"), "ringer-red", "lifestyle") + "</div>" +
      "<div>" +
      '<span class="hero__eyebrow">Our story</span>' +
      "<h2>One shirt. One message. Zero ambiguity.</h2>" +
      '<p class="hero__lead">It started as a single tee made for one very important person. Then everyone who loved Julia wanted one too. So we built a little shop — and kept the message exactly the same.</p>' +
      '<a class="btn btn--outline" href="#/pages/about">Read the story</a>' +
      "</div></div></section>" +
      '<section class="section"><div class="container">' +
      '<div class="features">' +
      '<div class="feature" style="background:var(--cream)"><div class="feature__icon">🧵</div><h3>Heavyweight & soft</h3><p class="muted">Ring-spun cotton that gets better every wash. No boxy cardboard tees here.</p></div>' +
      '<div class="feature" style="background:var(--cream)"><div class="feature__icon">🎨</div><h3>Printed to order</h3><p class="muted">Every shirt is screen printed when you order it, so nothing goes to waste.</p></div>' +
      '<div class="feature" style="background:var(--cream)"><div class="feature__icon">💌</div><h3>Gift-ready</h3><p class="muted">Add a note at checkout and we\'ll tuck a handwritten card in the box.</p></div>' +
      "</div></div></section>" +
      recentHTML();
  }

  var collState = { sort: "featured", types: [], colors: [] };

  function collectionPage(handle) {
    var col = COLLECTIONS[handle];
    if (!col) return notFound();
    collState = { sort: "featured", types: [], colors: [], handle: handle };
    var base = baseList(handle);
    var types = unique(base.map(function (p) { return p.type; }));
    var colors = unique([].concat.apply([], base.map(function (p) { return p.colors; })));
    return '<div class="container">' +
      '<div class="page-head"><div class="crumbs"><a href="#/">Home</a> / ' + esc(col.title) + "</div><h1>" + esc(col.title) + '</h1><p class="muted">' + esc(col.blurb) + "</p></div>" +
      '<div class="toolbar"><div class="toolbar__left"><span class="muted" id="count"></span></div>' +
      '<label class="toolbar__left"><span class="muted">Sort by</span><select class="select" id="sort">' +
      '<option value="featured">Featured</option><option value="new">Newest</option><option value="price-asc">Price, low to high</option><option value="price-desc">Price, high to low</option><option value="az">Alphabetically, A–Z</option></select></label></div>' +
      (types.length > 1 ? '<div class="filters" role="group" aria-label="Filter by style">' + types.map(function (t) { return '<button type="button" class="chip" data-filter-type="' + t + '" aria-pressed="false">' + TYPE_LABEL[t] + "</button>"; }).join("") + "</div>" : "") +
      '<div class="filters" role="group" aria-label="Filter by color">' + colors.map(function (k) { return '<button type="button" class="chip" data-filter-color="' + k + '" aria-pressed="false"><span class="dot" style="background:' + swatchBg(k) + '"></span>' + esc(COLORS[k].name) + "</button>"; }).join("") + "</div>" +
      '<div id="collGrid"></div>' +
      '<div style="height:56px"></div></div>';
  }

  function unique(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }
  function baseList(handle) {
    return PRODUCTS.filter(function (p) {
      if (handle === "all") return true;
      if (handle === "sale") return !!p.compareAt;
      return p.cat === handle;
    });
  }

  function renderCollGrid() {
    var list = baseList(collState.handle).filter(function (p) {
      if (collState.types.length && collState.types.indexOf(p.type) === -1) return false;
      if (collState.colors.length && !p.colors.some(function (c) { return collState.colors.indexOf(c) !== -1; })) return false;
      return true;
    });
    var s = collState.sort;
    list.sort(function (a, b) {
      if (s === "price-asc") return a.price - b.price;
      if (s === "price-desc") return b.price - a.price;
      if (s === "az") return a.title.localeCompare(b.title);
      if (s === "new") return b.added - a.added;
      return a.order - b.order;
    });
    $("#count").textContent = list.length + " product" + (list.length === 1 ? "" : "s");
    $("#collGrid").innerHTML = list.length
      ? '<div class="grid grid--4">' + list.map(function (p) {
        var c = collState.colors.length ? p.colors.filter(function (k) { return collState.colors.indexOf(k) !== -1; })[0] : null;
        return cardHTML(p, c);
      }).join("") + "</div>"
      : '<div class="empty"><h2>No matches</h2><p class="muted">Try removing a filter.</p><button class="btn btn--outline" type="button" id="clearFilters">Clear filters</button></div>';
  }

  /* ----- Product page ----- */

  var pdp = null;

  function productPage(id, params) {
    var p = byId(id);
    if (!p) return notFound();
    var color = p.colors.indexOf(params.color) !== -1 ? params.color : p.colors[0];
    pdp = { p: p, color: color, size: null, qty: 1, view: "front" };
    recent = [id].concat(recent.filter(function (x) { return x !== id; })).slice(0, 8);
    store.set("recent", recent);
    var r = rating(p.id);
    var on = wish.indexOf(p.id) !== -1;
    var related = PRODUCTS.filter(function (x) { return x.id !== p.id && (x.cat === p.cat || x.badge); }).slice(0, 4);
    return '<div class="container">' +
      '<div class="crumbs" style="padding-top:18px"><a href="#/">Home</a> / <a href="#/collections/' + p.cat + '">' + esc(COLLECTIONS[p.cat].title) + "</a> / " + esc(p.title) + "</div>" +
      '<div class="product">' +
      '<div class="gallery"><div class="gallery__main" id="galleryMain" role="button" tabindex="0" aria-label="Zoom image"></div><div class="gallery__thumbs" id="galleryThumbs"></div></div>' +
      '<div class="pinfo">' +
      (p.badge ? '<span class="pill' + (p.badge === "Bestseller" ? " pill--dark" : "") + '" style="margin-bottom:10px">' + p.badge + "</span>" : "") +
      "<h1>" + esc(p.title) + "</h1>" +
      '<div class="pinfo__rating">' + (r ? '<span class="stars">' + stars(r.avg) + "</span><a href=\"#reviews\" data-scroll=\"reviews\">" + r.avg.toFixed(1) + " · " + r.n + " review" + (r.n === 1 ? "" : "s") + "</a>" : '<a href="#reviews" data-scroll="reviews">Be the first to review</a>') + "</div>" +
      priceHTML(p) +
      (p.compareAt ? '<p class="muted" style="font-size:14px;margin:0">You save ' + money(p.compareAt - p.price) + "</p>" : "") +
      '<p class="muted" style="font-size:13px">Tax included where applicable. <a href="#/pages/shipping">Shipping</a> calculated at checkout.</p>' +
      '<form id="atcForm" novalidate>' +
      '<fieldset class="opt"><legend class="opt__label" style="width:100%"><span>Color: <b id="colorName"></b></span></legend><div class="swatches" id="swatches"></div></fieldset>' +
      '<fieldset class="opt"><legend class="opt__label" style="width:100%"><span>Size: <b id="sizeName">Select a size</b></span><a href="#/pages/size-guide" style="font-size:13px">Size guide</a></legend><div class="sizes" id="sizes"></div><div class="field__err" id="sizeErr" hidden>Please choose a size.</div></fieldset>' +
      '<div class="opt__label">Quantity</div>' +
      '<div class="buy-row" style="margin-bottom:10px"><div class="qty"><button type="button" data-pdp-qty="-1" aria-label="Decrease quantity">−</button><input type="number" id="pdpQty" min="1" max="20" value="1" aria-label="Quantity"><button type="button" data-pdp-qty="1" aria-label="Increase quantity">+</button></div>' +
      '<button type="button" class="icon-btn' + (on ? " is-on" : "") + '" data-wish="' + p.id + '" aria-pressed="' + on + '" aria-label="Save to wishlist">' + heartIcon(on) + "</button></div>" +
      '<div class="buy-row"><button class="btn btn--red" type="submit" id="atcBtn">Add to cart</button></div>' +
      '<button class="btn btn--block" type="button" id="buyNow" style="margin-top:10px">Buy it now</button>' +
      '<p class="stock" id="stock">In stock — printed &amp; shipped in 1–3 business days</p>' +
      "</form>" +
      '<ul class="perks"><li>🚚 Free shipping on orders over $75</li><li>↺ Free 30-day returns &amp; exchanges</li><li>💌 Add a free gift note at checkout</li></ul>' +
      '<p style="color:var(--ink-2)">' + esc(p.blurb) + "</p>" +
      '<details class="acc" open><summary>Details</summary><div class="acc__body"><ul>' + p.details.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ul></div></details>" +
      '<details class="acc"><summary>Fit &amp; sizing</summary><div class="acc__body">' + (p.type === "kids" ? "Kids' sizes run true to age. Between sizes? Go up — they'll grow into it." : p.type === "crop" ? "Fitted and cropped. Size up one for a relaxed look." : "Relaxed fit, true to size. Size down for a closer fit or up for an oversized look.") + ' See the full <a href="#/pages/size-guide">size guide</a>.</div></details>' +
      '<details class="acc"><summary>Care</summary><div class="acc__body">Machine wash cold, inside out, with like colors. Tumble dry low or hang dry. Do not iron directly on the print. Do not dry clean.</div></details>' +
      '<details class="acc"><summary>Shipping &amp; returns</summary><div class="acc__body">Orders ship in 1–3 business days. Standard shipping is free over $75. Returns and exchanges are free within 30 days of delivery — unworn, unwashed items only. <a href="#/pages/shipping">Full policy</a>.</div></details>' +
      "</div></div>" +
      reviewsHTML(p) +
      '<section class="section" style="padding-top:24px"><div class="section__head"><h2>You may also like</h2></div><div class="grid grid--4">' + related.map(function (x) { return cardHTML(x); }).join("") + "</div></section>" +
      "</div>" +
      recentHTML(p.id) +
      '<div class="sticky-atc" id="stickyAtc" aria-hidden="true"><div class="sticky-atc__info"><b>' + esc(p.title) + '</b><span class="muted" id="stickyMeta"></span></div><button class="btn btn--red" type="button" id="stickyBtn" tabindex="-1">Add to cart</button></div>';
  }

  function renderPdp() {
    var p = pdp.p, c = COLORS[pdp.color];
    $("#galleryMain").innerHTML = garment(p, pdp.color, pdp.view);
    $("#galleryThumbs").innerHTML = VIEWS.map(function (v) {
      return '<button type="button" class="thumb' + (v[0] === pdp.view ? " is-on" : "") + '" data-view="' + v[0] + '" aria-label="' + v[1] + ' view" aria-pressed="' + (v[0] === pdp.view) + '">' + garment(p, pdp.color, v[0]) + "</button>";
    }).join("");
    $("#colorName").textContent = c.name;
    $("#swatches").innerHTML = p.colors.map(function (k) {
      return '<button type="button" class="swatch' + (k === pdp.color ? " is-on" : "") + '" style="background:' + swatchBg(k) + '" data-color="' + k + '" aria-label="' + esc(COLORS[k].name) + '" aria-pressed="' + (k === pdp.color) + '"></button>';
    }).join("");
    if (pdp.size && isSoldOut(p, pdp.color, pdp.size)) pdp.size = null;
    $("#sizes").innerHTML = p.sizes.map(function (s) {
      var out = isSoldOut(p, pdp.color, s);
      return '<button type="button" class="size' + (s === pdp.size ? " is-on" : "") + '" data-size="' + s + '"' + (out ? ' disabled aria-label="' + s + ', sold out"' : ' aria-pressed="' + (s === pdp.size) + '"') + ">" + s + "</button>";
    }).join("");
    $("#sizeName").textContent = pdp.size || "Select a size";
    $("#pdpQty").value = pdp.qty;
    $("#stickyMeta").textContent = c.name + (pdp.size ? " / " + pdp.size : "") + " · " + money(p.price);
    var hasOut = p.sizes.some(function (s) { return isSoldOut(p, pdp.color, s); });
    var st = $("#stock");
    st.className = "stock" + (hasOut ? " stock--low" : "");
    st.textContent = hasOut ? "Some sizes sold out in " + c.name + " — restocking soon" : "In stock — printed & shipped in 1–3 business days";
    try { history.replaceState(null, "", "#/products/" + p.id + "?color=" + pdp.color); } catch (e) {}
  }

  function pdpSubmit(then) {
    if (!pdp.size) {
      $("#sizeErr").hidden = false;
      $("#sizes").scrollIntoView({ behavior: "smooth", block: "center" });
      var first = $("#sizes .size:not([disabled])"); if (first) first.focus();
      return;
    }
    if (then === "buy") {
      addToCartSilent(pdp.p.id, pdp.color, pdp.size, pdp.qty);
      location.hash = "#/checkout";
      return;
    }
    addToCart(pdp.p.id, pdp.color, pdp.size, pdp.qty);
  }
  function addToCartSilent(id, color, size, qty) {
    var k = cartKey(id, color, size);
    var line = cart.filter(function (l) { return l.key === k; })[0];
    if (line) line.qty = Math.min(20, line.qty + qty); else cart.push({ key: k, id: id, color: color, size: size, qty: qty });
    saveCart();
  }

  function reviewsHTML(p) {
    var list = reviews[p.id] || [];
    var r = rating(p.id);
    return '<section class="section reviews" id="reviews"><div class="reviews__grid">' +
      "<div><h2>Reviews</h2>" +
      (r ? '<p><span class="stars" style="font-size:20px">' + stars(r.avg) + "</span><br><b>" + r.avg.toFixed(1) + " out of 5</b> · " + r.n + " review" + (r.n === 1 ? "" : "s") + "</p>" : '<p class="muted">No reviews yet. Bought this one? Tell everyone how it fits.</p>') +
      '<form id="reviewForm" class="form-grid" novalidate>' +
      '<fieldset class="field" style="border:0;padding:0;margin:0"><legend>Your rating</legend><div class="rate-input">' +
      [5, 4, 3, 2, 1].map(function (n) { return '<input type="radio" name="rating" id="rate' + n + '" value="' + n + '"' + (n === 5 ? " checked" : "") + '><label for="rate' + n + '" title="' + n + ' star' + (n > 1 ? "s" : "") + '">★</label>'; }).join("") +
      "</div></fieldset>" +
      '<label class="field">Name<input name="name" required maxlength="40" autocomplete="given-name"></label>' +
      '<label class="field">Review title<input name="title" required maxlength="80"></label>' +
      '<label class="field">Review<textarea name="body" rows="4" required maxlength="1000"></textarea></label>' +
      '<button class="btn btn--outline" type="submit">Submit review</button>' +
      '<p class="muted" style="font-size:12px;margin:0">Reviews are saved on this device.</p>' +
      "</form></div>" +
      "<div>" + (list.length ? list.slice().reverse().map(function (x) {
        return '<div class="review"><div class="review__head"><span class="stars">' + stars(x.rating) + "</span><span class=\"muted\">" + esc(new Date(x.date).toLocaleDateString()) + "</span></div><b>" + esc(x.title) + '</b><p style="margin:6px 0">' + esc(x.body) + '</p><span class="muted" style="font-size:13px">— ' + esc(x.name) + "</span></div>";
      }).join("") : '<div class="empty" style="padding:30px 0"><div style="font-size:40px;color:var(--red)">♥</div><p class="muted">Reviews you write will show up here.</p></div>') + "</div>" +
      "</div></section>";
  }

  function recentHTML(exclude) {
    var ids = recent.filter(function (x) { return x !== exclude && byId(x); }).slice(0, 4);
    if (!ids.length) return "";
    return '<section class="section section--cream"><div class="container"><div class="section__head"><h2>Recently viewed</h2></div><div class="grid grid--4">' + ids.map(function (id) { return cardHTML(byId(id)); }).join("") + "</div></div></section>";
  }

  /* ----- Cart page ----- */

  function cartPage() {
    if (!cart.length) {
      return '<div class="container"><div class="empty"><div style="font-size:64px;color:var(--red);line-height:1">♥</div><h1 style="font-size:36px">Your cart is empty</h1><p class="muted">Let\'s fix that.</p><a class="btn btn--red" href="#/collections/all">Continue shopping</a></div></div>';
    }
    var t = totals();
    return '<div class="container"><div class="page-head"><h1>Your cart</h1><a href="#/collections/all">Continue shopping</a></div>' +
      '<div class="cart-page"><div>' + shipBar() + cart.map(function (l) { return lineHTML(l, true); }).join("") + "</div>" +
      '<aside class="summary">' +
      '<div class="summary__row"><span>Subtotal</span><span>' + money(t.sub) + "</span></div>" +
      (t.disc ? '<div class="summary__row"><span>Discount (' + esc(t.discount) + ')</span><span>−' + money(t.disc) + "</span></div>" : "") +
      (code && DISCOUNTS[code] && DISCOUNTS[code].freeShip ? '<div class="summary__row"><span>Shipping (FREESHIP)</span><span>Free</span></div>' : "") +
      '<form class="discount" id="cartDiscount" style="border:0;margin:0;padding:12px 0"><label class="sr-only" for="cartCode">Discount code</label><input id="cartCode" placeholder="Discount code" value="' + esc(code) + '"><button class="btn btn--outline" type="submit">Apply</button></form>' +
      '<div class="field__err" id="cartCodeErr" hidden></div>' +
      '<div class="summary__row summary__row--total"><span>Estimated total</span><span>' + money(t.sub - t.disc) + "</span></div>" +
      '<p class="muted" style="font-size:13px">Taxes and shipping calculated at checkout.</p>' +
      '<label for="cartNote" style="font-size:14px;font-weight:600">Gift note (optional)</label><textarea class="cart-note" id="cartNote" placeholder="We\'ll handwrite it on a card for you">' + esc(store.get("note", "")) + "</textarea>" +
      '<a class="btn btn--red btn--block" href="#/checkout">Check out</a>' +
      '<div class="pay-icons" style="justify-content:center;margin-top:14px"><span style="border:1px solid var(--line)">VISA</span><span style="border:1px solid var(--line)">MC</span><span style="border:1px solid var(--line)">AMEX</span><span style="border:1px solid var(--line)">PayPal</span></div>' +
      "</aside></div><div style=\"height:40px\"></div></div>";
  }

  function applyCode(input, errEl) {
    var v = (input || "").trim().toUpperCase();
    if (!v) { code = ""; store.set("code", code); return true; }
    var d = DISCOUNTS[v];
    if (!d) { errEl.textContent = "Enter a valid discount code"; errEl.hidden = false; return false; }
    if (d.min && subtotal() < d.min) { errEl.textContent = v + " requires a subtotal of " + money(d.min) + " or more"; errEl.hidden = false; return false; }
    code = v; store.set("code", code);
    toast("Discount applied: " + d.label);
    return true;
  }

  /* ----- Search / wishlist / account ----- */

  function searchList(q) {
    q = (q || "").toLowerCase().trim();
    if (!q) return [];
    var words = q.split(/\s+/);
    return PRODUCTS.filter(function (p) {
      var hay = (p.title + " " + p.type + " " + TYPE_LABEL[p.type] + " " + p.cat + " " + p.colors.map(function (k) { return COLORS[k].name; }).join(" ") + " " + p.blurb).toLowerCase().replace("♥", "heart love");
      return words.every(function (w) { return hay.indexOf(w) !== -1; });
    });
  }

  function searchPage(params) {
    var q = params.q || "";
    var list = searchList(q);
    return '<div class="container"><div class="page-head"><h1>Search</h1>' +
      '<form id="searchPageForm" class="discount" style="border:0;max-width:560px"><label class="sr-only" for="sq">Search</label><input id="sq" type="search" value="' + esc(q) + '" placeholder="Search products…"><button class="btn" type="submit">Search</button></form>' +
      (q ? '<p class="muted">' + list.length + ' result' + (list.length === 1 ? "" : "s") + ' for “' + esc(q) + '”</p>' : "") + "</div>" +
      (list.length ? '<div class="grid grid--4">' + list.map(function (p) { return cardHTML(p); }).join("") + "</div>" : q ? '<div class="empty"><p>No results. Try “hoodie”, “pink” or “kids”.</p></div>' : "") +
      '<div style="height:56px"></div></div>';
  }

  function wishlistPage() {
    var list = wish.map(byId).filter(Boolean);
    return '<div class="container"><div class="page-head"><h1>Wishlist</h1><p class="muted">' + (list.length ? list.length + " saved item" + (list.length === 1 ? "" : "s") : "Tap the ♥ on any product to save it here.") + "</p></div>" +
      (list.length ? '<div class="grid grid--4">' + list.map(function (p) { return cardHTML(p); }).join("") + "</div>" : '<div class="empty"><a class="btn btn--red" href="#/collections/all">Browse products</a></div>') +
      '<div style="height:56px"></div></div>';
  }

  function accountPage() {
    return '<div class="container"><div class="page-head"><h1>Your account</h1><p class="muted">Orders placed on this device.</p></div>' +
      (orders.length
        ? '<div class="table-wrap"><table class="orders"><thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Items</th><th>Total</th></tr></thead><tbody>' +
          orders.slice().reverse().map(function (o) {
            return '<tr><td><a href="#/order/' + o.number + '">#' + o.number + "</a></td><td>" + new Date(o.date).toLocaleDateString() + '</td><td><span class="status">Confirmed</span></td><td>' + o.items.reduce(function (a, l) { return a + l.qty; }, 0) + "</td><td>" + money(o.totals.total) + "</td></tr>";
          }).join("") + "</tbody></table></div>"
        : '<div class="empty"><p class="muted">You haven\'t placed any orders yet.</p><a class="btn btn--red" href="#/collections/all">Start shopping</a></div>') +
      '<div style="height:56px"></div></div>';
  }

  /* ----- Content pages ----- */

  var PAGES = {
    about: ["Our Story",
      "<p>I ♥ Julia started the way most good things do: as a gift. One shirt, one message, made for one person who deserved to know — loudly, in a heavyweight cotton blend — that she was loved.</p>" +
      "<p>Then people started asking where they could get one. Friends. Family. Strangers on the street. It turns out a lot of people love Julia.</p>" +
      "<h2>What we make</h2><p>Simple, bold shirts with a single message, printed on the softest blanks we could find. We screen print every piece to order with water-based inks, so the print feels like part of the fabric and nothing sits around in a warehouse.</p>" +
      "<h2>What we believe</h2><ul><li>Say what you mean.</li><li>Make it last.</li><li>Waste less.</li><li>Julia, obviously.</li></ul>"],
    faq: ["FAQ",
      "<h2>How do the shirts fit?</h2><p>Our tees, long sleeves and sweats are a relaxed, true-to-size fit. The Baby Tee is fitted and cropped — size up for a looser look. See the <a href=\"#/pages/size-guide\">size guide</a> for measurements.</p>" +
      "<h2>When will my order ship?</h2><p>Everything is printed to order and ships within 1–3 business days. You'll get tracking by email as soon as it leaves.</p>" +
      "<h2>Do you offer gift wrapping?</h2><p>Every order ships in a recyclable mailer. Add a gift note on the cart page and we'll handwrite it on a card for you — free.</p>" +
      "<h2>Can I return or exchange?</h2><p>Yes — free returns and exchanges within 30 days of delivery on unworn, unwashed items. See <a href=\"#/pages/shipping\">Shipping &amp; Returns</a>.</p>" +
      "<h2>Do you ship internationally?</h2><p>We ship to the US, Canada, the UK and Australia. International rates are shown at checkout.</p>" +
      "<h2>Can I get a custom name?</h2><p>Not yet — we only love Julia. (We're kidding. Custom names are on the roadmap. Join the newsletter to hear first.)</p>"],
    shipping: ["Shipping & Returns",
      "<h2>Shipping</h2><div class=\"table-wrap\"><table class=\"table\"><thead><tr><th>Method</th><th>Delivery</th><th>Cost</th></tr></thead><tbody>" +
      "<tr><td>Standard</td><td>3–6 business days</td><td>$5.99 · Free over $75</td></tr><tr><td>Express</td><td>2–3 business days</td><td>$14.99</td></tr><tr><td>Overnight</td><td>Next business day</td><td>$24.99</td></tr></tbody></table></div>" +
      "<p>All orders are printed and dispatched within 1–3 business days. Delivery times are counted from dispatch.</p>" +
      "<h2>Returns &amp; exchanges</h2><p>We offer free returns and exchanges within 30 days of delivery. Items must be unworn, unwashed and in original condition. Refunds go back to the original payment method within 5–7 business days of us receiving the return.</p>" +
      "<h2>Damaged or misprinted?</h2><p>That's on us. <a href=\"#/pages/contact\">Contact us</a> with a photo and we'll send a replacement right away — no need to return the original.</p>"],
    "size-guide": ["Size Guide",
      "<p>Measurements are of the garment laid flat, in inches. Chest is measured 1\" below the armpit, side to side.</p>" +
      "<h2>Tees, ringers &amp; long sleeves</h2><div class=\"table-wrap\"><table class=\"table\"><thead><tr><th>Size</th><th>Chest</th><th>Length</th></tr></thead><tbody>" +
      "<tr><td>XS</td><td>18</td><td>27</td></tr><tr><td>S</td><td>19.5</td><td>28</td></tr><tr><td>M</td><td>21</td><td>29</td></tr><tr><td>L</td><td>22.5</td><td>30</td></tr><tr><td>XL</td><td>24</td><td>31</td></tr><tr><td>2XL</td><td>26</td><td>32</td></tr><tr><td>3XL</td><td>28</td><td>33</td></tr></tbody></table></div>" +
      "<h2>Hoodies &amp; crewnecks</h2><div class=\"table-wrap\"><table class=\"table\"><thead><tr><th>Size</th><th>Chest</th><th>Length</th><th>Sleeve</th></tr></thead><tbody>" +
      "<tr><td>XS</td><td>19.5</td><td>26</td><td>32.5</td></tr><tr><td>S</td><td>21</td><td>27</td><td>33.5</td></tr><tr><td>M</td><td>22.5</td><td>28</td><td>34.5</td></tr><tr><td>L</td><td>24</td><td>29</td><td>35.5</td></tr><tr><td>XL</td><td>26</td><td>30</td><td>36.5</td></tr><tr><td>2XL</td><td>28</td><td>31</td><td>37.5</td></tr><tr><td>3XL</td><td>30</td><td>32</td><td>38.5</td></tr></tbody></table></div>" +
      "<h2>Cropped Baby Tee</h2><div class=\"table-wrap\"><table class=\"table\"><thead><tr><th>Size</th><th>Chest</th><th>Length</th></tr></thead><tbody>" +
      "<tr><td>XS</td><td>15</td><td>17.5</td></tr><tr><td>S</td><td>16</td><td>18</td></tr><tr><td>M</td><td>17</td><td>18.5</td></tr><tr><td>L</td><td>18.5</td><td>19</td></tr><tr><td>XL</td><td>20</td><td>19.5</td></tr></tbody></table></div>" +
      "<h2>Kids</h2><div class=\"table-wrap\"><table class=\"table\"><thead><tr><th>Size</th><th>Age</th><th>Chest</th></tr></thead><tbody>" +
      "<tr><td>2T</td><td>2</td><td>12</td></tr><tr><td>4T</td><td>4</td><td>13</td></tr><tr><td>6</td><td>5–6</td><td>14.5</td></tr><tr><td>8</td><td>7–8</td><td>15.5</td></tr><tr><td>10</td><td>9–10</td><td>16.5</td></tr><tr><td>12</td><td>11–12</td><td>17.5</td></tr></tbody></table></div>"],
    contact: ["Contact",
      "<p>Questions about sizing, an order, or a bulk order for the whole Julia fan club? Send us a note and we'll reply within one business day.</p>" +
      '<form id="contactForm" class="form-grid" novalidate style="max-width:520px">' +
      '<label class="field">Name<input name="name" required autocomplete="name"></label>' +
      '<label class="field">Email<input name="email" type="email" required autocomplete="email"></label>' +
      '<label class="field">Order number (optional)<input name="order" placeholder="#1001"></label>' +
      '<label class="field">Message<textarea name="msg" rows="5" required></textarea></label>' +
      '<button class="btn btn--red" type="submit">Send message</button></form>'],
    terms: ["Terms of Service",
      "<p>By using this site and placing an order you agree to these terms.</p><h2>Orders</h2><p>All orders are subject to availability and confirmation. Prices are in US dollars and may change without notice; the price at the time of your order is the price you pay.</p><h2>Products</h2><p>Colors may vary slightly from what you see on screen. Every shirt is printed to order, so small variations in print placement are normal.</p><h2>Intellectual property</h2><p>All designs and content on this site belong to I ♥ Julia and may not be reproduced without permission.</p>"],
    privacy: ["Privacy Policy",
      "<p>We collect only what we need to fulfill your order: your name, contact details, shipping address and order contents.</p><h2>Cookies &amp; local storage</h2><p>This store saves your cart, wishlist and order history in your browser's local storage so they're there when you come back. Clearing your browser data removes them.</p><h2>Payments</h2><p>Card details are handled by our payment processor and are never stored on our servers.</p><h2>Contact</h2><p>Questions about your data? <a href=\"#/pages/contact\">Get in touch</a>.</p>"]
  };

  function contentPage(slug) {
    var pg = PAGES[slug];
    if (!pg) return notFound();
    return '<div class="container"><div class="page-head"><div class="crumbs"><a href="#/">Home</a> / ' + esc(pg[0]) + "</div><h1>" + esc(pg[0]) + '</h1></div><div class="prose">' + pg[1] + "</div></div>";
  }

  function notFound() {
    return '<div class="container"><div class="empty"><div style="font-size:64px;color:var(--red);line-height:1">♥</div><h1 style="font-size:40px">Page not found</h1><p class="muted">This page wandered off. Julia\'s still here, though.</p><a class="btn btn--red" href="#/">Back to home</a></div></div>';
  }

  /* ================= Checkout ================= */

  var co = sess.get("co", { step: "information", email: "", news: true, country: "US", first: "", last: "", address: "", apt: "", city: "", region: "", zip: "", phone: "", ship: "standard", billSame: true });

  var COUNTRIES = { US: ["United States", "State", "ZIP code"], CA: ["Canada", "Province", "Postal code"], GB: ["United Kingdom", "County", "Postcode"], AU: ["Australia", "State/territory", "Postcode"] };

  function coSummary() {
    var t = totals(co.step === "information" ? null : co.ship);
    var d = t.discount;
    return '<button class="co-summary-toggle" type="button" id="coToggle" aria-expanded="false" aria-controls="coSummaryBody"><span>Show order summary ▾</span><strong>' + money(t.total) + "</strong></button>" +
      '<div class="co__summary-body" id="coSummaryBody" hidden>' +
      cart.map(function (l) {
        var p = byId(l.id);
        return '<div class="co__line"><div class="co__thumb"><span class="qty-badge">' + l.qty + '</span><div class="art-wrap">' + garment(p, l.color, "front") + "</div></div><div><b>" + esc(p.title) + '</b><div class="muted">' + esc(COLORS[l.color].name) + " / " + esc(l.size) + "</div></div><span>" + money(p.price * l.qty) + "</span></div>";
      }).join("") +
      '<form class="discount" id="coDiscount"><label class="sr-only" for="coCode">Discount code</label><input id="coCode" placeholder="Discount code or gift card"><button class="btn btn--outline" type="submit">Apply</button></form>' +
      '<div class="field__err" id="coCodeErr" hidden style="margin:-6px 0 10px"></div>' +
      (d ? '<span class="tag">🏷 ' + esc(code) + ' <button type="button" id="removeCode" aria-label="Remove discount">✕</button></span>' : "") +
      '<div class="summary__row"><span>Subtotal</span><span>' + money(t.sub) + "</span></div>" +
      (t.disc ? '<div class="summary__row"><span>Discount</span><span>−' + money(t.disc) + "</span></div>" : "") +
      '<div class="summary__row"><span>Shipping</span><span>' + (t.ship == null ? '<span class="muted">Calculated at next step</span>' : t.ship === 0 ? "Free" : money(t.ship)) + "</span></div>" +
      '<div class="summary__row"><span>Estimated taxes</span><span>' + money(t.tax) + "</span></div>" +
      '<div class="summary__row summary__row--total"><span>Total</span><span><small class="muted" style="font-weight:400;font-size:12px">USD</small> ' + money(t.total) + "</span></div>" +
      "</div>";
  }

  function field(name, label, opts) {
    opts = opts || {};
    return '<label class="field" data-field="' + name + '"><span class="sr-only">' + label + "</span>" +
      '<input name="' + name + '" placeholder="' + label + (opts.optional ? " (optional)" : "") + '" value="' + esc(co[name] || "") + '"' +
      (opts.type ? ' type="' + opts.type + '"' : "") + (opts.ac ? ' autocomplete="' + opts.ac + '"' : "") + (opts.optional ? "" : " required") + (opts.extra || "") + ">" +
      '<span class="field__err" hidden></span></label>';
  }

  function checkoutPage() {
    if (!cart.length) {
      return '<div class="container"><div class="empty"><h1 style="font-size:32px">Your cart is empty</h1><a class="btn btn--red" href="#/collections/all">Continue shopping</a></div></div>';
    }
    var steps = ["information", "shipping", "payment"];
    var idx = steps.indexOf(co.step);
    if (idx === -1) { co.step = "information"; idx = 0; }
    var crumb = '<nav class="co__steps" aria-label="Checkout steps"><a href="#/cart">Cart</a> ›' +
      steps.map(function (s, i) {
        var label = s.charAt(0).toUpperCase() + s.slice(1);
        if (i < idx) return ' <button type="button" data-co-step="' + s + '">' + label + "</button>" + (i < 2 ? " ›" : "");
        return ' <span class="' + (i === idx ? "is-current" : "") + '"' + (i === idx ? ' aria-current="step"' : "") + ">" + label + "</span>" + (i < 2 ? " ›" : "");
      }).join("") + "</nav>";

    var cc = COUNTRIES[co.country] || COUNTRIES.US;
    var main = "";
    if (co.step === "information") {
      main = '<div class="express" aria-label="Express checkout"><button type="button" class="x-shop" data-express>shop</button><button type="button" class="x-pp" data-express>PayPal</button><button type="button" class="x-gp" data-express>G Pay</button></div>' +
        '<div class="divider">OR</div>' +
        '<form id="coForm" novalidate>' +
        "<h2>Contact</h2>" + field("email", "Email", { type: "email", ac: "email" }) +
        '<label class="co__check"><input type="checkbox" name="news"' + (co.news ? " checked" : "") + "> Email me with news and offers</label>" +
        "<h2>Shipping address</h2><div class=\"form-grid\">" +
        '<label class="field"><span class="sr-only">Country/region</span><select name="country" autocomplete="country">' + Object.keys(COUNTRIES).map(function (k) { return '<option value="' + k + '"' + (k === co.country ? " selected" : "") + ">" + COUNTRIES[k][0] + "</option>"; }).join("") + "</select></label>" +
        '<div class="co__row co__row--2">' + field("first", "First name", { ac: "given-name" }) + field("last", "Last name", { ac: "family-name" }) + "</div>" +
        field("address", "Address", { ac: "address-line1" }) +
        field("apt", "Apartment, suite, etc.", { optional: true, ac: "address-line2" }) +
        '<div class="co__row co__row--3">' + field("city", "City", { ac: "address-level2" }) + field("region", cc[1], { ac: "address-level1" }) + field("zip", cc[2], { ac: "postal-code" }) + "</div>" +
        field("phone", "Phone", { optional: true, type: "tel", ac: "tel" }) +
        "</div>" +
        '<div class="co__nav"><a href="#/cart">‹ Return to cart</a><button class="btn btn--red" type="submit">Continue to shipping</button></div>' +
        "</form>";
    } else {
      var addr = esc([co.address, co.apt, co.city, co.region + " " + co.zip, cc[0]].filter(function (x) { return x && x.trim(); }).join(", "));
      main = '<div class="review-box">' +
        '<div class="review-box__row"><span>Contact</span><span>' + esc(co.email) + '</span><button class="link-btn" type="button" data-co-step="information">Change</button></div>' +
        '<div class="review-box__row"><span>Ship to</span><span>' + addr + '</span><button class="link-btn" type="button" data-co-step="information">Change</button></div>' +
        (co.step === "payment" ? '<div class="review-box__row"><span>Method</span><span>' + (function () { var m = SHIPPING.filter(function (x) { return x.id === co.ship; })[0]; var t = totals(co.ship); return esc(m.name) + " · " + (t.ship === 0 ? "Free" : money(t.ship)); })() + '</span><button class="link-btn" type="button" data-co-step="shipping">Change</button></div>' : "") +
        "</div>";
      if (co.step === "shipping") {
        main += '<form id="coForm" novalidate><h2>Shipping method</h2><div class="radio-list" role="radiogroup">' +
          SHIPPING.map(function (m) {
            var t = totals(m.id);
            return '<label class="radio' + (co.ship === m.id ? " is-on" : "") + '"><input type="radio" name="ship" value="' + m.id + '"' + (co.ship === m.id ? " checked" : "") + '><span class="radio__label">' + m.name + "<small>" + m.eta + "</small></span><b>" + (t.ship === 0 ? "Free" : money(t.ship)) + "</b></label>";
          }).join("") + "</div>" +
          '<div class="co__nav"><button class="link-btn" type="button" data-co-step="information" style="font-size:15px;text-decoration:none">‹ Return to information</button><button class="btn btn--red" type="submit">Continue to payment</button></div></form>';
      } else {
        main += '<form id="coForm" novalidate><h2>Payment</h2><p class="muted" style="font-size:14px;margin-top:-6px">All transactions are secure and encrypted.</p>' +
          '<div class="testmode"><b>Demo store — test mode.</b> No real payment is processed and card details never leave this page. Use test card <code>4242 4242 4242 4242</code>, any future date and any CVC. <code>4000 0000 0000 0002</code> simulates a decline.</div>' +
          '<div class="radio-list"><label class="radio is-on"><input type="radio" checked name="pm" value="card"><span class="radio__label">Credit card</span><span class="pay-icons"><span style="border:1px solid var(--line)">VISA</span><span style="border:1px solid var(--line)">MC</span><span style="border:1px solid var(--line)">AMEX</span></span></label>' +
          '<div class="pay-panel">' +
          '<label class="field" data-field="card"><span class="sr-only">Card number</span><input name="card" inputmode="numeric" autocomplete="off" placeholder="Card number" maxlength="23"><span class="field__err" hidden></span></label>' +
          '<div class="co__row co__row--2">' +
          '<label class="field" data-field="exp"><span class="sr-only">Expiration date</span><input name="exp" inputmode="numeric" autocomplete="off" placeholder="Expiration date (MM / YY)" maxlength="7"><span class="field__err" hidden></span></label>' +
          '<label class="field" data-field="cvc"><span class="sr-only">Security code</span><input name="cvc" inputmode="numeric" autocomplete="off" placeholder="Security code" maxlength="4"><span class="field__err" hidden></span></label>' +
          "</div>" +
          '<label class="field" data-field="nameOnCard"><span class="sr-only">Name on card</span><input name="nameOnCard" autocomplete="off" placeholder="Name on card" value="' + esc((co.first + " " + co.last).trim()) + '"><span class="field__err" hidden></span></label>' +
          "</div></div>" +
          "<h2>Billing address</h2>" +
          '<div class="radio-list"><label class="radio' + (co.billSame ? " is-on" : "") + '"><input type="radio" name="bill" value="same"' + (co.billSame ? " checked" : "") + '><span class="radio__label">Same as shipping address</span></label><label class="radio' + (!co.billSame ? " is-on" : "") + '"><input type="radio" name="bill" value="diff"' + (!co.billSame ? " checked" : "") + '><span class="radio__label">Use a different billing address</span></label>' +
          (!co.billSame ? '<div class="pay-panel">' + field("billAddress", "Billing address", { ac: "off" }) + '<div class="co__row co__row--2">' + field("billCity", "City", { ac: "off" }) + field("billZip", cc[2], { ac: "off" }) + "</div></div>" : "") +
          "</div>" +
          '<div class="field__err" id="payErr" hidden style="margin-top:14px;font-size:14px"></div>' +
          '<div class="co__nav"><button class="link-btn" type="button" data-co-step="shipping" style="font-size:15px;text-decoration:none">‹ Return to shipping</button><button class="btn btn--red" type="submit" id="payBtn">Pay now</button></div></form>';
      }
    }
    return '<div class="co"><div class="co__main"><div class="co__main-inner">' +
      '<a href="#/" class="logo co__logo">I <svg class="logo__heart" viewBox="0 0 32 29" aria-hidden="true"><path d="' + HEART + '"/></svg> JULIA</a>' +
      crumb + main +
      '<p class="muted" style="font-size:12px;margin-top:40px;border-top:1px solid var(--line);padding-top:14px"><a href="#/pages/shipping">Refund policy</a> · <a href="#/pages/shipping">Shipping policy</a> · <a href="#/pages/privacy">Privacy policy</a> · <a href="#/pages/terms">Terms of service</a></p>' +
      '</div></div><aside class="co__side" aria-label="Order summary"><div class="co__side-inner">' + coSummary() + "</div></aside></div>";
  }

  function setErr(form, name, msg) {
    var f = form.querySelector('[data-field="' + name + '"]');
    if (!f) return;
    f.classList.toggle("is-error", !!msg);
    var e = f.querySelector(".field__err");
    e.textContent = msg || "";
    e.hidden = !msg;
    var inp = f.querySelector("input,select");
    if (inp) inp.setAttribute("aria-invalid", msg ? "true" : "false");
  }

  function luhn(num) {
    var sum = 0, alt = false;
    for (var i = num.length - 1; i >= 0; i--) {
      var n = +num[i];
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n; alt = !alt;
    }
    return sum % 10 === 0;
  }

  function submitCheckout(form) {
    var firstBad = null;
    function bad(name, msg) { setErr(form, name, msg); if (msg && !firstBad) firstBad = form.querySelector('[name="' + name + '"]'); }
    if (co.step === "information") {
      var fd = new FormData(form);
      ["email", "first", "last", "address", "apt", "city", "region", "zip", "phone", "country"].forEach(function (k) { co[k] = (fd.get(k) || "").trim(); });
      co.news = !!fd.get("news");
      bad("email", !co.email ? "Enter an email" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(co.email) ? "Enter a valid email" : "");
      bad("first", co.first ? "" : "Enter a first name");
      bad("last", co.last ? "" : "Enter a last name");
      bad("address", co.address ? "" : "Enter an address");
      bad("city", co.city ? "" : "Enter a city");
      bad("region", co.region ? "" : "Enter a " + COUNTRIES[co.country][1].toLowerCase());
      bad("zip", !co.zip ? "Enter a " + COUNTRIES[co.country][2] : (co.country === "US" && !/^\d{5}(-\d{4})?$/.test(co.zip)) ? "Enter a valid ZIP code" : "");
      sess.set("co", co);
      if (firstBad) { firstBad.focus(); return; }
      co.step = "shipping";
    } else if (co.step === "shipping") {
      var s = form.querySelector('input[name="ship"]:checked');
      co.ship = s ? s.value : "standard";
      co.step = "payment";
    } else {
      var num = (form.card.value || "").replace(/\D/g, "");
      var exp = (form.exp.value || "").replace(/\s/g, "");
      var m = /^(\d{2})\/(\d{2})$/.exec(exp);
      var now = new Date();
      var expOk = m && +m[1] >= 1 && +m[1] <= 12 && new Date(2000 + +m[2], +m[1], 1) > now;
      bad("card", num.length < 13 || !luhn(num) ? "Enter a valid card number" : "");
      bad("exp", !expOk ? "Enter a valid expiration date" : "");
      bad("cvc", !/^\d{3,4}$/.test(form.cvc.value) ? "Enter the CVV or security code on your card" : "");
      bad("nameOnCard", form.nameOnCard.value.trim() ? "" : "Enter your name exactly as it's written on your card");
      if (!co.billSame) {
        bad("billAddress", form.billAddress.value.trim() ? "" : "Enter an address");
        bad("billCity", form.billCity.value.trim() ? "" : "Enter a city");
        bad("billZip", form.billZip.value.trim() ? "" : "Enter a postal code");
      }
      if (firstBad) { firstBad.focus(); return; }
      var btn = $("#payBtn"), err = $("#payErr");
      err.hidden = true;
      btn.disabled = true; btn.textContent = "Processing…";
      setTimeout(function () {
        if (num === "4000000000000002") {
          btn.disabled = false; btn.textContent = "Pay now";
          err.textContent = "Your card was declined. Try a different card.";
          err.hidden = false;
          return;
        }
        placeOrder(num.slice(-4));
      }, 1300);
      return;
    }
    sess.set("co", co);
    route();
    window.scrollTo(0, 0);
  }

  function placeOrder(last4) {
    var t = totals(co.ship);
    var number = 1001 + orders.length;
    var order = {
      number: number, date: new Date().toISOString(),
      items: cart.map(function (l) { return { id: l.id, color: l.color, size: l.size, qty: l.qty, price: byId(l.id).price }; }),
      totals: t, email: co.email,
      address: { first: co.first, last: co.last, address: co.address, apt: co.apt, city: co.city, region: co.region, zip: co.zip, country: co.country },
      ship: co.ship, last4: last4, note: store.get("note", "")
    };
    orders.push(order);
    store.set("orders", orders);
    cart = []; saveCart();
    code = ""; store.set("code", "");
    store.set("note", "");
    co.step = "information"; sess.set("co", co);
    location.hash = "#/order/" + number;
  }

  function orderPage(num) {
    var o = orders.filter(function (x) { return String(x.number) === String(num); })[0];
    if (!o) return notFound();
    var a = o.address, cc = COUNTRIES[a.country] || COUNTRIES.US;
    var m = SHIPPING.filter(function (x) { return x.id === o.ship; })[0] || SHIPPING[0];
    var eta = new Date(o.date);
    var days = { standard: 7, express: 4, overnight: 2 }[o.ship] || 7;
    eta.setDate(eta.getDate() + days);
    var t = o.totals;
    return '<div class="co"><div class="co__main"><div class="co__main-inner">' +
      '<a href="#/" class="logo co__logo">I <svg class="logo__heart" viewBox="0 0 32 29" aria-hidden="true"><path d="' + HEART + '"/></svg> JULIA</a>' +
      '<div class="thanks"><div class="thanks__check">✓</div><div><span class="muted">Order #' + o.number + "</span><h1>Thank you, " + esc(a.first) + "!</h1></div></div>" +
      '<div class="box"><h3>Your order is confirmed</h3><p style="margin:0">We\'ve received your order and it\'s headed to the print shop. A confirmation would be emailed to <b>' + esc(o.email) + "</b> in a live store.</p>" +
      '<div class="timeline"><div class="is-done">Confirmed</div><div>Printing</div><div>Shipped</div><div>Delivered</div></div>' +
      '<p class="muted" style="margin:10px 0 0;font-size:13px">Estimated delivery: <b>' + eta.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) + "</b></p></div>" +
      '<div class="box"><h3>Order details</h3><div class="box__grid">' +
      "<div><b>Contact information</b><br>" + esc(o.email) + "</div>" +
      "<div><b>Payment method</b><br>Card ending in " + esc(o.last4) + " · " + money(t.total) + ' <span class="muted">(test mode)</span></div>' +
      "<div><b>Shipping address</b><br>" + esc(a.first + " " + a.last) + "<br>" + esc(a.address) + (a.apt ? "<br>" + esc(a.apt) : "") + "<br>" + esc(a.city + ", " + a.region + " " + a.zip) + "<br>" + esc(cc[0]) + "</div>" +
      "<div><b>Shipping method</b><br>" + esc(m.name) + " (" + m.eta + ")</div>" +
      (o.note ? '<div style="grid-column:1/-1"><b>Gift note</b><br>“' + esc(o.note) + "”</div>" : "") +
      "</div></div>" +
      '<div class="co__nav"><a href="#/pages/contact">Need help? Contact us</a><a class="btn btn--red" href="#/collections/all">Continue shopping</a></div>' +
      '</div></div><aside class="co__side"><div class="co__side-inner">' +
      o.items.map(function (l) {
        var p = byId(l.id);
        if (!p) return "";
        return '<div class="co__line"><div class="co__thumb"><span class="qty-badge">' + l.qty + '</span><div class="art-wrap">' + garment(p, l.color, "front") + "</div></div><div><b>" + esc(p.title) + '</b><div class="muted">' + esc(COLORS[l.color].name) + " / " + esc(l.size) + "</div></div><span>" + money(l.price * l.qty) + "</span></div>";
      }).join("") +
      '<div style="border-top:1px solid var(--line);margin-top:14px;padding-top:10px">' +
      '<div class="summary__row"><span>Subtotal</span><span>' + money(t.sub) + "</span></div>" +
      (t.disc ? '<div class="summary__row"><span>Discount (' + esc(t.discount) + ')</span><span>−' + money(t.disc) + "</span></div>" : "") +
      '<div class="summary__row"><span>Shipping</span><span>' + (t.ship === 0 ? "Free" : money(t.ship)) + "</span></div>" +
      '<div class="summary__row"><span>Taxes</span><span>' + money(t.tax) + "</span></div>" +
      '<div class="summary__row summary__row--total"><span>Total</span><span>' + money(t.total) + "</span></div></div>" +
      "</div></aside></div>";
  }

  /* ================= Router ================= */

  var currentRoute = "";

  function parseHash() {
    var h = location.hash.replace(/^#\/?/, "");
    var qi = h.indexOf("?");
    var path = qi === -1 ? h : h.slice(0, qi);
    var params = {};
    if (qi !== -1) h.slice(qi + 1).split("&").forEach(function (kv) { var p = kv.split("="); if (p[0]) params[decodeURIComponent(p[0])] = decodeURIComponent((p[1] || "").replace(/\+/g, " ")); });
    return { parts: path.split("/").filter(Boolean), params: params };
  }

  var TITLES = { home: "I ♥ Julia — Official Shirt Shop" };

  function route() {
    var r = parseHash(), parts = r.parts, html, title;
    var name = parts[0] || "home";
    // In-page anchors like #reviews shouldn't re-route
    if (parts.length === 1 && !/^(collections|products|cart|checkout|order|pages|search|wishlist|account)$/.test(name) && name !== "home") {
      var el = document.getElementById(name);
      if (el) { el.scrollIntoView({ behavior: "smooth" }); return; }
    }
    pdp = null;
    if (stickyObs) { stickyObs.disconnect(); stickyObs = null; }
    switch (name) {
      case "home": html = homePage(); title = TITLES.home; break;
      case "collections": html = collectionPage(parts[1] || "all"); title = (COLLECTIONS[parts[1] || "all"] || {}).title; break;
      case "products": html = productPage(parts[1], r.params); title = (byId(parts[1]) || {}).title; break;
      case "cart": html = cartPage(); title = "Your cart"; break;
      case "checkout": html = checkoutPage(); title = "Checkout"; break;
      case "order": html = orderPage(parts[1]); title = "Order confirmed"; break;
      case "pages": html = contentPage(parts[1]); title = (PAGES[parts[1]] || [])[0]; break;
      case "search": html = searchPage(r.params); title = "Search"; break;
      case "wishlist": html = wishlistPage(); title = "Wishlist"; break;
      case "account": html = accountPage(); title = "Account"; break;
      default: html = notFound(); title = "Not found";
    }
    currentRoute = name;
    document.body.classList.toggle("is-checkout", name === "checkout" || name === "order");
    var main = $("#main");
    main.innerHTML = html;
    document.title = name === "home" ? TITLES.home : (title || "Not found") + " – I ♥ Julia";
    $$(".nav a").forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#/" + parts.join("/")); });
    closeSearch(); closeMenu(); closeModal();
    if ($("#cartDrawer").classList.contains("is-open")) closeCart();

    if (name === "collections" && COLLECTIONS[parts[1] || "all"]) renderCollGrid();
    if (pdp) { renderPdp(); setupSticky(); }
    if (name === "checkout" && cart.length) setupCheckout();
    window.scrollTo(0, 0);
    if (lastRouteWasNav) main.focus({ preventScroll: true });
    lastRouteWasNav = true;
  }
  var lastRouteWasNav = false;

  var stickyObs;
  function setupSticky() {
    if (stickyObs) stickyObs.disconnect();
    if (!("IntersectionObserver" in window)) return;
    var btn = $("#atcBtn"), bar = $("#stickyAtc"), sbtn = $("#stickyBtn");
    stickyObs = new IntersectionObserver(function (es) {
      var show = !es[0].isIntersecting && es[0].boundingClientRect.top < 0;
      bar.classList.toggle("is-on", show);
      bar.setAttribute("aria-hidden", !show);
      sbtn.tabIndex = show ? 0 : -1;
    });
    stickyObs.observe(btn);
  }

  function setupCheckout() {
    var form = $("#coForm");
    if (!form) return;
    if (form.card) {
      form.card.addEventListener("input", function () {
        var d = this.value.replace(/\D/g, "").slice(0, 19);
        this.value = d.replace(/(.{4})/g, "$1 ").trim();
      });
      form.exp.addEventListener("input", function (e) {
        var d = this.value.replace(/\D/g, "").slice(0, 4);
        if (e.inputType === "deleteContentBackward" && d.length <= 2) { this.value = d; return; }
        this.value = d.length >= 2 ? d.slice(0, 2) + " / " + d.slice(2) : d;
      });
      form.cvc.addEventListener("input", function () { this.value = this.value.replace(/\D/g, "").slice(0, 4); });
    }
    if (form.country) {
      form.country.addEventListener("change", function () {
        var fd = new FormData(form);
        ["email", "first", "last", "address", "apt", "city", "region", "zip", "phone"].forEach(function (k) { co[k] = (fd.get(k) || "").trim(); });
        co.country = this.value; sess.set("co", co); route();
        var c = $('select[name="country"]'); if (c) c.focus();
      });
    }
  }

  /* ================= Search bar ================= */

  function openSearch() {
    var b = $("#searchBar");
    b.hidden = false;
    $("#searchInput").focus();
    renderSearchResults();
  }
  function closeSearch() { $("#searchBar").hidden = true; }
  function renderSearchResults() {
    var q = $("#searchInput").value;
    var list = searchList(q);
    $("#searchResults").innerHTML = !q.trim() ? '<p class="muted" style="padding-bottom:14px;font-size:14px">Popular: <a href="#/search?q=hoodie">hoodie</a>, <a href="#/search?q=pink">pink</a>, <a href="#/search?q=kids">kids</a>, <a href="#/search?q=ringer">ringer</a></p>'
      : (list.slice(0, 5).map(function (p) {
        return '<a class="search-hit" href="#/products/' + p.id + '"><span class="search-hit__img">' + garment(p, p.colors[0], "front") + "</span><span><strong>" + esc(p.title) + '</strong><br><span class="muted">' + money(p.price) + "</span></span></a>";
      }).join("") || '<p class="muted" style="padding:12px 0">No products match “' + esc(q) + "”.</p>") +
        '<a class="searchbar__all" href="#/search?q=' + encodeURIComponent(q) + '">See all results for “' + esc(q) + "” →</a>";
  }

  /* ================= Menu / modal ================= */

  function openMenu() { $("#mobileNav").hidden = false; $("#menuBtn").setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden"; $("#mobileNav a").focus(); }
  function closeMenu() { if ($("#mobileNav").hidden) return; $("#mobileNav").hidden = true; $("#menuBtn").setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; }

  var quick = null;
  function openQuick(id, color) {
    var p = byId(id);
    if (!p) return;
    quick = { p: p, color: color && p.colors.indexOf(color) !== -1 ? color : p.colors[0], size: null };
    lastFocus = document.activeElement;
    if ($("#cartDrawer").classList.contains("is-open")) closeCart();
    renderQuick();
    $("#modal").hidden = false;
    document.body.style.overflow = "hidden";
    setTimeout(function () { var b = $(".modal__close"); if (b) b.focus(); }, 30);
  }
  function renderQuick() {
    var p = quick.p, c = COLORS[quick.color];
    if (quick.size && isSoldOut(p, quick.color, quick.size)) quick.size = null;
    $("#modalBox").innerHTML = '<button class="icon-btn modal__close" type="button" data-close-modal aria-label="Close">✕</button>' +
      '<div class="quick"><div class="quick__media">' + garment(p, quick.color, "front") + "</div>" +
      '<div class="quick__body"><h2 id="modalTitle">' + esc(p.title) + "</h2>" + priceHTML(p) +
      '<div class="opt"><div class="opt__label"><span>Color: <b>' + esc(c.name) + '</b></span></div><div class="swatches">' +
      p.colors.map(function (k) { return '<button type="button" class="swatch' + (k === quick.color ? " is-on" : "") + '" style="background:' + swatchBg(k) + '" data-q-color="' + k + '" aria-label="' + esc(COLORS[k].name) + '" aria-pressed="' + (k === quick.color) + '"></button>'; }).join("") + "</div></div>" +
      '<div class="opt"><div class="opt__label"><span>Size: <b>' + (quick.size || "Select a size") + '</b></span></div><div class="sizes">' +
      p.sizes.map(function (s) { var out = isSoldOut(p, quick.color, s); return '<button type="button" class="size' + (s === quick.size ? " is-on" : "") + '" data-q-size="' + s + '"' + (out ? " disabled" : "") + ">" + s + "</button>"; }).join("") + "</div></div>" +
      '<button class="btn btn--red btn--block" type="button" id="quickAdd"' + (quick.size ? "" : " disabled") + ">" + (quick.size ? "Add to cart · " + money(p.price) : "Select a size") + "</button>" +
      '<a href="#/products/' + p.id + "?color=" + quick.color + '" style="display:block;text-align:center;margin-top:14px;font-size:14px">View full details</a>' +
      "</div></div>";
  }
  function closeModal() {
    if ($("#modal").hidden) return;
    $("#modal").hidden = true; document.body.style.overflow = ""; quick = null;
    if (lastFocus && lastFocus.focus && document.contains(lastFocus)) lastFocus.focus();
  }

  /* ================= Events ================= */

  document.addEventListener("click", function (e) {
    var t = e.target;
    var el;
    if ((el = t.closest("[data-close-cart]"))) { closeCart(); return; }
    if ((el = t.closest("[data-wish]"))) { e.preventDefault(); toggleWish(el.getAttribute("data-wish")); return; }
    if ((el = t.closest("[data-quick]"))) { e.preventDefault(); openQuick(el.getAttribute("data-quick"), el.getAttribute("data-quick-color")); return; }
    if ((el = t.closest("[data-card-color]"))) {
      var card = el.closest("[data-card]"), p = byId(card.getAttribute("data-card"));
      var tmp = document.createElement("div");
      tmp.innerHTML = cardHTML(p, el.getAttribute("data-card-color"));
      card.replaceWith(tmp.firstChild);
      return;
    }
    if ((el = t.closest("[data-line-inc]"))) { var k = el.getAttribute("data-line-inc"); changeLine(k, lineQty(k) + 1); return; }
    if ((el = t.closest("[data-line-dec]"))) { var k2 = el.getAttribute("data-line-dec"); changeLine(k2, lineQty(k2) - 1); return; }
    if ((el = t.closest("[data-line-remove]"))) { changeLine(el.getAttribute("data-line-remove"), 0); toast("Removed from cart"); return; }
    if ((el = t.closest("[data-close-modal]")) || t === $("#modal")) { closeModal(); return; }
    if ((el = t.closest("[data-q-color]"))) { quick.color = el.getAttribute("data-q-color"); renderQuick(); return; }
    if ((el = t.closest("[data-q-size]"))) { quick.size = el.getAttribute("data-q-size"); renderQuick(); var qa = $("#quickAdd"); if (qa) qa.focus(); return; }
    if (t.closest("#quickAdd")) { var q = quick; closeModal(); addToCart(q.p.id, q.color, q.size, 1); return; }
    if ((el = t.closest("[data-close-menu]")) || t === $("#mobileNav")) { closeMenu(); return; }
    if ((el = t.closest("[data-scroll]"))) { e.preventDefault(); var target = document.getElementById(el.getAttribute("data-scroll")); if (target) target.scrollIntoView({ behavior: "smooth" }); return; }
    if ((el = t.closest("[data-express]"))) { toast("Express checkout isn't connected in this demo — use the form below"); return; }
    if ((el = t.closest("[data-co-step]"))) { co.step = el.getAttribute("data-co-step"); sess.set("co", co); route(); return; }
    if (t.closest("#coToggle")) {
      var b = $("#coSummaryBody"), tg = $("#coToggle"), open = b.hidden;
      b.hidden = !open; tg.setAttribute("aria-expanded", open);
      tg.firstChild.textContent = open ? "Hide order summary ▴" : "Show order summary ▾";
      return;
    }
    if (t.closest("#removeCode")) { code = ""; store.set("code", ""); route(); return; }
    if (t.closest("#clearFilters")) { collState.types = []; collState.colors = []; $$(".chip").forEach(function (c) { c.classList.remove("is-on"); c.setAttribute("aria-pressed", "false"); }); renderCollGrid(); return; }
    if ((el = t.closest("[data-filter-type],[data-filter-color]"))) {
      var isType = el.hasAttribute("data-filter-type");
      var val = el.getAttribute(isType ? "data-filter-type" : "data-filter-color");
      var arr = isType ? collState.types : collState.colors;
      var i = arr.indexOf(val);
      if (i === -1) arr.push(val); else arr.splice(i, 1);
      el.classList.toggle("is-on", i === -1);
      el.setAttribute("aria-pressed", i === -1);
      renderCollGrid();
      return;
    }
    // Product page
    if (pdp) {
      if ((el = t.closest("[data-color]"))) { pdp.color = el.getAttribute("data-color"); renderPdp(); return; }
      if ((el = t.closest("[data-size]"))) { pdp.size = el.getAttribute("data-size"); $("#sizeErr").hidden = true; renderPdp(); var sb = $('[data-size="' + pdp.size + '"]'); if (sb) sb.focus(); return; }
      if ((el = t.closest("[data-view]"))) { pdp.view = el.getAttribute("data-view"); renderPdp(); return; }
      if ((el = t.closest("[data-pdp-qty]"))) { pdp.qty = Math.max(1, Math.min(20, pdp.qty + +el.getAttribute("data-pdp-qty"))); $("#pdpQty").value = pdp.qty; return; }
      if (t.closest("#buyNow")) { pdpSubmit("buy"); return; }
      if (t.closest("#stickyBtn")) { pdpSubmit(); return; }
      if ((el = t.closest("#galleryMain"))) { el.classList.toggle("is-zoom"); return; }
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeCart(); closeModal(); closeMenu(); closeSearch(); }
    if ((e.key === "Enter" || e.key === " ") && e.target.id === "galleryMain") { e.preventDefault(); e.target.classList.toggle("is-zoom"); }
  });

  document.addEventListener("mousemove", function (e) {
    var g = e.target.closest && e.target.closest("#galleryMain.is-zoom");
    if (!g) return;
    var r = g.getBoundingClientRect();
    g.style.setProperty("--zx", ((e.clientX - r.left) / r.width * 100) + "%");
    g.style.setProperty("--zy", ((e.clientY - r.top) / r.height * 100) + "%");
  });

  function lineQty(k) { var l = cart.filter(function (x) { return x.key === k; })[0]; return l ? l.qty : 0; }

  document.addEventListener("change", function (e) {
    var t = e.target;
    if (t.matches("[data-line-qty]")) { changeLine(t.getAttribute("data-line-qty"), parseInt(t.value, 10) || 0); return; }
    if (t.id === "sort") { collState.sort = t.value; renderCollGrid(); return; }
    if (t.id === "pdpQty" && pdp) { pdp.qty = Math.max(1, Math.min(20, parseInt(t.value, 10) || 1)); t.value = pdp.qty; return; }
    if (t.id === "cartNote") { store.set("note", t.value.slice(0, 300)); return; }
    if (t.name === "ship") { co.ship = t.value; sess.set("co", co); $$(".radio").forEach(function (r) { r.classList.toggle("is-on", r.contains($('input[name="ship"]:checked'))); }); $(".co__side-inner").innerHTML = coSummary(); return; }
    if (t.name === "bill") {
      var f = $("#coForm"), saved = { card: f.card.value, exp: f.exp.value, cvc: f.cvc.value, nameOnCard: f.nameOnCard.value };
      var y = window.scrollY;
      co.billSame = t.value === "same"; sess.set("co", co); route();
      window.scrollTo(0, y);
      var nf = $("#coForm"); Object.keys(saved).forEach(function (k) { nf[k].value = saved[k]; });
      return;
    }
  });

  document.addEventListener("input", function (e) {
    if (e.target.id === "searchInput") renderSearchResults();
  });

  document.addEventListener("submit", function (e) {
    var f = e.target;
    e.preventDefault();
    if (f.id === "atcForm") { pdpSubmit(); return; }
    if (f.id === "coForm") { submitCheckout(f); return; }
    if (f.id === "searchBar") { var q = $("#searchInput").value.trim(); if (q) location.hash = "#/search?q=" + encodeURIComponent(q); return; }
    if (f.id === "searchPageForm") { location.hash = "#/search?q=" + encodeURIComponent($("#sq").value.trim()); return; }
    if (f.id === "cartDiscount") { if (applyCode($("#cartCode").value, $("#cartCodeErr"))) { route(); renderCart(); } return; }
    if (f.id === "coDiscount") {
      if (applyCode($("#coCode").value, $("#coCodeErr"))) { $(".co__side-inner").innerHTML = coSummary(); var b = $("#coSummaryBody"); b.hidden = false; }
      return;
    }
    if (f.id === "newsletterForm") { toast("You're in the Julia Club ♥ Use JULIA10 for 10% off"); f.reset(); return; }
    if (f.id === "contactForm") {
      if (!f.checkValidity()) { f.reportValidity(); return; }
      f.outerHTML = '<div class="box" style="max-width:520px"><h3>Message sent ♥</h3><p style="margin:0">Thanks, ' + esc(f.elements.name.value) + "! We'll reply to " + esc(f.elements.email.value) + " within one business day.</p></div>";
      return;
    }
    if (f.id === "reviewForm") {
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var id = pdp.p.id;
      (reviews[id] = reviews[id] || []).push({ rating: +f.elements.rating.value, name: f.elements.name.value.trim(), title: f.elements.title.value.trim(), body: f.elements.body.value.trim(), date: new Date().toISOString() });
      store.set("reviews", reviews);
      var sec = $("#reviews"), tmp = document.createElement("div");
      tmp.innerHTML = reviewsHTML(pdp.p);
      sec.replaceWith(tmp.firstChild);
      toast("Thanks for your review!");
      return;
    }
  });

  $("#cartBtn").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  $("#overlay").addEventListener("click", closeCart);
  $("#menuBtn").addEventListener("click", openMenu);
  $("#searchBtn").addEventListener("click", function () { $("#searchBar").hidden ? openSearch() : closeSearch(); });
  $("#searchClose").addEventListener("click", closeSearch);

  // Keep focus inside open dialogs
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;
    var box = !$("#modal").hidden ? $("#modalBox") : $("#cartDrawer").classList.contains("is-open") ? $("#cartDrawer") : !$("#mobileNav").hidden ? $(".mobile-nav__panel") : null;
    if (!box) return;
    var f = $$('a[href],button:not([disabled]),input,select,textarea', box).filter(function (x) { return x.offsetParent !== null; });
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });

  // Announcement rotator
  (function () {
    var ps = $$("#announce p"), i = 0;
    ps[0].classList.add("is-active");
    setInterval(function () { ps[i].classList.remove("is-active"); i = (i + 1) % ps.length; ps[i].classList.add("is-active"); }, 4000);
  })();

  // Sync across tabs
  window.addEventListener("storage", function (e) {
    if (e.key === "ihj:cart") { cart = store.get("cart", []); updateBadges(); renderCart(); }
  });

  $("#year").textContent = new Date().getFullYear();
  window.addEventListener("hashchange", route);
  updateBadges();
  renderCart();
  route();
})();
