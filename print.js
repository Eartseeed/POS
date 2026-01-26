function printCustomer(){

  const items = document.getElementById("items");
  if(!items || items.innerHTML.trim() === ""){
    alert("ยังไม่มีรายการสินค้า");
    return;
  }

  // วันที่
  document.getElementById("printDate").innerText =
    new Date().toLocaleString();

  // คัดลอกสินค้า
  document.getElementById("printItems").innerHTML =
    items.innerHTML;

  // รวมเงิน
  const totalText = document.getElementById("total").innerText;
  document.getElementById("printTotal").innerText = totalText;

  console.log("READY TO PRINT");   // ✅ ใช้เช็คว่าโค้ดทำงานไหม

  window.print();
}
