import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [country, setCountry] = useState("BR");
  const [currency, setCurrency] = useState("BRL");
  const language = "pt-BR";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const countryCurrencyMap: Record<string, string> = {
    BR: "BRL",
    PT: "EUR",
    US: "USD"
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        countryCode: country,
        currencyCode: currency,
        language
      });

      navigate("/login");
    } catch (err: any) {
      const responseMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.message;

      setError(responseMessage || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100svh] bg-[#000010] px-4 py-6 sm:py-8 overflow-y-auto flex items-start sm:items-center justify-center pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="w-full max-w-md bg-[#0b0b2a] rounded-xl shadow-lg p-5 sm:p-8 border border-white/10">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">
          Criar Conta
        </h1>

        <form onSubmit={handleRegister} className="space-y-4" noValidate={false}>

          {/* Nome */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Nome completo
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
              className="w-full px-4 py-3 sm:py-2 bg-[#000018] text-white border border-[#1f1f3a] rounded-lg text-base"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              inputMode="email"
              className="w-full px-4 py-3 sm:py-2 bg-[#000018] text-white border border-[#1f1f3a] rounded-lg text-base"
            />
          </div>

          {/* País */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              País
            </label>
            <select
              value={country}
              onChange={(e) => {
                const selected = e.target.value;
                setCountry(selected);
                setCurrency(countryCurrencyMap[selected]);
              }}
              className="w-full px-4 py-3 sm:py-2 bg-[#000018] text-white border border-[#1f1f3a] rounded-lg text-base"
            >
              <option value="BR">Brasil</option>
              <option value="PT">Portugal</option>
              <option value="US">Estados Unidos</option>
            </select>
          </div>

          {/* Moeda */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Moeda
            </label>
            <input
              value={currency}
              disabled
              className="w-full px-4 py-3 sm:py-2 bg-[#000018] text-gray-400 border border-[#1f1f3a] rounded-lg text-base"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Senha
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                minLength={6}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 sm:py-2 pr-10 bg-[#000018] text-white border border-[#1f1f3a] rounded-lg text-base"
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

          {/* Confirmar senha */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Confirmar senha
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 sm:py-2 pr-10 bg-[#000018] text-white border border-[#1f1f3a] rounded-lg text-base"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium text-base"
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-400">
          Já tem conta?{" "}
          <Link to="/login" className="text-purple-400 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
