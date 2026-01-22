import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { GradientButton } from "../components/GradientButton";
import { Plus, Trash2 } from "lucide-react";

type Category = {
  id: number;
  name: string;
};

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");

  const userId = 1; // depois vem do login

  const loadCategories = async () => {
    const response = await api.get(`/categories/${userId}`);
    setCategories(response.data);
  };

  useEffect(() => {
    loadCategories();
    console.log("API URL =>", import.meta.env.VITE_API_URL);
    console.log("Teste");
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;

    await api.post("/categories", {
      name,
      user_Id: userId,
    });

    setName("");
    loadCategories();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja excluir esta categoria?")) return;

    await api.delete(`/categories/${id}`);
    loadCategories();
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-semibold mb-2">Categorias</h2>
      <p className="text-sm text-gray-400 mb-6">
        Organize seus tipos de gastos
      </p>

      <div className="flex gap-3 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nova categoria"
          className="flex-1 p-2 rounded bg-[#0d1821] border border-[#12202a] text-white"
        />
        <GradientButton label="Adicionar" icon={Plus} onClick={handleCreate} />
      </div>

      <div className="space-y-2">
        {categories.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between bg-surface-dark p-3 rounded border border-[#12202a]"
          >
            <span>{c.name}</span>
            <button
              onClick={() => handleDelete(c.id)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
