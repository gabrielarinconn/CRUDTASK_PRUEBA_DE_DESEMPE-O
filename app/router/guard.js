import { getUser } from "../services/auth.js";

export function canAccess(routeConfig){
  const user = getUser();

  // no auth needed
  if(routeConfig.auth === false) {
    // si ya está logueado, no volver al login
    if(user) return { ok:false, redirect:"/home" };
    return { ok:true };
  }

  // auth required
  if(!user) return { ok:false, redirect:"/login" };

  // roles
  if(routeConfig.roles && !routeConfig.roles.map(r => r.toLowerCase()).includes(user.role.toLowerCase())){
      return { ok:false, redirect:"/home" };
  }

  return { ok:true };
}
