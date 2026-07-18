import api from "../api/axios";

export async function registerUser(data: {
  fullName: string;
  email: string;
  password: string;
  countryCode: string;
  currencyCode: string;
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
