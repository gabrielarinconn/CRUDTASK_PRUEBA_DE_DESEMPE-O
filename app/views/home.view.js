import { apiFetch } from "../services/api.js";
import { getUser } from "../services/auth.js";

async function loadTemplate(path){
  const res = await fetch(path);
  return res.text();
}

export async function homeView(root){
  root.innerHTML = await loadTemplate("./templates/pages/home.html");

  const [students, payments] = await Promise.all([
    apiFetch("/students"),
    apiFetch("/payments")
  ]);

  document.getElementById("kStudents").textContent = students.length;
  document.getElementById("kCourses").textContent = "2";
  document.getElementById("kPaid").textContent = "INR " + payments.reduce((a,p)=>a+(p.amountPaid||0),0).toLocaleString("en-IN");
  document.getElementById("kRole").textContent = getUser().role;
}
