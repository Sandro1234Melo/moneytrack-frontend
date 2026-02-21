import { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";
import api from "../../api/axios";
import type { ReportFiltersType } from "../../pages/Reports";

type Props = {
  user_Id: number;
  filters: ReportFiltersType;
};

const COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#22c55e",
  "#eab308",
  "#ef4444"
];

const CategoryDistributionChart: React.FC<Props> = ({ user_Id, filters }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!user_Id) return;
    if (!filters.from || !filters.to) return;

    api
      .get("/reports/category-distribution", {
        params: {
          userId: user_Id,
          from: filters.from,
          to: filters.to
        }
      })
      .then(res => setData(res.data))
      .catch(console.error);
  }, [user_Id, filters]);

  return (
    <div className="bg-[#071122] p-6 rounded-lg border border-[#12202a]">
      <h3 className="text-lg font-semibold mb-4">
        Distribuição por Categoria
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
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