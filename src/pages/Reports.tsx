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
  //categoryId: string;
  //locationId: string;
  //paymentMethod: string;
};

const Reports = () => {
  const user = getLoggedUser();
  const userId = user?.id;

  const [filters, setFilters] = useState<ReportFiltersType>({
    fromDate: "",
    toDate: "",
    //categoryId: "",
    //locationId: "",
    //paymentMethod: ""
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [openFilters, setOpenFilters] = useState(false);
  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState( new Date().getMonth() + 1);



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

  useEffect(() => {
    const from = new Date(selectedYear, selectedMonth - 1, 1);
    const to = new Date(selectedYear, selectedMonth, 0);

    setFilters((prev) => ({
      ...prev,
      fromDate: from.toISOString().substring(0, 10),
      toDate: to.toISOString().substring(0, 10),
    }));
  }, [selectedYear, selectedMonth]);


  const years = [currentYear - 1, currentYear, currentYear + 1];

  const months = [
    { id: 1, label: "Jan" },
    { id: 2, label: "Fev" },
    { id: 3, label: "Mar" },
    { id: 4, label: "Abr" },
    { id: 5, label: "Mai" },
    { id: 6, label: "Jun" },
    { id: 7, label: "Jul" },
    { id: 8, label: "Ago" },
    { id: 9, label: "Set" },
    { id: 10, label: "Out" },
    { id: 11, label: "Nov" },
    { id: 12, label: "Dez" },
  ];


  return (
  <div className="space-y-6">

    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold">
        Análises e Relatórios
      </h2>

      <Button
        label="Filtrar"
        variant="secondary"
        onClick={() => setOpenFilters(true)}
        className="lg:hidden"
      />
    </div>
    <div className="flex gap-3 overflow-x-auto py-2">
      {years.map((year) => (
        <button
          key={year}
          onClick={() => setSelectedYear(year)}
          className={`
            px-4 py-2 rounded-lg border
            ${selectedYear === year
              ? "bg-blue-600 text-white border-blue-500"
              : "bg-transparent text-gray-300 border-[#12202a]"
            }
          `}
        >
          {year}
        </button>
      ))}
    </div>
    <div className="flex gap-2 overflow-x-auto pb-4">
      {months.map((month) => (
        <button
          key={month.id}
          onClick={() => setSelectedMonth(month.id)}
          className={`
            px-3 py-1 rounded-md text-sm border
            ${selectedMonth === month.id
              ? "bg-purple-600 text-white border-purple-500"
              : "bg-transparent text-gray-300 border-[#12202a]"
            }
          `}
        >
          {month.label}
        </button>
      ))}
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
