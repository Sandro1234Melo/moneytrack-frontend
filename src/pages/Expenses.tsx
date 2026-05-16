import React, { useEffect, useMemo, useState } from "react";
import { Calendar, ChevronDown, ChevronUp, CreditCard, Download, FileText, MapPin, ShoppingCart, TrendingUp, Wallet } from "lucide-react";
import api from "../api/axios";
import { getLoggedUser } from "../utils/auth";
import { Button } from "../components/ui/Button";
import ExpenseFilters, { type Filters } from "../components/ui/ExpenseFilters";

type ExpenseItem = { id: number; quantity?: number; description: string; amount?: number; price?: number; unitPrice?: number; categoryName?: string };
type Expense = { id: number; date: string; locationName?: string | null; paymentMethodName?: string; paymentMethod?: number; items: ExpenseItem[] };

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [openFilters, setOpenFilters] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const user = getLoggedUser();
  const userId = user?.id;
  const currency = user?.currencySymbol || "€";

  const [filters, setFilters] = useState<Filters>({ fromDate: "", toDate: "", locationId: "", categoryId: "", noteId: "", description: "", minValue: "", maxValue: "" });

  const itemTotal = (item: ExpenseItem) => Number(item.amount ?? (Number(item.quantity ?? 1) * Number(item.price ?? item.unitPrice ?? 0)));
  const expenseTotal = (e: Expense) => e.items?.reduce((sum, item) => sum + itemTotal(item), 0) ?? 0;
  const money = (v: number) => `${currency} ${v.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const fetchExpenses = async (customFilters: Filters = filters) => {
    try {
      const response = await api.get(`/expenses`, { params: { userId, from: customFilters.fromDate || undefined, to: customFilters.toDate || undefined, locationId: customFilters.locationId || undefined, categoryId: customFilters.categoryId || undefined, description: customFilters.description || undefined, min: customFilters.minValue || undefined, max: customFilters.maxValue || undefined } });
      setExpenses(response.data);
      if (response.data?.[0]?.id) setExpandedId(response.data[0].id);
    } catch (error) { console.error("Erro ao carregar despesas:", error); }
  };

  useEffect(() => {
    if (!userId) return;
    fetchExpenses();
    api.get(`/locations/${userId}`).then((res) => setLocations(res.data)).catch(() => null);
    api.get(`/categories/${userId}`).then((res) => setCategories(res.data)).catch(() => null);
  }, [userId]);

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + expenseTotal(e), 0);
    const qtd = expenses.reduce((sum, e) => sum + (e.items?.length ?? 0), 0);
    const highest = expenses.reduce((max, e) => Math.max(max, expenseTotal(e)), 0);
    return { total, qtd, avg: expenses.length ? total / expenses.length : 0, highest };
  }, [expenses]);

  const exportFile = async (type: "excel" | "pdf") => {
    const response = await api.get(`/expenses/export/${type}`, { params: { userId, from: filters.fromDate || undefined, to: filters.toDate || undefined, locationId: filters.locationId || undefined, categoryId: filters.categoryId || undefined, description: filters.description || undefined, min: filters.minValue || undefined, max: filters.maxValue || undefined }, responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `gastos.${type === "excel" ? "xlsx" : "pdf"}`);
    document.body.appendChild(link);
    link.click();
  };

  const clear = () => { const empty: Filters = { fromDate: "", toDate: "", locationId: "", categoryId: "", noteId: "", description: "", minValue: "", maxValue: "" }; setFilters(empty); fetchExpenses(empty); };

  const payment = (e: Expense) => e.paymentMethodName ?? (["", "Dinheiro", "Cartão Crédito", "Cartão Débito", "PIX", "MB Way"][Number(e.paymentMethod)] ?? "Cartão Débito");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div><h1 className="text-3xl font-bold tracking-tight">Meus Gastos</h1><p className="mt-1 text-slate-400">Histórico de despesas registradas</p></div>
        <div className="relative">
          <Button label="Exportar" icon={Download} variant="secondary" onClick={() => setOpenExport(!openExport)} />
          {openExport && <div className="absolute right-0 z-40 mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#081222] shadow-2xl"><button className="block w-full px-4 py-3 text-left hover:bg-white/5" onClick={() => exportFile("excel")}>Exportar Excel</button><button className="block w-full px-4 py-3 text-left hover:bg-white/5" onClick={() => exportFile("pdf")}>Exportar PDF</button></div>}
        </div>
      </div>

      <section className="hidden rounded-3xl border border-white/10 bg-[#0a1425]/80 p-6 lg:block">
        <ExpenseFilters filters={filters} locations={locations} categories={categories} onChange={setFilters} onSearch={() => fetchExpenses(filters)} onClear={clear} />
      </section>

      <div className="flex justify-end lg:hidden"><Button label="Filtros" variant="secondary" onClick={() => setOpenFilters(true)} /></div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[{t:'Total gasto',v:money(stats.total),s:`${expenses.length} despesas`,i:Wallet,c:'text-violet-300 bg-violet-500/15'}, {t:'Ticket médio',v:money(stats.avg),s:'por despesa',i:Wallet,c:'text-emerald-300 bg-emerald-500/15'}, {t:'Quantidade',v:`${stats.qtd} itens`,s:'comprados',i:ShoppingCart,c:'text-blue-300 bg-blue-500/15'}, {t:'Maior gasto',v:money(stats.highest),s:'no período',i:TrendingUp,c:'text-orange-300 bg-orange-500/15'}].map(({t,v,s,i:Icon,c}) => <div key={t} className="rounded-3xl border border-white/10 bg-[#0a1425]/80 p-5"><div className={`mb-6 grid h-14 w-14 place-items-center rounded-2xl ${c}`}><Icon size={25}/></div><p className="text-slate-300">{t}</p><p className="mt-2 text-2xl font-bold">{v}</p><p className="mt-1 text-slate-400">{s}</p></div>)}
      </section>

      <section className="space-y-3">
        {expenses.map((expense) => {
          const open = expandedId === expense.id;
          const total = expenseTotal(expense);
          return (
            <article key={expense.id} className="rounded-3xl border border-white/10 bg-[#0a1425]/80 p-4 shadow-2xl shadow-black/20 lg:p-6">
              <button className="flex w-full items-center gap-4 text-left" onClick={() => setExpandedId(open ? null : expense.id)}>
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-violet-600/20 text-violet-300"><FileText size={24}/></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2"><h3 className="font-bold">Nota: {expense.id}</h3><span className="flex items-center gap-2 text-slate-400"><Calendar size={16}/>{new Date(expense.date).toLocaleDateString('pt-PT')}</span><span className="flex items-center gap-2 text-slate-400"><CreditCard size={16}/>{payment(expense)}</span><span className="flex items-center gap-2 text-slate-400"><MapPin size={16}/>{expense.locationName ?? 'Local'}</span></div>
                </div>
                <div className="text-right"><p className="text-slate-300">Qtd: {expense.items?.length ?? 0}</p><p className="text-xl font-bold">{money(total)}</p></div>
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-600/20 text-violet-300">{open ? <ChevronUp/> : <ChevronDown/>}</div>
              </button>
              {open && <div className="mt-5 overflow-x-auto rounded-2xl border border-white/5"><table className="w-full min-w-[720px] text-sm"><thead className="text-slate-400"><tr><th className="px-4 py-3 text-left">PRODUTO</th><th>QUANTIDADE</th><th>CATEGORIA</th><th>PREÇO UNIT.</th><th className="px-4 text-right">TOTAL</th></tr></thead><tbody>{expense.items?.map((item, idx) => <tr key={item.id ?? idx} className="border-t border-white/5"><td className="px-4 py-4 font-semibold">{item.description}</td><td className="text-center">{item.quantity ?? 1}</td><td className="text-center">{item.categoryName ?? '-'}</td><td className="text-center">{money(Number(item.price ?? item.unitPrice ?? item.amount ?? 0))}</td><td className="px-4 text-right font-bold">{money(itemTotal(item))}</td></tr>)}</tbody></table></div>}
            </article>
          )
        })}
      </section>

      {openFilters && <div className="fixed inset-0 z-50 bg-black/70 p-4 backdrop-blur-sm lg:hidden"><div className="mx-auto mt-16 max-h-[82vh] max-w-md overflow-auto rounded-3xl border border-white/10 bg-[#081222] p-5"><div className="mb-4 flex items-center justify-between"><h3 className="text-xl font-bold">Filtrar despesas</h3><button onClick={() => setOpenFilters(false)}>✕</button></div><ExpenseFilters filters={filters} locations={locations} categories={categories} onChange={setFilters} onSearch={() => { fetchExpenses(filters); setOpenFilters(false); }} onClear={() => { clear(); setOpenFilters(false); }} /></div></div>}
    </div>
  );
};

export default Expenses;
