import { useEffect, useRef, useState } from "react";
import PurchaseItemsTable from "./PurchaseItemsTable";
import PurchaseHeader from "./PurchaseHeader";
import PurchaseActions from "./PurchaseActions";
import QuickCreateModal from "../ui/QuickCreateModal";
import api from "../../api/axios";
import { getLoggedUser } from "../../utils/auth";

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
  const user = getLoggedUser();

  const [date, setDate] = useState("");
  const [locationId, setLocationId] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState<number | "">("");
  const [items, setItems] = useState<any[]>([]);

  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openLocationModal, setOpenLocationModal] = useState(false);

  const [localCategories, setLocalCategories] = useState<any[]>(categories);
  const [localLocations, setLocalLocations] = useState<any[]>(locations);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  useEffect(() => {
    setLocalLocations(locations);
  }, [locations]);

  useEffect(() => {
    if (purchase) {
      setDate(purchase.date?.substring(0, 10) ?? "");
      setLocationId(purchase.locationId ? Number(purchase.locationId) : "");
      setPaymentMethod(
        purchase.paymentMethod !== undefined
          ? Number(purchase.paymentMethod)
          : ""
      );

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

  // CRIAR CATEGORIA
  const handleCreateCategory = async (data: any) => {
    const response = await api.post("/categories", {
      name: data.name,
      user_Id: user?.id
    });

    const newCat = response.data;

    setLocalCategories(prev => [...prev, newCat]);

    setItems(prev => {
      if (prev.length === 0) return prev;
      const copy = [...prev];
      copy[copy.length - 1].categoryId = String(newCat.id);
      return copy;
    });

    setOpenCategoryModal(false);
  };

  // CRIAR LOCAL
  const handleCreateLocation = async (data: any) => {
    const response = await api.post("/locations", {
      name: data.name,
      user_Id: user?.id
    });

    const newLoc = response.data;

    setLocalLocations(prev => [...prev, newLoc]);
    setLocationId(newLoc.id);

    setOpenLocationModal(false);
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
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        locations={localLocations}
        onAddLocation={() => setOpenLocationModal(true)}
      />

      <PurchaseItemsTable
        items={items}
        setItems={setItems}
        categories={localCategories}
        onAddCategory={() => setOpenCategoryModal(true)}
      />

      <PurchaseActions
        onCancel={onCancel}
        onSave={handleSubmit}
        onAddItem={() =>
          setItems([
            ...items,
            {
              description: "",
              categoryId: "",
              quantity: 1,
              price: 0
            }
          ])
        }
      />

      {/* MODAL CATEGORIA */}
      <QuickCreateModal
        open={openCategoryModal}
        title="Nova categoria"
        fields={[
          { name: "name", label: "Nome", placeholder: "Ex: Alimentação" }
        ]}
        onClose={() => setOpenCategoryModal(false)}
        onSubmit={handleCreateCategory}
      />

      {/* MODAL LOCAL */}
      <QuickCreateModal
        open={openLocationModal}
        title="Novo local"
        fields={[
          { name: "name", label: "Nome", placeholder: "Ex: Supermercado" }
        ]}
        onClose={() => setOpenLocationModal(false)}
        onSubmit={handleCreateLocation}
      />
    </div>
  );
};

export default PurchaseFormDesktop;
