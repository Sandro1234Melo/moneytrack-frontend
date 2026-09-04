import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  ChevronRight,
  Cloud,
  Download,
  Eye,
  FileText,
  Info,
  Lock,
  Moon,
  Palette,
  Save,
  Shield,
  SlidersHorizontal,
  Sun,
  Trash2,
  Upload,
  User,
  Monitor,
} from "lucide-react";
import api from "../api/axios";
import { getApiAssetUrl } from "../api/axios";
import { getLoggedUser } from "../utils/auth";

const THEME_KEY = "moneytrack-theme";

type SettingsTab = "profile" | "preferences" | "appearance" | "security" | "notifications" | "data";
type ThemeMode = "dark" | "light" | "system";
type AccentColor = "purple" | "blue" | "green" | "orange";

type UserSettings = {
  id: number;
  full_name: string;
  email: string;
  currency_code: string;
  country_code: string;
  language: string;
  theme: ThemeMode;
  date_format: string;
  accent_color: AccentColor;
  compact_mode: boolean;
  interface_animations: boolean;
  notify_goal_80: boolean;
  notify_spending_increase: boolean;
  notify_pending_lists: boolean;
  profile_image_url?: string;
  bottom_nav_config?: string;
  created_at?: string;
  last_backup_at?: string | null;
  token?: string;
};

const normalizeUser = (raw: any): UserSettings => ({
  id: raw?.id ?? 0,
  full_name: raw?.full_Name ?? raw?.full_name ?? raw?.fullName ?? "Usuário",
  email: raw?.email ?? "",
  currency_code: raw?.currency_Code ?? raw?.currency_code ?? "EUR",
  country_code: raw?.country_Code ?? raw?.country_code ?? "PT",
  language: raw?.language ?? "pt-PT",
  theme: (raw?.theme ?? localStorage.getItem(THEME_KEY) ?? "dark") as ThemeMode,
  date_format: raw?.date_Format ?? raw?.date_format ?? "dd/MM/yyyy",
  accent_color: (raw?.accent_Color ?? raw?.accent_color ?? "purple") as AccentColor,
  compact_mode: Boolean(raw?.compact_Mode ?? raw?.compact_mode ?? false),
  interface_animations: raw?.interface_Animations ?? raw?.interface_animations ?? true,
  notify_goal_80: raw?.notify_Goal_80 ?? raw?.notify_goal_80 ?? true,
  notify_spending_increase: raw?.notify_Spending_Increase ?? raw?.notify_spending_increase ?? true,
  notify_pending_lists: raw?.notify_Pending_Lists ?? raw?.notify_pending_lists ?? false,
  profile_image_url: raw?.profileImageUrl ?? raw?.profile_Image_Url ?? raw?.profile_image_url ?? "",
  bottom_nav_config: raw?.bottom_Nav_Config ?? raw?.bottom_nav_config ?? "",
  created_at: raw?.created_At ?? raw?.created_at,
  last_backup_at: raw?.last_Backup_At ?? raw?.last_backup_at ?? null,
  token: raw?.token,
});

const toSessionUser = (u: UserSettings) => ({
  ...u,
  full_Name: u.full_name,
  currency_Code: u.currency_code,
  country_Code: u.country_code,
  profile_Image_Url: u.profile_image_url,
  profileImageUrl: u.profile_image_url,
  bottom_Nav_Config: u.bottom_nav_config,
  token: u.token,
});

const updateStoredProfilePhoto = (profileImageUrl: string) => {
  const storedUser = getLoggedUser();
  if (!storedUser) return;

  const updatedUser = {
    ...storedUser,
    profile_image_url: profileImageUrl,
    profile_Image_Url: profileImageUrl,
  };
  const serializedUser = JSON.stringify(updatedUser);
  sessionStorage.setItem("user", serializedUser);
  localStorage.setItem("user", serializedUser);
  window.dispatchEvent(new Event("moneytrack:user-updated"));
};

const applyTheme = (theme: ThemeMode) => {
  const resolved = theme === "system" ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : theme;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.classList.toggle("theme-light", resolved === "light");
  document.documentElement.classList.toggle("theme-dark", resolved === "dark");
  localStorage.setItem(THEME_KEY, resolved);
};

const currencies = [
  { value: "EUR", label: "Euro (€)" },
  { value: "BRL", label: "Real (R$)" },
  { value: "USD", label: "Dólar ($)" },
];

const countries = [
  { value: "PT", label: "Portugal" },
  { value: "BR", label: "Brasil" },
  { value: "US", label: "Estados Unidos" },
];

