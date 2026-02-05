/**********************
 MANAGE PRODUCT (KIP + STOCK + BARCODE SCAN)
**********************/

let products = JSON.parse(localStorage.getItem("products") || "[]");
const menuBox = document.getElementById("manageMenu");

/* =====================
   INIT DATA (รองรับของเก่า)
===================== */
products.forEach(p => {
  if (typeof p.stockIn !== "number") {
    p.stockIn = p.stock || 0;
    p.sold = p.sold || 0;
    delete p.stock;
  }
});
saveProducts();

/* =====================
   RENDER
===================== */
function renderManage(){
  menuBox.innerHTML = "";

  products.forEach((p, index)=>{
    const remain = p.stockIn - p.sold;

    const div = document.createElement("div");
    div.className = "manage-card";

    div.innerHTML = `
      <img src="${p.img}">

      <!-- NAME -->
      <input 
        value="${p.name}" 
        placeholder="ຊື່ສິນຄ້າ"
        onchange="updateField(${index}, 'name', this.value)">

      <!-- BARCODE (SCAN READY) -->
      <input 
        value="${p.barcode || ""}" 
        placeholder="📷 Scan Barcode"
        inputmode="numeric"
        autocomplete="off"
        onfocus="this.select()"
        oninput="this.value=this.value.replace(/[^0-9]/g,'')"
        onkeyup="barcodeEnter(event, ${index}, this.value)"
        onchange="updateBarcode(${index}, this.value)">

      <!-- CATEGORY (TEXT INPUT) -->
      <input 
        value="${p.category || ""}" 
        placeholder="📂 ໝວດສິນຄ້າ"
        onchange="updateField(${index}, 'category', this.value)">

      <!-- PRICE (KIP) -->
      <input 
        type="number" 
        value="${p.price}"
        placeholder="ລາຄາ (ກີບ)"
        onchange="updateField(${index}, 'price', this.value)">

      <!-- STOCK CONTROL -->
      <div class="stock-control">
        <button onclick="changeStock(${index}, -1)">➖</button>
        <b>${remain}</b>
        <button onclick="changeStock(${index}, 1)">➕</button>
      </div>

      <small>
        📦 Stock ເຂົ້າ: ${p.stockIn} |
        🔥 ຂາຍ: ${p.sold}
      </small>

      <button class="btn-delete" onclick="deleteProduct(${index})">
        🗑 ລົບສິນຄ້າ
      </button>
    `;
    menuBox.appendChild(div);
  });
}

renderManage();

/* =====================
   UPDATE FIELD
===================== */
function updateField(index, field, value){
  if(field === "price"){
    value = Number(value) || 0;
  }
  products[index][field] = value;
  saveProducts();
}

/* =====================
   STOCK + / -
===================== */
function changeStock(index, qty){
  const p = products[index];

  if(qty < 0 && (p.stockIn - p.sold) <= 0){
    alert("❌ Stock ໝົດແລ້ວ");
    return;
  }

  if(qty > 0){
    p.stockIn++;
  }else{
    p.sold++;
  }

  saveProducts();
  renderManage();
}

/* =====================
   BARCODE ENTER SUPPORT
===================== */
function barcodeEnter(e, index, value){
  if(e.key === "Enter"){
    updateBarcode(index, value);
  }
}

/* =====================
   UPDATE BARCODE (NO DUPLICATE)
===================== */
function updateBarcode(index, value){
  value = value.trim();
  if(!value) return;

  if(!/^[0-9]+$/.test(value)){
    alert("❗ Barcode ຕ້ອງເປັນຕົວເລກ");
    renderManage();
    return;
  }

  const duplicate = products.some((p,i)=>p.barcode === value && i !== index);
  if(duplicate){
    alert("❗ Barcode ນີ້ຖືກໃຊ້ແລ້ວ");
    renderManage();
    return;
  }

  products[index].barcode = value;
  saveProducts();
}

/* =====================
   DELETE
===================== */
function deleteProduct(index){
  if(!confirm("ລົບສິນຄ້ານີ້ ?")) return;
  products.splice(index,1);
  saveProducts();
  renderManage();
}

/* =====================
   SAVE
===================== */
function saveProducts(){
  localStorage.setItem("products", JSON.stringify(products));
}