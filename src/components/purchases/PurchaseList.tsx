import { Pencil, Trash2 } from "lucide-react";

type Props = {
  purchases: any[];
  onEdit: (purchase: any) => void;
  onDelete: (id: number) => void;
};

const PurchaseList: React.FC<Props> = ({ purchases, onEdit, onDelete }) => {
  return (
    <div className="space-y-3">
      {purchases.map((p) => (
        <div
          key={p.id}
          className="bg-surface-dark border border-[#12202a] rounded-lg p-4
                     flex justify-between items-center"
        >
          <div>
            <div className="text-white font-medium">
              {p.locationName ?? "—"}
            </div>
            <div className="text-sm text-gray-400">
              {new Date(p.date).toLocaleDateString("pt-BR")}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-primary-light font-semibold">
              R$ {p.amount?.toFixed(2)}
            </span>

            <button
              onClick={() => onEdit(p)}
              className="text-blue-400 hover:text-blue-300"
            >
              <Pencil size={18} />
            </button>

            <button
              onClick={() => onDelete(p.id)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PurchaseList;
