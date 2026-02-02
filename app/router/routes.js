import { loginView } from "../views/login.view.js";
import { shellView } from "../views/shell.view.js";
import { homeView } from "../views/home.view.js";
import { studentsView } from "../views/students.view.js";
import { paymentsView } from "../views/payments.view.js";
import { coursesView } from "../views/courses.view.js";
import { reportsView } from "../views/reports.view.js";
import { settingsView } from "../views/settings.view.js";
import { registerView } from "../views/register.view.js"; 

export const routes = {
 "/login": { view: loginView, auth: false },
  "/register": { view: registerView, auth: false },
  "/home": { shell: true, view: homeView, auth: true },
  "/students": { shell: true, view: studentsView, auth: true },
  "/payments": { shell: true, view: paymentsView, auth: true, roles: ["ADMIN"] }, // ✅ solo admin
  "/courses": { shell: true, view: coursesView, auth: true },
  "/reports": { shell: true, view: reportsView, auth: true },
  "/settings": { shell: true, view: settingsView, auth: true }
};

