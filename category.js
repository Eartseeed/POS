let categories = JSON.parse(localStorage.getItem("categories") || "[]");

function renderCategory(){
  const box = document.getElementById("categoryList");
  box.innerHTML = "";

  categories.forEach((cat, index)=>{
    const div = document.createElement("div");
    div.style.marginBottom = "8px";
    div.innerHTML = `
      ${cat}
      <button onclick="removeCategory(${index})" style="margin-left:10px;">🗑 ลบ</button>
    `;
    box.appendChild(div);
  });
}

function addCategory(){
  const name = newCategory.value.trim();
  if(!name) return;

  categories.push(name);
  localStorage.setItem("categories", JSON.stringify(categories));
  newCategory.value = "";
  renderCategory();
}

function removeCategory(index){
  if(!confirm("ลบหมวดนี้?")) return;
  categories.splice(index,1);
  localStorage.setItem("categories", JSON.stringify(categories));
  renderCategory();
}

renderCategory();