const languages = [
  { value: "pt-PT", label: "Português" },
  { value: "pt-BR", label: "Português (BR)" },
  { value: "en-US", label: "Inglês" },
];

const dateFormats = [
  { value: "dd/MM/yyyy", label: "dd/mm/aaaa" },
  { value: "MM/dd/yyyy", label: "mm/dd/aaaa" },
  { value: "yyyy-MM-dd", label: "aaaa-mm-dd" },
];

const tabItems = [
  { id: "profile", label: "Perfil", icon: User },
  { id: "preferences", label: "Preferências", icon: SlidersHorizontal },
  { id: "appearance", label: "Aparência", icon: Palette },
  { id: "security", label: "Segurança", icon: Shield },
  { id: "notifications", label: "Notificações", icon: Bell },
  { id: "data", label: "Dados e backup", icon: Cloud },
] as const;

const inputClass = "h-11 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/10";
const selectClass = `${inputClass} appearance-none`;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-medium text-slate-300">{label}</span>
      {children}
    </label>
  );
}

function Panel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`w-full min-w-0 rounded-2xl border border-white/10 bg-[#081222]/80 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl sm:rounded-3xl sm:p-5 ${className}`}>
      <h2 className="mb-4 text-base font-bold text-white sm:text-lg">{title}</h2>
      {children}
    </section>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full border transition ${checked ? "border-violet-400/70 bg-violet-600" : "border-white/10 bg-white/15"}`}
    >
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"}`} />
    </button>
  );
}

