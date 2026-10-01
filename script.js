/* ZOZO STORE - Vanilla JS: data, rendering, cart, search, navigation */

/* ---------- 1. Product data (images: replace files in /images to use real photos) ---------- */
const CAT = {
  trays: { title: 'الصواني', desc: 'تصاميم فاخرة تناسب زفافك', page: 'trays.html' },
  fingerprint: { title: 'البصمة', desc: 'خلي بصمتكم ذكرى تدوم', page: 'fingerprint.html' },
  hoops: { title: 'الطوق', desc: 'لمسة أنيقة ليوم مميز', page: 'hoops.html' }
};
const colors = { label: 'اللون', values: ['ذهبي', 'فضي', 'روز جولد'] };
const sizes = { label: 'المقاس', values: ['صغير', 'وسط', 'كبير'] };
const names = { label: 'الاسم المراد كتابته', values: ['بدون كتابة', 'اسم العروسين', 'اسم العروسين + التاريخ'] };
const P = [
  { id: 1, category: 'trays', name: 'صينية كريستال دائرية', price: 850, best: true, image: 'images/trays/tray1.jpg', description: 'صينية أنيقة مصممة خصيصاً لحفلات الخطوبة والزفاف، بتفاصيل كريستال لامعة وإطار ذهبي فاخر.', options: [colors, sizes] },
  { id: 2, category: 'trays', name: 'صينية الورد الملكية', price: 720, best: true, image: 'images/trays/tray2.jpg', description: 'صينية مزينة بورود صناعية فاخرة تناسب تقديم الشربات والحلويات.', options: [colors, sizes] },
  { id: 3, category: 'trays', name: 'صينية اللؤلؤ الذهبية', price: 940, image: 'images/trays/tray3.jpg', description: 'تصميم راقٍ بحواف من اللؤلؤ الطبيعي ولمسات ذهبية.', options: [colors, sizes] },
  { id: 4, category: 'trays', name: 'صينية الخطوبة البيضاء', price: 600, image: 'images/trays/tray4.jpg', description: 'صينية بيضاء ناعمة بتصميم بسيط وأنيق ليوم الخطوبة.', options: [sizes] },
  { id: 6, category: 'fingerprint', name: 'لوحة بصمة القلب', price: 450, best: true, image: 'images/fingerprint/fp1.jpg', description: 'لوحة بصمة على شكل قلب تجمع بصمتي العروسين مع الاسم والتاريخ.', options: [names, sizes] },
  { id: 7, category: 'fingerprint', name: 'إطار بصمة الزفاف', price: 520, image: 'images/fingerprint/fp2.jpg', description: 'إطار خشبي فاخر لبصمة الزفاف مع كتابة مخصصة.', options: [names, sizes] },
  { id: 8, category: 'fingerprint', name: 'بصمة شجرة العائلة', price: 650, image: 'images/fingerprint/fp3.jpg', description: 'شجرة بصمات تجمع العائلة في ذكرى واحدة جميلة.', options: [names, sizes] },
  { id: 10, category: 'hoops', name: 'طوق الورد الكلاسيك', price: 380, best: true, image: 'images/hoops/hoop1.jpg', description: 'طوق مزين بالورد لعرض الدبل بشكل أنيق يوم الخطوبة.', options: [colors] },
];

/* ---------- 2. Helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const byId = id => P.find(p => p.id === Number(id));
const money = n => n.toLocaleString('en') + ' EGP';
/* SVG placeholder used when a real image file is missing */
function ph(label) {
  const s = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e8cc"/><stop offset="1" stop-color="#d9b877"/></linearGradient></defs><rect width="500" height="500" fill="url(#g)"/><text x="250" y="260" font-size="90" text-anchor="middle">💍</text><text x="250" y="340" font-size="26" text-anchor="middle" fill="#7d6e5e" font-family="Tahoma">${label}</text></svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(s);
}
const imgTag = p => `<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src=ph('${p.name}')">`;
function toast(msg) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1800);
}

/* ---------- 3. Cart (localStorage) ---------- */
const getCart = () => { try { return JSON.parse(localStorage.getItem('zozoCart')) || []; } catch { return []; } };
const saveCart = c => { localStorage.setItem('zozoCart', JSON.stringify(c)); updateBadge(); };
function updateBadge() {
  const n = getCart().reduce((s, i) => s + i.qty, 0);
  const b = $('#badge'); if (b) b.textContent = n || '';
}
function addToCart(id, qty = 1, opt = null) {
  const p = byId(id);
  opt = opt || Object.fromEntries((p.options || []).map(o => [o.label, o.values[0]]));
  const cart = getCart(), key = id + JSON.stringify(opt);
  const ex = cart.find(i => i.key === key);
  ex ? ex.qty += qty : cart.push({ key, id, qty, opt });
  saveCart(cart); toast('تمت الإضافة إلى السلة 🛍');
}

