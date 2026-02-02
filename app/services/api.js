export const API = "http://localhost:3001";
// nuestra api sirve como un puente de informacion entre mi json y mi codigo
export async function apiFetch(path, options){ // el optiomn lo que hace es decirle al servidor el que voy a hacer al llamar con feth, no solo leer, tambien eliminar o escribir 
  const res = await fetch(API + path, options);
  if(!res.ok) throw new Error("API error");
  if(res.status === 204) return null;
  return res.json();
}
