let products = JSON.parse(localStorage.getItem("products") || "[]");

function renderList() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  products.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <img src="${p.img}" style="height:120px; object-fit:contain"><br>

      <input value="${p.name}" onchange="updateName(${index}, this.value)"><br>
      <input type="number" value="${p.price}" onchange="updatePrice(${index}, this.value)"><br>

      <input type="file" accept="image/*" onchange="updateImage(${index}, this)"><br>

      <button onclick="removeProduct(${index})" class="danger">🗑 ลบ</button>
    `;

    list.appendChild(div);
  });
}

function updateName(i, val) {
  products[i].name = val;
  save();
}

function updatePrice(i, val) {
  products[i].price = Number(val);
  save();
}

/* ⭐ เปลี่ยนรูป */
function updateImage(i, input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    products[i].img = e.target.result;
    save();
    renderList();
  };
  reader.readAsDataURL(file);
}

function removeProduct(i) {
  if (!confirm("ต้องการลบเมนูนี้ใช่หรือไม่?")) return;
  products.splice(i, 1);
  save();
  renderList();
}

function save() {
  localStorage.setItem("products", JSON.stringify(products));
}

function goBack() {
  location.href = "index.html";
}

renderList();