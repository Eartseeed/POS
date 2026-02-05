/*******************************
 ⭐⭐⭐⭐⭐ POS APP.JS – PRO VERSION
 KIP ONLY + FULL STOCK
 BARCODE SCAN + SEARCH + CATEGORY
 CUSTOMER SCREEN + QR REALTIME
*******************************/

let cart = {};
let totalKIP = 0;

/* =====================
  LOAD CATEGORIES
===================== */
let categories = JSON.parse(localStorage.getItem("categories") || "[]");

if (categories.length === 0) {
  categories = ["ອາຫານ", "ເຄື່ອງດື່ມ", "ຂອງຫວານ"];
  localStorage.setItem("categories", JSON.stringify(categories));
}

/* =====================
  LOAD PRODUCTS
===================== */
let products = JSON.parse(localStorage.getItem("products") || "[]");

if (products.length === 0) {
  products = [
    {
      name: "ເຂົ້າຜັດ",
      barcode: "100001",
      price: 25000,
      img: "food1.jpg",
      category: "ອາຫານ",
      stockIn: 20,
      sold: 0
    },
    {
      name: "ນ້ຳ",
      barcode: "100002",
      price: 10000,
      img: "food2.jpg",
      category: "ເຄື່ອງດື່ມ",
      stockIn: 30,
      sold: 0
    }
  ];
  localStorage.setItem("products", JSON.stringify(products));
}

/* =====================
  FIX OLD SCHEMA
===================== */
products.forEach(p => {
  if (typeof p.stockIn !== "number") p.stockIn = p.stock || 0;
  if (typeof p.sold !== "number") p.sold = 0;
  delete p.stock;
});
localStorage.setItem("products", JSON.stringify(products));

/* =====================
  SOUND
===================== */
const beep = new Audio("beep.mp3");

/* =====================
  STOCK
===================== */
function getStockRemain(p) {
  return p.stockIn - p.sold;
}

/* =====================
  CATEGORY
===================== */
function renderCategoryDropdown() {
  const select = document.getElementById("categorySelect");
  if (!select) return;

  select.innerHTML = `<option value="all">📦 ທັງໝົດ</option>`;
  categories.forEach(c => {
    const o = document.createElement("option");
    o.value = c;
    o.textContent = c;
    select.appendChild(o);
  });
}

/* =====================
  FILTER
===================== */
function filterProducts() {
  const cat = document.getElementById("categorySelect")?.value || "all";
  const kw  = document.getElementById("searchInput")?.value.toLowerCase() || "";

  const list = products.filter(p => {
    const matchCat = cat === "all" || p.category === cat;
    const matchKey = (p.name + p.barcode).toLowerCase().includes(kw);
    return matchCat && matchKey;
  });

  renderMenu(list);
}

/* =====================
  MENU
===================== */
function renderMenu(list = products) {
  const menu = document.getElementById("menu");
  if (!menu) return;

  menu.innerHTML = "";

  list.forEach(p => {
    const qty = cart[p.name]?.qty || 0;
    const remain = getStockRemain(p);

    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div class="photo">
        <div class="badge ${qty ? "" : "hide"}">${qty}</div>
        <img src="${p.img}">
        <div class="controls">
          <button onclick="change('${p.name}',-1)">−</button>
          <button onclick="change('${p.name}',1)">+</button>
        </div>
      </div>
      <b>${p.name}</b>
      <div>${p.price.toLocaleString()} ກີບ</div>
      <small style="color:${remain<=5?'red':'green'}">
        📦 ${remain}
      </small>
    `;
    menu.appendChild(div);
  });
}

/* =====================
  ADD / REMOVE
===================== */
function change(name, qty) {
  const p = products.find(x => x.name === name);
  if (!p) return;

  if (qty > 0 && getStockRemain(p) <= 0) {
    alert("❌ Stock ໝົດ");
    return;
  }

  if (!cart[name]) {
    cart[name] = {
      name,
      price: p.price,
      category: p.category,
      qty: 0
    };
  }

  cart[name].qty += qty;
  if (cart[name].qty <= 0) delete cart[name];

  if (qty > 0) p.sold++;
  else p.sold = Math.max(p.sold - 1, 0);

  localStorage.setItem("products", JSON.stringify(products));

  renderReceipt();
  filterProducts();
}

/* =====================
  BARCODE SCAN
===================== */
let buffer = "";
let timer  = null;

document.addEventListener("keydown", e => {
  if (document.activeElement.tagName === "INPUT") return;

  if (timer) clearTimeout(timer);

  if (e.key === "Enter") {
    if (buffer.length > 2) scanBarcode(buffer);
    buffer = "";
    return;
  }

  if (/^[0-9]$/.test(e.key)) buffer += e.key;
  timer = setTimeout(() => buffer = "", 300);
});

function scanBarcode(code) {
  const p = products.find(x => x.barcode === code);
  if (!p) return alert("❌ ບໍ່ພົບ Barcode");

  beep.currentTime = 0;
  beep.play();
  change(p.name, 1);
}

/* =====================
  CUSTOMER SCREEN + QR
===================== */
function updateCustomerScreen() {
  localStorage.setItem("POS_CART", JSON.stringify(cart));
  localStorage.setItem("POS_TOTAL", totalKIP);

  // 👉 QR เปลี่ยนตามยอด
  localStorage.setItem(
    "POS_QR",
    `PAY:${totalKIP}`
  );
}

/* =====================
  RECEIPT
===================== */
function renderReceipt() {
  let html = "";
  totalKIP = 0;

  Object.values(cart).forEach(i => {
    const sum = i.qty * i.price;
    totalKIP += sum;
    html += `<div>${i.name} x${i.qty} = <b>${sum.toLocaleString()}</b></div>`;
  });

  document.getElementById("items").innerHTML = html || "-";
  document.getElementById("total").innerHTML =
    `ລວມ: <b>${totalKIP.toLocaleString()} ກີບ</b>`;
  document.getElementById("time").innerText =
    new Date().toLocaleString();

  // ⭐ ส่งไปจอลูกค้า
  updateCustomerScreen();
}

/* =====================
  INIT
===================== */
renderCategoryDropdown();
renderMenu();
renderReceipt();