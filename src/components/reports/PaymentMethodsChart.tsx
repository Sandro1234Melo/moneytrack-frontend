import { useEffect, useState } from "react";

import api from "../../api/axios";
import type { ReportFilters } from "../reports/ReportFilters";
import { BarChart } from "../ui/2.0/bar-chart";

type Props = {
  user_Id: number
  filters: ReportFilters
}

const PaymentMethodsChart: React.FC<Props> = ({ user_Id, filters }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!user_Id) return;
    if (!filters?.from || !filters?.to) return;

    api.get("/reports/payment-methods", {
      params: {
        userId: user_Id,
        from: filters.from,
        to: filters.to     
      }
      
    })
      .then(res => setData(res.data))
      .catch(console.error);

  }, [user_Id, filters]);

  console.log("PaymentMethodsChart data:", data);

  return (
    <div className="bg-[#071122] p-6 rounded-lg border border-[#12202a]">
      <h3 className="text-lg font-semibold mb-4">
        Formas de Pagamento
      </h3>

      <div className="h-64">
        <BarChart 
          datasets={
            [
              {
                 id: "payment-methods",
                 label: "Formas de Pagamento",
                 color: "#06b6d4",
                 data: data.map(d => d.total),
              }
            ]
          }
          
          
          labels={data.map(d => d.method)}
          height={300}

        />
      </div>
    </div>
  );
};

export default PaymentMethodsChart;
