import api from "../api/axios";


export interface RegisterDto {
  full_Name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterDto) => {
  const response = await api.post("/Auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginDto) => {
  const response = await api.post("/Auth/login", data);
  return response.data;
};
