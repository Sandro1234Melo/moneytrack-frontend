import { useEffect, useState } from "react";
import api from "../api/axios";
import { getLoggedUser } from "../utils/auth";

import MonthlyExpensesChart from "../components/reports/MonthlyExpensesChart";
import CategoryDistributionChart from "../components/reports/CategoryDistributionChart";
import PaymentMethodsChart from "../components/reports/PaymentMethodsChart";
import ReportFilters from "../components/reports/ReportFilters";
import { Button } from "../components/ui/Button";


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
  const [openFilters, setOpenFilters] = useState(false);


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

    {/* BOTÃO FILTRAR — MOBILE */}
    <div className="flex justify-end lg:hidden">
      <Button
        label="Filtrar"
        variant="secondary"
        onClick={() => setOpenFilters(true)}
      />
    </div>

    {/* FILTROS — DESKTOP */}
    <div className="hidden lg:block">
      <ReportFilters
        filters={filters}
        onChange={setFilters}
        categories={categories}
        locations={locations}
      />
    </div>

    {/* GRÁFICO MENSAL */}
    <MonthlyExpensesChart
      user_Id={userId}
      filters={filters}
    />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CategoryDistributionChart
        user_Id={userId}
        filters={filters}
      />
      <PaymentMethodsChart
        user_Id={userId}
        filters={filters}
      />
    </div>

    {/* MODAL FILTROS — MOBILE */}
    {openFilters && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

        {/* Overlay */}
        <div
          className="absolute inset-0"
          onClick={() => setOpenFilters(false)}
        />

        {/* Modal */}
        <div
          className="
            relative
            w-full max-w-md
            bg-surface-dark
            border border-[#12202a]
            rounded-lg
            p-5
            max-h-[90%]
            overflow-y-auto
          "
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Filtros</h3>
            <button
              onClick={() => setOpenFilters(false)}
              className="text-gray-400"
            >
              ✕
            </button>
          </div>

          <ReportFilters
            filters={filters}
            onChange={setFilters}
            categories={categories}
            locations={locations}
          />

          <div className="flex justify-end mt-4">
            <Button
              label="Aplicar"
              variant="primary"
              onClick={() => setOpenFilters(false)}
              type="button"
            />
          </div>
        </div>
      </div>
    )}
  </div>
);

};

export default Reports;
