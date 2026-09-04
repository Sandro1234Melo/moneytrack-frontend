import { BarChart3, ChevronDown, Crosshair, Home, ListChecks, MapPin, Settings, ShoppingCart, Tags, Users, Wallet, Zap, Split } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { getLoggedUser } from "../utils/auth";

const Sidebar = () => {
  const { pathname } = useLocation();
  const user = getLoggedUser();
  const [openMenu, setOpenMenu] = useState(true);
  const initials = useMemo(() => {
    const name = user?.full_Name ?? user?.fullName ?? "Samuel Almeida";
    return name.split(" ").slice(0, 2).map((p: string) => p[0]).join("").toUpperCase();
  }, [user]);

  const normalItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Análises", path: "/reports", icon: BarChart3 },
    { name: "Listas de Compras", path: "/shopping-lists", icon: ListChecks },
    { name: "Meus Gastos", path: "/expenses", icon: Wallet },
  ];

  const registerItems = [
    { name: "Comprar", path: "/purchases", icon: ShoppingCart },
    { name: "Locais", path: "/locations", icon: MapPin },
    { name: "Categorias", path: "/categories", icon: Tags },
  ];

  const bottomItems = [
    { name: "Relatórios", path: "/reports", icon: BarChart3 },
    { name: "Metas", path: "/goals", icon: Crosshair },
    { name: "Amigos", path: "/friends", icon: Users },
    { name: "Dividir conta", path: "/splits", icon: Split },
    { name: "Configurações", path: "/settings", icon: Settings },
  ];

  const linkClass = (active: boolean) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${active ? "bg-gradient-to-r from-violet-700 to-violet-600 text-white shadow-lg shadow-violet-950/40" : "text-slate-300 hover:bg-white/[0.06] hover:text-white"}`;

  return (
    <aside className="flex h-screen w-[292px] shrink-0 flex-col justify-between border-r border-white/5 bg-[#07101f]/90 p-5 backdrop-blur-xl">
      <div>
        <Link to="/" className="mb-8 flex items-center gap-3 px-1">
          <div className="flex h-8 w-8 items-end gap-1 text-violet-500">
            <span className="h-3 w-1.5 rounded-full bg-current" /><span className="h-5 w-1.5 rounded-full bg-current" /><span className="h-7 w-1.5 rounded-full bg-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">MoneyTrack</span>
        </Link>

        <nav className="space-y-1">
          {normalItems.map(({ name, path, icon: Icon }) => (
            <Link key={path} to={path} className={linkClass(pathname === path)}>
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
                <Link key={path} to={path} className={linkClass(pathname === path)}>
                  <Icon size={17} /> {name}
                </Link>
              ))}
            </div>
          )}

          {bottomItems.map(({ name, path, icon: Icon }) => (
            <Link key={path} to={path} className={linkClass(pathname === path)}>
              <Icon size={19} /> {name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Zap className="text-violet-400" size={16} /> Insights para você</div>
          <p className="text-sm leading-6 text-slate-400">Você gastou 12% a menos esta semana comparado à semana passada.</p>
          <button className="mt-4 text-sm font-semibold text-violet-400">Ver detalhes →</button>
        </div>
        <div className="flex items-center gap-3 border-t border-white/5 pt-5">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 font-bold">{initials || "SA"}</div>
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
