import { useEffect, useRef, useState } from "react";
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

  const formRef = useRef<HTMLDivElement>(null);

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
      items: items.map(item => ({
        ...item,
        categoryId: Number(item.categoryId), // 🔥 aqui sim converte
        quantity: Number(item.quantity),
        price: Number(item.price)
      }))
    });
  };

  useEffect(() => {
    if (purchase) {
      setDate(purchase.date?.substring(0, 10));
      setLocationId(purchase.locationId ?? "");

      setItems(
        purchase.items.map((item: any) => ({
        description: item.description ?? "",
        categoryId: String(
          item.categoryId ?? item.category?.id ?? ""
        ),
        quantity: item.quantity ?? 1,
        price: item.price ?? item.unitPrice ?? 0
        }))
      );
    } else {
      setDate(new Date().toISOString().substring(0, 10));
      setLocationId("");
      setItems([]);
    }
  }, [purchase]);


  useEffect(() => {
    if (purchase && formRef.current) {
      formRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [purchase]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        description: "",
        categoryId: "",
        quantity: 1,
        price: 0
      }
    ]);
  };

  return (
    <div
      ref={formRef}
      className="bg-surface-dark border border-[#12202a] rounded-lg p-6"
    >

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
