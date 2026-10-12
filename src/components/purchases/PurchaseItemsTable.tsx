import PurchaseItemRow from "./PurchaseItemRow";
import type { NamedOption, PurchaseItem } from "../../types/purchases";

type Props = {
  items: PurchaseItem[];
  setItems: (items: PurchaseItem[]) => void;
  categories: NamedOption[];
  onAddCategory: () => void;
};

const PurchaseItemsTable = ({
  items,
  setItems,
  categories,
  onAddCategory
}: Props) => {
  const updateItem = (index: number, field: keyof PurchaseItem, value: string | number) => {
    const copy = [...items];
    copy[index] = { ...copy[index], [field]: value };
    setItems(copy);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="border border-[#12202a] rounded">
      <div className="grid grid-cols-12 text-sm text-blue-100 px-4 py-2">
        <div className="col-span-4">Produto</div>
        <div className="col-span-3">Categoria</div>
        <div className="col-span-2">Qtd</div>
        <div className="col-span-2">Preço</div>
        <div className="col-span-1"></div>
      </div>

      {items.map((item, index) => (
        <PurchaseItemRow
          key={index}
          item={item}
          categories={categories}
          onChange={(field, value) =>
            updateItem(index, field, value)
          }
          onRemove={() => removeItem(index)}
          onAddCategory={onAddCategory}
        />
      ))}
    </div>
  );
};

export default PurchaseItemsTable;
