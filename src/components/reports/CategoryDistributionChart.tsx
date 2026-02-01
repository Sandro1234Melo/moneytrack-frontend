import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from "recharts";
import api from "../../api/axios";
import type { ReportFilters } from "../reports/ReportFilters";

const COLORS = ["#8b5cf6", "#22d3ee", "#f97316", "#10b981"];

type Props = {
  userId: number
  filters: ReportFilters
}

const CategoryDistributionChart: React.FC<Props> = ({ userId, filters }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;

    api.get("/reports/category-distribution", {
      params: { userId, ...filters }
    })
      .then(res =>
        setData(
          res.data.map((d: any) => ({
            name: d.category,
            value: d.total
          }))
        )
      )
      .catch(console.error);

  }, [userId, filters]);

  return (
    <div className="bg-[#071122] p-6 rounded-lg border border-[#12202a]">
      <h3 className="text-lg font-semibold mb-4">
        Distribuição por Categoria
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" label>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryDistributionChart;
