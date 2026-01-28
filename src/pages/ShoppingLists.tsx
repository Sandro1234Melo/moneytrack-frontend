import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getLoggedUser } from "../utils/auth";
import {
  getShoppingListsByUser,
  createShoppingList,
  deleteShoppingList
} from "../services/shoppingListService";

type ShoppingList = {
  id: number;
  name: string;
  status: string;
  plannedDate?: string;
};

const ShoppingLists = () => {
  const user = getLoggedUser();
  const userId = user?.id;

  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [name, setName] = useState("");

  const loadLists = async () => {
    if (!userId) return;
    const res = await getShoppingListsByUser(userId);
    setLists(res.data);
  };

  useEffect(() => {
    loadLists();
  }, [userId]);

  const handleCreateList = async () => {
    if (!name.trim() || !userId) return;

    try {
      await createShoppingList(userId, name);
      setName("");
      setOpenCreate(false);
      loadLists();
    } catch (err) {
      console.error("Erro ao criar lista", err);
    }
  };



  const handleDelete = async (id: number) => {
    if (!confirm("Excluir esta lista?")) return;
    await deleteShoppingList(id);
    loadLists();
  };

  return (
    <div className="max-w-5xl mx-auto px-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-brand-light">
          Listas de Compras
        </h1>

        <button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          Nova Lista
        </button>
      </div>

      {/* LIST */}
      <div className="grid gap-4">
        {lists.map(list => (
          <div
            key={list.id}
            className="bg-surface-dark border border-[#12202a] rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{list.name}</p>
              <p className="text-sm text-gray-400">
                Status: {list.status}
              </p>
            </div>

            <button
              onClick={() => handleDelete(list.id)}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Excluir
            </button>
          </div>
        ))}

        {lists.length === 0 && (
          <p className="text-gray-400 text-sm">
            Nenhuma lista criada ainda.
          </p>
        )}
      </div>

      {/* MODAL CRIAR */}
      {openCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#0b0b2a] w-full max-w-md rounded-xl p-6">

            <h2 className="text-lg font-semibold mb-4">
              Nova Lista
            </h2>

            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nome da lista"
              className="w-full px-4 py-2 bg-[#000018] text-white border border-[#1f1f3a] rounded-lg mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenCreate(false)}
                className="px-4 py-2 text-gray-400"
              >
                Cancelar
              </button>

              <button
                onClick={handleCreateList}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
              >
                Criar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ShoppingLists;
