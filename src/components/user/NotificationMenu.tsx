import { Bell, CheckCircle2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { getLoggedUser } from "../../utils/auth";

type Notice = { id: string; title: string; detail: string; path: string; icon: "friend" | "split" };

export default function NotificationMenu({ onCountChange }: { onCountChange?: (count: number) => void }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [requestsResult, splitsResult] = await Promise.allSettled([api.get("/friendships/requests"), api.get("/splits")]);
      const userId = Number(getLoggedUser()?.id);
      const requests = requestsResult.status === "fulfilled" ? requestsResult.value.data : [];
      const splits = splitsResult.status === "fulfilled" ? splitsResult.value.data : [];
      const friendNotices = (requests ?? []).map((request: any) => ({ id: `friend-${request.id}`, title: "Novo pedido de amizade", detail: `${request.fullName} quer adicionar você.`, path: "/friends", icon: "friend" as const }));
      const splitNotices = (splits ?? []).flatMap((split: any) => (split.participants ?? [])
        .filter((participant: any) => participant.userId === userId && !participant.isPaid)
        .map((participant: any) => ({ id: `split-${participant.id}`, title: "Parcela pendente", detail: `${split.description}: € ${Number(participant.amount).toFixed(2)}`, path: "/splits", icon: "split" as const })));
      const next = [...friendNotices, ...splitNotices];
      setNotices(next); onCountChange?.(next.length);
    } catch {
      setNotices([]); onCountChange?.(0);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  const goTo = (path: string) => { setOpen(false); navigate(path); };

  return <div className="relative">
    <button type="button" onClick={() => { setOpen(value => !value); if (!open) load(); }} aria-label="Notificações" className="relative grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10">
      <Bell size={20} />
      {notices.length > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">{notices.length > 9 ? "9+" : notices.length}</span>}
    </button>
    {open && <div className="absolute right-0 top-13 z-[80] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#081222] shadow-2xl shadow-black/50">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3"><b>Notificações</b><button onClick={() => goTo("/friends")} className="text-xs font-semibold text-violet-300">Ver amigos</button></div>
      <div className="max-h-80 overflow-y-auto">{loading ? <p className="p-4 text-sm text-slate-400">Carregando...</p> : notices.length ? notices.map(notice => <button key={notice.id} onClick={() => goTo(notice.path)} className="flex w-full items-start gap-3 border-b border-white/5 p-4 text-left hover:bg-white/[0.04]"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${notice.icon === "friend" ? "bg-violet-500/15 text-violet-300" : "bg-orange-500/15 text-orange-300"}`}>{notice.icon === "friend" ? <UserPlus size={18}/> : <CheckCircle2 size={18}/>}</span><span><b className="block text-sm">{notice.title}</b><span className="mt-0.5 block text-xs text-slate-400">{notice.detail}</span></span></button>) : <p className="p-5 text-center text-sm text-slate-400">Você não tem notificações pendentes.</p>}</div>
      <button onClick={() => goTo("/splits")} className="w-full border-t border-white/10 px-4 py-3 text-left text-sm font-semibold text-violet-300 hover:bg-white/[0.04]">Ver divisões de conta</button>
    </div>}
  </div>;
}
