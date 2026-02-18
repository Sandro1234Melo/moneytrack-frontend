import { useEffect, useState } from "react";
import FormSelect from "../molecules/select-field";
import { Trash2 } from "lucide-react";
import { paymentMethods } from "../../utils/paymentMethods";

export interface PurchaseFormMobileProps {
  purchase?: any | null;
  locations: any[];
  categories: any[];
  onSave: (data: any) => void;
  onCancel: () => void;
}

const PurchaseFormMobile: React.FC<PurchaseFormMobileProps> = ({
  purchase,
  locations,
  categories,
  onSave,
  onCancel
}) => {
  const [date, setDate] = useState(
    purchase?.date?.substring(0, 10) ??
      new Date().toISOString().substring(0, 10)
  );

  const [locationId, setLocationId] = useState<number | "">(
    purchase?.locationId ?? ""
  );

  const [paymentMethod, setPaymentMethod] = useState<number | "">(
    purchase?.paymentMethod ?? ""
  );

  const [items, setItems] = useState<any[]>([]); 

  useEffect(() => {
    if (purchase) {
      setDate(purchase.date?.substring(0, 10));
      setLocationId(purchase.locationId ?? "");
      setPaymentMethod(purchase.paymentMethod ?? "");

      setItems(
        purchase.items.map((item: any) => ({
          description: item.description ?? "",
          categoryId: String(item.categoryId ?? ""),
          quantity: item.quantity ?? 1,
          price: item.unitPrice ?? 0
        }))
      );
    } else {
      setItems([]);
      setPaymentMethod("");
    }
  }, [purchase]);

  const handleAddItem = () => {
    setItems([
      ...items,
      { description: "", categoryId: "", quantity: 1, price: 0 }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!locationId) {
      alert("Selecione o local");
      return;
    }

    if (paymentMethod === "") {
      alert("Selecione a forma de pagamento");
      return;
    }

    if (items.length === 0) {
      alert("Adicione pelo menos um item");
      return;
    }

    for (const item of items) {
      if (!item.categoryId) {
        alert("Todos os itens precisam de categoria");
        return;
      }
    }

    onSave({
      date,
      locationId: Number(locationId),
      paymentMethod: Number(paymentMethod),
      items: items.map(item => ({
        description: item.description,
        categoryId: Number(item.categoryId),
        quantity: Number(item.quantity),
        price: Number(item.price)
      }))
    });
  };

  return (
    <div className="bg-surface-dark rounded-xl p-4 space-y-5">
      <h2 className="text-lg font-semibold">
        {purchase ? "Editar Compra" : "Nova Compra"}
      </h2>

      <FormSelect
        label="Local"
        value={locationId}
        onChange={value => setLocationId(Number(value))}
        options={locations.map(l => ({ value: l.id, label: l.name }))}
      />

      <FormSelect
        label="Forma de pagamento"
        value={paymentMethod}
        onChange={value => setPaymentMethod(Number(value))}
        options={paymentMethods}
      />

      <div>
        <label className="text-sm text-blue-100">Data</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="input-primary w-full mt-1"
        />
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-[#0b0b2a] border border-[#1f1f3a] rounded-xl p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-purple-400">
                Item {index + 1}
              </p>
              <button
                onClick={() => handleRemoveItem(index)}
                className="text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <input
              placeholder="Produto"
              value={item.description}
              onChange={e => {
                const copy = [...items];
                copy[index].description = e.target.value;
                setItems(copy);
              }}
              className="w-full input"
            />

            <FormSelect
              label="Categoria"
              value={item.categoryId ?? ""}
              onChange={value => {
                const copy = [...items];
                copy[index].categoryId = value;
                setItems(copy);
              }}
              options={categories.map(c => ({
                value: String(c.id),
                label: c.name
              }))}
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={e => {
                  const copy = [...items];
                  copy[index].quantity = Number(e.target.value);
                  setItems(copy);
                }}
                className="input"
                placeholder="Qtd"
              />

              <input
                type="number"
                min={0}
                step="0.01"
                value={item.price}
                onChange={e => {
                  const copy = [...items];
                  copy[index].price = Number(e.target.value);
                  setItems(copy);
                }}
                className="input"
                placeholder="Preço"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddItem}
        className="w-full bg-purple-700 py-3 rounded-lg"
      >
        + Adicionar Item
      </button>

      <button
        onClick={handleSave}
        className="w-full bg-blue-600 py-3 rounded-lg"
      >
        Salvar Compra
      </button>

      <button onClick={onCancel} className="w-full text-gray-400">
        Cancelar
      </button>
    </div>
  );
};

export default PurchaseFormMobile;
