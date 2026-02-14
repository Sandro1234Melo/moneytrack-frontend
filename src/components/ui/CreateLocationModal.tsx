import { useState } from "react";
import api from "../../api/axios";
import { getLoggedUser } from "../../utils/auth";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (location: any) => void;
};

const CreateLocationModal: React.FC<Props> = ({
  open,
  onClose,
  onCreated
}) => {
  const [name, setName] = useState("");
  const user = getLoggedUser();

  if (!open) return null;

  const handleCreate = async () => {
    if (!name) return;

    const res = await api.post("/locations", {
      name,
      userId: user.id
    });

    onCreated(res.data);
    setName("");
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#071122] p-6 rounded-lg w-80">
        <h3 className="text-lg font-semibold mb-4">
          Nova Localização
        </h3>

        <input
          className="input-primary w-full mb-4"
          placeholder="Nome do local"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400"
          >
            Cancelar
          </button>

          <button
            onClick={handleCreate}
            className="bg-purple-600 px-4 py-2 rounded"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLocationModal;
