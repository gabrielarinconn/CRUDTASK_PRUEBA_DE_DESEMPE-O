import { apiFetch } from "./api.js";

export const PaymentsService = {
  list: () => apiFetch("/payments"),

  create: (payload) => apiFetch("/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }),

  update: (id, payload) => apiFetch(`/payments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }),

  remove: (id) => apiFetch(`/payments/${id}`, { method: "DELETE" })
};