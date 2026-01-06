import { Plus } from "lucide-react";
import { GradientButton } from "../GradientButton";

type Props = {
  onSave: () => void;
  onCancel: () => void;
  onAddItem: () => void;
};

const PurchaseActions: React.FC<Props> = ({
  onSave,
  onCancel,
  onAddItem
}) => {
  return (
    <>
      <GradientButton label="Adicionar Item" icon={Plus} onClick={onAddItem} />

      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-600 text-gray-300 rounded"
        >
          Cancelar
        </button>

        <button
          onClick={onSave}
          className="px-6 py-2 bg-primary text-white rounded"
        >
          Salvar
        </button>
      </div>
    </>
  );
};

export default PurchaseActions;
