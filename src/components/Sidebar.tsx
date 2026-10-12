import { BarChart3, ChevronDown, Crosshair, HandCoins, Home, ListChecks, MapPin, Settings, ShoppingCart, Tags, Users, Wallet, Zap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api, { getApiAssetUrl } from "../api/axios";
import { getLoggedUser } from "../utils/auth";

type SidebarProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

type InsightSummary = {
  totalExpense?: number;
  previousPeriodTotal?: number;
  totalTrendPercent?: number;
};

type Insight = {
  message: string;
  action: string;
  path: string;
};

const toDateInputValue = (date: Date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
};

const Sidebar = ({ mobile = false, onNavigate }: SidebarProps) => {
  const { pathname } = useLocation();
  const [user, setUser] = useState(() => getLoggedUser());
  const [openMenu, setOpenMenu] = useState(true);
  const [insightSummary, setInsightSummary] = useState<InsightSummary | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(true);
  const [isInsightUnavailable, setIsInsightUnavailable] = useState(false);
  const initials = useMemo(() => {
    const name = user?.full_Name ?? user?.fullName ?? "Samuel Almeida";
    return name.split(" ").slice(0, 2).map((p: string) => p[0]).join("").toUpperCase();
  }, [user]);

  useEffect(() => {
    const refreshUser = () => setUser(getLoggedUser());
    window.addEventListener("moneytrack:user-updated", refreshUser);
    return () => window.removeEventListener("moneytrack:user-updated", refreshUser);
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setIsInsightLoading(false);
      return;
    }

    const today = new Date();
    const from = new Date(today);
    from.setDate(today.getDate() - 6);
    let isCurrent = true;

    setIsInsightLoading(true);
    setIsInsightUnavailable(false);

    api
      .get<InsightSummary>("/reports/dashboard-summary", {
        params: {
          userId: user.id,
          from: toDateInputValue(from),
          to: toDateInputValue(today),
        },
      })
      .then((response) => {
        if (isCurrent) setInsightSummary(response.data);
      })
      .catch(() => {
        if (isCurrent) setIsInsightUnavailable(true);
      })
      .finally(() => {
        if (isCurrent) setIsInsightLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [pathname, user?.id]);

  const insight = useMemo<Insight>(() => {
    const currentTotal = Number(insightSummary?.totalExpense ?? 0);
    const previousTotal = Number(insightSummary?.previousPeriodTotal ?? 0);
    const trend = Number(insightSummary?.totalTrendPercent ?? 0);
    const formattedTrend = Math.abs(trend).toLocaleString("pt-PT", {
      maximumFractionDigits: 1,
    });
    const money = `${user?.currencySymbol || "€"} ${currentTotal.toLocaleString("pt-PT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    if (currentTotal <= 0 && previousTotal <= 0) {
      return {
        message: "Registe a sua primeira compra para começar a receber insights personalizados.",
        action: "Registar compra →",
        path: "/purchases",
      };
    }

    if (currentTotal <= 0) {
      return {
        message: "Ainda não há gastos registados nos últimos 7 dias. Registe as suas compras para acompanhar o seu ritmo.",
        action: "Ver gastos →",
        path: "/expenses",
      };
    }

    if (previousTotal <= 0) {
      return {
        message: `Registou ${money} em gastos nos últimos 7 dias. Continue a registar para comparar o seu ritmo financeiro.`,
        action: "Ver análises →",
        path: "/reports",
      };
    }

    if (trend > 0) {
      return {
        message: `Gastou ${formattedTrend}% a mais nos últimos 7 dias em comparação aos 7 dias anteriores.`,
        action: "Ver análises →",
        path: "/reports",
      };
    }

    if (trend < 0) {
      return {
        message: `Gastou ${formattedTrend}% a menos nos últimos 7 dias em comparação aos 7 dias anteriores.`,
        action: "Ver análises →",
        path: "/reports",
      };
    }

    return {
      message: "Os seus gastos mantiveram-se iguais aos dos 7 dias anteriores.",
      action: "Ver análises →",
      path: "/reports",
    };
  }, [insightSummary, user?.currencySymbol]);

  const normalItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Análises", path: "/reports", icon: BarChart3 },
    { name: "Listas de Compras", path: "/shopping-lists", icon: ListChecks },
    { name: "Meus Gastos", path: "/expenses", icon: Wallet },
    { name: "Pessoas", path: "/friends", icon: Users },
    { name: "Dividir conta", path: "/splits", icon: HandCoins },
  ];

  const registerItems = [
    { name: "Comprar", path: "/purchases", icon: ShoppingCart },
    { name: "Locais", path: "/locations", icon: MapPin },
    { name: "Categorias", path: "/categories", icon: Tags },
  ];

  const bottomItems = [
    { name: "Metas", path: "/goals", icon: Crosshair },
    { name: "Configurações", path: "/settings", icon: Settings },
  ];

  const linkClass = (active: boolean) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${active ? "bg-gradient-to-r from-violet-700 to-violet-600 text-white shadow-lg shadow-violet-950/40" : "text-slate-300 hover:bg-white/[0.06] hover:text-white"}`;

  return (
    <aside className={`flex shrink-0 flex-col justify-between border-r border-white/5 bg-[#07101f]/90 p-5 backdrop-blur-xl ${mobile ? "h-[100dvh] w-full" : "h-screen w-[292px]"}`}>
      <div>
        <Link to="/dashboard" onClick={onNavigate} className="mb-8 flex items-center gap-3 px-1">
          <div className="flex h-8 w-8 items-end gap-1 text-violet-500">
            <span className="h-3 w-1.5 rounded-full bg-current" /><span className="h-5 w-1.5 rounded-full bg-current" /><span className="h-7 w-1.5 rounded-full bg-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">MoneyTrack</span>
        </Link>

        <nav className="space-y-1">
          {normalItems.map(({ name, path, icon: Icon }) => (
            <Link key={path} to={path} onClick={onNavigate} className={linkClass(pathname === path)}>
              <Icon size={19} /> {name}
            </Link>
          ))}

          <button onClick={() => setOpenMenu((v) => !v)} className="mt-2 flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-white/[0.06]">
            <span className="flex items-center gap-3"><Tags size={19} /> Cadastros</span>
            <ChevronDown size={16} className={`transition ${openMenu ? "rotate-180" : ""}`} />
          </button>
          {openMenu && (
            <div className="ml-4 space-y-1 border-l border-white/10 pl-3">
              {registerItems.map(({ name, path, icon: Icon }) => (
                <Link key={path} to={path} onClick={onNavigate} className={linkClass(pathname === path)}>
                  <Icon size={17} /> {name}
                </Link>
              ))}
            </div>
          )}

          {bottomItems.map(({ name, path, icon: Icon }) => (
            <Link key={path} to={path} onClick={onNavigate} className={linkClass(pathname === path)}>
              <Icon size={19} /> {name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Zap className="text-violet-400" size={16} /> Insights para você</div>
          {isInsightLoading ? (
            <p className="text-sm leading-6 text-slate-400" aria-live="polite">A analisar os seus gastos...</p>
          ) : isInsightUnavailable ? (
            <>
              <p className="text-sm leading-6 text-slate-400">Não foi possível gerar o seu insight agora.</p>
              <Link to="/reports" onClick={onNavigate} className="mt-4 inline-block text-sm font-semibold text-violet-400 hover:text-violet-300">Ver análises →</Link>
            </>
          ) : (
            <>
              <p className="text-sm leading-6 text-slate-400">{insight.message}</p>
              <Link to={insight.path} onClick={onNavigate} className="mt-4 inline-block text-sm font-semibold text-violet-400 hover:text-violet-300">{insight.action}</Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 border-t border-white/5 pt-5">
          <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-violet-600 to-blue-600 font-bold">
            {user?.profile_Image_Url ?? user?.profile_image_url ?? user?.profileImageUrl ? (
              <img src={getApiAssetUrl(user.profile_Image_Url ?? user.profile_image_url ?? user.profileImageUrl)} alt="" className="h-full w-full object-cover" />
            ) : initials || "SA"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user?.full_Name ?? user?.fullName ?? "Samuel Almeida"}</p>
            <p className="truncate text-xs text-slate-400">{user?.email ?? "samuel@email.com"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
