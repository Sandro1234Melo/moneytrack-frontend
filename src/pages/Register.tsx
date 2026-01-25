import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
        full_Name: fullName,
        email,
        password,
        country_Code: country,
        currency_Code: currency,
        language
      });

      navigate("/login");
    } catch {
      setError("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000010] px-4">
      <div className="w-full max-w-md bg-[#0b0b2a] rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">
          Criar Conta
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">

          {/* Nome */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Nome completo
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#000018] text-white border border-[#1f1f3a] rounded-lg"
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
              className="w-full px-4 py-2 bg-[#000018] text-white border border-[#1f1f3a] rounded-lg"
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
              className="w-full px-4 py-2 bg-[#000018] text-white border border-[#1f1f3a] rounded-lg"
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
              className="w-full px-4 py-2 bg-[#000018] text-gray-400 border border-[#1f1f3a] rounded-lg"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              minLength={6}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#000018] text-white border border-[#1f1f3a] rounded-lg"
            />
          </div>

          {/* Confirmar senha */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Confirmar senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#000018] text-white border border-[#1f1f3a] rounded-lg"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium"
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
