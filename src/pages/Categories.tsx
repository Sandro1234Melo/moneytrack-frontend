import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { GradientButton } from "../components/GradientButton";
import { Plus, Pencil } from "lucide-react";
import { getLoggedUser } from "../utils/auth";
import Alert from "../components/ui/Alert";
import ConfirmDialog from "../components/ui/ConfirmDialog";

type Category = {
  id: number;
  name: string;
};

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const user = getLoggedUser();
  const userId = user?.id;

  const loadCategories = async () => {
    const response = await api.get(`/categories/${userId}`);
    setCategories(response.data);
  };

  useEffect(() => {
    if (!userId) return;
    loadCategories();
  }, [userId]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/categories/${id}`);

      setSuccessMessage("Categoria removida com sucesso!");

      setIsEditing(false);
      setEditingCategory(null);
      setName("");

      loadCategories();

      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (error: any) {

      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Não foi possível excluir a categoria.");
      }

      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, {
          name,
          user_Id: userId,
        });

        setSuccessMessage("Categoria atualizada com sucesso!");
      } else {
        await api.post("/categories", {
          name,
          user_Id: userId,
        });

        setSuccessMessage("Categoria criada com sucesso!");
      }

      setIsEditing(false);
      setEditingCategory(null);
      setName("");

      loadCategories();

      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (error: any) {

      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Erro ao salvar categoria.");
      }

      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  const openCreate = () => {
    setEditingCategory(null);
    setName("");
    setIsEditing(true);
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingCategory(null);
    setName("");
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-xl mx-auto">

      {successMessage && (
        <Alert message={successMessage} variant="success" />
      )}

      {errorMessage && (
        <Alert message={errorMessage} variant="error" />
      )}

      <h2 className="text-2xl font-semibold mb-2">Categorias</h2>   

      <div className="flex items-center gap-3 mb-6">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar categoria..."
          className="flex-1 p-2 rounded bg-[#0d1821] border border-[#12202a] text-white"
        />

        <GradientButton
          label="Nova categoria"
          icon={Plus}
          onClick={openCreate}
        />

      </div>

      {isEditing ? (

        <div className="bg-surface-dark p-6 rounded border border-[#12202a] space-y-4">

          <h3 className="text-lg font-semibold">
            {editingCategory ? "Editar categoria" : "Nova categoria"}
          </h3>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome da categoria"
            className="w-full p-2 rounded bg-[#0d1821] border border-[#12202a] text-white"
          />

          <div className="flex justify-between">

            {editingCategory && (
              <button
                onClick={() => setDeleteId(editingCategory.id)}
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
          {filteredCategories.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between bg-surface-dark p-3 rounded border border-[#12202a]"
            >
              <span>{c.name}</span>

              <button
                onClick={() => openEdit(c)}
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
        title="Excluir categoria"
        message="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId !== null) handleDelete(deleteId);
          setDeleteId(null);
        }}
      />

    </div>
  );
};

export default Categories;
