import { useEffect, useState } from "react";
import api from "../../api/axios";
import type { ReportFiltersType } from "../../pages/Reports";
import { LineChart } from "../ui/2.0/line-chart";

type Props = {
  user_Id: number
  filters: ReportFiltersType
}

const MonthlyExpensesChart: React.FC<Props> = ({ user_Id, filters }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!user_Id) return;
    if (!filters.from) return;

    //const year = new Date(filters.from).getFullYear();

    api.get("/reports/monthly-expenses", {
      params: {
        userId: user_Id,
        from: filters.from,
        to: filters.to     
      }
    })
      .then(res => setData(res.data))
      .catch(console.error);

  }, [user_Id, filters]);

  console.log("MonthlyExpensesChart data:", data);

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
              data: data.map(d => d.total),
              showArea: true,
              showDots: true
            }
  
          ]} 
          labels={data.map(d => d.month)}
          height={300}
          />
        
      </div>
    </div>
  );
};

export default MonthlyExpensesChart;
