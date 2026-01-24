import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/Sidebar";
import MobileBottomNav from "../components/ui/MobileBottomNav";
import MobileHeader from "../components/ui/MobileHeader";
import MobileDrawer from "../components/ui/MobileDrawer";

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const pageTitleMap: Record<string, string> = {
    "/": "Dashboard",
    "/expenses": "Meus Gastos",
    "/purchases": "Compras",
    "/shopping-lists": "Listas de Compras",
    "/categories": "Categorias",
    "/locations": "Locais",
    "/reports": "Análises"
  };

  const title = pageTitleMap[location.pathname] ?? "MoneyTrack";

  return (
    <div className="flex h-screen bg-[#000010] text-white">

      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <MobileHeader
        title={title}
        onMenuClick={() => setDrawerOpen(true)}
      />

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <main className="flex-1 overflow-y-auto pt-16 pb-20 lg:pt-6 lg:pb-6 px-4 sm:px-6">
        <Outlet />
      </main>

      <MobileBottomNav />
    </div>
  );
}
