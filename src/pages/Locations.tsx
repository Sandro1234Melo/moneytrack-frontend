import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { GradientButton } from "../components/GradientButton";
import { Plus, Trash2 } from "lucide-react";

type Location = {
  id: number;
  name: string;
};

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [name, setName] = useState("");

  const userId = 1; // depois vem do login

  const loadLocations = async () => {
    try {
      const response = await api.get(`/locations`);
      setLocations(response.data);
    } catch (error) {
      console.error("Erro ao carregar locais", error);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;

    await api.post("/locations", {
      name,
      user_Id: userId,
    });

    setName("");
    loadLocations();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja excluir este local?")) return;

    await api.delete(`/locations/${id}`);
    loadLocations();
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-semibold mb-2">Locais</h2>
      <p className="text-sm text-gray-400 mb-6">
        Onde os gastos acontecem
      </p>

      <div className="flex gap-3 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Novo local"
          className="flex-1 p-2 rounded bg-[#0d1821] border border-[#12202a] text-white"
        />
        <GradientButton label="Adicionar" icon={Plus} onClick={handleCreate} />
      </div>

      <div className="space-y-2">
        {locations.map((l) => (
          <div
            key={l.id}
            className="flex items-center justify-between bg-surface-dark p-3 rounded border border-[#12202a]"
          >
            <span>{l.name}</span>
            <button
              onClick={() => handleDelete(l.id)}
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

export default Locations;
