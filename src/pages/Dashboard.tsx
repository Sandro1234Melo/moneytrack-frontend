import React from "react";
import Navbar from "../components/Navbar";
import { getLoggedUser } from "../utils/auth";

const StatCard: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <div className="bg-[#0b1220] p-4 rounded-lg shadow-sm border border-[#17202a]">
    <div className="text-sm text-gray-400">{title}</div>
    <div className="text-2xl font-bold mt-2">{value}</div>
  </div>
);

const Dashboard: React.FC = () => {

  const user = getLoggedUser();
     const currencySymbol = user?.currencySymbol || "€";
     
  return (
    <div>
      <Navbar />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard title="Saldo Atual" value={`${currencySymbol} 0,00`} />
        <StatCard title="Despesa Mensal" value={`${currencySymbol} 0,00`} />
        <StatCard title="Receita Mensal" value={`${currencySymbol} 0.00`} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#071122] p-6 rounded-lg border border-[#12202a]">
          <h3 className="text-lg font-semibold mb-4">Evolução dos Gastos Mensais</h3>
          <div className="h-48 flex items-center justify-center text-gray-500">
            {/* Placeholder para gráfico — pode integrar Recharts ou Chart.js */}
            Gráfico (a integrar)
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-[#071122] p-6 rounded-lg border border-[#12202a] h-44">
            <h3 className="text-lg font-semibold mb-2">Distribuição por Categoria</h3>
            <div className="h-28 flex items-center justify-center text-gray-500">Gráfico pizza</div>
          </div>

          <div className="bg-[#071122] p-6 rounded-lg border border-[#12202a]">
            <h3 className="text-lg font-semibold mb-2">Formas de Pagamento</h3>
            <div className="h-16 flex items-center justify-center text-gray-500">Cards</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
