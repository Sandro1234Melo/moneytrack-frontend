import { use, useEffect, useMemo, useState } from "react";

import api from "../../api/axios";
import type { ReportFiltersType } from "../../pages/Reports";
import { PieChart } from "../ui/2.0/pie-chart";
import HeatMap from "../ui/2.0/heat-map";

type Props = {
  user_Id: number;
  filters: ReportFiltersType;
};


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