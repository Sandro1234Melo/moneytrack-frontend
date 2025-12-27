import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import ShoppingLists from "./pages/ShoppingLists";
import Reports from "./pages/Reports";
import Categories from "./pages/Categories";
import Locations from "./pages/Locations";
import Purchases from "./pages/Purchases";


function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#000010] text-white">
        <Sidebar />
        <main className="flex-1 p-6">
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
      </div>
    </Router>
  );
}

export default App;
