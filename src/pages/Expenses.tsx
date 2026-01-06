import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ExpenseCard from "../components/ExpenseCard";

type ExpenseItem = {
  id: number;
  quantity?: number;
  description: string;
  amount: number;
  categoryName?: string;
};

type Expense = {
  id: number;
  date: string;
  locationName?: string | null;
  items: ExpenseItem[];
};

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const userId = 1;

  const fetchExpenses = async () => {
    try {
      const response = await api.get(`/expenses/user/${userId}`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Erro ao carregar despesas:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="px-4 sm:px-8">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-brand-light">Meus Gastos</h2>
        <p className="text-sm text-blue-100">
          Histórico de despesas registradas
        </p>
      </div>

      {/* EMPTY STATE */}
      {expenses.length === 0 && (
        <div className="text-gray-400 text-sm">
          Nenhum gasto registrado até o momento.
        </div>
      )}

      {/* LIST */}
      <div className="flex flex-col gap-6">
        {expenses.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))}
      </div>
    </div>
  );
};

export default Expenses;
