import { useState } from "react";
import api from "../../api/axios";
import { getLoggedUser } from "../../utils/auth";
import Modal from "../ui/Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (category: any) => void;
};

const CategoryQuickCreate: React.FC<Props> = ({
  open,
  onClose,
  onCreated
}) => {
  const [name, setName] = useState("");
  const user = getLoggedUser();

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Informe o nome da categoria");
      return;
    }

    const response = await api.post("/categories", {
      name,
      userId: user.id
    });

    onCreated(response.data);
    setName("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Nova categoria">
      
      <div className="space-y-4">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nome da categoria"
          className="input-primary w-full"
        />

        <button
          onClick={handleSave}
          className="w-full bg-purple-600 py-2 rounded-lg"
        >
          Salvar categoria
        </button>
      </div>

    </Modal>
  );
};

export default CategoryQuickCreate;
