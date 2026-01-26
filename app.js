/***********************
 POS APP.JS (NEW VERSION)
***********************/

let cart = {};
let totalTHB = 0;

/* =====================
  อัตราแลกเปลี่ยน
===================== */
const RATE_KIP = 680;   // 1 บาท ≈ 15,000 ກີບ

/* =====================
  โหลดเมนูจาก LocalStorage
===================== */
let products = JSON.parse(localStorage.getItem("products") || "[]");

/* ถ้ายังไม่มีเมนูเลย ให้ใส่ค่าเริ่มต้น */
if (products.length === 0) {
  products = [
    { name: "ข้าวผัด", price: 50, img: "food1.jpg" },
    { name: "น้ำ", price: 10, img: "food2.jpg" }
  ];
  localStorage.setItem("products", JSON.stringify(products));
}

/* =====================
  แสดงเมนูสินค้า
===================== */
function renderMenu() {
  const menu = document.getElementById("menu");
  if (!menu) return;

  menu.innerHTML = "";

  products.forEach((p) => {
    const kip = p.price * RATE_KIP;

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
      <div>${p.price.toLocaleString()} บาท</div>
      <div>${kip.toLocaleString()} ກີບ</div>
    `;

    menu.appendChild(div);
  });
}

/* =====================
  เพิ่มสินค้าใหม่ (อัปโหลดรูป)
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

    // clear input
    document.getElementById("pname").value = "";
    document.getElementById("pprice").value = "";
    document.getElementById("pimg").value = "";
  };

  reader.readAsDataURL(file);
}

/* =====================
  ตะกร้าสินค้า
===================== */
function change(name, price, qty) {
  if (!cart[name]) {
    cart[name] = { price, qty: 0 };
  }

  cart[name].qty += qty;

  if (cart[name].qty <= 0) {
    delete cart[name];
  }

  render();
}

/* =====================
  แสดงใบเสร็จ
===================== */
function render() {
  let html = '';
  totalTHB = 0;

  for (let name in cart) {
    const item = cart[name];
    const sum = item.qty * item.price;
    const kip = sum * RATE_KIP;

    totalTHB += sum;

    html += `
      ${name} x ${item.qty} = 
      ${sum.toLocaleString()} บาท 
      (${kip.toLocaleString()} ກີບ)<br>
    `;
  }

  const totalKIP = totalTHB * RATE_KIP;

  const itemsBox = document.getElementById("items");
  const totalBox = document.getElementById("total");
  const timeBox = document.getElementById("time");

  if (itemsBox) {
    itemsBox.innerHTML = html || "- ไม่มีรายการ -";
  }

  if (totalBox) {
    totalBox.innerHTML = `
      รวม: ${totalTHB.toLocaleString()} บาท<br>
      ≈ ${totalKIP.toLocaleString()} ກີບ
    `;
  }

  if (timeBox) {
    const now = new Date();
    timeBox.innerText =
      now.toLocaleDateString() + " " + now.toLocaleTimeString();
  }
}

/* =====================
  พิมพ์
===================== */
function printCustomer() {
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
render();