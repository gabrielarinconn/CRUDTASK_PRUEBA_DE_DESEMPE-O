import { register } from "../services/auth.js";

async function loadTemplate(path) {
  const res = await fetch(path);
  return res.text();
}

export async function registerView(root) {
  root.innerHTML = await loadTemplate("./templates/pages/register.html");

  const err = document.getElementById("error");
  
  document.getElementById("btnRegister").addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !password) {
      err.textContent = "Please fill all fields.";
      return;
    }

    try {
      await register({ name, email, password });
      alert("Registration successful! Please login.");
      location.hash = "#/login";
    } catch (e) {
      err.textContent = e.message;
    }
  });
}