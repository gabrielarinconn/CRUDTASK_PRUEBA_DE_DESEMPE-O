import { CoursesService } from "../services/courses.service.js";
import { openModal, closeModal } from "./shell.view.js";

async function loadTemplate(path){
  const res = await fetch(path);
  return res.text();
}

export async function coursesView(root){
  root.innerHTML = await loadTemplate("./templates/pages/courses.html");

  // render inicial
  await renderCourses("");

  // search global del header (mismo input)
  const search = document.getElementById("searchBox");
  search.value = "";
  search.placeholder = "Search (courses)";
  search.addEventListener("input", async ()=>{
    await renderCourses(search.value.trim());
  });

  // add course
  document.getElementById("btnAddCourse").addEventListener("click", ()=>{
    openCourseModal(null);
  });
}

async function renderCourses(term=""){
  let courses = await CoursesService.list();

  if(term){
    const t = term.toLowerCase();
    courses = courses.filter(c =>
      [c.title, c.durationWeeks, c.fee]
        .some(v => String(v ?? "").toLowerCase().includes(t))
    );
  }

  const table = document.getElementById("coursesTable");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Title</th>
        <th>Duration (weeks)</th>
        <th>Fee</th>
        <th style="width:140px">Actions</th>
      </tr>
    </thead>
    <tbody>
      ${courses.map(c=>`
        <tr>
          <td>${c.title}</td>
          <td>${c.durationWeeks}</td>
          <td>INR ${Number(c.fee||0).toLocaleString("en-IN")}</td>
          <td style="display:flex;gap:8px">
            <button class="btn-ghost btn-small" data-edit="${c.id}">✏️</button>
            <button class="btn-danger btn-small" data-del="${c.id}">🗑</button>
          </td>
        </tr>
      `).join("")}
    </tbody>
  `;

  table.querySelectorAll("[data-edit]").forEach(btn=>{
    btn.addEventListener("click", ()=> openCourseModal(Number(btn.dataset.edit)));
  });

  table.querySelectorAll("[data-del]").forEach(btn=>{
    btn.addEventListener("click", ()=> confirmDelete(Number(btn.dataset.del)));
  });
}

function openCourseModal(id){
  const isEdit = Boolean(id);

  openModal({
    title: isEdit ? "Edit Course" : "Add Course",
    bodyHtml: `
      <div class="field"><label>Title</label><input id="cTitle" placeholder="Course name"></div>
      <div class="field"><label>Duration (weeks)</label><input id="cDur" type="number" min="1" placeholder="6"></div>
      <div class="field"><label>Fee (INR)</label><input id="cFee" type="number" min="0" placeholder="25000"></div>
      <div class="error" id="cErr"></div>
    `,
    actionsHtml: `
      <button class="btn-ghost" id="cCancel">Cancel</button>
      <button class="btn-primary" id="cSave">${isEdit ? "Update" : "Create"}</button>
    `,
    onMount: async ()=>{
      cCancel.addEventListener("click", closeModal);
      cSave.addEventListener("click", ()=> saveCourse(id));

      if(isEdit){
        const courses = await CoursesService.list();
        const course = courses.find(x=>x.id===id);
        if(course){
          cTitle.value = course.title;
          cDur.value = course.durationWeeks;
          cFee.value = course.fee;
        }
      }else{
        cDur.value = 4;
        cFee.value = 0;
      }
    }
  });
}

async function saveCourse(id){
  const err = document.getElementById("cErr");
  err.textContent = "";

  const title = cTitle.value.trim();
  const durationWeeks = Number(cDur.value);
  const fee = Number(cFee.value);

  // ✅ Validaciones
  if(title.length < 3) return err.textContent = "Title required (min 3 chars).";
  if(!Number.isFinite(durationWeeks) || durationWeeks < 1) return err.textContent = "Duration must be >= 1.";
  if(!Number.isFinite(fee) || fee < 0) return err.textContent = "Fee must be >= 0.";

  const payload = { title, durationWeeks, fee };

  if(id){
    await CoursesService.update(id, payload);
  }else{
    await CoursesService.create(payload);
  }

  closeModal();
  await renderCourses(document.getElementById("searchBox").value.trim());
}

function confirmDelete(id){
  openModal({
    title: "Delete Course",
    bodyHtml: `<div style="color:var(--muted);font-size:13px">Are you sure you want to delete this course?</div>`,
    actionsHtml: `
      <button class="btn-ghost" id="no">Cancel</button>
      <button class="btn-danger" id="yes">Delete</button>
    `,
    onMount: ()=>{
      no.addEventListener("click", closeModal);
      yes.addEventListener("click", async ()=>{
        await CoursesService.remove(id);
        closeModal();
        await renderCourses(document.getElementById("searchBox").value.trim());
      });
    }
  });
}
