import React, { useEffect, useState } from "react";
import { GradientButton } from "../components/GradientButton";

type PurchaseItem = {
  description: string;
  amount: number;
  category_Id: number;
};

type PurchaseFormProps = {
  purchase?: any | null;
  onSave: (data: any) => void;
  onCancel: () => void;
};

const PurchaseForm: React.FC<PurchaseFormProps> = ({
  purchase,
  onSave,
  onCancel,
}) => {
  const [date, setDate] = useState("");
  const [locationId, setLocationId] = useState<number | null>(null);
  const [items, setItems] = useState<PurchaseItem[]>([
    { description: "", amount: 0, category_Id: 0 },
  ]);

  useEffect(() => {
    if (purchase) {
      setDate(purchase.date);
      setLocationId(purchase.locationId ?? null);
      setItems(
        purchase.items.map((i: any) => ({
          description: i.description,
          amount: i.amount,
          category_Id: i.category_Id,
        }))
      );
    }
  }, [purchase]);

  const addItem = () => {
    setItems([...items, { description: "", amount: 0, category_Id: 0 }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...items];
    // @ts-ignore
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      date,
      locationId,
      items,
    });

    setDate("");
    setLocationId(null);
    setItems([{ description: "", amount: 0, category_Id: 0 }]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-dark p-5 rounded-2xl border border-[#12202a] mb-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">
        {purchase ? "Editar Compra" : "Nova Compra"}
      </h3>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm text-gray-300">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-2 rounded bg-[#0d1821] border border-[#12202a] text-white"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Local (opcional)</label>
          <input
            type="number"
            placeholder="ID do local"
            value={locationId ?? ""}
            onChange={(e) =>
              setLocationId(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full p-2 rounded bg-[#0d1821] border border-[#12202a] text-white"
          />
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid sm:grid-cols-3 gap-3"
          >
            <input
              placeholder="Descrição"
              value={item.description}
              onChange={(e) =>
                updateItem(index, "description", e.target.value)
              }
              className="p-2 rounded bg-[#0d1821] border border-[#12202a] text-white"
            />

            <input
              type="number"
              step="0.01"
              placeholder="Valor"
              value={item.amount}
              onChange={(e) =>
                updateItem(index, "amount", Number(e.target.value))
              }
              className="p-2 rounded bg-[#0d1821] border border-[#12202a] text-white"
            />

            <input
              type="number"
              placeholder="Categoria ID"
              value={item.category_Id}
              onChange={(e) =>
                updateItem(index, "category_Id", Number(e.target.value))
              }
              className="p-2 rounded bg-[#0d1821] border border-[#12202a] text-white"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={addItem}
          className="text-sm text-purple-400 hover:text-purple-300"
        >
          + Adicionar item
        </button>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 rounded text-white hover:bg-gray-600"
        >
          Cancelar
        </button>

        <GradientButton label="Salvar" />
      </div>
    </form>
  );
};

export default PurchaseForm;
