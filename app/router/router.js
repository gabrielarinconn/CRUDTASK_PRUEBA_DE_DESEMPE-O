import { routes } from "./routes.js";
import { canAccess } from "./guard.js";
import { shellView } from "../views/shell.view.js";
import { coursesView } from "../views/courses.view.js";


const app = document.getElementById("app");

function getRoute(){
  const hash = location.hash || "#/login";
  const path = hash.replace("#", "");
  return routes[path] ? path : "/home";
}

export async function startRouter(){
  window.addEventListener("hashchange", renderRoute);

  if(!location.hash) location.hash = "#/login";
  await renderRoute();
}

async function renderRoute(){
  const path = getRoute();
  const cfg = routes[path];
  const access = canAccess(cfg);

  if(!access.ok){
    location.hash = `#${access.redirect}`;
    return;
  }

  // Login no tiene shell
  if(!cfg.shell){
    await cfg.view(app);
    return;
  }

  // Shell fijo (sidebar + header) y adentro el contenido
  await shellView(app);
  await cfg.view(document.getElementById("page"));
}
