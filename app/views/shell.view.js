import { getUser, logout } from "../services/auth.js";

async function loadTemplate(path){
  const res = await fetch(path);
  return res.text();
}

export async function shellView(root){
  const menu = await loadTemplate("./templates/partials/menu.html");
  const header = await loadTemplate("./templates/partials/header.html");

  root.innerHTML = `
    <div class="layout">
      <aside class="sidebar">${menu}</aside>

      <main class="main">
        ${header}
        <div id="page"></div>
      </main>
    </div>

    <!-- MODAL GLOBAL -->
    <div class="modal-backdrop" id="modalBackdrop">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title" id="modalTitle">Modal</div>
          <button class="btn-ghost btn-small" id="modalClose">✕</button>
        </div>

        <div id="modalBody"></div>
        <div class="modal-actions" id="modalActions"></div>
      </div>
    </div>
  `;

  const user = getUser();

  // top-right pill
  document.getElementById("rolePill").textContent = `${user.role} • ${user.email}`;

  // sidebar profile
  document.getElementById("avatar").textContent = (user.name || "U")[0].toUpperCase();
  document.getElementById("userName").textContent = user.name || "User";
  document.getElementById("userRole").textContent = user.role;

  // Student: bloquear link Payment (aunque guard ya lo bloquea)
  if(user.role !== "ADMIN"){
    const pay = document.getElementById("payLink");
    if(pay){
      pay.innerHTML = `Payment <span class="lock">🔒</span>`;
      pay.addEventListener("click", (e)=> e.preventDefault());
    }
  }

  // logout
  const btnLogout = document.getElementById("btnLogout");
  if(btnLogout){
    btnLogout.addEventListener("click",(e)=>{
      e.preventDefault();
      logout();
      location.hash = "#/login";
    });
  }

  // activar menú actual
  setActive();

  // cerrar modal
  const modalClose = document.getElementById("modalClose");
  const modalBackdrop = document.getElementById("modalBackdrop");

  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", (e)=>{
    if(e.target.id === "modalBackdrop") closeModal();
  });
}

/** Marca el link activo del sidebar */
export function setActive(){
  const route = (location.hash || "#/home").replace("#","");
  document.querySelectorAll("#nav a[data-route]").forEach(a=>{
    a.classList.toggle("active", a.getAttribute("data-route") === route);
  });
}

/** Abre modal global */
export function openModal({ title, bodyHtml, actionsHtml, onMount }){
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalBody").innerHTML = bodyHtml;
  document.getElementById("modalActions").innerHTML = actionsHtml || "";
  document.getElementById("modalBackdrop").style.display = "flex";
  onMount?.();
}

/** Cierra modal global */
export function closeModal(){
  const el = document.getElementById("modalBackdrop");
  if(el) el.style.display = "none";
}
