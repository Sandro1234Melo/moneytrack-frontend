import React from "react";
import { Pencil, Trash2 } from "lucide-react";

type PurchaseListProps = {
  purchases: any[];
  onEdit: (purchase: any) => void;
  onDelete: (id: number) => void;
};

const PurchaseList: React.FC<PurchaseListProps> = ({
  purchases,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid gap-3">
      {purchases.map((p) => (
        <div
          key={p.id}
          className="bg-surface-dark p-4 rounded border border-[#12202a]
                     flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
        >
          <div className="flex-1">
            <div className="font-medium text-white">
              Compra #{p.id}
            </div>
            <div className="text-sm text-gray-400">
              {p.date} • {p.locationName ?? "—"}
            </div>
          </div>

          <div className="flex gap-3">
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
