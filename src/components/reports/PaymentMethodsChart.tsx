import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { method: "Cartão", total: 1200 },
  { method: "Dinheiro", total: 300 },
  { method: "Pix", total: 520 }
];

const PaymentMethodsChart = () => {
  return (
    <div className="bg-[#071122] p-6 rounded-lg border border-[#12202a]">
      <h3 className="text-lg font-semibold mb-4">
        Formas de Pagamento
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="method" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar
              dataKey="total"
              fill="#8b5cf6"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PaymentMethodsChart;
