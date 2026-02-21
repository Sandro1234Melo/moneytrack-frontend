import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getLoggedUser } from "../utils/auth";
import MonthlyExpensesChart from "../components/reports/MonthlyExpensesChart";
import CategoryDistributionChart from "../components/reports/CategoryDistributionChart";
import api from "../api/axios";
import type { ReportFiltersType } from "./Reports";


const StatCard: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <div className="bg-[#0b1220] p-4 rounded-lg shadow-sm border border-[#17202a]">
    <div className="text-sm text-gray-400">{title}</div>
    <div className="text-2xl font-bold mt-2">{value}</div>
  </div>
);

type DashboardSummary = {
  monthlyExpense: number;
  totalPurchases: number;
};

const Dashboard: React.FC = () => {
  const user = getLoggedUser();
  const currencySymbol = user?.currencySymbol || "€";
  const now = new Date();
  const userId = user?.id;

  const [summary, setSummary] = useState<DashboardSummary>({
    monthlyExpense: 0,
    totalPurchases: 0
  });

  const defaultFilters = React.useMemo<ReportFiltersType>(() => ({
    from: new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .substring(0, 10),
    to: new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .substring(0, 10),
    categoryId: "",
    locationId: "",
    paymentMethod: ""
  }), []);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      try {
        setLoading(true);

        const res = await api.get("/reports/dashboard-summary", {
          params: { userId }
        });

        setSummary(res.data);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  const avgPurchase =
    summary.totalPurchases > 0
      ? summary.monthlyExpense / summary.totalPurchases
      : 0;

  return (
    <div>
      <Navbar />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Despesa do Mês"
          value={
            loading
              ? "..."
              : `${currencySymbol} ${summary.monthlyExpense.toFixed(2)}`
          }
        />

        <StatCard
          title="Compras no Mês"
          value={loading ? "..." : summary.totalPurchases.toString()}
        />

        <StatCard
          title="Média por Compra"
          value={
            loading
              ? "..."
              : `${currencySymbol} ${avgPurchase.toFixed(2)}`
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full">
          {userId && (
            <MonthlyExpensesChart
              user_Id={userId}
              filters={defaultFilters}
            />
          )}
        </div>

        <div className="flex flex-col gap-4">
          {userId && (
            <CategoryDistributionChart
              user_Id={userId}
              filters={defaultFilters}
            />
          )}

          <div className="bg-[#071122] p-6 rounded-lg border border-[#12202a]">
            <h3 className="text-lg font-semibold mb-2">
              Formas de Pagamento
            </h3>
            <div className="h-16 flex items-center justify-center text-gray-500">
              Cards
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;