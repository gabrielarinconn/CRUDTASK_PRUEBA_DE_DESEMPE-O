import { StudentsService } from "../services/students.service.js";
import { openModal, closeModal } from "./shell.view.js";

async function loadTemplate(path){
  const res = await fetch(path);
  return res.text();
}

export async function studentsView(root){
  root.innerHTML = await loadTemplate("./templates/pages/students.html");

  // render inicial
  await renderStudents("");

  // buscar
  const search = document.getElementById("searchBox");
  search.value = "";
  search.addEventListener("input", async ()=>{
    await renderStudents(search.value.trim());
  });

  // add
  document.getElementById("btnAddStudent").addEventListener("click", ()=>{
    openStudentModal(null);
  });
}

async function renderStudents(term=""){
  let students = await StudentsService.list();

  if(term){
    const t = term.toLowerCase();
    students = students.filter(s =>
      [s.name,s.email,s.phone,s.enrollNumber,s.admissionDate]
        .some(v => String(v||"").toLowerCase().includes(t))
    );
  }

  const table = document.getElementById("studentsTable");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Name</th><th>Email</th><th>Phone</th><th>Enroll</th><th>Date</th><th style="width:140px">Actions</th>
      </tr>
    </thead>
    <tbody>
      ${students.map(s=>`
        <tr>
          <td>${s.name}</td>
          <td>${s.email}</td>
          <td>${s.phone}</td>
          <td>${s.enrollNumber}</td>
          <td>${s.admissionDate}</td>
          <td style="display:flex;gap:8px">
            <button class="btn-ghost btn-small" data-edit="${s.id}">✏️</button>
            <button class="btn-danger btn-small" data-del="${s.id}">🗑</button>
          </td>
        </tr>
      `).join("")}
    </tbody>
  `;

  table.querySelectorAll("[data-edit]").forEach(btn=>{
    btn.addEventListener("click", ()=> openStudentModal(Number(btn.dataset.edit)));
  });

  table.querySelectorAll("[data-del]").forEach(btn=>{
    btn.addEventListener("click", ()=> confirmDelete(Number(btn.dataset.del)));
  });
}

function openStudentModal(id){
  const isEdit = Boolean(id);

  openModal({
    title: isEdit ? "Edit Student" : "Add Student",
    bodyHtml: `
      <div class="field"><label>Name</label><input id="stName" placeholder="Name"></div>
      <div class="field"><label>Email</label><input id="stEmail" placeholder="email@gmail.com"></div>
      <div class="field"><label>Phone (10 digits)</label><input id="stPhone" placeholder="7305477760"></div>
      <div class="field"><label>Enroll</label><input id="stEnroll" placeholder="123456..."></div>
      <div class="field"><label>Date</label><input id="stDate" type="date"></div>
      <div class="error" id="stErr"></div>
    `,
    actionsHtml: `
      <button class="btn-ghost" id="stCancel">Cancel</button>
      <button class="btn-primary" id="stSave">${isEdit ? "Update" : "Create"}</button>
    `,
    onMount: async ()=>{
      document.getElementById("stCancel").addEventListener("click", closeModal);
      document.getElementById("stSave").addEventListener("click", ()=> saveStudent(id));

      if(isEdit){
        // json-server soporta GET /students/:id
        const s = (await StudentsService.list()).find(x=>x.id===id);
        if(s){
          stName.value = s.name;
          stEmail.value = s.email;
          stPhone.value = s.phone;
          stEnroll.value = s.enrollNumber;
          stDate.value = s.admissionDate;
        }
      }else{
        stDate.value = new Date().toISOString().slice(0,10);
      }
    }
  });
}

async function saveStudent(id){
  const err = document.getElementById("stErr");
  err.textContent = "";

  const name = stName.value.trim();
  const email = stEmail.value.trim();
  const phone = stPhone.value.trim();
  const enroll = stEnroll.value.trim();
  const date = stDate.value;

  // ✅ Validaciones
  if(name.length < 2) return err.textContent = "Name required (min 2).";
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err.textContent = "Valid email required.";
  if(!/^\d{10}$/.test(phone)) return err.textContent = "Phone must be 10 digits.";
  if(enroll.length < 6) return err.textContent = "Enroll required (min 6).";
  if(!date) return err.textContent = "Date required.";

  const payload = { name, email, phone, enrollNumber: enroll, admissionDate: date };

  if(id){
    await StudentsService.update(id, payload);
  }else{
    await StudentsService.create(payload);
  }

  closeModal();
  await renderStudents(document.getElementById("searchBox").value.trim());
}

function confirmDelete(id){
  openModal({
    title: "Delete Student",
    bodyHtml: `<div style="color:var(--muted);font-size:13px">Are you sure you want to delete this student?</div>`,
    actionsHtml: `
      <button class="btn-ghost" id="no">Cancel</button>
      <button class="btn-danger" id="yes">Delete</button>
    `,
    onMount: ()=>{
      no.addEventListener("click", closeModal);
      yes.addEventListener("click", async ()=>{
        await StudentsService.remove(id);
        closeModal();
        await renderStudents(document.getElementById("searchBox").value.trim());
      });
    }
  });
}
