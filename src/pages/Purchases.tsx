import { useEffect, useState } from "react";
import api from "../api/axios";
import PurchaseForm from "../components/purchases/PurchaseForm";
import PurchaseList from "../components/purchases/PurchaseList";

const Purchases = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [editingPurchase, setEditingPurchase] = useState<any | null>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);


  const userId = 1; // depois vem do login

  // 🔹 BUSCAR COMPRAS
  const loadPurchases = async () => {
    try {
      const response = await api.get(`/expenses/user/${userId}`);
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

  

  useEffect(() => {
    loadPurchases();
    loadCategories(); 
    loadLocations();  
  }, []);

  // CRIAR / EDITAR
  const handleSave = async (data: any) => {
    try {
      if (editingPurchase) {
        await api.put(`/expenses/${editingPurchase.id}`, data);
      } else {
        await api.post("/expenses", {
          ...data,
          userId,
        });
      }

      setEditingPurchase(null);
      loadPurchases();
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
      loadPurchases();
    } catch (error) {
      console.error("Erro ao excluir compra", error);
    }
  };

  return (
    <div className="px-6 max-w-7xl mx-auto">

      <h1 className="text-2xl font-semibold text-brand-light mb-6">
        Compras
      </h1>

      <PurchaseList
        purchases={purchases}
        onEdit={setEditingPurchase}
        onDelete={handleDelete}
      />

      <PurchaseForm
        purchase={editingPurchase}
        categories={categories}
        locations={locations}
        onCancel={() => setEditingPurchase(null)}
        onSave={handleSave}
      />
    </div>
  );
};

export default Purchases;
