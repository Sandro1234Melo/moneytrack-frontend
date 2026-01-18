import { Trash2 } from "lucide-react";
import FormSelect from "../ui/FormSelect";

const PurchaseItemRow = ({ item, categories, onChange, onRemove }: any) => {
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

      <div className="col-span-3">
        <FormSelect
          label=""
          value={item.categoryId ?? ""}
          placeholder="Categoria"
          onChange={(v) => onChange("categoryId", v)}
          options={categories.map((cat: any) => ({
            value: String(cat.id),
            label: cat.name
          }))}
        />

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
          className="input-primary w-full "
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
