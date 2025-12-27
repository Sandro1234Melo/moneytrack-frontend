import React, { useEffect, useState } from "react";
import api from "../api/axios";
import PurchaseForm from "../components/PurchaseForm";
import PurchaseList from "../components/PurchaseList";

const Purchases: React.FC = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [editingPurchase, setEditingPurchase] = useState<any | null>(null);

  const userId = 1;

  const loadPurchases = async () => {
    const res = await api.get(`/expenses/user/${userId}`);
    setPurchases(res.data);
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  const handleSave = async (data: any) => {
    if (editingPurchase) {
      await api.put(`/expenses/${editingPurchase.id}`, data);
    } else {
      await api.post("/expenses", { ...data, userId });
    }

    setEditingPurchase(null);
    loadPurchases();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja excluir esta compra?")) return;
    await api.delete(`/expenses/${id}`);
    loadPurchases();
  };

  return (
    <div className="px-6">

      <h2 className="text-2xl font-semibold text-brand-light mb-6">
        Compras
      </h2>

      <PurchaseForm
        purchase={editingPurchase}
        onSave={handleSave}
        onCancel={() => setEditingPurchase(null)}
      />

      <PurchaseList
        purchases={purchases}
        onEdit={setEditingPurchase}
        onDelete={handleDelete}
      />

    </div>
  );
};

export default Purchases;
