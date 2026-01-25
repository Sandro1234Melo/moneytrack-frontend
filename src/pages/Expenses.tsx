import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ExpenseCard from "../components/ExpenseCard";
import ExpenseFilters, { type Filters } from "../components/ui/ExpenseFilters";
import { getLoggedUser } from "../utils/auth";

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

  const user = getLoggedUser();
  const userId = user?.id;

  const [locations, setLocations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

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

  const fetchExpenses = async (customFilters: Filters = filters) => {
    try {
      const response = await api.get(`/expenses/user/${userId}`, {
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

      setExpenses(response.data);
    } catch (error) {
      console.error("Erro ao carregar despesas:", error);
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchExpenses();
    api.get(`/locations/${userId}`).then(res => setLocations(res.data));
    api.get(`/categories/${userId}`).then(res => setCategories(res.data));
  }, []);

  const handleSearch = () => {
  fetchExpenses(filters);
};

const handleClear = () => {
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
  fetchExpenses(emptyFilters);
};



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
      <div className="mb-6" >
        <ExpenseFilters
          filters={filters}
          locations={locations}
          categories={categories}
          onChange={setFilters}
          onSearch={handleSearch}
          onClear={handleClear}
        />
      </div>

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
