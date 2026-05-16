import api from "../api/axios";

export const getExpensesByUser = (userId: number) =>
  api.get(`/expenses/user/${userId}`);

export const getExpenseById = (id: number) =>
  api.get(`/expenses/${id}`);

export const createExpense = (data: any) =>
  api.post("/expenses", data);

export const deleteExpense = (id: number) =>
  api.delete(`/expenses/${id}`);
