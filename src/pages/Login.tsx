import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { normalizeUser } from "../utils/auth";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await loginUser({ email, password });
      sessionStorage.setItem("user", JSON.stringify(normalizeUser(user)));
      navigate("/dashboard");
    } catch {
      setError("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020919] px-4">
      <div className="relative w-full max-w-md">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1 rounded-2xl bg-violet-500/50 blur-xl"
        />
        <div className="relative rounded-xl bg-[#0b0b2a] p-6 shadow-lg sm:p-8">
        <h1 className="mb-6 flex items-end justify-center gap-2 text-center text-2xl font-bold text-white">
          <span className="flex h-7 w-6 items-end gap-1 text-violet-400" aria-hidden="true">
            <i className="h-2.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,.8)]" />
            <i className="h-5 w-1.5 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,.9)]" />
            <i className="h-7 w-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,.9)]" />
          </span>
          MoneyTrack
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#000018] text-white border border-[#1f1f3a] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Senha</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 bg-[#000018] text-white border border-[#1f1f3a] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition font-medium"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-400">
          Não tem conta?{" "}
          <Link to="/register" className="text-purple-400 hover:underline">
            Criar conta
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
}
