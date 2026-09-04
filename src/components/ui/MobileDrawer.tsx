import {
  BarChart3,
  ChevronDown,
  Crosshair,
  Home,
  ListChecks,
  LogOut,
  MapPin,
  Settings,
  ShoppingCart,
  Tags,
  Wallet,
  Users,
  Split,
  X,
} from "lucide-react";
import { useMemo, useState, type ElementType } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getLoggedUser } from "../../utils/auth";

type Props = {
  open: boolean;
  onClose: () => void;
};

type MobileDrawerItem = {
  name: string;
  path: string;
  icon: ElementType;
};

const mainItems: MobileDrawerItem[] = [
  { name: "Dashboard", path: "/", icon: Home },
  { name: "Análises", path: "/reports", icon: BarChart3 },
  { name: "Listas de Compras", path: "/shopping-lists", icon: ListChecks },
  { name: "Meus Gastos", path: "/expenses", icon: Wallet },
  { name: "Relatórios", path: "/reports", icon: BarChart3 },
  { name: "Metas", path: "/goals", icon: Crosshair },
  { name: "Amigos", path: "/friends", icon: Users },
  { name: "Dividir conta", path: "/splits", icon: Split },
];

const registerItems: MobileDrawerItem[] = [
  { name: "Comprar", path: "/purchases", icon: ShoppingCart },
  { name: "Locais", path: "/locations", icon: MapPin },
  { name: "Categorias", path: "/categories", icon: Tags },
];

const systemItems: MobileDrawerItem[] = [
  { name: "Configurações", path: "/settings", icon: Settings },
];

const MobileDrawer = ({ open, onClose }: Props) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = getLoggedUser();
  const [cadastrosOpen, setCadastrosOpen] = useState(true);

  const userName = user?.fullName ?? user?.full_Name ?? user?.full_name ?? "Sandro Melo";
  const userEmail = user?.email ?? "sandrodemelo55@gmail.com";

  const initials = useMemo(() => {
    return userName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0])
      .join("")
      .toUpperCase() || "SM";
  }, [userName]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    onClose();
    navigate("/login");
  };

  const linkClass = (active: boolean) =>
    `flex h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium transition active:scale-[0.98] ${
      active
        ? "bg-gradient-to-r from-violet-700 to-violet-600 text-white shadow-lg shadow-violet-950/40"
        : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
    }`;

  const renderLink = ({ name, path, icon: Icon }: MobileDrawerItem) => {
    const active = pathname === path;
    return (
      <Link key={`${name}-${path}`} to={path} onClick={onClose} className={linkClass(active)}>
        <Icon size={19} />
        <span className="truncate">{name}</span>
      </Link>
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Fechar menu"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="absolute bottom-0 left-0 top-0 flex w-[82vw] max-w-[320px] flex-col overflow-hidden border-r border-white/10 bg-[#07101f]/95 shadow-2xl shadow-black/60">
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-4">
          <Link to="/" onClick={onClose} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-end gap-1 text-violet-500">
              <span className="h-3 w-1.5 rounded-full bg-current" />
              <span className="h-5 w-1.5 rounded-full bg-current" />
              <span className="h-7 w-1.5 rounded-full bg-current" />
            </div>
            <span className="text-xl font-bold tracking-tight">MoneyTrack</span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-2xl bg-white/[0.06] text-slate-200 transition hover:bg-white/[0.1] active:scale-95"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-white/5 px-4 py-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-sm font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{userName}</p>
            <p className="truncate text-xs text-slate-400">{userEmail}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mb-4">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Principal</p>
            <div className="space-y-1">{mainItems.map(renderLink)}</div>
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={() => setCadastrosOpen((current) => !current)}
              className="mb-2 flex h-10 w-full items-center justify-between rounded-2xl px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:bg-white/[0.04]"
            >
              <span>Cadastros</span>
              <ChevronDown size={16} className={`transition ${cadastrosOpen ? "rotate-180" : ""}`} />
            </button>

            {cadastrosOpen && <div className="space-y-1 border-l border-white/10 pl-2">{registerItems.map(renderLink)}</div>}
          </div>

          <div className="mb-4">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Sistema</p>
            <div className="space-y-1">{systemItems.map(renderLink)}</div>
          </div>
        </nav>

        <div className="border-t border-white/5 px-3 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-11 w-full items-center gap-3 rounded-2xl px-3 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-300 active:scale-[0.98]"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>
    </div>
  );
};

export default MobileDrawer;
