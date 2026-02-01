import { useEffect, useState } from "react";
import api from "../api/axios";
import { getLoggedUser } from "../utils/auth";

import MonthlyExpensesChart from "../components/reports/MonthlyExpensesChart";
import CategoryDistributionChart from "../components/reports/CategoryDistributionChart";
import PaymentMethodsChart from "../components/reports/PaymentMethodsChart";
import ReportFilters from "../components/reports/ReportFilters";

/* ===============================
   TIPOS
================================ */
export type ReportFiltersType = {
  fromDate: string;
  toDate: string;
  categoryId: string;
  locationId: string;
  paymentMethod: string;
};

const Reports = () => {
  const user = getLoggedUser();
  const userId = user?.id;

  const [filters, setFilters] = useState<ReportFiltersType>({
    fromDate: "",
    toDate: "",
    categoryId: "",
    locationId: "",
    paymentMethod: ""
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  /* ===============================
     LOAD AUX DATA
  ================================ */
  const loadCategories = async () => {
    if (!userId) return;
    const res = await api.get(`/categories/${userId}`);
    setCategories(res.data);
  };

  const loadLocations = async () => {
    if (!userId) return;
    const res = await api.get(`/locations/${userId}`);
    setLocations(res.data);
  };

  useEffect(() => {
    loadCategories();
    loadLocations();
  }, [userId]);

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-semibold">
        Análises e Relatórios
      </h2>

      {/* FILTROS */}
      <ReportFilters
        filters={filters}
        onChange={setFilters}
        categories={categories}
        locations={locations}
      />

      {/* GRÁFICO MENSAL */}
      <MonthlyExpensesChart
        userId={userId}
        filters={filters}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDistributionChart
          userId={userId}
          filters={filters}
        />
        <PaymentMethodsChart
          userId={userId}
          filters={filters}
        />
      </div>

    </div>
  );
};

export default Reports;
