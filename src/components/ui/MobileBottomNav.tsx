import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  ListChecks,
  Wallet,
  MapPin,
  Tags
} from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/expenses", label: "Gastos", icon: Wallet },
  { to: "/purchases", label: "Compras", icon: ShoppingCart },
  { to: "/shopping-lists", label: "Listas", icon: ListChecks },
  { to: "/categories", label: "Categorias", icon: Tags },
  { to: "/locations", label: "Locais", icon: MapPin }
];

const MobileBottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#050518] border-t border-white/10 lg:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;

          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center text-xs ${
                active ? "text-blue-500" : "text-gray-400"
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
