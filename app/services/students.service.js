import { apiFetch } from "./api.js";

export const StudentsService = {
  list: () => apiFetch("/students"),
  create: (payload) => apiFetch("/students", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(payload)
  }),
  update: (id, payload) => apiFetch(`/students/${id}`, {
    method:"PATCH",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(payload)
  }),
  remove: (id) => apiFetch(`/students/${id}`, { method:"DELETE" })
};

