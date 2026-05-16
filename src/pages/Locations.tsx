import React, { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  MoreVertical,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Store,
  Trash2,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getLoggedUser } from "../utils/auth";
import Alert from "../components/ui/Alert";
import ConfirmDialog from "../components/ui/ConfirmDialog";

type Location = {
  id: number;
  name: string;
  userName?: string;
  totalPurchases?: number;
  totalSpent?: number;
  averagePerPurchase?: number;
  lastPurchaseDate?: string | null;
};

const tags = ["Supermercado", "Alimentação", "Farmácia", "Combustível", "Casa", "Outros"];
const tagClass = (i: number) =>
  [
    "bg-emerald-500/15 text-emerald-300",
    "bg-orange-500/15 text-orange-300",
    "bg-pink-500/15 text-pink-300",
    "bg-amber-500/15 text-amber-300",
    "bg-blue-500/15 text-blue-300",
    "bg-slate-500/15 text-slate-300",
  ][i % 6];

const icons = ["🛒", "🏪", "☕", "⛽", "💊", "🥐", "🏠", "🧾"];

const getApiError = (error: any, fallback: string) => {
  const data = error?.response?.data;
  return data?.details || data?.error || data?.message || fallback;
};

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const navigate = useNavigate();
  const user = getLoggedUser();
  const userId = user?.id;
  const currency = user?.currencySymbol || "€";

  const money = (value?: number) =>
    `${currency} ${(Number(value) || 0).toLocaleString("pt-PT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const loadLocations = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await api.get(`/locations/${userId}`);
      setLocations(response.data ?? []);
    } catch (error: any) {
      setErrorMessage(getApiError(error, "Erro ao carregar locais."));
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, [userId]);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 5000);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/locations/${id}`);
      showSuccess("Local removido com sucesso!");
      setIsEditing(false);
      setEditingLocation(null);
      setName("");
      setOpenMenuId(null);
      await loadLocations();
    } catch (error: any) {
      showError(getApiError(error, "Não foi possível excluir o local."));
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !userId) return;

    try {
      const payload = { name: name.trim(), user_Id: userId };

      if (editingLocation) {
        await api.put(`/locations/${editingLocation.id}`, payload);
        showSuccess("Local atualizado com sucesso!");
      } else {
        await api.post("/locations", payload);
        showSuccess("Local criado com sucesso!");
      }

      setIsEditing(false);
      setEditingLocation(null);
      setName("");
      await loadLocations();
    } catch (error: any) {
      showError(getApiError(error, "Erro ao salvar local."));
    }
  };

  const openCreate = () => {
    setEditingLocation(null);
    setName("");
    setIsEditing(true);
  };

  const openEdit = (location: Location) => {
    setEditingLocation(location);
    setName(location.name);
    setIsEditing(true);
    setOpenMenuId(null);
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return locations;
    return locations.filter((location) => location.name.toLowerCase().includes(term));
  }, [locations, search]);

  const maxTotalSpent = Math.max(...locations.map((location) => location.totalSpent || 0), 1);
  const maxPurchases = Math.max(...locations.map((location) => location.totalPurchases || 0), 1);

  const stats = useMemo(() => {
    const totalPurchases = locations.reduce((sum, location) => sum + (location.totalPurchases || 0), 0);
    const totalSpent = locations.reduce((sum, location) => sum + (location.totalSpent || 0), 0);

    return {
      total: locations.length,
      totalPurchases,
      totalSpent,
      averagePerPurchase: totalPurchases > 0 ? totalSpent / totalPurchases : 0,
    };
  }, [locations]);

  const lastPurchaseLabel = (date?: string | null) => {
    if (!date) return "Sem compras";

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "Sem compras";

    return parsed.toLocaleDateString("pt-PT");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 pb-24 sm:px-6 lg:px-0 lg:pb-8">
      {successMessage && <Alert message={successMessage} variant="success" />}
      {errorMessage && <Alert message={errorMessage} variant="error" />}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Locais</h1>
          <p className="mt-1 text-sm text-slate-400 sm:text-base">
            Gerencie os estabelecimentos onde você realiza compras.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar local..."
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm outline-none transition focus:border-violet-500/70"
            />
          </div>

          <button
            onClick={openCreate}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 font-bold shadow-lg shadow-violet-900/30 transition hover:scale-[1.01]"
          >
            <Plus size={20} /> Novo local
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Total de locais",
            value: String(stats.total),
            subtitle: "cadastrados",
            icon: Store,
            className: "text-violet-300 bg-violet-500/15",
          },
          {
            title: "Total de compras",
            value: String(stats.totalPurchases),
            subtitle: "realizadas",
            icon: ShoppingBag,
            className: "text-blue-300 bg-blue-500/15",
          },
          {
            title: "Total gasto",
            value: money(stats.totalSpent),
            subtitle: "em todos os locais",
            icon: Wallet,
            className: "text-emerald-300 bg-emerald-500/15",
          },
          {
            title: "Média por compra",
            value: money(stats.averagePerPurchase),
            subtitle: "considerando compras reais",
            icon: TrendingUp,
            className: "text-orange-300 bg-orange-500/15",
          },
        ].map(({ title, value, subtitle, icon: Icon, className }) => (
          <div key={title} className="rounded-3xl border border-white/10 bg-[#0a1425]/80 p-5 shadow-xl shadow-black/10">
            <div className={`mb-4 grid h-14 w-14 place-items-center rounded-2xl ${className}`}>
              <Icon size={26} />
            </div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
            <p className="text-sm text-slate-400">{subtitle}</p>
          </div>
        ))}
      </section>

      {isEditing && (
        <section className="rounded-3xl border border-white/10 bg-[#0a1425]/90 p-5 shadow-2xl shadow-black/20 sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">{editingLocation ? "Editar local" : "Novo local"}</h2>
              <p className="mt-1 text-sm text-slate-400">
                {editingLocation ? "Atualize o nome do estabelecimento." : "Cadastre um novo estabelecimento para usar nas compras."}
              </p>
            </div>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingLocation(null);
                setName("");
              }}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-300 hover:bg-white/5"
            >
              <X size={18} />
            </button>
          </div>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do local"
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 outline-none transition focus:border-violet-500/70"
          />

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-between">
            {editingLocation && (
              <button
                onClick={() => setDeleteId(editingLocation.id)}
                className="rounded-xl border border-red-500/50 px-5 py-3 text-red-300 transition hover:bg-red-500/10"
              >
                Excluir
              </button>
            )}

            <div className="flex flex-col gap-3 sm:ml-auto sm:flex-row">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingLocation(null);
                  setName("");
                }}
                className="rounded-xl border border-white/10 px-5 py-3 transition hover:bg-white/5"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 font-bold"
              >
                Salvar
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0a1425]/80 shadow-xl shadow-black/10">
        <div className="hidden grid-cols-[1.4fr_0.7fr_0.8fr_0.8fr_0.7fr_0.7fr] gap-4 border-b border-white/5 px-6 py-4 text-xs font-bold text-slate-400 lg:grid">
          <span>LOCAL</span>
          <span>COMPRAS</span>
          <span>TOTAL GASTO</span>
          <span>MÉDIA POR COMPRA</span>
          <span>ÚLTIMA COMPRA</span>
          <span className="text-right">AÇÕES</span>
        </div>

        {loading && <div className="px-6 py-10 text-center text-slate-400">Carregando locais...</div>}

        {!loading && filtered.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-violet-500/15 text-violet-300">
              <Store size={26} />
            </div>
            <h3 className="text-lg font-bold">Nenhum local encontrado</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              Cadastre locais como Lidl, Continente, farmácia ou posto de combustível para acompanhar seus gastos por estabelecimento.
            </p>
            <button
              onClick={openCreate}
              className="mt-5 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 font-bold"
            >
              + Novo local
            </button>
          </div>
        )}

        {!loading &&
          filtered.map((location, index) => {
            const purchases = location.totalPurchases || 0;
            const totalSpent = location.totalSpent || 0;
            const average = location.averagePerPurchase || 0;
            const purchaseProgress = Math.max(5, Math.round((purchases / maxPurchases) * 100));
            const spentProgress = Math.max(5, Math.round((totalSpent / maxTotalSpent) * 100));

            return (
              <div
                key={location.id}
                className="grid gap-4 border-b border-white/5 px-4 py-4 last:border-b-0 lg:grid-cols-[1.4fr_0.7fr_0.8fr_0.8fr_0.7fr_0.7fr] lg:items-center lg:px-6"
              >
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-xl">
                    {icons[index % icons.length]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-bold">
                      <span className="truncate">{location.name}</span>
                      {purchases > 0 && <Star size={15} className="shrink-0 text-amber-400" />}
                    </div>
                    <span className={`mt-1 inline-flex rounded-md px-2 py-1 text-xs ${tagClass(index)}`}>
                      {tags[index % tags.length]}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 lg:block">
                    <span className="text-xs font-bold uppercase text-slate-500 lg:hidden">Compras</span>
                    <p className="font-bold">{purchases}</p>
                  </div>
                  <p className="text-xs text-slate-400">compras</p>
                  <div className="mt-2 h-1.5 w-full max-w-32 rounded-full bg-white/10 lg:w-24">
                    <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${purchaseProgress}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 lg:block">
                    <span className="text-xs font-bold uppercase text-slate-500 lg:hidden">Total gasto</span>
                    <p className="font-bold">{money(totalSpent)}</p>
                  </div>
                  <div className="mt-2 h-1.5 w-full max-w-32 rounded-full bg-white/10 lg:w-24">
                    <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${spentProgress}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 lg:block">
                  <span className="text-xs font-bold uppercase text-slate-500 lg:hidden">Média</span>
                  <span className="font-bold">{money(average)}</span>
                </div>

                <div className="flex items-center justify-between gap-2 text-sm text-slate-300 lg:block">
                  <span className="text-xs font-bold uppercase text-slate-500 lg:hidden">Última compra</span>
                  <span>{lastPurchaseLabel(location.lastPurchaseDate)}</span>
                </div>

                <div className="relative flex justify-end gap-2">
                  <button
                    onClick={() => navigate(`/purchases?locationId=${location.id}`)}
                    className="hidden rounded-xl border border-violet-500/40 px-4 py-2 text-violet-300 transition hover:bg-violet-500/10 xl:inline-flex"
                  >
                    Nova compra
                  </button>
                  <button
                    onClick={() => openEdit(location)}
                    className="rounded-xl border border-violet-500/40 px-4 py-2 text-violet-300 transition hover:bg-violet-500/10"
                  >
                    <Edit3 size={16} className="inline" /> Editar
                  </button>
                  <button
                    onClick={() => setOpenMenuId(openMenuId === location.id ? null : location.id)}
                    className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 transition hover:bg-white/5"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenuId === location.id && (
                    <div className="absolute right-0 top-12 z-20 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220] shadow-2xl shadow-black/40">
                      <button
                        onClick={() => navigate(`/purchases?locationId=${location.id}`)}
                        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm hover:bg-white/5"
                      >
                        <Plus size={16} /> Nova compra
                      </button>
                      <button
                        onClick={() => openEdit(location)}
                        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm hover:bg-white/5"
                      >
                        <Edit3 size={16} /> Editar
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(location.id);
                          setOpenMenuId(null);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 size={16} /> Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </section>

      <ConfirmDialog
        open={deleteId !== null}
        title="Excluir local"
        message="Tem certeza que deseja excluir este local? Se houver compras usando este local, a exclusão pode ser bloqueada pelo banco."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId !== null) handleDelete(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
};

export default Locations;
