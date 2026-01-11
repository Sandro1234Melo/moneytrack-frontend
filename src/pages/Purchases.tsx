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
  const [filters, setFilters] = useState<Filters>({
    fromDate: "",
    toDate: "",
    locationId: "",
    minValue: "",
    maxValue: ""
  });

  const userId = 1;

  // 🔹 CARREGAR COMPRAS (COM FILTROS)
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

  // 🔹 LOAD INICIAL
  useEffect(() => {
    loadPurchases();
    loadCategories();
    loadLocations();
  }, []);

  // 🔹 RECARREGAR QUANDO FILTROS MUDAREM
  useEffect(() => {
    loadPurchases(filters);
  }, [filters]);

  // 🔹 CRIAR / EDITAR
  const handleSave = async (data: any) => {
    try {
      if (editingPurchase) {
        await api.put(`/expenses/${editingPurchase.id}`, data);
      } else {
        await api.post("/expenses", {
          ...data,
          userId
        });
      }

      setEditingPurchase(null);
      loadPurchases(filters);
    } catch (error) {
      console.error("Erro ao salvar compra", error);
      alert("Erro ao salvar a compra");
    }
  };

  // 🔹 EXCLUIR
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

      {/* FORMULÁRIO + LISTA */}
      <div className="flex flex-col gap-8 mt-8">

        <PurchaseForm
          purchase={editingPurchase}
          categories={categories}
          locations={locations}
          onCancel={() => setEditingPurchase(null)}
          onSave={handleSave}
        />

        {/* 🔍 FILTROS */}
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
