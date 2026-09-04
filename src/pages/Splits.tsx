import { Check, Plus, ReceiptText, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { getLoggedUser } from "../utils/auth";

type Friend = { id: number; fullName: string; email: string };
type Split = { id: number; description: string; totalAmount: number; paidByUserId: number; createdAt: string; participants: { id: number; userId: number; name: string; amount: number; isPaid: boolean }[] };

export default function Splits() {
  const me = getLoggedUser(); const myId = Number(me?.id);
  const [friends, setFriends] = useState<Friend[]>([]); const [splits, setSplits] = useState<Split[]>([]);
  const [description, setDescription] = useState(""); const [total, setTotal] = useState(""); const [selected, setSelected] = useState<number[]>([]);
  const [custom, setCustom] = useState(false); const [amounts, setAmounts] = useState<Record<number, string>>({}); const [message, setMessage] = useState("");
  const people = useMemo(() => [{ id: myId, fullName: me?.fullName ?? me?.full_Name ?? "Você", email: "" }, ...friends.filter(f => selected.includes(f.id))], [myId, me, friends, selected]);
  const equalAmount = people.length ? (Number(total || 0) / people.length).toFixed(2) : "0.00";
  const load = async () => { const [f, s] = await Promise.all([api.get("/friendships"), api.get("/splits")]); setFriends(f.data); setSplits(s.data); };
  useEffect(() => { load().catch(() => setMessage("Não foi possível carregar as divisões.")); }, []);
  const toggle = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const create = async () => {
    const value = Number(total); const participants = people.map(person => ({ userId: person.id, amount: Number(custom ? amounts[person.id] || 0 : equalAmount) }));
    if (!description.trim() || !value || people.length < 2) return setMessage("Informe descrição, valor e pelo menos um amigo.");
    try { await api.post("/splits", { description, totalAmount: value, participants }); setDescription(""); setTotal(""); setSelected([]); setAmounts({}); setMessage("Conta dividida com sucesso."); await load(); }
    catch (e: any) { setMessage(e.response?.data?.error ?? "Não foi possível criar a divisão."); }
  };
  const markPaid = async (id: number) => { await api.post(`/splits/participants/${id}/paid`); await load(); };

  return <div className="mx-auto max-w-5xl space-y-6 pb-8"><div><h1 className="text-3xl font-black">Dividir conta</h1><p className="mt-1 text-slate-400">Crie uma divisão e acompanhe quem já acertou a parte.</p></div>
    <section className="rounded-3xl border border-white/10 bg-[#081222]/80 p-5"><h2 className="mb-4 flex items-center gap-2 text-lg font-black"><Plus size={20} className="text-violet-300"/>Nova divisão</h2><div className="grid gap-3 sm:grid-cols-2"><input value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex.: Jantar de sexta" className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 outline-none"/><input value={total} onChange={e => setTotal(e.target.value)} type="number" min="0.01" step="0.01" placeholder="Valor total" className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 outline-none"/></div>
      <div className="mt-4"><p className="mb-2 text-sm font-semibold">Participantes</p><div className="grid gap-2 sm:grid-cols-2">{friends.map(friend => <label key={friend.id} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3"><input type="checkbox" checked={selected.includes(friend.id)} onChange={() => toggle(friend.id)} /><span className="min-w-0"><b className="block truncate">{friend.fullName}</b><span className="text-xs text-slate-400">{friend.email}</span></span></label>)}</div>{!friends.length && <p className="text-sm text-slate-400">Adicione amigos antes de criar uma divisão.</p>}</div>
      <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={custom} onChange={e => setCustom(e.target.checked)}/> Definir valores personalizados</label>
      {people.length > 1 && <div className="mt-3 space-y-2 rounded-2xl border border-white/10 p-3">{people.map(person => <div key={person.id} className="flex items-center justify-between gap-4"><span>{person.id === myId ? "Você" : person.fullName}</span>{custom ? <input type="number" step="0.01" min="0" value={amounts[person.id] ?? ""} onChange={e => setAmounts(a => ({ ...a, [person.id]: e.target.value }))} className="h-9 w-28 rounded-lg bg-white/[0.06] px-2 text-right"/> : <b>€ {equalAmount}</b>}</div>)}</div>}
      <button onClick={create} className="accent-surface mt-5 inline-flex h-11 items-center gap-2 rounded-2xl px-5 font-bold"><ReceiptText size={18}/>Criar divisão</button></section>
    {message && <p className="rounded-2xl border border-violet-400/30 bg-violet-500/10 px-4 py-3 text-sm text-violet-200">{message}</p>}
    <section className="rounded-3xl border border-white/10 bg-[#081222]/80 p-5"><h2 className="mb-4 flex items-center gap-2 text-lg font-black"><Users size={20} className="text-violet-300"/>Divisões recentes</h2>{splits.length ? <div className="space-y-4">{splits.map(split => <article key={split.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="flex justify-between gap-4"><div><h3 className="font-bold">{split.description}</h3><p className="text-sm text-slate-400">Total: € {Number(split.totalAmount).toFixed(2)}</p></div><span className="text-xs text-slate-400">{new Date(split.createdAt).toLocaleDateString("pt-PT")}</span></div><div className="mt-3 space-y-2">{split.participants.map(p => <div key={p.id} className="flex items-center justify-between text-sm"><span>{p.userId === myId ? "Você" : p.name}</span><span className={p.isPaid ? "text-emerald-300" : "text-orange-300"}>€ {Number(p.amount).toFixed(2)} · {p.isPaid ? "Pago" : "Pendente"}</span>{p.userId === myId && !p.isPaid && <button onClick={() => markPaid(p.id)} className="ml-2 inline-flex items-center gap-1 text-emerald-300"><Check size={15}/>Marcar pago</button>}</div>)}</div></article>)}</div> : <p className="text-sm text-slate-400">Nenhuma conta dividida ainda.</p>}</section>
  </div>;
}
