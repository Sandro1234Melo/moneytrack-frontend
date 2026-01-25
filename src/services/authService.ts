import api from "../api/axios";

export async function registerUser(data: {
  full_Name: string;
  email: string;
  password: string;
  country_Code: string;
  currency_Code: string;
  language: string;
}) {
  const response = await api.post("/auth/register", data);
  return response.data;
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const response = await api.post("/auth/login", data);
  return response.data;
}
