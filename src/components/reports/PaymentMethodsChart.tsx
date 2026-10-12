import { useEffect, useState } from "react";

import api from "../../api/axios";
import type { PaymentMethodTotal, ReportFilters } from "../../types/reports";
import { BarChart } from "../ui/2.0/bar-chart";

type Props = {
  userId: number
  filters: ReportFilters
}

const paymentMethodLabels: Record<number, string> = {
  0: "Dinheiro",
  1: "Débito",
  2: "Crédito",
  3: "PIX",
  4: "Transferência",
  5: "MB Way",
  6: "Vale alimentação",
};

const PaymentMethodsChart: React.FC<Props> = ({ userId, filters }) => {
  const [data, setData] = useState<PaymentMethodTotal[]>([]);

  useEffect(() => {
    if (!userId) return;
    if (!filters?.from || !filters?.to) return;

    api.get("/reports/payment-methods", {
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
                 data: data.map(d => Number(d.total)),
              }
            ]
          }
          
          
          labels={data.map(d => paymentMethodLabels[Number(d.method)] ?? "Outro")}
          height={300}

        />
      </div>
    </div>
  );
};

export default PaymentMethodsChart;
