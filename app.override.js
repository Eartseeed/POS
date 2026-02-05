/* =========================
   SALE SAVE OVERRIDE (SAFE)
   ทำให้ report ใช้ได้ทันที
========================= */

function saveSale(){

  // 🔹 ใช้ key เดิมที่ report.html อ่าน
  let sales = JSON.parse(localStorage.getItem("sales") || "[]");

  sales.push({
    date: new Date().toISOString(), // ✅ report ใช้ date
    total: totalKIP,
    items: Object.values(cart).map(i => {
      const p = products.find(x => x.name === i.name) || {};
      return {
        name: i.name,
        qty: i.qty,
        price: i.price,
        category: p.category || "ອື່ນໆ"
      };
    })
  });

  localStorage.setItem("sales", JSON.stringify(sales));
}

/* =========================
   CLEAR BILL OVERRIDE
========================= */
function clearBill(){

  // ✅ บันทึกขายก่อนล้าง
  if(totalKIP > 0){
    saveSale();
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