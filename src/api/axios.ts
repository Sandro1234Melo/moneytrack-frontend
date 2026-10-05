import axios from "axios";

// A API publicada no Render hoje expõe as rotas no padrão /api
// Exemplo: https://moneytrack-api-7ajy.onrender.com/api/auth/login
// Se no futuro a API publicada passar a usar /api/v1, basta mudar VITE_API_BASE_PATH.
const rawBaseUrl =
  import.meta.env.VITE_API_URL || "https://moneytrack-api-7ajy.onrender.com";

const rawApiBasePath = import.meta.env.VITE_API_BASE_PATH || "/api";

const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "");
const normalizedApiBasePath = `/${rawApiBasePath.replace(/^\/+|\/+$/g, "")}`;

/** Converte caminhos relativos retornados pela API em URLs acessíveis pelo navegador. */
export function getApiAssetUrl(path?: string | null) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${normalizedBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

const api = axios.create({
  baseURL: `${normalizedBaseUrl}${normalizedApiBasePath}`,
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
