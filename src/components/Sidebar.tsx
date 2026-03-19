import {
  LayoutDashboard,
  Wallet,
  ShoppingCart,
  BarChart3,
  MapPin,
  Tags,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Análises", path: "/reports", icon: BarChart3 },
    { name: "Listas de Compras", path: "/shopping-lists", icon: ShoppingCart },
    { name: "Meus Gastos", path: "/expenses", icon: Wallet },

    {
      name: "Cadastros",
      icon: Tags,
      children: [
        { name: "Comprar", path: "/purchases", icon: ShoppingCart },
        { name: "Locais", path: "/locations", icon: MapPin },
        { name: "Categorias", path: "/categories", icon: Tags },
      ],
    },
  ];

  return (
    <aside className="w-64 h-screen bg-[#14171f] p-5 flex flex-col justify-between sticky top-0">
      <div>
        <h1 className="text-xl font-semibold mb-8">MoneyTrack</h1>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            // MENU COM SUBMENU
            if (item.children) {
              const isOpen = openMenu === item.name;

              return (
                <div key={item.name} className="flex flex-col">
                  {/* BOTÃO DO MENU */}
                  <button
                    onClick={() => setOpenMenu(isOpen ? null : item.name)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#1f2230] transition"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      {item.name}
                    </div>

                    <span className="text-xs">{isOpen ? "▾" : "▸"}</span>
                  </button>

                  {/* SUBMENU */}
                  {isOpen && (
                    <div className="flex flex-col ml-6 mt-1 gap-1">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const active = pathname === child.path;

                        return (
                          <Link
                            key={child.name}
                            to={child.path}
                            className={`flex items-center gap-3 p-2 rounded-lg transition ${
                              active ? "bg-purple-600" : "hover:bg-[#1f2230]"
                            }`}
                          >
                            <ChildIcon size={16} />
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // MENU NORMAL
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
