import { getUser } from "../services/auth.js";

async function loadTemplate(path){
  const res = await fetch(path);
  return res.text();
}

export async function settingsView(root){
  root.innerHTML = await loadTemplate("./templates/pages/settings.html");

  const user = getUser();

  const nameInput = document.getElementById("setName");
  const emailInput = document.getElementById("setEmail");
  const roleInput = document.getElementById("setRole");
  const err = document.getElementById("setErr");

  nameInput.value = user.name || "";
  emailInput.value = user.email || "";
  roleInput.value = user.role || "";

  const originalName = nameInput.value;

  document.getElementById("btnResetName").addEventListener("click", ()=>{
    err.textContent = "";
    nameInput.value = originalName;
  });

  document.getElementById("btnSaveSettings").addEventListener("click", ()=>{
    err.textContent = "";

    const newName = (nameInput.value || "").trim();
    if(newName.length < 2){
      err.textContent = "Name must be at least 2 characters.";
      return;
    }

    user.name = newName;
    localStorage.setItem("user", JSON.stringify(user));

    alert("Saved!");
  });
}
