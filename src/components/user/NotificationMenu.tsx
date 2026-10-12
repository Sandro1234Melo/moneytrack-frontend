import { AlertTriangle, Bell, CheckCircle2, ClipboardList, Target, UserPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { getLoggedUser } from "../../utils/auth";

type Notice = { id: string; title: string; detail: string; path: string; icon: "friend" | "split" | "goal" | "list" | "spending" };
type FriendRequest = { id: number; fullName: string };
type SplitParticipant = { id: number; userId: number; isPaid: boolean; amount: number };
type Split = { description: string; participants?: SplitParticipant[] };
type GoalSummary = { definedLimits: number; projectedMonthlySpending: number; riskGoalsList?: Array<{ id: number; name: string; progressPercentage: number }> };
type ShoppingList = { id: number; name: string; status: string; plannedDate?: string };

export default function NotificationMenu({ onCountChange }: { onCountChange?: (count: number) => void }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const user = getLoggedUser();
      const userId = Number(user?.id);
      const [requestsResult, splitsResult, goalsResult, listsResult] = await Promise.allSettled([
        api.get<FriendRequest[]>("/friendships/requests"),
        api.get<Split[]>("/splits"),
        api.get<GoalSummary>(`/goals/user/${userId}/summary`),
        api.get<ShoppingList[]>(`/shoppinglists/user/${userId}`),
      ]);
      const requests = requestsResult.status === "fulfilled" ? requestsResult.value.data : [];
      const splits = splitsResult.status === "fulfilled" ? splitsResult.value.data : [];
      const friendNotices = (requests as FriendRequest[]).map((request) => ({ id: `friend-${request.id}`, title: "Novo pedido de amizade", detail: `${request.fullName} quer adicionar você.`, path: "/friends", icon: "friend" as const }));
      const splitNotices = (splits as Split[]).flatMap((split) => (split.participants ?? [])
        .filter((participant) => participant.userId === userId && !participant.isPaid)
        .map((participant) => ({ id: `split-${participant.id}`, title: "Parcela pendente", detail: `${split.description}: € ${Number(participant.amount).toFixed(2)}`, path: "/splits", icon: "split" as const })));
      const goals = goalsResult.status === "fulfilled" ? goalsResult.value.data : null;
      const lists = listsResult.status === "fulfilled" ? listsResult.value.data : [];
      const notifyGoals = user?.notify_Goal_80 ?? user?.notify_goal_80 ?? true;
      const notifySpending = user?.notify_Spending_Increase ?? user?.notify_spending_increase ?? true;
      const notifyLists = user?.notify_Pending_Lists ?? user?.notify_pending_lists ?? false;
      const goalNotices = notifyGoals ? (goals?.riskGoalsList ?? []).map((goal) => ({ id: `goal-${goal.id}`, title: "Meta próxima do limite", detail: `${goal.name}: ${Math.round(goal.progressPercentage)}% utilizado.`, path: "/goals", icon: "goal" as const })) : [];
      const spendingNotices = notifySpending && goals && goals.definedLimits > 0 && goals.projectedMonthlySpending > goals.definedLimits
        ? [{ id: "monthly-spending", title: "Projeção acima do limite", detail: "A projeção de gastos do mês ultrapassa os limites definidos.", path: "/goals", icon: "spending" as const }]
        : [];
      const listNotices = notifyLists ? (lists as ShoppingList[]).filter((list) => list.status === "Draft" || list.status === "InProgress").slice(0, 3).map((list) => ({ id: `list-${list.id}`, title: "Lista pendente", detail: `${list.name} ainda está em aberto.`, path: "/shopping-lists", icon: "list" as const })) : [];
      const next = [...friendNotices, ...splitNotices, ...goalNotices, ...spendingNotices, ...listNotices];
      setNotices(next); onCountChange?.(next.length);
    } catch {
      setNotices([]); onCountChange?.(0);
    } finally { setLoading(false); }
  }, [onCountChange]);

  useEffect(() => { void load(); }, [load]);
  const goTo = (path: string) => { setOpen(false); navigate(path); };

  return <div className="relative">
    <button type="button" onClick={() => { setOpen(value => !value); if (!open) load(); }} aria-label="Notificações" className="relative grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10">
      <Bell size={20} />
      {notices.length > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">{notices.length > 9 ? "9+" : notices.length}</span>}
    </button>
    {open && <div className="absolute right-0 top-13 z-[80] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#081222] shadow-2xl shadow-black/50">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3"><b>Notificações</b><button onClick={() => goTo("/friends")} className="text-xs font-semibold text-violet-300">Ver amigos</button></div>
      <div className="max-h-80 overflow-y-auto">{loading ? <p className="p-4 text-sm text-slate-400">Carregando...</p> : notices.length ? notices.map(notice => <button key={notice.id} onClick={() => goTo(notice.path)} className="flex w-full items-start gap-3 border-b border-white/5 p-4 text-left hover:bg-white/[0.04]"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${notice.icon === "friend" ? "bg-violet-500/15 text-violet-300" : notice.icon === "goal" ? "bg-amber-500/15 text-amber-300" : notice.icon === "list" ? "bg-blue-500/15 text-blue-300" : "bg-orange-500/15 text-orange-300"}`}>{notice.icon === "friend" ? <UserPlus size={18}/> : notice.icon === "goal" ? <Target size={18}/> : notice.icon === "list" ? <ClipboardList size={18}/> : notice.icon === "spending" ? <AlertTriangle size={18}/> : <CheckCircle2 size={18}/>}</span><span><b className="block text-sm">{notice.title}</b><span className="mt-0.5 block text-xs text-slate-400">{notice.detail}</span></span></button>) : <p className="p-5 text-center text-sm text-slate-400">Você não tem notificações pendentes.</p>}</div>
      <button onClick={() => goTo("/splits")} className="w-full border-t border-white/10 px-4 py-3 text-left text-sm font-semibold text-violet-300 hover:bg-white/[0.04]">Ver divisões de conta</button>
    </div>}
  </div>;
}
