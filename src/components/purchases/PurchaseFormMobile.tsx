import { useEffect, useMemo, useState } from "react";
import { Calendar, ChevronDown, CreditCard, FileText, Plus, Save, Store, Trash2 } from "lucide-react";
import { paymentMethods } from "../../utils/paymentMethods";

export interface PurchaseFormMobileProps {
  purchase?: any | null;
  locations: any[];
  categories: any[];
  onSave: (data: any) => void;
  onCancel: () => void;
  onAddLocation: () => void;
  onAddCategory: () => void;
  onCategoryCreated?: number | null;
  onLocationCreated?: number | null;
}

const fieldClass = "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-white outline-none focus:border-violet-500/70";
const iconBox = "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-violet-600/15 text-violet-300";

const PurchaseFormMobile: React.FC<PurchaseFormMobileProps> = ({ purchase, locations, categories, onSave, onCancel, onAddLocation, onAddCategory, onCategoryCreated, onLocationCreated }) => {
  const [date, setDate] = useState(purchase?.date?.substring(0, 10) ?? new Date().toISOString().substring(0, 10));
  const [locationId, setLocationId] = useState<number | "">(purchase?.locationId ?? "");
  const [paymentMethod, setPaymentMethod] = useState<number | "">(purchase?.paymentMethod ?? "");
  const [items, setItems] = useState<any[]>([]);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (purchase) {
      setDate(purchase.date?.substring(0, 10));
      setLocationId(purchase.locationId ?? "");
      setPaymentMethod(purchase.paymentMethod ?? "");
      setItems(purchase.items?.map((item: any) => ({ description: item.description ?? "", categoryId: String(item.categoryId ?? ""), quantity: item.quantity ?? 1, price: item.price ?? item.unitPrice ?? item.amount ?? 0 })) ?? []);
    } else {
      setItems([{ description: "", categoryId: "", quantity: 1, price: 0 }]);
      setPaymentMethod("");
    }
  }, [purchase]);

  useEffect(() => { if (onLocationCreated) setLocationId(onLocationCreated); }, [onLocationCreated]);
  useEffect(() => { if (!onCategoryCreated) return; setItems(prev => { const copy = [...prev]; if (copy.length) copy[copy.length - 1].categoryId = String(onCategoryCreated); return copy; }); }, [onCategoryCreated]);

  const total = useMemo(() => items.reduce((s, item) => s + Number(item.quantity || 0) * Number(item.price || 0), 0), [items]);
  const money = (v: number) => `€ ${v.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const addItem = () => setItems([...items, { description: "", categoryId: "", quantity: 1, price: 0 }]);
  const updateItem = (index: number, patch: any) => setItems(items.map((item, i) => i === index ? { ...item, ...patch } : item));

  const handleSave = () => {
    if (!locationId) return alert("Selecione o local");
    if (paymentMethod === "") return alert("Selecione a forma de pagamento");
    if (!items.length) return alert("Adicione pelo menos um item");
    for (const item of items) if (!item.description || !item.categoryId) return alert("Preencha produto e categoria em todos os itens");
    onSave({ date, locationId: Number(locationId), paymentMethod: Number(paymentMethod), items: items.map(item => ({ description: item.description, categoryId: Number(item.categoryId), quantity: Number(item.quantity), price: Number(item.price) })) });
  };

  return (
    <div className="-mx-4 -mt-20 min-h-screen bg-[#020513] px-5 pb-32 pt-20 sm:-mx-6 sm:px-6">
      <div className="mb-8 flex items-center justify-between"><button onClick={onCancel} className="text-slate-200">←</button><h1 className="text-2xl font-bold">Nova compra</h1><div className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.06]"><FileText size={20}/></div></div>
      <div className="mb-8 flex items-center gap-3"><div className="h-1.5 flex-1 rounded-full bg-violet-600"/><div className="h-1.5 flex-1 rounded-full bg-violet-600"/><div className="h-1.5 flex-1 rounded-full bg-white/10"/><span className="rounded-full bg-white/[0.06] px-3 py-1 text-sm">1 de 3</span></div>

      <div className="space-y-4">
        <div className="rounded-3xl border border-white/10 bg-[#0a1425]/80 p-4"><div className="flex items-center gap-4"><div className={iconBox}><Store/></div><label className="flex-1"><span className="text-xs text-slate-400">Local</span><select value={locationId} onChange={e => setLocationId(e.target.value ? Number(e.target.value) : "")} className="mt-1 w-full bg-transparent text-lg font-bold outline-none"><option className="bg-slate-900" value="">Selecione</option>{locations.map(l => <option className="bg-slate-900" key={l.id} value={l.id}>{l.name}</option>)}</select></label><button onClick={onAddLocation} className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-600"><Plus/></button></div></div>
        <div className="rounded-3xl border border-white/10 bg-[#0a1425]/80 p-4"><div className="flex items-center gap-4"><div className={iconBox}><CreditCard/></div><label className="flex-1"><span className="text-xs text-slate-400">Forma de pagamento</span><select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value ? Number(e.target.value) : "")} className="mt-1 w-full bg-transparent text-lg font-bold outline-none"><option className="bg-slate-900" value="">Selecione</option>{paymentMethods.map((p: any) => <option className="bg-slate-900" key={p.value} value={p.value}>{p.label}</option>)}</select></label><ChevronDown/></div></div>
        <div className="rounded-3xl border border-white/10 bg-[#0a1425]/80 p-4"><div className="flex items-center gap-4"><div className={iconBox}><Calendar/></div><label className="flex-1"><span className="text-xs text-slate-400">Data da compra</span><input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 w-full bg-transparent text-lg font-bold outline-none" /></label></div></div>
      </div>

      <div className="mb-4 mt-8 flex items-center justify-between"><h2 className="text-2xl font-bold">Itens da compra</h2><button onClick={() => setCompact(!compact)} className="rounded-full bg-white/[0.06] px-4 py-2 text-sm">{compact ? "Editar itens" : `${items.length} itens`}</button></div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-3xl border border-white/10 bg-[#0a1425]/80 p-4">
            <div className="mb-4 flex items-center gap-4"><span className="grid h-9 w-9 place-items-center rounded-full bg-violet-600 font-bold">{index + 1}</span><input placeholder="Nome do produto" value={item.description} onChange={e => updateItem(index, { description: e.target.value })} className="min-w-0 flex-1 bg-transparent text-lg font-bold outline-none"/><button onClick={() => setItems(items.filter((_, i) => i !== index))} className="text-red-400"><Trash2/></button></div>
            {!compact && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Categoria</span>
                  <div className="grid grid-cols-[1fr_auto] gap-3">
                    <select
                      value={item.categoryId ?? ""}
                      onChange={e => updateItem(index, { categoryId: e.target.value })}
                      className={fieldClass}
                    >
                      <option className="bg-slate-900" value="">Selecione a categoria</option>
                      {categories.map(c => <option className="bg-slate-900" key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button
                      type="button"
                      onClick={onAddCategory}
                      className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-950/40"
                      aria-label="Criar nova categoria"
                    >
                      <Plus size={22}/>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Quantidade</span>
                    <input
                      type="number"
                      min={1}
                      inputMode="decimal"
                      value={item.quantity}
                      onChange={e => updateItem(index, { quantity: e.target.value })}
                      onBlur={e => updateItem(index, { quantity: Number(e.target.value || 1) })}
                      className={fieldClass}
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Preço unitário</span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      inputMode="decimal"
                      value={item.price}
                      onChange={e => updateItem(index, { price: e.target.value })}
                      onBlur={e => updateItem(index, { price: Number(e.target.value || 0) })}
                      className={fieldClass}
                    />
                  </label>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-violet-500/20 bg-violet-600/10 p-4">
                  <span className="text-sm text-slate-300">Total do item</span>
                  <strong className="text-xl text-violet-300">{money(Number(item.quantity || 0) * Number(item.price || 0))}</strong>
                </div>
              </div>
            )}
            {compact && <div className="flex items-center justify-between text-slate-400"><span>{item.quantity || 1} x {money(Number(item.price || 0))}</span><span className="font-bold text-white">{money(Number(item.quantity || 0) * Number(item.price || 0))}</span></div>}
          </div>
        ))}
      </div>

      <button onClick={addItem} className="mt-5 w-full rounded-3xl border border-dashed border-violet-500/70 py-5 text-lg font-bold text-violet-300">+ Novo produto</button>
      <div className="fixed bottom-0 left-0 right-0 z-40 rounded-t-3xl border-t border-white/10 bg-[#0a1425]/95 p-5 backdrop-blur-xl"><p className="text-sm text-slate-400">TOTAL DA COMPRA</p><p className="mb-4 mt-1 text-3xl font-bold text-violet-400">{money(total)}</p><button onClick={handleSave} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 py-4 text-lg font-bold"><Save/> Salvar compra</button></div>
    </div>
  );
};

export default PurchaseFormMobile;
