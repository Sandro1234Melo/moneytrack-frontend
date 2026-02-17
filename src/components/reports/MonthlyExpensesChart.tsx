import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import api from "../../api/axios";
import type {ReportFilters}  from "../reports/ReportFilters";

type Props = {
  user_Id: number
  filters: ReportFilters
}

const MonthlyExpensesChart: React.FC<Props> = ({ user_Id, filters }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!user_Id) return;

    api.get("/reports/monthly-expenses", {
      params: { user_Id, ...filters }
    })
      .then(res => setData(res.data))
      .catch(console.error);

  }, [user_Id, filters]);

  return (
    <div className="bg-[#071122] p-6 rounded-lg border border-[#12202a]">
      <h3 className="text-lg font-semibold mb-4">
        Evolução dos Gastos Mensais
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#8b5cf6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyExpensesChart;
