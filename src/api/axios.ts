import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7074/api",
});

export default api;
