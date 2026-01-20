import { Pencil, Trash2 } from "lucide-react";

type Props = {
  purchase: any;
  onEdit: () => void;
  onDelete: () => void;
};

const PurchaseCard = ({ purchase, onEdit, onDelete }: Props) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">
          Nota {purchase.id}
        </span>

        <span className="font-semibold text-primary-light">
          € {purchase.amount?.toFixed(2)}
        </span>
      </div>

      <div className="text-sm text-gray-300">
        {new Date(purchase.date).toLocaleDateString("pt-PT")}
      </div>

      <div className="font-medium">
        {purchase.locationName ?? "—"}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onEdit}
          className="text-blue-400"
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={onDelete}
          className="text-red-400"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default PurchaseCard;
