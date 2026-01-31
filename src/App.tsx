import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import PrivateRoute from "./routes/PrivateRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Categories from "./pages/Categories";
import Locations from "./pages/Locations";
import Purchases from "./pages/Purchases";
import Reports from "./pages/Reports";
import ShoppingLists from "./pages/ShoppingLists";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/settings" element={<Settings />} />

        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/shopping-lists" element={<ShoppingLists />} />
          <Route path="/reports" element={<Reports />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}
