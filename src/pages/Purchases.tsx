import { useEffect, useState } from "react";
import api from "../api/axios";

import PurchaseForm from "../components/purchases/PurchaseForm";
import PurchaseList from "../components/purchases/PurchaseList";
import type { Filters } from "../components/purchases/PurchaseFilters";
import PurchaseFilters from "../components/purchases/PurchaseFilters";


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
    minValue: "",
    maxValue: ""
  });

  const userId = 1;

  // CARREGAR COMPRAS (COM FILTROS)
  const loadPurchases = async (customFilters = filters) => {
    try {
      const response = await api.get("/expenses", {
        params: {
          userId,
          from: customFilters.fromDate || undefined,
          to: customFilters.toDate || undefined,
          locationId: customFilters.locationId || undefined,
          min: customFilters.minValue || undefined,
          max: customFilters.maxValue || undefined
        }
      });

      setPurchases(response.data);
    } catch (error) {
      console.error("Erro ao carregar compras", error);
    }
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

  // LOAD INICIAL
  useEffect(() => {
    loadPurchases();
    loadCategories();
    loadLocations();
  }, []);

  // RECARREGAR QUANDO FILTROS MUDAREM
  useEffect(() => {
    loadPurchases(filters);
  }, [filters]);

  // CRIAR / EDITAR
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

      // 🔄 força reset do formulário
      setFormKey(prev => prev + 1);

      // 🔄 recarrega lista mantendo filtros
      loadPurchases(filters);

      // ⏱️ remove mensagem após 3s
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (error) {
      console.error("Erro ao salvar compra", error);
      alert("Erro ao salvar a compra");
    }
  };


  // EXCLUIR
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
          <div className="
            p-3 rounded-lg
            bg-green-600/10
            border border-green-600
            text-green-400
          ">
            {successMessage}
          </div>
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
          onChange={setFilters}
          onClear={() =>
            setFilters({
              fromDate: "",
              toDate: "",
              locationId: "",
              minValue: "",
              maxValue: ""
            })
          }
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
