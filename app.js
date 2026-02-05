/*******************************
 ⭐⭐⭐⭐⭐ POS APP.JS – PRO VERSION
 KIP ONLY + FULL STOCK (CORRECT FLOW)
*******************************/

let cart = {};
let totalKIP = 0;

/* =====================
  FORMAT KIP
===================== */
function formatKIP(n){
  return Number(n || 0).toLocaleString("en-US");
}

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
products.forEach(p=>{
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
  STOCK (DISPLAY ONLY)
===================== */
function getStockRemain(p){
  const inCart = cart[p.name]?.qty || 0;
  return p.stockIn - p.sold - inCart;
}

/* =====================
  CATEGORY
===================== */
function renderCategoryDropdown(){
  const select = document.getElementById("categorySelect");
  if(!select) return;

  select.innerHTML = `<option value="all">📦 ທັງໝົດ</option>`;
  categories.forEach(c=>{
    const o = document.createElement("option");
    o.value = c;
    o.textContent = c;
    select.appendChild(o);
  });
}

/* =====================
  FILTER
===================== */
function filterProducts(){
  const cat = document.getElementById("categorySelect")?.value || "all";
  const kw  = document.getElementById("searchInput")?.value.toLowerCase() || "";

  renderMenu(
    products.filter(p =>
      (cat === "all" || p.category === cat) &&
      (p.name + p.barcode).toLowerCase().includes(kw)
    )
  );
}

/* =====================
  MENU
===================== */
function renderMenu(list = products){
  const menu = document.getElementById("menu");
  if(!menu) return;

  menu.innerHTML = "";

  list.forEach(p=>{
    const qty = cart[p.name]?.qty || 0;
    const remain = getStockRemain(p);

    menu.innerHTML += `
      <div class="item">
        <div class="photo">
          <div class="badge ${qty ? "" : "hide"}">${qty}</div>
          <img src="${p.img}">
          <div class="controls">
            <button class="minus" onclick="change('${p.name}',-1)">−</button>
            <button class="plus" onclick="change('${p.name}',1)">+</button>
          </div>
        </div>

        <b>${p.name}</b>
        <div class="menu-barcode">🧾 ${p.barcode}</div>
        <div class="menu-price">${formatKIP(p.price)} ກີບ</div>

        <small style="color:${remain<=5?'red':'green'}">
          📦 ${remain}
        </small>
      </div>
    `;
  });
}

/* =====================
  ADD / REMOVE (CORRECT LOGIC)
===================== */
function change(name, qty){
  const p = products.find(x=>x.name===name);
  if(!p) return;

  if(!cart[name]){
    cart[name] = { name, price:p.price, qty:0 };
  }

  // ❌ ห้ามเพิ่ม ถ้า stock ไม่พอ (ดู stock จริง - sold - ในบิล)
  if(qty > 0 && getStockRemain(p) <= 0){
    alert("❌ Stock ໝົດ");
    return;
  }

  cart[name].qty += qty;

  if(cart[name].qty <= 0){
    delete cart[name];
  }

  renderReceipt();
  filterProducts();
}

/* =====================
  BARCODE SCAN
===================== */
let buffer = "";
let timer = null;

document.addEventListener("keydown", e=>{
  if(document.activeElement.tagName === "INPUT") return;

  if(timer) clearTimeout(timer);

  if(e.key === "Enter"){
    if(buffer.length > 2) scanBarcode(buffer);
    buffer = "";
    return;
  }

  if(/^[0-9]$/.test(e.key)) buffer += e.key;
  timer = setTimeout(()=>buffer="",300);
});

function scanBarcode(code){
  const p = products.find(x=>x.barcode===code);
  if(!p) return alert("❌ ບໍ່ພົບ Barcode");

  beep.currentTime = 0;
  beep.play();
  change(p.name,1);
}

/* =====================
  QR PAY
===================== */
function updateCustomerScreen(){
  localStorage.setItem("POS_CART", JSON.stringify(cart));
  localStorage.setItem("POS_TOTAL", totalKIP);
  localStorage.setItem("POS_QR", `PAY|AMOUNT=${totalKIP}|CURRENCY=KIP`);
}

/* =====================
  SAVE SALE (REPORT)
===================== */
function saveSale(){
  let sales = JSON.parse(localStorage.getItem("POS_SALES") || "[]");

  sales.push({
    time: new Date().toISOString(),
    items: Object.values(cart),
    total: totalKIP
  });

  localStorage.setItem("POS_SALES", JSON.stringify(sales));
}

/* =====================
  RECEIPT
===================== */
function renderReceipt(){
  let html = "";
  totalKIP = 0;

  Object.values(cart).forEach(i=>{
    const sum = i.qty * i.price;
    totalKIP += sum;
    html += `<div>${i.name} x${i.qty} = <b>${formatKIP(sum)}</b></div>`;
  });

  document.getElementById("items").innerHTML = html || "-";
  document.getElementById("total").innerHTML =
    `ລວມ: <b>${formatKIP(totalKIP)} ກີບ</b>`;
  document.getElementById("time").innerText =
    new Date().toLocaleString();

  updateCustomerScreen();
}

/* =====================
  CLEAR BILL (CUT REAL STOCK)
===================== */
function clearBill(){

  if(totalKIP > 0){

    saveSale();

    Object.values(cart).forEach(i=>{
      const p = products.find(x=>x.name===i.name);
      if(p){
        p.sold += i.qty;
      }
    });

    localStorage.setItem("products", JSON.stringify(products));
  }

  cart = {};
  totalKIP = 0;

  document.getElementById("items").innerHTML = "-";
  document.getElementById("total").innerHTML = "ລວມ: 0 ກີບ";
  document.getElementById("time").innerText = "";

  localStorage.removeItem("POS_CART");
  localStorage.removeItem("POS_TOTAL");
  localStorage.removeItem("POS_QR");

  filterProducts();
}

/* =====================
  INIT
===================== */
renderCategoryDropdown();
renderMenu();
renderReceipt();