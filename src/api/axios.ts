import axios from "axios";

const rawBaseUrl =
  import.meta.env.VITE_API_URL || "https://moneytrack-api-7ajy.onrender.com";

const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "");

const api = axios.create({
  baseURL: `${normalizedBaseUrl}/api`,
});

api.interceptors.request.use((config) => {
  try {
    const userStr = sessionStorage.getItem("user");

    if (userStr) {
      const user = JSON.parse(userStr);

      if (user?.id) {
        config.headers["X-User-Id"] = user.id.toString();
      }
    }
  } catch (err) {
    console.error("Erro ao ler usuário do storage", err);
  }

  return config;
});

export default api;