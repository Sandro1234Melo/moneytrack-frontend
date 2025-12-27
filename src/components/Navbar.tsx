import React from "react";

const Navbar: React.FC = () => {
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-semibold">Listas de Compras</h2>
        <p className="text-sm text-gray-400">Organize suas compras e converta em gastos</p>
      </div>

      <div className="flex items-center gap-3">
        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md shadow">
          + Nova Lista
        </button>
      </div>
    </header>
  );
};

export default Navbar;
