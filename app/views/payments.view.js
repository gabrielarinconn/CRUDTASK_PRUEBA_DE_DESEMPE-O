import { PaymentsService } from "../services/PaytmentsServices.js";
import { openModal, closeModal } from "./shell.view.js";

async function loadTemplate(path){
  const res = await fetch(path);
  return res.text();
}

export async function paymentsView(root){
  root.innerHTML = await loadTemplate("./templates/pages/payments.html");

  await renderPayments("");

  const search = document.getElementById("searchBox");
  search.value = "";
  search.placeholder = "Search (payments)";
  search.oninput = async () => {
    await renderPayments(search.value.trim());
  };

  document.getElementById("btnAddPayment").addEventListener("click", ()=>{
    openPaymentModal(null);
  });
}

async function renderPayments(term=""){
  let payments = await PaymentsService.list();

  if(term){
    const t = term.toLowerCase();
    payments = payments.filter(p =>
      [p.studentName, p.schedule, p.billNumber, p.amountPaid, p.balance, p.date, p.status]
        .some(v => String(v ?? "").toLowerCase().includes(t))
    );
  }

  const table = document.getElementById("paymentsTable");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Name</th>
        <th>Schedule</th>
        <th>Bill</th>
        <th>Paid</th>
        <th>Balance</th>
        <th>Date</th>
        <th>Status</th>
        <th>Priority</th>
        <th style="width:260px">Actions</th>
      </tr>
    </thead>
    <tbody>
      ${payments.map(p => `
        <tr>
          <td>${p.studentName}</td>
          <td>${p.schedule}</td>
          <td>${p.billNumber}</td>
          <td>INR ${Number(p.amountPaid||0).toLocaleString("en-IN")}</td>
          <td>INR ${Number(p.balance||0).toLocaleString("en-IN")}</td>
          <td>${p.date}</td>
          <td>
            <span class="badge ${p.status === "COMPLETED" ? "ok" : "wait"}">
              ${p.status === "COMPLETED" ? "COMPLETED" : "PENDING"}
            </span>
          </td>
          <td>
            <span class="badge ${p.status === "COMPLETED" ? "ok" : "wait"}">
              ${p.status === "COMPLETED" ? "COMPLETED" : "PENDING"}
            </span>
          </td>
          <td style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn-ghost btn-small" data-toggle="${p.id}">
              ${p.status === "COMPLETED" ? "⏳ Set PENDING" : "✅ Set COMPLETED"}
            </button>
            <button class="btn-ghost btn-small" data-edit="${p.id}">✏️ Edit</button>
            <button class="btn-danger btn-small" data-del="${p.id}">🗑 Delete</button>
          </td>
        </tr>
      `).join("")}
    </tbody>
  `;

  table.querySelectorAll("[data-toggle]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      const id = Number(btn.dataset.toggle);
      const list = await PaymentsService.list();
      const pay = list.find(x => x.id === id);
      if(!pay) return;

      const nextStatus = pay.status === "COMPLETED" ? "PENDING" : "COMPLETED";
      await PaymentsService.update(id, { status: nextStatus });

      await renderPayments(document.getElementById("searchBox").value.trim());
    });
  });

  table.querySelectorAll("[data-edit]").forEach(btn=>{
    btn.addEventListener("click", ()=> openPaymentModal(Number(btn.dataset.edit)));
  });

  table.querySelectorAll("[data-del]").forEach(btn=>{
    btn.addEventListener("click", ()=> confirmDelete(Number(btn.dataset.del)));
  });
}

function openPaymentModal(id){
  const isEdit = Boolean(id);

  openModal({
    title: isEdit ? "Edit Payment" : "Add Payment",
    bodyHtml: `
      <div class="field"><label>Student Name</label><input id="pName"></div>
      <div class="field"><label>Schedule</label><input id="pSchedule"></div>
      <div class="field"><label>Bill Number</label><input id="pBill"></div>
      <div class="field"><label>Amount Paid</label><input id="pPaid" type="number" min="0"></div>
      <div class="field"><label>Balance</label><input id="pBal" type="number" min="0"></div>
      <div class="field"><label>Date</label><input id="pDate" type="date"></div>
      <div class="field">
        <label>Status</label>
        <select id="pStatus">
          <option value="PENDING">PENDING</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
      </div>
      <div class="error" id="pErr"></div>
    `,
    actionsHtml: `
      <button class="btn-ghost" id="pCancel">Cancel</button>
      <button class="btn-primary" id="pSave">${isEdit ? "Update" : "Create"}</button>
    `,
    onMount: async ()=>{
      pCancel.addEventListener("click", closeModal);
      pSave.addEventListener("click", ()=> savePayment(id));

      if(isEdit){
        const payments = await PaymentsService.list();
        const pay = payments.find(x=>x.id===id);
        if(pay){
          pName.value = pay.studentName || "";
          pSchedule.value = pay.schedule || "";
          pBill.value = pay.billNumber || "";
          pPaid.value = pay.amountPaid ?? 0;
          pBal.value = pay.balance ?? 0;
          pDate.value = pay.date || "";
          pStatus.value = pay.status || "PENDING";
        }
      }else{
        pDate.value = new Date().toISOString().slice(0,10);
        pStatus.value = "PENDING";
      }
    }
  });
}

async function savePayment(id){
  const err = document.getElementById("pErr");
  err.textContent = "";

  const payload = {
    studentName: pName.value.trim(),
    schedule: pSchedule.value.trim(),
    billNumber: pBill.value.trim(),
    amountPaid: Number(pPaid.value),
    balance: Number(pBal.value),
    date: pDate.value,
    status: pStatus.value
  };

  if(payload.studentName.length < 2) return err.textContent = "Student name required.";
  if(!payload.date) return err.textContent = "Date is required.";

  if(id) await PaymentsService.update(id, payload);
  else await PaymentsService.create(payload);

  closeModal();
  await renderPayments(document.getElementById("searchBox").value.trim());
}

function confirmDelete(id){
  openModal({
    title: "Delete Payment",
    bodyHtml: `<div style="color:var(--muted);font-size:13px">Are you sure?</div>`,
    actionsHtml: `
      <button class="btn-ghost" id="no">Cancel</button>
      <button class="btn-danger" id="yes">Delete</button>
    `,
    onMount: ()=>{
      no.addEventListener("click", closeModal);
      yes.addEventListener("click", async ()=>{
        await PaymentsService.remove(id);
        closeModal();
        await renderPayments(document.getElementById("searchBox").value.trim());
      });
    }
  });
}
