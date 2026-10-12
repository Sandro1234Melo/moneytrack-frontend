import { useEffect, useState } from "react";

import api from "../../api/axios";
import type { CategoryDistribution, ReportFilters } from "../../types/reports";
import HeatMap from "../ui/2.0/heat-map";

type Props = {
  userId: number;
  filters: ReportFilters;
};


const CategoryDistributionChart: React.FC<Props> = ({ userId, filters }) => {
  const [data, setData] = useState<CategoryDistribution[]>([]);

  useEffect(() => {
    if (!userId) return;
    if (!filters.from || !filters.to) return;

    api
      .get("/reports/category-distribution", {
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
    <div className="bg-[#071122] p-6 rounded-lg border border-[#12202a]">
      <h3 className="text-lg font-semibold mb-4">
        Distribuição por Categoria
      </h3>

     {data.length > 0 ? (
      <HeatMap 
        data={data.map(d => ({ id: d.name, value: Number(d.value) }))} 
        
        animate
        fromColor="#06b6d4"
        toColor="#8b5cf6"
        height={300}
      />
    ) : (
      <div className="text-white">Carregando dados...</div>
    )}
    </div>
  );
};

export default CategoryDistributionChart;