function ActionRow({ icon: Icon, label, onClick, danger = false }: { icon: any; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${danger ? "border-red-500/40 text-red-300 hover:bg-red-500/10" : "border-white/10 text-slate-200 hover:border-violet-400/40 hover:bg-white/[0.04]"}`}
    >
      <span className="flex min-w-0 items-center gap-3"><Icon size={17} className="shrink-0" /><span className="truncate">{label}</span></span>
      {!danger && <ChevronRight size={16} className="text-slate-500" />}
    </button>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const initial = normalizeUser(getLoggedUser());

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [, setUser] = useState<UserSettings>(initial);
  const [form, setForm] = useState<UserSettings>(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const setField = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/users/me");
        const normalized = normalizeUser({ ...res.data, token: getLoggedUser()?.token });
        setUser(normalized);
        setForm(normalized);
        sessionStorage.setItem("user", JSON.stringify(toSessionUser(normalized)));
        window.dispatchEvent(new Event("moneytrack:user-updated"));
        applyTheme(normalized.theme);
      } catch (err: any) {
        setMessage({ type: "error", text: err?.response?.data?.details || err?.response?.data?.error || "Erro ao carregar configurações." });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    applyTheme(form.theme);
  }, [form.theme]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const payload = {
        full_name: form.full_name,
        email: form.email,
        currency_code: form.currency_code,
        country_code: form.country_code,
        language: form.language,
        theme: form.theme,
        date_format: form.date_format,
        accent_color: form.accent_color,
        compact_mode: form.compact_mode,
        interface_animations: form.interface_animations,
        notify_goal_80: form.notify_goal_80,
        notify_spending_increase: form.notify_spending_increase,
        notify_pending_lists: form.notify_pending_lists,
        bottom_nav_config: form.bottom_nav_config,
      };

      const res = await api.put("/users/me/preferences", payload);
      const updated = normalizeUser({ ...(res.data ?? form), token: getLoggedUser()?.token });
      setUser(updated);
      setForm(updated);
      sessionStorage.setItem("user", JSON.stringify(toSessionUser(updated)));
      localStorage.setItem("user", JSON.stringify(toSessionUser(updated)));
      window.dispatchEvent(new Event("moneytrack:user-updated"));
      setMessage({ type: "success", text: "Configurações salvas com sucesso." });
    } catch (err: any) {
      setMessage({ type: "error", text: err?.response?.data?.details || err?.response?.data?.error || "Erro ao salvar configurações." });
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      setMessage(null);
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/users/me/upload-photo", formData, { headers: { "Content-Type": "multipart/form-data" } });
      const imageUrl = res.data?.url;
      const fullUrl = imageUrl ? `${getApiAssetUrl(imageUrl)}?t=${Date.now()}` : "";
      setForm((prev) => ({ ...prev, profile_image_url: fullUrl }));
      setUser((prev) => ({ ...prev, profile_image_url: fullUrl }));
      updateStoredProfilePhoto(imageUrl);
      setMessage({ type: "success", text: "Foto atualizada com sucesso." });
    } catch (err: any) {
      setMessage({ type: "error", text: err?.response?.data?.details || err?.response?.data?.error || "Erro ao enviar foto." });
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    try {
      await api.delete("/users/me/profile-photo");
      setForm((prev) => ({ ...prev, profile_image_url: "" }));
      setUser((prev) => ({ ...prev, profile_image_url: "" }));
      updateStoredProfilePhoto("");
      setMessage({ type: "success", text: "Foto removida com sucesso." });
    } catch (err: any) {
      setMessage({ type: "error", text: err?.response?.data?.details || err?.response?.data?.error || "Erro ao remover foto." });
    }
  };

  const handleChangePassword = async () => {
    try {
      setMessage(null);
      if (!passwords.currentPassword || !passwords.newPassword) throw new Error("Preencha a senha atual e a nova senha.");
      if (passwords.newPassword.length < 6) throw new Error("A nova senha deve ter pelo menos 6 caracteres.");
      if (passwords.newPassword !== passwords.confirmPassword) throw new Error("A confirmação da senha não confere.");
      await api.put("/users/me/password", { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage({ type: "success", text: "Senha alterada com sucesso." });
    } catch (err: any) {
      setMessage({ type: "error", text: err?.response?.data?.details || err?.response?.data?.error || err?.message || "Erro ao alterar senha." });
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get("/users/me/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `moneytrack-dados-${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setMessage({ type: "success", text: "Dados exportados com sucesso." });
    } catch (err: any) {
      setMessage({ type: "error", text: err?.response?.data?.details || err?.response?.data?.error || "Erro ao exportar dados." });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmText = window.prompt('Digite APAGAR para confirmar a exclusão da conta.');
    if (confirmText !== "APAGAR") return;
    try {
      await api.delete("/users/me");
      sessionStorage.removeItem("user");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err: any) {
      setMessage({ type: "error", text: err?.response?.data?.details || err?.response?.data?.error || "Erro ao apagar conta." });
    }
  };

  const selectedCurrency = currencies.find((item) => item.value === form.currency_code)?.label ?? form.currency_code;
  const selectedCountry = countries.find((item) => item.value === form.country_code)?.label ?? form.country_code;
  const selectedTheme = form.theme === "light" ? "Claro" : form.theme === "system" ? "Sistema" : "Escuro";
  const lastBackup = form.last_backup_at ? new Date(form.last_backup_at).toLocaleString("pt-PT") : "ainda não realizado";

  if (loading) {
    return <div className="grid min-h-[55vh] place-items-center text-slate-400">Carregando configurações...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-5 overflow-hidden pb-10 text-white sm:space-y-6 lg:pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight sm:text-4xl">Configurações</h1>
          <p className="mt-1 text-sm text-slate-400 sm:text-base">Personalize sua conta, preferências do app e segurança.</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition hover:scale-[1.01] disabled:opacity-60 sm:w-auto sm:min-w-48"
        >
          <Save size={18} /> {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>

      {message && (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${message.type === "success" ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200" : "border-red-400/30 bg-red-500/10 text-red-200"}`}>
          {message.text}
        </div>
      )}

      <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
        <aside className="min-w-0 rounded-2xl border border-white/10 bg-[#081222]/80 p-2 shadow-2xl shadow-black/10 backdrop-blur-xl sm:rounded-3xl sm:p-3 xl:sticky xl:top-4 xl:h-fit">
          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1 xl:block xl:space-y-2 xl:overflow-visible xl:pb-0">
            {tabItems.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex min-w-max items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm xl:w-full ${active ? "bg-gradient-to-r from-violet-700 to-violet-600 text-white shadow-lg shadow-violet-700/20" : "text-slate-300 hover:bg-white/[0.04]"}`}
                >
                  <Icon size={18} /> {label}
                </button>
              );
            })}
          </div>
        </aside>

        <main className="min-w-0 space-y-5">
          {(activeTab === "profile" || activeTab === "preferences") && (
            <Panel title="Perfil">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <div className="grid h-16 w-16 shrink-0 sm:h-20 sm:w-20 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-2xl font-black shadow-xl shadow-violet-600/25">
                    {form.profile_image_url ? <img src={getApiAssetUrl(form.profile_image_url)} alt="Perfil" className="h-full w-full object-cover" /> : "SA"}
                  </div>
                  <div>
                    <h3 className="truncate text-lg font-black sm:text-xl">{form.full_name}</h3>
                    <p className="break-all text-sm text-slate-400">{form.email}</p>
                  </div>
                </div>
                <div className="grid gap-2 sm:flex sm:flex-row">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-400/40 px-4 py-2.5 text-sm font-semibold text-violet-200 hover:bg-violet-500/10 sm:w-auto">
                    <Upload size={16} /> {uploading ? "Enviando..." : "Alterar foto"}
                  </button>
                  <button type="button" onClick={handleDeletePhoto} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/40 px-4 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/10 sm:w-auto">
                    <Trash2 size={16} /> Remover foto
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nome completo"><input className={inputClass} value={form.full_name} onChange={(e) => setField("full_name", e.target.value)} /></Field>
                <Field label="E-mail"><input className={inputClass} type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} /></Field>
                <Field label="País"><select className={selectClass} value={form.country_code} onChange={(e) => setField("country_code", e.target.value)}>{countries.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></Field>
                <Field label="Moeda"><select className={selectClass} value={form.currency_code} onChange={(e) => setField("currency_code", e.target.value)}>{currencies.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></Field>
                <Field label="Idioma"><select className={selectClass} value={form.language} onChange={(e) => setField("language", e.target.value)}>{languages.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></Field>
                <Field label="Formato de data"><select className={selectClass} value={form.date_format} onChange={(e) => setField("date_format", e.target.value)}>{dateFormats.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></Field>
              </div>
            </Panel>
          )}

          {(activeTab === "appearance" || activeTab === "preferences") && (
            <Panel title="Aparência">
              <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-400">Tema</p>
                  <div className="grid grid-cols-3 rounded-2xl border border-white/10 bg-white/[0.025] p-1">
                    {[
                      { value: "dark", label: "Escuro", icon: Moon },
                      { value: "light", label: "Claro", icon: Sun },
                      { value: "system", label: "Sistema", icon: Monitor },
                    ].map(({ value, label, icon: Icon }) => (
                      <button key={value} type="button" onClick={() => setField("theme", value as ThemeMode)} className={`flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold transition sm:gap-2 sm:px-3 sm:text-sm ${form.theme === value ? "bg-violet-600 text-white" : "text-slate-300 hover:bg-white/[0.05]"}`}>
                        <Icon size={16} /> {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-400">Cor principal</p>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { value: "purple", label: "Roxo", cls: "bg-violet-600" },
                      { value: "blue", label: "Azul", cls: "bg-blue-600" },
                      { value: "green", label: "Verde", cls: "bg-green-500" },
                      { value: "orange", label: "Laranja", cls: "bg-orange-500" },
                    ].map((c) => (
                      <button key={c.value} type="button" onClick={() => setField("accent_color", c.value as AccentColor)} className="flex flex-col items-center gap-1 text-xs text-slate-300">
                        <span className={`grid h-9 w-9 place-items-center rounded-full ${c.cls} ring-offset-2 ring-offset-[#081222] ${form.accent_color === c.value ? "ring-2 ring-white" : ""}`}>{form.accent_color === c.value && <Check size={18} />}</span>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-5 divide-y divide-white/10 rounded-2xl border border-white/10">
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">Modo compacto</p><p className="text-sm text-slate-400">Reduz espaçamentos e tamanhos para exibir mais informações.</p></div><div className="self-end sm:self-auto"><Toggle checked={form.compact_mode} onChange={(v) => setField("compact_mode", v)} /></div></div>
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">Animações da interface</p><p className="text-sm text-slate-400">Ativar animações e transições suaves no aplicativo.</p></div><div className="self-end sm:self-auto"><Toggle checked={form.interface_animations} onChange={(v) => setField("interface_animations", v)} /></div></div>
              </div>
            </Panel>
          )}

          {activeTab === "security" && (
            <Panel title="Segurança">
              <div className="grid gap-4 lg:grid-cols-3">
                <Field label="Senha atual"><div className="relative"><input className={`${inputClass} pr-10`} type="password" placeholder="Digite sua senha atual" value={passwords.currentPassword} onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))} /><Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} /></div></Field>
                <Field label="Nova senha"><div className="relative"><input className={`${inputClass} pr-10`} type="password" placeholder="Digite uma nova senha" value={passwords.newPassword} onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))} /><Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} /></div></Field>
                <Field label="Confirmar nova senha"><div className="relative"><input className={`${inputClass} pr-10`} type="password" placeholder="Confirme a nova senha" value={passwords.confirmPassword} onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))} /><Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} /></div></Field>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-400"><Shield size={15} className="mr-1 inline" /> Último acesso: Hoje, 09:42 • Dispositivo atual: Windows</p>
                <button type="button" onClick={handleChangePassword} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-400/40 px-4 py-3 text-sm font-bold text-violet-200 hover:bg-violet-500/10 sm:w-auto"><Lock size={16} /> Alterar senha</button>
              </div>
            </Panel>
          )}

          {activeTab === "notifications" && (
            <Panel title="Notificações">
              <div className="divide-y divide-white/10 rounded-2xl border border-white/10">
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">Alertar metas em 80%</p><p className="text-sm text-slate-400">Receba aviso quando uma meta estiver próxima do limite.</p></div><div className="self-end sm:self-auto"><Toggle checked={form.notify_goal_80} onChange={(v) => setField("notify_goal_80", v)} /></div></div>
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">Avisar sobre aumento de gastos</p><p className="text-sm text-slate-400">Mostra alertas quando seus gastos subirem acima do normal.</p></div><div className="self-end sm:self-auto"><Toggle checked={form.notify_spending_increase} onChange={(v) => setField("notify_spending_increase", v)} /></div></div>
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">Lembrar listas pendentes</p><p className="text-sm text-slate-400">Lembretes para listas de compras abertas ou em execução.</p></div><div className="self-end sm:self-auto"><Toggle checked={form.notify_pending_lists} onChange={(v) => setField("notify_pending_lists", v)} /></div></div>
              </div>
            </Panel>
          )}

          {activeTab === "data" && (
            <Panel title="Dados e backup">
              <div className="grid gap-3 sm:grid-cols-2">
                <ActionRow icon={Download} label="Exportar dados" onClick={handleExport} />
                <ActionRow icon={FileText} label="Baixar relatório PDF" onClick={() => setMessage({ type: "success", text: "Use a tela Relatórios para exportar PDF com filtros detalhados." })} />
                <ActionRow icon={Cloud} label="Sincronizar com a nuvem" onClick={handleExport} />
                <ActionRow icon={Trash2} label="Apagar conta" onClick={handleDeleteAccount} danger />
              </div>
              <p className="mt-4 text-sm text-slate-400">Último backup: {lastBackup}</p>
            </Panel>
          )}
        </main>

        <aside className="hidden space-y-5 xl:sticky xl:top-4 xl:block xl:h-fit">
          <Panel title="Resumo da conta">
            <div className="space-y-4 text-sm">
              <div className="flex justify-between gap-4"><span className="text-slate-400">Plano atual:</span><strong className="text-violet-300">Gratuito</strong></div>
              <div className="flex justify-between gap-4"><span className="text-slate-400">País:</span><strong>{selectedCountry}</strong></div>
              <div className="flex justify-between gap-4"><span className="text-slate-400">Moeda padrão:</span><strong>{selectedCurrency}</strong></div>
              <div className="flex justify-between gap-4"><span className="text-slate-400">Tema atual:</span><strong className="flex items-center gap-2"><Moon size={15} /> {selectedTheme}</strong></div>
            </div>
          </Panel>

          <Panel title="Notificações">
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-3"><span>Alertar metas em 80%</span><Toggle checked={form.notify_goal_80} onChange={(v) => setField("notify_goal_80", v)} /></div>
              <div className="flex items-center justify-between gap-3"><span>Avisar sobre aumento de gastos</span><Toggle checked={form.notify_spending_increase} onChange={(v) => setField("notify_spending_increase", v)} /></div>
              <div className="flex items-center justify-between gap-3"><span>Lembrar listas pendentes</span><Toggle checked={form.notify_pending_lists} onChange={(v) => setField("notify_pending_lists", v)} /></div>
            </div>
          </Panel>

          <Panel title="Dados e backup">
            <div className="space-y-3">
              <ActionRow icon={Download} label="Exportar dados" onClick={handleExport} />
              <ActionRow icon={FileText} label="Baixar relatório PDF" onClick={() => setMessage({ type: "success", text: "Use a tela Relatórios para exportar PDF com filtros detalhados." })} />
              <ActionRow icon={Cloud} label="Sincronizar com a nuvem" onClick={handleExport} />
              <p className="text-xs text-slate-400">Último backup: {lastBackup}</p>
              <ActionRow icon={Trash2} label="Apagar conta" onClick={handleDeleteAccount} danger />
            </div>
          </Panel>

          <div className="rounded-3xl border border-white/10 bg-[#081222]/80 p-5 text-sm text-slate-300">
            <div className="mb-3 flex items-center gap-2 font-bold text-white"><Info size={18} className="text-violet-300" /> Dica para você</div>
            As alterações de tema e notificações são aplicadas imediatamente na interface e salvas no banco ao clicar em <strong>Salvar alterações</strong>.
          </div>
        </aside>
      </div>
    </div>
  );
}
