import { login } from "../services/auth.js";

async function loadTemplate(path){
  const res = await fetch(path);
  return res.text();
}

export async function loginView(root){
  root.innerHTML = await loadTemplate("./templates/pages/login.html");

  const err = document.getElementById("error");
  document.getElementById("btnLogin").addEventListener("click", async ()=>{
    err.textContent = "";
    const email = document.getElementById("email").value.trim();
    const pass  = document.getElementById("password").value.trim();

    if(!email || !pass){
      err.textContent = "All fields are required.";
      return;
    }

    const user = await login(email, pass);
    if(!user){
      err.textContent = "Invalid credentials.";
      return;
    }
    location.hash = "#/home";
  });

  // --- Redirección a Registro ---
  document.getElementById("btnRegister").addEventListener("click", () => {
    location.hash = "#/register";
  });
}
