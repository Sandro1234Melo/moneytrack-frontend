import axios from "axios";

const rawBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5139" : undefined);

if (!rawBaseUrl) {
  throw new Error("VITE_API_URL precisa ser configurada para o ambiente de produção.");
}

const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "");

export function getApiAssetUrl(path?: string | null) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${normalizedBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

const api = axios.create({
  baseURL: `${normalizedBaseUrl}/api`,
});

api.interceptors.request.use((config) => {
  try {
    const userStr = sessionStorage.getItem("user");

    if (userStr) {
      const user = JSON.parse(userStr);

      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }

    }
  } catch (err) {
    console.error("Erro ao ler usuário do storage", err);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("user");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
