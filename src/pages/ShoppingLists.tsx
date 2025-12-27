import React from "react";

const ShoppingLists: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Listas de Compras</h2>
          <p className="text-sm text-gray-400">Organize suas compras e converta em gastos</p>
        </div>
        <div>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded text-white">+ Nova Lista</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#071122] p-4 rounded border border-[#12202a]">
          <div className="font-medium">Uva</div>
          <div className="text-sm text-gray-400">0 itens</div>
          <div className="mt-3">
            <input className="w-full p-2 rounded bg-[#0b1117] border border-[#12202a]" placeholder="Adicionar item..." />
          </div>
          <div className="mt-4">
            <button className="w-full py-2 rounded bg-[#0b1117] text-gray-300">Converter em Gasto</button>
          </div>
        </div>

        <div className="bg-[#071122] p-4 rounded border border-[#12202a]">
          <div className="font-medium">Compras do Mês</div>
          <div className="text-sm text-gray-400">0 itens</div>
          <div className="mt-3">
            <input className="w-full p-2 rounded bg-[#0b1117] border border-[#12202a]" placeholder="Adicionar item..." />
          </div>
          <div className="mt-4">
            <button className="w-full py-2 rounded bg-[#0b1117] text-gray-300">Converter em Gasto</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingLists;
