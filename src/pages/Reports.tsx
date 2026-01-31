import MonthlyExpensesChart from "../components/reports/MonthlyExpensesChart";
import CategoryDistributionChart from "../components/reports/CategoryDistributionChart";
import PaymentMethodsChart from "../components/reports/PaymentMethodsChart";

const Reports = () => {
  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-semibold">
        Análises e Relatórios
      </h2>

      <MonthlyExpensesChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDistributionChart />
        <PaymentMethodsChart />
      </div>

    </div>
  );
};

export default Reports;