/* ---------- 4. Shared layout: header & footer ---------- */
const ico = {
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
  bag: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8a3 3 0 016 0"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'
};
const svg = k => `<svg viewBox="0 0 24 24">${ico[k]}</svg>`;
function renderLayout() {
  const page = location.pathname.split('/').pop() || 'index.html';
  const links = [['index.html', 'الرئيسية'], ['trays.html', 'الصواني'], ['fingerprint.html', 'البصمة'], ['hoops.html', 'الطوق'], ['about.html', 'من نحن'], ['contact.html', 'تواصل معنا']];
  $('#hdr').outerHTML = `<header class="hdr"><div class="wrap hdr-in">
    <button class="ib burger" id="burger" aria-label="القائمة">${svg('menu')}</button>
    <a class="logo" href="index.html">ZOZO<br>STORE</a>
    <nav class="nav" id="nav">${links.map(l => `<a href="${l[0]}" class="${l[0] === page ? 'on' : ''}">${l[1]}</a>`).join('')}</nav>
    <div class="icons"><button class="ib" id="sBtn" aria-label="بحث">${svg('search')}</button>
      <a class="ib" href="cart.html" aria-label="السلة">${svg('bag')}<span id="badge"></span></a>
      <a class="ib" href="contact.html" aria-label="حسابي">${svg('user')}</a></div></div>
    <div class="sbar" id="sbar"><input id="q" type="search" placeholder="ابحثي عن منتج... مثال: كريستال"><div id="sres"></div></div></header>`;
  $('#ftr').outerHTML = `<footer class="ftr"><div class="wrap"><div class="ftr-g">
    <div><a class="logo" href="index.html">ZOZO<br>STORE</a><p>لمسات تجمع حب وتفاصيل تدوم</p>
      <div class="soc"><a href="https://wa.me/201012320764" target="_blank" rel="noopener" aria-label="WhatsApp">✆</a></div></div>
    <div><h4>روابط سريعة</h4>${links.map(l => `<a href="${l[0]}">${l[1]}</a>`).join('')}</div>
    <div><h4>معلومات</h4><a href="about.html#faq">الأسئلة الشائعة</a><a href="about.html#returns">سياسة الاسترجاع</a><a href="about.html#privacy">سياسة الخصوصية</a><a href="about.html#shipping">الشحن والتوصيل</a></div>
    <div><h4>تواصل</h4><p>01012320764</p><p>zs3574586@gmail.com</p></div></div>
    <p class="copy">© ${new Date().getFullYear()} ZOZO STORE. جميع الحقوق محفوظة</p></div></footer>`;
  updateBadge();
  // mobile menu
  $('#burger').onclick = () => $('#nav').classList.toggle('open');
  // search
  $('#sBtn').onclick = () => { $('#sbar').classList.toggle('open'); $('#q').focus(); };
  $('#q').oninput = e => {
    const v = e.target.value.trim(), box = $('#sres');
    if (!v) return box.innerHTML = '';
    const r = P.filter(p => p.name.includes(v)).slice(0, 8);
    box.innerHTML = r.length ? r.map(p => `<a href="product.html?id=${p.id}">${imgTag(p)}<span>${p.name} — <b class="price">${money(p.price)}</b></span></a>`).join('') : '<p class="empty">لا توجد نتائج</p>';
  };
}

/* ---------- 5. Product card templates ---------- */
/* "best" cards: image + name + price + view button ONLY (no heart, no cart) */
const bestCard = p => `<article class="card"><a class="im" href="product.html?id=${p.id}">${imgTag(p)}</a>
  <div class="bd"><h3>${p.name}</h3><div class="price">${money(p.price)}</div>
  <div class="acts"><a class="btn" href="product.html?id=${p.id}">عرض المنتج</a></div></div></article>`;
const shopCard = p => `<article class="card"><a class="im" href="product.html?id=${p.id}">${imgTag(p)}</a>
  <div class="bd"><h3>${p.name}</h3><div class="price">${money(p.price)}</div>
  <div class="acts"><a class="btn out" href="product.html?id=${p.id}">التفاصيل</a><button class="btn" data-add="${p.id}">أضف إلى السلة</button></div></div></article>`;

/* ---------- 6. Pages ---------- */
function pageHome() { $('#best').innerHTML = P.filter(p => p.best).map(bestCard).join(''); }

