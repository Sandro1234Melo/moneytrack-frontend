import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import MobileBottomNav from "../components/ui/MobileBottomNav";
import MobileHeader from "../components/ui/MobileHeader";
import MobileDrawer from "../components/ui/MobileDrawer";
import Topbar from "../layouts/Topbar";

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const pageTitleMap: Record<string, string> = {
    "/": "Dashboard",
    "/expenses": "Meus Gastos",
    "/purchases": "Compras",
    "/shopping-lists": "Listas",
    "/categories": "Categorias",
    "/locations": "Locais",
    "/reports": "Análises",
    "/settings": "Configurações",
    "/goals": "Metas"
    ,"/friends": "Amigos"
    ,"/splits": "Dividir conta"
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#020513] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.18),transparent_32%),radial-gradient(circle_at_80%_15%,rgba(37,99,235,0.16),transparent_34%)]" />
      <div className="relative flex h-screen">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="hidden lg:block">
            <Topbar />
          </div>

          <div className="lg:hidden">
            <MobileHeader title={pageTitleMap[location.pathname] ?? "MoneyTrack"} onMenuClick={() => setDrawerOpen(true)} />
          </div>

          <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

          <main className="flex-1 overflow-y-auto px-4 pb-28 pt-20 sm:px-6 lg:px-10 lg:pb-8 lg:pt-8">
            <Outlet />
          </main>

          {!drawerOpen && (
            <div className="lg:hidden">
              <MobileBottomNav />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
