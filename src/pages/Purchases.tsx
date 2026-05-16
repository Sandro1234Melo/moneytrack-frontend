import { useEffect, useMemo, useState } from "react";
import { Filter, Plus, ShoppingCart, Wallet } from "lucide-react";
import api from "../api/axios";
import { getLoggedUser } from "../utils/auth";
import PurchaseFormMobile from "../components/purchases/PurchaseFormMobile";
import PurchaseFormDesktop from "../components/purchases/PurchaseFormDesktop";
import QuickCreateModal from "../components/ui/QuickCreateModal";
import ExpenseFilters, { type Filters } from "../components/ui/ExpenseFilters";

const Purchases = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [editingPurchase, setEditingPurchase] = useState<any | null>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [formKey, setFormKey] = useState(0);
  const [openFilters, setOpenFilters] = useState(false);
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [createdCategoryId, setCreatedCategoryId] = useState<number | null>(null);
  const [createdLocationId, setCreatedLocationId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [period, setPeriod] = useState("Tudo");
  const user = getLoggedUser();
  const userId = user?.id;
  const currency = user?.currencySymbol || "€";

  const [filters, setFilters] = useState<Filters>({ fromDate: "", toDate: "", locationId: "", categoryId: "", noteId: "", description: "", minValue: "", maxValue: "" });

  const total = (purchase: any) => purchase.items?.reduce((s: number, item: any) => s + Number(item.amount ?? (Number(item.quantity ?? 1) * Number(item.price ?? item.unitPrice ?? 0))), 0) ?? 0;
  const money = (v: number) => `${currency} ${v.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const loadPurchases = async (customFilters: Filters = filters) => {
    if (!userId) return;

    try {
      const response = await api.get(`/expenses`, {
        params: {
          userId,
          from: customFilters.fromDate || undefined,
          to: customFilters.toDate || undefined,
          locationId: customFilters.locationId || undefined,
          categoryId: customFilters.categoryId || undefined,
          noteId: customFilters.noteId || undefined,
          description: customFilters.description || undefined,
          min: customFilters.minValue || undefined,
          max: customFilters.maxValue || undefined
        }
      });
      setPurchases(response.data);
    } catch (error: any) {
      console.error("Erro ao carregar compras", error);
      alert(error?.response?.data?.details || error?.response?.data?.error || "Erro ao carregar compras");
    }
  };

  const loadCategories = async () => { const response = await api.get(`/categories/${userId}`); setCategories(response.data); };
  const loadLocations = async () => { const response = await api.get(`/locations/${userId}`); setLocations(response.data); };

  useEffect(() => { if (!userId) return; loadPurchases(); loadCategories(); loadLocations(); }, [userId]);

  const handleSave = async (data: any) => {
    try {
      if (editingPurchase) await api.put(`/expenses/${editingPurchase.id}`, data);
      else await api.post("/expenses", { ...data, userId });
      setEditingPurchase(null); setIsEditing(false); setFormKey((prev) => prev + 1); loadPurchases(filters);
    } catch { alert("Erro ao salvar a compra"); }
  };

  const summary = useMemo(() => {
    const sum = purchases.reduce((s, p) => s + total(p), 0);
    return { sum, avg: purchases.length ? sum / purchases.length : 0 };
  }, [purchases]);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const applyPeriod = (selectedPeriod: string) => {
    setPeriod(selectedPeriod);
    const today = new Date();
    let periodFilters: Filters = { ...filters, fromDate: "", toDate: "" };

    if (selectedPeriod === "Hoje") {
      const date = formatDate(today);
      periodFilters = { ...periodFilters, fromDate: date, toDate: date };
    }

    if (selectedPeriod === "Semana") {
      const start = new Date(today);
      start.setDate(today.getDate() - 6);
      periodFilters = { ...periodFilters, fromDate: formatDate(start), toDate: formatDate(today) };
    }

    if (selectedPeriod === "Mês") {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      periodFilters = { ...periodFilters, fromDate: formatDate(start), toDate: formatDate(today) };
    }

    setFilters(periodFilters);
    loadPurchases(periodFilters);
  };

  const clearFilters = () => {
    const empty: Filters = { fromDate: "", toDate: "", locationId: "", categoryId: "", noteId: "", description: "", minValue: "", maxValue: "" };
    setPeriod("Tudo");
    setFilters(empty);
    loadPurchases(empty);
  };

  if (isEditing) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="hidden lg:block"><PurchaseFormDesktop key={formKey} purchase={editingPurchase} categories={categories} locations={locations} onCancel={() => { setEditingPurchase(null); setIsEditing(false); }} onSave={handleSave} /></div>
        <div className="lg:hidden"><PurchaseFormMobile key={formKey} purchase={editingPurchase} categories={categories} locations={locations} onCancel={() => { setEditingPurchase(null); setIsEditing(false); }} onSave={handleSave} onAddLocation={() => setOpenLocationModal(true)} onAddCategory={() => setOpenCategoryModal(true)} onCategoryCreated={createdCategoryId} onLocationCreated={createdLocationId} /></div>
        <QuickCreateModal open={openCategoryModal} title="Nova categoria" fields={[{ name: "name", label: "Nome", placeholder: "Ex: Alimentação" }]} onClose={() => setOpenCategoryModal(false)} onSubmit={async (data) => { const res = await api.post("/categories", { name: data.name, user_Id: userId }); setCategories((prev) => [...prev, res.data]); setCreatedCategoryId(res.data.id); setOpenCategoryModal(false); }} />
        <QuickCreateModal open={openLocationModal} title="Novo local" fields={[{ name: "name", label: "Nome", placeholder: "Ex: Supermercado" }]} onClose={() => setOpenLocationModal(false)} onSubmit={async (data) => { const res = await api.post("/locations", { name: data.name, user_Id: userId }); setLocations((prev) => [...prev, res.data]); setCreatedLocationId(res.data.id); setOpenLocationModal(false); }} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div><h1 className="text-3xl font-bold tracking-tight">Compras</h1><p className="mt-1 hidden text-slate-400 sm:block">Registre e acompanhe suas compras</p></div>
        <div className="flex items-center gap-3"><button onClick={() => setOpenFilters(true)} className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-slate-300 lg:hidden"><Filter size={20}/> Filtros</button><button onClick={() => { setEditingPurchase(null); setIsEditing(true); }} className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 font-bold shadow-lg shadow-violet-950/40"><Plus size={22}/> Nova compra</button></div>
      </div>

      <div className="flex items-center justify-between gap-3 lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1">{["Tudo", "Hoje", "Semana", "Mês"].map(p => <button key={p} onClick={() => applyPeriod(p)} className={`rounded-2xl border px-5 py-3 ${period === p ? "border-violet-500 bg-violet-600 text-white" : "border-white/10 bg-white/[0.03] text-slate-300"}`}>{p}</button>)}</div>
        <button onClick={() => setOpenFilters(true)} className="flex items-center gap-2 text-slate-200"><Filter/> Filtros</button>
      </div>

      <section className="rounded-3xl border border-white/10 bg-[#0a1425]/80 p-5 lg:hidden">
        <div className="grid grid-cols-2 divide-x divide-white/10"><div><p className="text-slate-400">Total no período</p><p className="mt-3 text-3xl font-bold text-emerald-400">{money(summary.sum)}</p><p className="mt-2 text-slate-400">{purchases.length} compras</p></div><div className="pl-6"><p className="text-slate-400">Média por compra</p><p className="mt-3 flex items-center gap-3 text-3xl font-bold"><span className="grid h-12 w-12 place-items-center rounded-full bg-violet-600/30 text-violet-300"><Wallet/></span>{money(summary.avg)}</p></div></div>
      </section>

      <section className="hidden rounded-3xl border border-white/10 bg-[#0a1425]/80 p-6 lg:block"><ExpenseFilters filters={filters} locations={locations} categories={categories} onChange={(next) => { setFilters(next); setPeriod("Tudo"); }} onSearch={() => loadPurchases(filters)} onClear={clearFilters} /></section>

      <section className="space-y-4 lg:hidden">
        {purchases.map((purchase) => <button key={purchase.id} onClick={() => { setEditingPurchase(purchase); setIsEditing(true); }} className="flex w-full items-center gap-4 rounded-3xl border border-white/10 bg-[#0a1425]/80 p-4 text-left"><div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-lime-500 to-lime-700"><ShoppingCart size={28}/></div><div className="min-w-0 flex-1"><p className="truncate text-xl font-bold">{purchase.locationName ?? 'Local'}</p><p className="mt-1 text-slate-400">{purchase.items?.length ?? 0} itens • {purchase.paymentMethodName ?? 'Cartão Crédito'}</p></div><div className="text-right"><p className="text-sm text-slate-400">{new Date(purchase.date).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</p><p className="mt-2 text-2xl font-bold">{money(total(purchase))}</p></div></button>)}
        <button onClick={() => { setEditingPurchase(null); setIsEditing(true); }} className="flex w-full items-center gap-4 rounded-3xl border border-dashed border-violet-500/70 p-5 text-left text-violet-400"><Plus size={34}/><div><p className="text-xl font-bold">Nova compra rápida</p><p className="text-slate-400">Adicione uma compra em segundos</p></div></button>
      </section>

      <section className="hidden overflow-hidden rounded-3xl border border-white/10 bg-[#0a1425]/80 lg:block">
        <table className="w-full text-sm"><thead className="text-slate-400"><tr><th className="px-6 py-4 text-left">LOCAL</th><th className="text-left">ITENS</th><th className="text-left">TOTAL GASTO</th><th className="text-left">DATA</th><th className="px-6 text-right">AÇÕES</th></tr></thead><tbody>{purchases.map((p) => <tr key={p.id} className="border-t border-white/5"><td className="px-6 py-4 font-bold">{p.locationName ?? 'Local'}</td><td>{p.items?.length ?? 0} itens</td><td className="font-bold">{money(total(p))}</td><td>{new Date(p.date).toLocaleDateString('pt-PT')}</td><td className="px-6 text-right"><button onClick={() => { setEditingPurchase(p); setIsEditing(true); }} className="rounded-xl border border-violet-500/40 px-4 py-2 text-violet-300">Editar</button></td></tr>)}</tbody></table>
      </section>

      {openFilters && <div className="fixed inset-0 z-50 bg-black/70 p-4 backdrop-blur-sm"><div className="mx-auto mt-16 max-h-[82vh] max-w-md overflow-auto rounded-3xl border border-white/10 bg-[#081222] p-5"><div className="mb-4 flex items-center justify-between"><h3 className="text-xl font-bold">Filtros</h3><button onClick={() => setOpenFilters(false)}>✕</button></div><ExpenseFilters filters={filters} locations={locations} categories={categories} onChange={(next) => { setFilters(next); setPeriod("Tudo"); }} onSearch={() => { loadPurchases(filters); setOpenFilters(false); }} onClear={() => { clearFilters(); setOpenFilters(false); }} /></div></div>}
      <button onClick={() => { setEditingPurchase(null); setIsEditing(true); }} className="fixed bottom-28 right-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-violet-700 text-white shadow-2xl shadow-violet-950/60 lg:hidden"><Plus size={40}/></button>
    </div>
  );
};

export default Purchases;
