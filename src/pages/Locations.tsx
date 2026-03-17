import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { GradientButton } from "../components/GradientButton";
import { Plus, Pencil } from "lucide-react";
import { getLoggedUser } from "../utils/auth";
import Alert from "../components/ui/Alert";
import ConfirmDialog from "../components/ui/ConfirmDialog";

type Location = {
  id: number;
  name: string;
};

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const user = getLoggedUser();
  const userId = user?.id;

  const loadLocations = async () => {
    const response = await api.get(`/locations/${userId}`);
    setLocations(response.data);
  };

  useEffect(() => {
    if (!userId) return;
    loadLocations();
  }, [userId]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/locations/${id}`);

      setSuccessMessage("Local removido com sucesso!");

      setIsEditing(false);
      setEditingLocation(null);
      setName("");

      loadLocations();

      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (error: any) {

      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Não foi possível excluir o local.");
      }

      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      if (editingLocation) {
        await api.put(`/locations/${editingLocation.id}`, {
          name,
          user_Id: userId,
        });

        setSuccessMessage("Local atualizado com sucesso!");
      } else {
        await api.post("/locations", {
          name,
          user_Id: userId,
        });

        setSuccessMessage("Local criado com sucesso!");
      }

      setIsEditing(false);
      setEditingLocation(null);
      setName("");

      loadLocations();

      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (error: any) {

      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Erro ao salvar local.");
      }

      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  const openCreate = () => {
    setEditingLocation(null);
    setName("");
    setIsEditing(true);
  };

  const openEdit = (location: Location) => {
    setEditingLocation(location);
    setName(location.name);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingLocation(null);
    setName("");
  };

  const filteredLocations = locations.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-xl mx-auto">

      {successMessage && (
        <Alert message={successMessage} variant="success" />
      )}

      {errorMessage && (
        <Alert message={errorMessage} variant="error" />
      )}

      <h2 className="text-2xl font-semibold mb-2">Locais</h2>

      <div className="flex items-center gap-3 mb-6">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar local..."
          className="flex-1 p-2 rounded bg-[#0d1821] border border-[#12202a] text-white"
        />

        <GradientButton
          label="Novo local"
          icon={Plus}
          onClick={openCreate}
        />

      </div>

      {isEditing ? (

        <div className="bg-surface-dark p-6 rounded border border-[#12202a] space-y-4">

          <h3 className="text-lg font-semibold">
            {editingLocation ? "Editar local" : "Novo local"}
          </h3>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do local"
            className="w-full p-2 rounded bg-[#0d1821] border border-[#12202a] text-white"
          />

          <div className="flex justify-between">

            {editingLocation && (
              <button
                onClick={() => setDeleteId(editingLocation.id)}
                className="border border-red-400 text-red-400 hover:bg-red-400/10 px-3 py-2 rounded"
              >
                Excluir
              </button>
            )}

            <div className="flex gap-2 ml-auto">

              <button
                onClick={handleCancel}
                className="border border-white/20 px-3 py-2 rounded"
              >
                Cancelar
              </button>

              <GradientButton
                label="Salvar"
                icon={Plus}
                onClick={handleSave}
              />

            </div>

          </div>

        </div>

      ) : (

        <div className="space-y-2">
          {filteredLocations.map((l) => (
            <div
              key={l.id}
              className="flex items-center justify-between bg-surface-dark p-3 rounded border border-[#12202a]"
            >
              <span>{l.name}</span>

              <button
                onClick={() => openEdit(l)}
                className="text-blue-400 hover:text-blue-300"
              >
                <Pencil size={18} />
              </button>
            </div>
          ))}
        </div>

      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Excluir local"
        message="Tem certeza que deseja excluir este local? Esta ação não pode ser desfeita."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId !== null) handleDelete(deleteId);
          setDeleteId(null);
        }}
      />

    </div>
  );
};

export default Locations;
