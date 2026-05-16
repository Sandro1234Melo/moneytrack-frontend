import { useEffect, useMemo, useState } from "react";
import { Calendar, CreditCard, Plus, Save, ShoppingBag, Trash2 } from "lucide-react";
import { paymentMethods } from "../../utils/paymentMethods";
import QuickCreateModal from "../ui/QuickCreateModal";
import api from "../../api/axios";
import { getLoggedUser } from "../../utils/auth";

type Props = { purchase?: any | null; locations: any[]; categories: any[]; onSave: (data: any) => void; onCancel: () => void };
const fieldClass = "h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none focus:border-violet-500/70";

const PurchaseFormDesktop: React.FC<Props> = ({ purchase, locations, categories, onSave, onCancel }) => {
  const user = getLoggedUser();
  const [date, setDate] = useState("");
  const [locationId, setLocationId] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState<number | "">("");
  const [items, setItems] = useState<any[]>([]);
  const [localCategories, setLocalCategories] = useState<any[]>(categories);
  const [localLocations, setLocalLocations] = useState<any[]>(locations);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openLocationModal, setOpenLocationModal] = useState(false);

  useEffect(() => setLocalCategories(categories), [categories]);
  useEffect(() => setLocalLocations(locations), [locations]);
  useEffect(() => {
    if (purchase) {
      setDate(purchase.date?.substring(0, 10) ?? new Date().toISOString().substring(0, 10));
      setLocationId(purchase.locationId ? Number(purchase.locationId) : "");
      setPaymentMethod(purchase.paymentMethod !== undefined ? Number(purchase.paymentMethod) : "");
      setItems(purchase.items?.map((item: any) => ({ description: item.description ?? "", categoryId: String(item.categoryId ?? ""), quantity: item.quantity ?? 1, price: item.price ?? item.unitPrice ?? item.amount ?? 0 })) ?? []);
    } else {
      setDate(new Date().toISOString().substring(0, 10));
      setLocationId(""); setPaymentMethod("");
      setItems([{ description: "", categoryId: "", quantity: 1, price: 0 }]);
    }
  }, [purchase]);

  const total = useMemo(() => items.reduce((s, item) => s + Number(item.quantity || 0) * Number(item.price || 0), 0), [items]);
  const money = (v: number) => `€ ${v.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const addItem = () => setItems([...items, { description: "", categoryId: "", quantity: 1, price: 0 }]);
  const updateItem = (index: number, patch: any) => setItems(items.map((item, i) => i === index ? { ...item, ...patch } : item));

  const submit = () => {
    if (!locationId) return alert("Selecione o local");
    if (paymentMethod === "") return alert("Selecione a forma de pagamento");
    if (!items.length) return alert("Adicione pelo menos um item");
    onSave({ date, locationId: Number(locationId), paymentMethod: Number(paymentMethod), items: items.map(item => ({ description: item.description, categoryId: Number(item.categoryId), quantity: Number(item.quantity), price: Number(item.price) })) });
  };

  const handleCreateCategory = async (data: any) => { const response = await api.post("/categories", { name: data.name, user_Id: user?.id }); setLocalCategories(prev => [...prev, response.data]); updateItem(items.length - 1, { categoryId: String(response.data.id) }); setOpenCategoryModal(false); };
  const handleCreateLocation = async (data: any) => { const response = await api.post("/locations", { name: data.name, user_Id: user?.id }); setLocalLocations(prev => [...prev, response.data]); setLocationId(response.data.id); setOpenLocationModal(false); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">Compras › Nova Compra</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Nova Compra</h1><p className="text-slate-400">Registre os detalhes da sua compra</p></div></div>
      <section className="grid max-w-4xl grid-cols-2 gap-6 rounded-3xl border border-white/10 bg-[#0a1425]/80 p-6"><div className="flex items-center gap-5"><div className="grid h-16 w-16 place-items-center rounded-3xl bg-violet-600/20 text-violet-300"><ShoppingBag size={30}/></div><div><p className="text-slate-400">Itens da compra</p><p className="text-3xl font-bold">{items.length} itens</p></div></div><div className="border-l border-white/10 pl-12"><p className="text-slate-400">Total da compra</p><p className="text-4xl font-bold text-violet-400">{money(total)}</p></div></section>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-3xl border border-white/10 bg-[#0a1425]/80 p-6"><h2 className="mb-6 text-xl font-bold">Informações da compra</h2><div className="grid grid-cols-[1fr_auto_1fr_1fr] gap-4"><label><span className="mb-2 block text-sm text-slate-400">Local / Estabelecimento</span><select className={`${fieldClass} w-full`} value={locationId} onChange={e => setLocationId(e.target.value ? Number(e.target.value) : "")}><option className="bg-slate-900" value="">Selecione</option>{localLocations.map(l => <option className="bg-slate-900" key={l.id} value={l.id}>{l.name}</option>)}</select></label><button onClick={() => setOpenLocationModal(true)} className="mt-7 grid h-12 w-12 place-items-center rounded-xl bg-violet-600"><Plus/></button><label><span className="mb-2 block text-sm text-slate-400">Data da compra</span><div className={`${fieldClass} flex items-center gap-2`}><Calendar size={16}/><input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-transparent outline-none" /></div></label><label><span className="mb-2 block text-sm text-slate-400">Forma de pagamento</span><select className={`${fieldClass} w-full`} value={paymentMethod} onChange={e => setPaymentMethod(e.target.value ? Number(e.target.value) : "")}><option className="bg-slate-900" value="">Selecione</option>{paymentMethods.map((p: any) => <option className="bg-slate-900" key={p.value} value={p.value}>{p.label}</option>)}</select></label></div>
          <div className="my-6 h-px bg-white/10"/><h2 className="mb-4 text-xl font-bold">Itens da compra</h2><div className="space-y-3">{items.map((item, index) => <div key={index} className="grid grid-cols-[34px_1.3fr_1fr_auto_0.7fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-600 text-sm font-bold">{index + 1}</span><input className={fieldClass} placeholder="Produto" value={item.description} onChange={e => updateItem(index, { description: e.target.value })}/><select className={fieldClass} value={item.categoryId} onChange={e => updateItem(index, { categoryId: e.target.value })}><option className="bg-slate-900" value="">Categoria</option>{localCategories.map(c => <option className="bg-slate-900" key={c.id} value={c.id}>{c.name}</option>)}</select><button onClick={() => setOpenCategoryModal(true)} className="grid h-12 w-12 place-items-center rounded-xl bg-violet-600"><Plus size={18}/></button><div className="flex overflow-hidden rounded-xl border border-white/10"><button onClick={() => updateItem(index, { quantity: Math.max(1, Number(item.quantity) - 1) })} className="h-12 w-10 bg-white/[0.04]">−</button><input type="number" min={1} className="h-12 w-14 bg-transparent text-center outline-none" value={item.quantity} onChange={e => updateItem(index, { quantity: Number(e.target.value) })}/><button onClick={() => updateItem(index, { quantity: Number(item.quantity) + 1 })} className="h-12 w-10 bg-white/[0.04]">+</button></div><div className="flex items-center gap-3"><input type="number" min={0} step="0.01" className={`${fieldClass} w-24`} value={item.price} onChange={e => updateItem(index, { price: Number(e.target.value) })}/><strong className="w-24 text-right text-violet-300">{money(Number(item.quantity || 0) * Number(item.price || 0))}</strong><button onClick={() => setItems(items.filter((_, i) => i !== index))} className="text-red-400"><Trash2 size={18}/></button></div></div>)}</div><button onClick={addItem} className="mt-5 w-full rounded-2xl border border-dashed border-violet-500/70 py-4 font-bold text-violet-300">+ Adicionar novo item</button><div className="mt-6 flex justify-end gap-4"><button onClick={onCancel} className="rounded-xl border border-white/10 px-8 py-3 font-bold">Cancelar</button><button onClick={submit} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-3 font-bold"><Save size={18}/> Salvar compra</button></div></section>
        <aside className="h-max rounded-3xl border border-white/10 bg-[#0a1425]/80 p-6"><h3 className="mb-5 flex items-center gap-2 font-bold"><CreditCard className="text-violet-300"/> Resumo da compra</h3><div className="space-y-4 text-sm"><div className="flex justify-between text-slate-400"><span>Itens</span><strong className="text-white">{items.length} itens</strong></div><div className="flex justify-between text-slate-400"><span>Subtotal</span><strong className="text-white">{money(total)}</strong></div><div className="flex justify-between text-slate-400"><span>Taxas</span><strong className="text-white">€ 0,00</strong></div><div className="h-px bg-white/10"/><p className="text-slate-400">TOTAL</p><p className="text-4xl font-bold text-violet-400">{money(total)}</p></div><div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm text-slate-400">Compra segura<br/>Seus dados estão protegidos e criptografados.</div></aside>
      </div>
      <QuickCreateModal open={openCategoryModal} title="Nova categoria" fields={[{ name: "name", label: "Nome", placeholder: "Ex: Alimentação" }]} onClose={() => setOpenCategoryModal(false)} onSubmit={handleCreateCategory}/>
      <QuickCreateModal open={openLocationModal} title="Novo local" fields={[{ name: "name", label: "Nome", placeholder: "Ex: Supermercado" }]} onClose={() => setOpenLocationModal(false)} onSubmit={handleCreateLocation}/>
    </div>
  );
};

export default PurchaseFormDesktop;
