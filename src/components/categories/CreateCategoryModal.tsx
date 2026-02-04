import { useState } from "react";
import Modal from "../ui/Modal";
import api from "../../api/axios";
import { getLoggedUser } from "../../utils/auth";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (category: any) => void;
};

const CreateCategoryModal = ({ open, onClose, onCreated }: Props) => {
  const [name, setName] = useState("");
  const user = getLoggedUser();

  const handleSave = async () => {
    if (!name.trim()) return;

    const res = await api.post("/categories", {
      name,
      userId: user.id
    });

    onCreated(res.data);
    setName("");
    onClose();
  };

  return (
    <Modal open={open} title="Nova Categoria" onClose={onClose}>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Nome da categoria"
        className="input w-full mb-4"
      />

      <button
        onClick={handleSave}
        className="w-full bg-purple-700 py-2 rounded-lg"
      >
        Salvar
      </button>
    </Modal>
  );
};

export default CreateCategoryModal;
