import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import MobileBottomNav from "./components/ui/MobileBottomNav";
import MobileHeader from "./components/ui/MobileHeader";
import MobileDrawer from "./components/ui/MobileDrawer";

import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import ShoppingLists from "./pages/ShoppingLists";
import Reports from "./pages/Reports";
import Categories from "./pages/Categories";
import Locations from "./pages/Locations";
import Purchases from "./pages/Purchases";

const AppLayout = () => {
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
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/shopping-lists" element={<ShoppingLists />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/purchases" element={<Purchases />} />
        </Routes>
      </main>

      {/* Bottom Nav */}
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
