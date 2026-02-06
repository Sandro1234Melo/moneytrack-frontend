import { useEffect, useRef, useState } from "react";
import PurchaseItemsTable from "./PurchaseItemsTable";
import PurchaseHeader from "./PurchaseHeader";
import PurchaseActions from "./PurchaseActions";
import CategoryQuickCreate from "../categories/CreateCategoryModal";

type Props = {
  purchase?: any | null;
  locations: any[];
  categories: any[];
  onSave: (data: any) => void;
  onCancel: () => void;
};

const PurchaseFormDesktop: React.FC<Props> = ({
  purchase,
  locations,
  categories,
  onSave,
  onCancel
}) => {
  const formRef = useRef<HTMLDivElement>(null);

  const [date, setDate] = useState("");
  const [locationId, setLocationId] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState<number | "">("");
  const [items, setItems] = useState<any[]>([]);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);

  useEffect(() => {
    if (purchase) {
      setDate(purchase.date?.substring(0, 10) ?? "");
      setLocationId(purchase.locationId ? Number(purchase.locationId) : "");
      setPaymentMethod(purchase.paymentMethod !== undefined ? Number(purchase.paymentMethod) : "");

      setItems(
        purchase.items?.map((item: any) => ({
          description: item.description ?? "",
          categoryId: String(item.categoryId ?? ""),
          quantity: item.quantity ?? 1,
          price: item.unitPrice ?? item.price ?? 0
        })) ?? []
      );
    } else {
      setDate(new Date().toISOString().substring(0, 10));
      setLocationId("");
      setPaymentMethod("");
      setItems([]);
    }
  }, [purchase]);

  const handleSubmit = () => {
    if (!locationId) { alert("Selecione o local"); return; }
    if (paymentMethod === "") { alert("Selecione a forma de pagamento"); return; }
    if (items.length === 0) { alert("Adicione pelo menos um item"); return; }

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
    <div ref={formRef} className="bg-surface-dark border border-[#12202a] rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">
        {purchase ? "Editar Compra" : "Nova Compra"}
      </h2>

      <PurchaseHeader
        date={date}
        setDate={setDate}
        locationId={locationId}
        setLocationId={setLocationId}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        locations={locations}
      />

      <div className="mt-2">
        <button type="button" onClick={() => setOpenCategoryModal(true)} className="text-sm text-purple-400 hover:underline">
          + Nova categoria
        </button>
      </div>

      <PurchaseItemsTable items={items} setItems={setItems} categories={categories} />

      <PurchaseActions onCancel={onCancel} onSave={handleSubmit} onAddItem={() => setItems([...items, { description: "", categoryId: "", quantity: 1, price: 0 }])} />

      <CategoryQuickCreate open={openCategoryModal} onClose={() => setOpenCategoryModal(false)} onCreated={(newCat) => categories.push(newCat)} />
    </div>
  );
};

export default PurchaseFormDesktop;