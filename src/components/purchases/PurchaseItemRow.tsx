import { Trash2, Plus } from "lucide-react";
import FormSelect from "../molecules/select-field";
import type { NamedOption, PurchaseItem } from "../../types/purchases";

type Props = {
  item: PurchaseItem;
  categories: NamedOption[];
  onChange: (field: keyof PurchaseItem, value: string | number) => void;
  onRemove: () => void;
  onAddCategory: () => void;
};

const PurchaseItemRow = ({
  item,
  categories,
  onChange,
  onRemove,
  onAddCategory
}: Props) => {
  return (
    <div className="grid grid-cols-12 gap-2 px-4 py-2 items-center">
      <div className="col-span-4">
        <input
          value={item.description}
          onChange={e => onChange("description", e.target.value)}
          className="input-primary w-full"
          placeholder="Produto"
        />
      </div>

      <div className="col-span-3 flex gap-2 items-center">
        <div className="flex-1">
          <FormSelect
            label=""
            value={item.categoryId ?? ""}
            placeholder="Categoria"
            onChange={(v) => onChange("categoryId", v)}
            options={categories.map((cat) => ({
              value: String(cat.id),
              label: cat.name
            }))}
          />
        </div>

        <button
          type="button"
          onClick={onAddCategory}
          className="w-8 h-8 flex items-center justify-center 
                     rounded-md bg-purple-600 hover:bg-purple-700"
          title="Nova categoria"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="col-span-2">
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={e => onChange("quantity", Number(e.target.value))}
          className="input-primary w-full"
        />
      </div>

      <div className="col-span-2">
        <input
          type="number"
          step="0.01"
          value={item.price}
          onChange={e => onChange("price", Number(e.target.value))}
          className="input-primary w-full"
        />
      </div>

      <div className="col-span-1">
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-400"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default PurchaseItemRow;
