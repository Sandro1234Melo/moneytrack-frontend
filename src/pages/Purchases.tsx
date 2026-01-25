import { useEffect, useState } from "react";
import api from "../api/axios";

import PurchaseForm from "../components/purchases/PurchaseForm";
import PurchaseList from "../components/purchases/PurchaseList";
import PurchaseCardList from "../components/purchases/PurchaseCardList";
import PurchaseFilters, { type Filters } from "../components/ui/ExpenseFilters";
import Alert from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { getLoggedUser } from "../utils/auth";

const Purchases = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [editingPurchase, setEditingPurchase] = useState<any | null>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [formKey, setFormKey] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [openFilters, setOpenFilters] = useState(false);

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

  const user = getLoggedUser();
    const userId = user?.id;

  const loadPurchases = async (customFilters: Filters = filters) => {
    try {
      const response = await api.get(`/expenses`, {
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
    const response = await api.get(`/categories/${userId}`);
    setCategories(response.data);
  };

  const loadLocations = async () => {
    const response = await api.get(`/locations/${userId}`);
    setLocations(response.data);
  };

  useEffect(() => {
    if (!userId) return;
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
        await api.post("/expenses", { ...data, userId });
        setSuccessMessage("Compra registrada com sucesso!");
      }

      setEditingPurchase(null);
      setFormKey(prev => prev + 1);
      loadPurchases(filters);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      alert("Erro ao salvar a compra");
    }
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/expenses/${id}`);
    loadPurchases(filters);
  };

  return (
    <div className="px-4 sm:px-6 max-w-7xl mx-auto">

      <h1 className="text-2xl font-semibold text-brand-light mb-6">
        Compras
      </h1>

      <div className="flex flex-col gap-8">

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

        {/* BOTÃO FILTRAR — MOBILE */}
        <div className="flex justify-end lg:hidden">
          <Button
            label="Filtrar"
            variant="secondary"
            onClick={() => setOpenFilters(true)}
          />
        </div>

        {/* FILTROS — DESKTOP */}
        <div className="hidden lg:block">
          <PurchaseFilters
            filters={filters}
            locations={locations}
            categories={categories}
            onChange={setFilters}
            onSearch={handleSearch}
            onClear={handleClearFilters}
          />
        </div>

        {/* LISTA — DESKTOP */}
        <div className="hidden lg:block">
          <PurchaseList
            purchases={purchases}
            onEdit={setEditingPurchase}
            onDelete={handleDelete}
          />
        </div>

        {/* LISTA — MOBILE */}
        <div className="lg:hidden">
          <PurchaseCardList
            purchases={purchases}
            onEdit={setEditingPurchase}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* DRAWER FILTROS — MOBILE */}
      {openFilters && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/60">

          {/* Overlay */}
          <div
            className="absolute inset-0"
            onClick={() => setOpenFilters(false)}
          />

          {/* Drawer */}
          <div className="relative w-full max-w-md bg-surface-dark
                          rounded-t-xl p-4 mt-auto">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filtros</h3>
              <button
                onClick={() => setOpenFilters(false)}
                className="text-gray-400"
              >
                ✕
              </button>
            </div>

            <PurchaseFilters
              filters={filters}
              locations={locations}
              categories={categories}
              onChange={setFilters}
              onSearch={() => {
                handleSearch();
                setOpenFilters(false);
              }}
              onClear={() => {
                handleClearFilters();
                setOpenFilters(false);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default Purchases;
