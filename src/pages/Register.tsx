import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { normalizeUser } from "../utils/auth";

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countryCode, setCountryCode] = useState("PT");
  const [currencyCode, setCurrencyCode] = useState("EUR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const user = await registerUser({
        fullName,
        email,
        password,
        countryCode,
        currencyCode,
        language: countryCode === "BR" ? "pt-BR" : countryCode === "US" ? "en-US" : "pt-PT",
      });
      const normalizedUser = normalizeUser(user);
      if (!normalizedUser?.token) throw new Error("Resposta de autenticação inválida");
      sessionStorage.setItem("user", JSON.stringify(normalizedUser));
      navigate("/");
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || "Não foi possível criar a conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000010] px-4">
      <div className="w-full max-w-md bg-[#0b0b2a] rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">Criar conta</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input aria-label="Nome completo" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nome completo" className="w-full px-4 py-2 bg-[#000018] text-white border border-[#1f1f3a] rounded-lg" />
          <input aria-label="E-mail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className="w-full px-4 py-2 bg-[#000018] text-white border border-[#1f1f3a] rounded-lg" />
          <input aria-label="Senha" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha (mínimo 6 caracteres)" className="w-full px-4 py-2 bg-[#000018] text-white border border-[#1f1f3a] rounded-lg" />
          <input aria-label="Confirmar senha" type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmar senha" className="w-full px-4 py-2 bg-[#000018] text-white border border-[#1f1f3a] rounded-lg" />
          <select aria-label="País" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="w-full px-4 py-2 bg-[#000018] text-white border border-[#1f1f3a] rounded-lg">
            <option value="PT">Portugal</option>
            <option value="BR">Brasil</option>
            <option value="US">Estados Unidos</option>
          </select>
          <select aria-label="Moeda" value={currencyCode} onChange={(e) => setCurrencyCode(e.target.value)} className="w-full px-4 py-2 bg-[#000018] text-white border border-[#1f1f3a] rounded-lg">
            <option value="EUR">Euro (€)</option>
            <option value="BRL">Real brasileiro (R$)</option>
            <option value="USD">Dólar americano (US$)</option>
          </select>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium disabled:opacity-60">{loading ? "Criando..." : "Criar conta"}</button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-400">Já tem conta? <Link to="/login" className="text-purple-400 hover:underline">Entrar</Link></p>
      </div>
    </div>
  );
}
