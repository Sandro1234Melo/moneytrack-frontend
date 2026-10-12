import { useEffect, useState } from "react";
import api from "../../api/axios";
import type { MonthlyExpense, ReportFilters } from "../../types/reports";
import { LineChart } from "../ui/2.0/line-chart";

type Props = {
  userId: number
  filters: ReportFilters
}

const MonthlyExpensesChart: React.FC<Props> = ({ userId, filters }) => {
  const [data, setData] = useState<MonthlyExpense[]>([]);

  useEffect(() => {
    if (!userId) return;
    if (!filters.from) return;

    //const year = new Date(filters.from).getFullYear();

    api.get("/reports/monthly-expenses", {
      params: {
        userId,
        from: filters.from,
        to: filters.to,
        categoryId: filters.categoryId || undefined,
        locationId: filters.locationId || undefined,
        paymentMethod: filters.paymentMethod || undefined,
      }
    })
      .then(res => setData(res.data))
      .catch(console.error);

  }, [userId, filters]);

  return (
    <div className="bg-[#071122] p-6 px-2 rounded-lg border border-[#12202a]">
      <h3 className="text-lg font-semibold mb-4">
        Evolução dos Gastos Mensais
      </h3>

      <div className="h-64">
        
          <LineChart datasets={[
            {
              id: "gastos",
              label: "Gastos",
              color: "#8884d8",
              data: data.map(d => Number(d.total)),
              showArea: true,
              showDots: true
            }
  
          ]} 
          labels={data.map(d => d.label)}
          height={300}
          />
        
      </div>
    </div>
  );
};

export default MonthlyExpensesChart;
