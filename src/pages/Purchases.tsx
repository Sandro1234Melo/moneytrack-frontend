import { useEffect, useState } from "react";
import api from "../api/axios";

import PurchaseForm from "../components/purchases/PurchaseForm";
import PurchaseList from "../components/purchases/PurchaseList";
import PurchaseFilters, { type Filters } from "../components/ui/ExpenseFilters";
import Alert from "../components/ui/Alert";

const Purchases = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [editingPurchase, setEditingPurchase] = useState<any | null>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [formKey, setFormKey] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const [filters, setFilters] = useState<Filters>({
    fromDate: "",
    toDate: "",
    locationId: "",
    categoryId: "",
    noteId: "",
    description: "",
    minValue: "",
    maxValue: ""
  });

  const userId = 1;

  const loadPurchases = async (customFilters: Filters = filters) => {
    try {
      const response = await api.get("/expenses", {
        params: {
          userId,
          from: customFilters.fromDate || undefined,
          to: customFilters.toDate || undefined,
          locationId: customFilters.locationId || undefined,
          categoryId: customFilters.categoryId || undefined,
          noteId: customFilters.noteId || undefined,
          description: customFilters.description || undefined,
          min: customFilters.minValue || undefined,
          max: customFilters.maxValue || undefined
        }
      });

      setPurchases(response.data);
    } catch (error) {
      console.error("Erro ao carregar compras", error);
    }
  };
  
  const handleSearch = () => {
    loadPurchases(filters);
  };
  
  const handleClearFilters = () => {
    const emptyFilters: Filters = {
      fromDate: "",
      toDate: "",
      locationId: "",
      categoryId: "",
      noteId: "",
      description: "",
      minValue: "",
      maxValue: ""
    };

    setFilters(emptyFilters);
    loadPurchases(emptyFilters);
  };

  const loadCategories = async () => {
    try {
      const response = await api.get(`/categories/${userId}`);
      setCategories(response.data);
    } catch (error) {
      console.error("Erro ao carregar categorias", error);
    }
  };

  const loadLocations = async () => {
    try {
      const response = await api.get("/locations");
      setLocations(response.data);
    } catch (error) {
      console.error("Erro ao carregar locais", error);
    }
  };

  useEffect(() => {
    loadPurchases();
    loadCategories();
    loadLocations();
  }, []);

  const handleSave = async (data: any) => {
    try {
      if (editingPurchase) {
        await api.put(`/expenses/${editingPurchase.id}`, data);
        setSuccessMessage("Compra atualizada com sucesso!");
      } else {
        await api.post("/expenses", {
          ...data,
          userId
        });
        setSuccessMessage("Compra registrada com sucesso!");
      }

      setEditingPurchase(null);
      setFormKey(prev => prev + 1);
      loadPurchases(filters);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Erro ao salvar compra", error);
      alert("Erro ao salvar a compra");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja excluir esta compra?")) return;

    try {
      await api.delete(`/expenses/${id}`);
      loadPurchases(filters);
    } catch (error) {
      console.error("Erro ao excluir compra", error);
    }
  };

  return (
    <div className="px-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-brand-light mb-6">
        Compras
      </h1>

      <div className="flex flex-col gap-8 mt-8">

        {successMessage && (
          <Alert message={successMessage} variant="success" />
        )}

        <PurchaseForm
          key={formKey}
          purchase={editingPurchase}
          categories={categories}
          locations={locations}
          onCancel={() => setEditingPurchase(null)}
          onSave={handleSave}
        />

        <PurchaseFilters
          filters={filters}
          locations={locations}
          categories={categories}
          onChange={setFilters}
          onSearch={handleSearch}
          onClear={handleClearFilters}
        />

        <PurchaseList
          purchases={purchases}
          onEdit={setEditingPurchase}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Purchases;
