import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";
import { getLoggedUser } from "../utils/auth";
import MonthlyExpensesChart from "../components/reports/MonthlyExpensesChart";
import PaymentMethodsChart from "../components/reports/PaymentMethodsChart";
import { Button } from "../components/ui/Button";
import CategoryDistributionChart from "../components/reports/CategoryDistributionChart";
import ReportFilters from "../components/reports/ReportFilters";
import type { ReportFilters as ReportFiltersType, ReportLookupOption } from "../types/reports";

const monthRange = (year: number, month: number) => {
  const from = new Date(year, month - 1, 1);
  const to = new Date(year, month, 0);
  const formatDateInput = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  return {
    from: formatDateInput(from),
    to: formatDateInput(to),
  };
};

const Reports = () => {
  const user = getLoggedUser();
  const userId = Number(user?.id) || 0;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const [filters, setFilters] = useState<ReportFiltersType>(() => ({
    ...monthRange(currentYear, currentMonth),
    categoryId: "",
    locationId: "",
    paymentMethod: "",
  }));
  const [categories, setCategories] = useState<ReportLookupOption[]>([]);
  const [locations, setLocations] = useState<ReportLookupOption[]>([]);
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const loadSupportData = useCallback(async () => {
    if (!userId) return;

    try {
      const [categoriesResponse, locationsResponse] = await Promise.all([
        api.get<ReportLookupOption[]>(`/categories/${userId}`),
        api.get<ReportLookupOption[]>(`/locations/${userId}`),
      ]);

      setCategories(categoriesResponse.data);
      setLocations(locationsResponse.data);
    } catch (error) {
      console.error("Não foi possível carregar os filtros de análises.", error);
    }
  }, [userId]);

  useEffect(() => {
    void loadSupportData();
  }, [loadSupportData]);

  useEffect(() => {
    setFilters((previous) => ({
      ...previous,
      ...monthRange(selectedYear, selectedMonth),
    }));
  }, [selectedYear, selectedMonth]);

  const years = [currentYear - 1, currentYear, currentYear + 1];
  const months = [
    { id: 1, label: "Jan" }, { id: 2, label: "Fev" }, { id: 3, label: "Mar" },
    { id: 4, label: "Abr" }, { id: 5, label: "Mai" }, { id: 6, label: "Jun" },
    { id: 7, label: "Jul" }, { id: 8, label: "Ago" }, { id: 9, label: "Set" },
    { id: 10, label: "Out" }, { id: 11, label: "Nov" }, { id: 12, label: "Dez" },
  ];

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Análises</h2>
          <p className="mt-1 text-sm text-slate-400">Os gráficos refletem todos os filtros selecionados.</p>
        </div>
        <Button label="Filtrar" variant="secondary" onClick={() => setOpenFilters(true)} className="lg:hidden" />
      </div>

      <div className="hidden lg:block">
        <ReportFilters filters={filters} onChange={setFilters} categories={categories} locations={locations} />
      </div>

      <div className="flex gap-3 overflow-x-auto py-2">
        {years.map((year) => (
          <button key={year} onClick={() => setSelectedYear(year)} className={`rounded-lg border px-4 py-2 ${selectedYear === year ? "border-blue-500 bg-blue-600 text-white" : "border-[#12202a] bg-transparent text-gray-300"}`}>
            {year}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4">
        {months.map((month) => (
          <button key={month.id} onClick={() => setSelectedMonth(month.id)} className={`rounded-md border px-3 py-1 text-sm ${selectedMonth === month.id ? "border-purple-500 bg-purple-600 text-white" : "border-[#12202a] bg-transparent text-gray-300"}`}>
            {month.label}
          </button>
        ))}
      </div>

      <MonthlyExpensesChart userId={userId} filters={filters} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryDistributionChart userId={userId} filters={filters} />
        <PaymentMethodsChart userId={userId} filters={filters} />
      </div>

      {openFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <button aria-label="Fechar filtros" className="absolute inset-0 cursor-default" onClick={() => setOpenFilters(false)} />
          <div className="relative max-h-[90%] w-full max-w-md overflow-y-auto rounded-lg border border-[#12202a] bg-surface-dark p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filtros</h3>
              <button onClick={() => setOpenFilters(false)} className="text-gray-400" aria-label="Fechar">✕</button>
            </div>
            <ReportFilters filters={filters} onChange={setFilters} categories={categories} locations={locations} />
            <div className="mt-4 flex justify-end">
              <Button label="Aplicar" variant="primary" onClick={() => setOpenFilters(false)} type="button" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
