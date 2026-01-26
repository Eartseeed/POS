/***********************
 POS APP.JS (STABLE VERSION)
***********************/

let cart = {};
let totalTHB = 0;

/* =====================
  อัตราแลกเปลี่ยน
===================== */
const RATE_KIP = 680;   // ✅ 1 บาท = 680 กีบ (ปรับได้)

/* =====================
  โหลดเมนูจาก LocalStorage
===================== */
let products = JSON.parse(localStorage.getItem("products") || "[]");

/* ถ้ายังไม่มีเมนู ให้สร้างตัวอย่าง */
if (products.length === 0) {
  products = [
    { name: "ข้าวผัด", price: 50, img: "food1.jpg" },
    { name: "น้ำ", price: 20, img: "food2.jpg" }
  ];
  localStorage.setItem("products", JSON.stringify(products));
}

/* =====================
  ฟังก์ชันแปลงเงินบาท → กีบ
===================== */
function toKip(thb){
  return Math.round(thb * RATE_KIP);
}

/* =====================
  แสดงเมนูสินค้า
===================== */
function renderMenu() {
  const menu = document.getElementById("menu");
  if (!menu) return;

  menu.innerHTML = "";

  products.forEach((p) => {
    const kip = toKip(p.price);

    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <div class="photo">
        <img src="${p.img}">
        <div class="controls">
          <button class="minus" onclick="change('${p.name}', ${p.price}, -1)">−</button>
          <button class="plus" onclick="change('${p.name}', ${p.price}, 1)">+</button>
        </div>
      </div>

      <b>${p.name}</b>
      <div class="price">${p.price.toLocaleString()} บาท</div>
      <div class="kip">${kip.toLocaleString()} ກີບ</div>
    `;

    menu.appendChild(div);
  });
}

/* =====================
  เพิ่มสินค้าใหม่ (รองรับอัปโหลดรูป)
===================== */
function addProduct() {
  const name = document.getElementById("pname").value.trim();
  const price = parseFloat(document.getElementById("pprice").value);
  const file = document.getElementById("pimg").files[0];

  if (!name || !price || !file) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    const imgBase64 = e.target.result;

    products.push({
      name,
      price,
      img: imgBase64
    });

    localStorage.setItem("products", JSON.stringify(products));
    renderMenu();

    document.getElementById("pname").value = "";
    document.getElementById("pprice").value = "";
    document.getElementById("pimg").value = "";
  };

  reader.readAsDataURL(file);
}

/* =====================
  จัดการตะกร้าสินค้า
===================== */
function change(name, price, qty) {
  if (!cart[name]) {
    cart[name] = { price, qty: 0 };
  }

  cart[name].qty += qty;

  if (cart[name].qty <= 0) {
    delete cart[name];
  }

  renderReceipt();
}

/* =====================
  แสดงใบเสร็จ
===================== */
function renderReceipt() {
  let html = '';
  totalTHB = 0;

  for (let name in cart) {
    const item = cart[name];
    const sum = item.qty * item.price;
    const kip = toKip(sum);

    totalTHB += sum;

    html += `
      <div>
        ${name} x ${item.qty}
        = ${sum.toLocaleString()} บาท
        <br>
        <small style="color:#64748b;">
          ≈ ${kip.toLocaleString()} ກີບ
        </small>
      </div>
    `;
  }

  const totalKIP = toKip(totalTHB);

  const itemsBox = document.getElementById("items");
  const totalBox = document.getElementById("total");
  const timeBox  = document.getElementById("time");

  if (itemsBox) {
    itemsBox.innerHTML = html || "- ไม่มีรายการ -";
  }

  if (totalBox) {
    totalBox.innerHTML = `
      รวม: <b>${totalTHB.toLocaleString()} บาท</b><br>
      ≈ <b>${totalKIP.toLocaleString()} ກີບ</b>
    `;
  }

  if (timeBox) {
    const now = new Date();
    timeBox.innerText =
      now.toLocaleDateString() + " " + now.toLocaleTimeString();
  }
}

/* =====================
  บันทึกยอดขาย
===================== */
function saveSale(){
  if(totalTHB <= 0) return;

  const sales = JSON.parse(localStorage.getItem("sales") || "[]");

  sales.push({
    date: new Date().toISOString(),
    total: totalTHB
  });

  localStorage.setItem("sales", JSON.stringify(sales));
}

/* =====================
  พิมพ์
===================== */
function printCustomer() {
  saveSale();
  window.print();
}

function printKitchen() {
  const totalBox = document.getElementById("total");
  if (totalBox) totalBox.style.display = "none";

  window.print();

  if (totalBox) totalBox.style.display = "block";
}

/* =====================
  เริ่มต้นระบบ
===================== */
renderMenu();
renderReceipt();