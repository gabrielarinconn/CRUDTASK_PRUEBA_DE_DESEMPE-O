import { apiFetch } from "./api.js";

export const CoursesService = {
  list: () => apiFetch("/courses"),
  create: (payload) => apiFetch("/courses", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(payload)
  }),
  update: (id, payload) => apiFetch(`/courses/${id}`, {
    method:"PATCH",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(payload)
  }),
  remove: (id) => apiFetch(`/courses/${id}`, { method:"DELETE" })
};
