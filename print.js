/* =========================
   PRINT OVERRIDE (SAFE)
   เขียนทับแบบไม่พังระบบ
========================= */

function printCustomer(){

  const itemsEl = document.getElementById("items");
  const printItemsEl = document.getElementById("printItems");

  if(!itemsEl || !cart || Object.keys(cart).length === 0){
    alert("❌ ຍັງບໍ່ມີລາຍການສິນຄ້າ");
    return;
  }

  /* วันที่ / เวลา */
  const printDate = document.getElementById("printDate");
  if(printDate){
    printDate.innerText = new Date().toLocaleString();
  }

  /* =========================
     BUILD PRINT ITEMS (FIX)
     ชื่อ | = | ราคา (ฟิก)
  ========================= */
  let html = "";

  Object.values(cart).forEach(i => {
    const name = `${i.name} x${i.qty}`;
    const price = (i.qty * i.price).toLocaleString();

    html += `
      <div class="print-item">
        <span class="item-name">${name}</span>
        <span class="item-eq">=</span>
        <span class="item-price">${price}</span>
      </div>
    `;
  });

  printItemsEl.innerHTML = html;

  /* รวมเงิน */
  const printTotal = document.getElementById("printTotal");
  if(printTotal){
    printTotal.innerText = totalKIP.toLocaleString();
  }

  console.log("✅ PRINT READY (FIX ALIGN)");

  window.print();
}

/* =========================
   PRINT + CLEAR (SAFE)
========================= */
function printAndClear(){

  if(!cart || Object.keys(cart).length === 0){
    alert("❌ ບໍ່ມີສິນຄ້າໃນບິນ");
    return;
  }

  // พิมพ์ก่อน
  printCustomer();

  // เคลียร์หลังพิมพ์ (กันข้อมูลหาย)
  setTimeout(() => {
    clearBill();
  }, 800);
}