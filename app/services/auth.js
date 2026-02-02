import { apiFetch } from "./api.js";

export function getUser(){
  return JSON.parse(localStorage.getItem("user"));
}

export async function login(email, password){
  const users = await apiFetch(`/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
  if(users.length === 0) return null;
  localStorage.setItem("user", JSON.stringify(users[0]));
  return users[0];
}

export function logout(){
  localStorage.removeItem("user");
}


export async function register(userData) {
  // Verificamos si el usuario ya existe
  const existing = await apiFetch(`/users?email=${encodeURIComponent(userData.email)}`);
  if (existing.length > 0) throw new Error("User already exists");

  // Si no existe, lo guardamos (POST)
  return await apiFetch("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...userData,
      role: "STUDENT" // Rol por defecto
    })
  });
}