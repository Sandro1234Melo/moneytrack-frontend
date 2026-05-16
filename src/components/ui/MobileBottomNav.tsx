import { Link, useLocation } from "react-router-dom";
import { BarChart3, Home, ListChecks, ShoppingCart, Wallet } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/reports", label: "Análises", icon: BarChart3 },
  { to: "/shopping-lists", label: "Listas", icon: ListChecks },
  { to: "/expenses", label: "Gastos", icon: Wallet },
  { to: "/purchases", label: "Comprar", icon: ShoppingCart }
];

const MobileBottomNav = () => {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[#06101d]/95 px-2 pb-4 pt-2 shadow-2xl shadow-black backdrop-blur-xl lg:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link key={to} to={to} className={`flex min-w-14 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition ${active ? "bg-violet-600/15 text-violet-400" : "text-slate-400"}`}>
              <Icon size={24} strokeWidth={active ? 2.4 : 2} />
              <span>{label}</span>
              {active && <span className="mt-1 h-1 w-9 rounded-full bg-violet-500 shadow-lg shadow-violet-500/60" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
