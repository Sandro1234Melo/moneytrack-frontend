import { useEffect, useRef, useState } from "react";
import PurchaseItemsTable from "./PurchaseItemsTable";
import PurchaseHeader from "./PurchaseHeader";
import PurchaseActions from "./PurchaseActions";
import FormSelect from "../ui/FormSelect";
import { paymentMethods } from "../../utils/paymentMethods";

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

  const [date, setDate] = useState(
    purchase?.date ?? new Date().toISOString().substring(0, 10)
  );

  const [locationId, setLocationId] = useState<number | "">(
    purchase?.locationId ?? ""
  );

  const [paymentMethod, setPaymentMethod] = useState<number | "">(
    purchase?.paymentMethod ?? ""
  );

  const [openCategoryModal, setOpenCategoryModal] = useState(false);


  const [items, setItems] = useState<any[]>(purchase?.items ?? []);

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
          price: item.unitPrice ?? item.price ?? 0
        }))
      );

    } else {
      setDate(new Date().toISOString().substring(0, 10));
      setLocationId("");
      setPaymentMethod("");
      setItems([]);
    }
  }, [purchase]);


  const handleSubmit = () => {
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
        alert("Todos os itens devem ter categoria");
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

  const handleAddItem = () => {
    setItems([
      ...items,
      { description: "", categoryId: "", quantity: 1, price: 0 }
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

      <div className="mt-4 max-w-sm">
        <FormSelect
          label="Forma de pagamento"
          value={paymentMethod}
          onChange={value => setPaymentMethod(Number(value))}
          options={paymentMethods}
          placeholder="Selecione"
        />
      </div>

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

export default PurchaseFormDesktop;
