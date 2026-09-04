import { Check, Search, UserPlus, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import api, { getApiAssetUrl } from "../api/axios";

type Profile = { id: number; fullName: string; email: string; profileImageUrl?: string | null };
type Request = Profile & { id: number; userId: number };

const Avatar = ({ profile }: { profile: Profile }) => (
  <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-violet-600 to-blue-600 font-bold">
    {profile.profileImageUrl ? <img src={getApiAssetUrl(profile.profileImageUrl)} className="h-full w-full object-cover" alt="" /> : profile.fullName.slice(0, 2).toUpperCase()}
  </div>
);

export default function Friends() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [friends, setFriends] = useState<Profile[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [message, setMessage] = useState("");

  const load = async () => {
    const [friendsRes, requestsRes] = await Promise.all([api.get("/friendships"), api.get("/friendships/requests")]);
    setFriends(friendsRes.data); setRequests(requestsRes.data);
  };
  useEffect(() => { load().catch(() => setMessage("Não foi possível carregar amigos.")); }, []);
  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (query.trim().length < 2) { setResults([]); setSearchError(""); return; }
      try {
        setSearching(true); setSearchError("");
        setResults((await api.get("/friendships/search", { params: { q: query.trim() } })).data);
      }
      catch (e: any) { setResults([]); setSearchError(e.response?.data?.error ?? "Não foi possível pesquisar perfis."); }
      finally { setSearching(false); }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query]);
  const send = async (userId: number) => { try { await api.post("/friendships/requests", { userId }); setMessage("Pedido enviado."); setResults([]); setQuery(""); } catch (e: any) { setMessage(e.response?.data?.error ?? "Não foi possível enviar o pedido."); } };
  const respond = async (id: number, action: "accept" | "decline") => { try { await api.post(`/friendships/requests/${id}/${action}`); setMessage(action === "accept" ? "Pedido aceito." : "Pedido recusado."); await load(); } catch { setMessage("Não foi possível responder ao pedido."); } };

  return <div className="mx-auto max-w-4xl space-y-6 pb-8">
    <div><h1 className="text-3xl font-black">Amigos</h1><p className="mt-1 text-slate-400">Adicione pessoas para dividir despesas em breve.</p></div>
    <section className="rounded-3xl border border-white/10 bg-[#081222]/80 p-5"><label className="mb-2 block text-sm font-semibold">Encontrar perfis</label><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Nome ou e-mail" className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 outline-none focus:border-violet-500/70" /></div>
      {query.trim().length === 1 && <p className="mt-3 text-sm text-slate-400">Digite pelo menos 2 caracteres para pesquisar.</p>}
      {searching && <p className="mt-3 text-sm text-slate-400">Pesquisando perfis...</p>}
      {searchError && <p className="mt-3 text-sm text-red-300">{searchError}</p>}
      {!searching && !searchError && query.trim().length >= 2 && results.length === 0 && <p className="mt-3 text-sm text-slate-400">Nenhum perfil disponível foi encontrado.</p>}
      {results.length > 0 && <div className="mt-3 divide-y divide-white/10 rounded-2xl border border-white/10">{results.map(profile => <div key={profile.id} className="flex items-center gap-3 p-3"><Avatar profile={profile}/><div className="min-w-0 flex-1"><p className="truncate font-bold">{profile.fullName}</p><p className="truncate text-sm text-slate-400">{profile.email}</p></div><button onClick={() => send(profile.id)} className="accent-surface inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold"><UserPlus size={16}/>Adicionar</button></div>)}</div>}
    </section>
    {message && <p className="rounded-2xl border border-violet-400/30 bg-violet-500/10 px-4 py-3 text-sm text-violet-200">{message}</p>}
    {requests.length > 0 && <section className="rounded-3xl border border-white/10 bg-[#081222]/80 p-5"><h2 className="mb-3 text-lg font-black">Pedidos recebidos</h2><div className="space-y-3">{requests.map(request => <div key={request.id} className="flex items-center gap-3"><Avatar profile={{ ...request, id: request.userId }}/><div className="min-w-0 flex-1"><p className="truncate font-bold">{request.fullName}</p><p className="truncate text-sm text-slate-400">{request.email}</p></div><button onClick={() => respond(request.id, "accept")} className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600"><Check size={18}/></button><button onClick={() => respond(request.id, "decline")} className="grid h-10 w-10 place-items-center rounded-xl bg-red-600"><X size={18}/></button></div>)}</div></section>}
    <section className="rounded-3xl border border-white/10 bg-[#081222]/80 p-5"><h2 className="mb-4 flex items-center gap-2 text-lg font-black"><Users size={20} className="text-violet-300"/>Meus amigos</h2>{friends.length ? <div className="grid gap-3 sm:grid-cols-2">{friends.map(profile => <div key={profile.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3"><Avatar profile={profile}/><div className="min-w-0"><p className="truncate font-bold">{profile.fullName}</p><p className="truncate text-sm text-slate-400">{profile.email}</p></div></div>)}</div> : <p className="text-sm text-slate-400">Ainda não tem amigos adicionados.</p>}</section>
  </div>;
}
