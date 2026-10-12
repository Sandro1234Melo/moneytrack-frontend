import PurchaseCard from "./PurchaseCard";
import type { Purchase } from "../../types/purchases";

type Props = {
  purchases: Purchase[];
  onEdit: (purchase: Purchase) => void;
  onDelete: (id: number) => void;
};

const PurchaseCardList = ({ purchases, onEdit, onDelete }: Props) => {
  return (
    <div className="space-y-4">
      {purchases.map(p => (
        <PurchaseCard
          key={p.id}
          purchase={p}
          onEdit={() => onEdit(p)}
          onDelete={() => onDelete(p.id)}
        />
      ))}
    </div>
  );
};

export default PurchaseCardList;