function pageCategory() {
  const c = CAT[document.body.dataset.cat];
  $('#main').innerHTML = `<div class="wrap"><div class="pg-head"><h1>${c.title}</h1><p>${c.desc}</p></div>
    <section class="sec"><div class="grid" id="list">${P.filter(p => p.category === document.body.dataset.cat).map(shopCard).join('')}</div></section></div>`;
}

function pageProduct() {
  const p = byId(new URLSearchParams(location.search).get('id'));
  if (!p) { $('#main').innerHTML = '<div class="empty wrap"><h2>المنتج غير موجود</h2><a class="btn" href="index.html">العودة للرئيسية</a></div>'; return; }
  document.title = p.name + ' | ZOZO STORE';
  const rel = P.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  $('#main').innerHTML = `<div class="wrap">
    <div class="crumb"><a href="${CAT[p.category].page}">→ ${CAT[p.category].title}</a></div>
    <div class="pd"><div class="pd-im">${imgTag(p)}</div><div>
      <h1>${p.name}</h1><div class="price">${money(p.price)}</div><p>${p.description}</p>
      ${(p.options || []).map((o, i) => `<div class="opt"><label>${o.label}</label><select data-opt="${o.label}">${o.values.map(v => `<option>${v}</option>`).join('')}</select></div>`).join('')}
      <div class="opt"><label>الكمية</label><div class="qty"><button id="plus">+</button><span id="qv">1</span><button id="minus">−</button></div></div>
      <div class="row"><button class="btn" id="addBtn">أضف إلى السلة</button><a class="btn out" href="cart.html">عرض السلة</a><button class="btn out" onclick="history.length>1?history.back():location.href='${CAT[p.category].page}'">رجوع</button></div>
    </div></div>
    <section class="sec"><h2 class="sec-t">منتجات مشابهة</h2><div class="grid">${rel.map(bestCard).join('')}</div></section></div>`;
  let q = 1;
  $('#plus').onclick = () => $('#qv').textContent = ++q;
  $('#minus').onclick = () => { if (q > 1) $('#qv').textContent = --q; };
  $('#addBtn').onclick = () => {
    const opt = {}; document.querySelectorAll('[data-opt]').forEach(s => opt[s.dataset.opt] = s.value);
    addToCart(p.id, q, opt);
  };
}

function pageCart() {
  const draw = () => {
    const cart = getCart();
    if (!cart.length) { $('#main').innerHTML = '<div class="wrap sec empty"><h2>سلتك فارغة 🛍</h2><br><a class="btn" href="index.html#categories">تسوقي الآن</a></div>'; return; }
    const total = cart.reduce((s, i) => s + byId(i.id).price * i.qty, 0);
    $('#main').innerHTML = `<div class="wrap sec"><h1 class="sec-t">سلة التسوق</h1>
      ${cart.map((i, k) => { const p = byId(i.id); return `<div class="ci">${imgTag(p)}
        <div><b>${p.name}</b><br><small>${Object.values(i.opt).join(' • ')}</small><br><span class="price">${money(p.price)}</span></div>
        <div class="qty"><button data-q="${k}" data-d="1">+</button><span>${i.qty}</span><button data-q="${k}" data-d="-1">−</button></div>
        <b>${money(p.price * i.qty)}</b><button class="rm" data-rm="${k}">حذف ✕</button></div>`; }).join('')}
      <div class="total">الإجمالي: <span class="price">${money(total)}</span></div>
      <div class="row"><button class="btn" id="checkout">إتمام الطلب</button><a class="btn out" href="index.html#categories">متابعة التسوق</a></div></div>`;
    $('#checkout').onclick = () => { localStorage.removeItem('zozoCart'); updateBadge(); toast('تم استلام طلبك، شكراً لكِ 🤍'); draw(); };
  };
  draw();
  $('#main').addEventListener('click', e => {
    const c = getCart(), t = e.target;
    if (t.dataset.rm !== undefined) c.splice(t.dataset.rm, 1);
    else if (t.dataset.q !== undefined) { c[t.dataset.q].qty = Math.max(1, c[t.dataset.q].qty + Number(t.dataset.d)); }
    else return;
    saveCart(c); draw();
  });
}

function pageContact() {
  $('#cform').onsubmit = e => { e.preventDefault(); $('#cmsg').hidden = false; e.target.reset(); };
}

/* ---------- 7. Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderLayout();
  const page = document.body.dataset.page;
  ({ home: pageHome, category: pageCategory, product: pageProduct, cart: pageCart, contact: pageContact }[page] || (() => {}))();
  // add-to-cart buttons on category pages
  document.addEventListener('click', e => { const b = e.target.closest('[data-add]'); if (b) addToCart(b.dataset.add); });
});
