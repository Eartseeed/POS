function printCustomer(){

  const itemsDiv = document.getElementById("items");
  if(!itemsDiv || itemsDiv.innerHTML.trim() === ""){
    alert("ยังไม่มีรายการสินค้า");
    return;
  }

  // วันที่เวลา
  document.getElementById("printDate").innerText =
    new Date().toLocaleString();

  // คัดลอกรายการสินค้า
  document.getElementById("printItems").innerHTML =
    itemsDiv.innerHTML;

  // ราคารวม
  document.getElementById("printTotal").innerText =
    document.getElementById("total").innerText.replace("รวม:","");

  window.print();
}