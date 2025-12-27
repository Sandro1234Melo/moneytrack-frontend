import React from "react";

const Reports: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Análises e Relatórios</h2>

      <div className="bg-[#071122] p-6 rounded-lg border border-[#12202a] mb-6">
        <h3 className="text-lg font-semibold mb-2">Evolução dos Gastos Mensais</h3>
        <div className="h-48 flex items-center justify-center text-gray-500">Gráfico (placeholder)</div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#071122] p-6 rounded-lg border border-[#12202a] h-40">Distribuição por Categoria</div>
        <div className="bg-[#071122] p-6 rounded-lg border border-[#12202a] h-40">Formas de Pagamento</div>
      </div>
    </div>
  );
};

export default Reports;
