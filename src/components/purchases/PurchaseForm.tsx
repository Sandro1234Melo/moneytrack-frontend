import { useEffect, useState } from "react";
import PurchaseItemsTable from "./PurchaseItemsTable";
import PurchaseHeader from "./PurchaseHeader";
import PurchaseActions from "./PurchaseActions";

type Props = {
  purchase?: any | null;
  locations: any[];
  categories: any[];
  onSave: (data: any) => void;
  onCancel: () => void;
};

const PurchaseForm: React.FC<Props> = ({
  purchase,
  locations,
  categories,
  onSave,
  onCancel
}) => {
  const [date, setDate] = useState(
    purchase?.date ?? new Date().toISOString().substring(0, 10)
  );
  const [locationId, setLocationId] = useState<number | "">(
    purchase?.locationId ?? ""
  );
  const [items, setItems] = useState<any[]>(purchase?.items ?? []);

  const handleSubmit = () => {
    if (items.length === 0) {
      alert("Adicione pelo menos um item");
      return;
    }

    for (const item of items) {
      if (!item.categoryId) {
        alert("Todos os itens devem ter categoria");
        return;
      }
    }

    onSave({
      date,
      locationId,
      items
    });
  };

  useEffect(() => {
  if (purchase) {
    setDate(purchase.date);
    setLocationId(purchase.locationId ?? "");
    setItems(purchase.items ?? []);
  } else {
    setDate(new Date().toISOString().substring(0, 10));
    setLocationId("");
    setItems([]);
  }
}, [purchase]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        description: "",
        categoryId: null,
        quantity: 1,
        price: 0
      }
    ]);
  };

  return (
    <div className="bg-surface-dark border border-[#12202a] rounded-lg p-6">
      
      <h2 className="text-lg font-semibold mb-4">
      {purchase ? "Editar Compra" : "Nova Compra"}
      </h2>
      
      <PurchaseHeader
        date={date}
        setDate={setDate}
        locationId={locationId}
        setLocationId={setLocationId}
        locations={locations}
      />

      <PurchaseItemsTable
        items={items}
        setItems={setItems}
        categories={categories}
      />

      <PurchaseActions
        onCancel={onCancel}
        onSave={handleSubmit}
        onAddItem={handleAddItem}
      />

    </div>
  );
};
export default PurchaseForm;
