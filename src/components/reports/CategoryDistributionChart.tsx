import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { name: "Alimentação", value: 420 },
  { name: "Transporte", value: 180 },
  { name: "Lazer", value: 260 },
  { name: "Moradia", value: 740 }
];

const COLORS = ["#8b5cf6", "#22d3ee", "#f97316", "#10b981"];

const CategoryDistributionChart = () => {
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
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
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
