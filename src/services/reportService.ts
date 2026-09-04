import api from "../api/axios";

export const getMonthlyExpenses = (userId: number, from?: string, to?: string) =>
  api.get("/reports/monthly-expenses", {
    params: { userId, from, to }
  });

export const getCategoryDistribution = (
  userId: number,
  from?: string,
  to?: string
) =>
  api.get("/reports/category-distribution", {
    params: { userId, from, to }
  });

export const getPaymentMethods = (userId: number) =>
  api.get("/reports/payment-methods", {
    params: { userId }
  });
