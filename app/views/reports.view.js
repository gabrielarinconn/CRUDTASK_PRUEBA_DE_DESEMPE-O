import { apiFetch } from "../services/api.js";
import { getUser } from "../services/auth.js";

async function loadTemplate(path){
  const res = await fetch(path);
  return res.text();
}

export async function reportsView(root){
  root.innerHTML = await loadTemplate("./templates/pages/reports.html");

  const user = getUser();

  const [students, courses, payments] = await Promise.all([
    apiFetch("/students"),
    apiFetch("/courses"),
    apiFetch("/payments")
  ]);

  const totalPaid = payments.reduce((a,p)=>a + (p.amountPaid || 0), 0);
  const totalBalance = payments.reduce((a,p)=>a + (p.balance || 0), 0);

  document.getElementById("reportBox").innerHTML = `
    <div class="cards">
      <div class="card">
        <div>
          <div class="label">Students</div>
          <div class="value">${students.length}</div>
        </div>🎓
      </div>

      <div class="card">
        <div>
          <div class="label">Courses</div>
          <div class="value">${courses.length}</div>
        </div>📘
      </div>

      <div class="card">
        <div>
          <div class="label">Total Paid</div>
          <div class="value">INR ${totalPaid.toLocaleString("en-IN")}</div>
        </div>💰
      </div>

      <div class="card">
        <div>
          <div class="label">Total Balance</div>
          <div class="value">INR ${totalBalance.toLocaleString("en-IN")}</div>
        </div>🧾
      </div>
    </div>

    <div style="margin-top:12px;color:var(--muted);font-size:13px">
      Logged as: <b>${user.role}</b>. Student can view report, but cannot open Payments page.
    </div>
  `;
}
