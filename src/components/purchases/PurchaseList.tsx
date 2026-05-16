import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmDialog from "../ui/ConfirmDialog";
import { getLoggedUser } from "../../utils/auth";

type Props = {
  purchases: any[];
  onEdit: (purchase: any) => void;
  onDelete: (id: number) => void;
};

const PurchaseList: React.FC<Props> = ({ purchases, onEdit, onDelete }) => {

  const user = getLoggedUser();
   const currencySymbol = user?.currencySymbol || "€";
   
  const [deleteId, setDeleteId] = useState<number | null>(null);

  return (
    <>
      <div className="space-y-4">
        {purchases.map((p) => (
          <div
            key={p.id}
            className="bg-white/5 border border-white/10 rounded-lg p-4"
          >
            <div
              className="grid gap-y-2"
              style={{ gridTemplateColumns: "120px 1fr 160px 40px 40px" }}
            >
              <div className="text-sm text-gray-400">
                Nota {p.id}
              </div>

              <div className="text-sm text-gray-400">
                {new Date(p.date).toLocaleDateString("pt-BR")}
              </div>

              <div className="text-primary-light font-semibold text-right">
                {currencySymbol} {p.amount?.toFixed(2)}
              </div>

              <button
                onClick={() => onEdit(p)}
                className="text-blue-400 hover:text-blue-300 justify-self-center"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => setDeleteId(p.id)}
                className="text-red-400 hover:text-red-300 justify-self-center"
              >
                <Trash2 size={18} />
              </button>

              <div className="col-span-5 text-white font-medium">
                {p.locationName ?? "—"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Excluir compra"
        message="Tem certeza que deseja excluir esta compra? Esta ação não pode ser desfeita."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) onDelete(deleteId);
          setDeleteId(null);
        }}
      />
    </>
  );
};

export default PurchaseList;
