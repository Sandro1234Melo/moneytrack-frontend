import { LayoutDashboard, Wallet, ShoppingCart, BarChart3, MapPin,Tags } from "lucide-react";
import { Link, useLocation } from "react-router-dom";


const Sidebar = () => {
  const { pathname } = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Análises", path: "/reports", icon: BarChart3 },
    { name: "Listas de Compras", path: "/shopping-lists", icon: ShoppingCart },
    { name: "Meus Gastos", path: "/expenses", icon: Wallet },
    { name: "Compras", path: "/purchases", icon: ShoppingCart },
    { name: "Locais", path: "/locations", icon: MapPin },
    { name: "Categorias", path: "/categories", icon: Tags }
  ];

  return (
    <aside className="w-64 h-screen bg-[#14171f] p-5 flex flex-col justify-between sticky top-0">
      <div>
        <h1 className="text-xl font-semibold mb-8">MoneyTrack</h1>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 p-2 rounded-lg transition ${
                  active ? "bg-purple-600" : "hover:bg-[#1f2230]"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="text-sm text-gray-400">© 2025 MoneyTrack</div>
    </aside>
  );
};

export default Sidebar;
