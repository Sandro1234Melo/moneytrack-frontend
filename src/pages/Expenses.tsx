import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ExpenseCard from "../components/ExpenseCard";
import ExpenseFilters, { type Filters } from "../components/ui/ExpenseFilters";
import { getLoggedUser } from "../utils/auth";
import { Button } from "../components/ui/Button";
import { Download } from "lucide-react";


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
  const [openFilters, setOpenFilters] = useState(false);
  const [openExport, setOpenExport] = useState(false);


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

  const handleExportExcel = async () => {
  const response = await api.get("/expenses/export/excel", {
    params: {
      userId,
      from: filters.fromDate || undefined,
      to: filters.toDate || undefined,
      locationId: filters.locationId || undefined,
      categoryId: filters.categoryId || undefined,
      description: filters.description || undefined,
      min: filters.minValue || undefined,
      max: filters.maxValue || undefined,
    },
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "gastos.xlsx");
  document.body.appendChild(link);
  link.click();
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
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-brand-light">
            Meus Gastos
          </h2>
          <p className="text-sm text-blue-100">
            Histórico de despesas registradas
          </p>
        </div>

        {/* BOTÃO EXPORTAR */}
        <div className="relative">
          <Button
            label="Exportar"
            icon={Download}
            variant="secondary"
            onClick={() => {
              setOpenExport(false);
              handleExportExcel();
            }}

          />

          {openExport && (
            <div
              className="
                absolute right-0 mt-2 w-44
                bg-[#0b1620]
                border border-[#1f2d3a]
                rounded-lg
                shadow-2xl
                overflow-hidden
                z-50
              "
            >
              <button
                className="
                  w-full text-left px-4 py-2
                text-gray-200
                hover:bg-white/5
                  transition"
                onClick={() => {
                  setOpenExport(false);
                  alert("Exportar Excel (em breve)");
                }}
              >
                Exportar Excel
              </button>
              <div className="h-px bg-[#1f2d3a]" />
              <button
                className="w-full text-left px-4 py-2 hover:bg-white/5"
                onClick={() => {
                  setOpenExport(false);
                  alert("Exportar PDF (em breve)");
                }}
              >
                Exportar PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BOTÃO FILTRO — MOBILE */}
      <div className="flex justify-end mb-4 lg:hidden">
        <Button
          label="Filtrar"
          variant="secondary"
          onClick={() => setOpenFilters(true)}
        />
      </div>

      {/* FILTROS — DESKTOP */}
      <div className="hidden lg:block mb-6">
        <ExpenseFilters
          filters={filters}
          locations={locations}
          categories={categories}
          onChange={setFilters}
          onSearch={handleSearch}
          onClear={handleClear}
        />
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

      {/* MODAL FILTROS — MOBILE */}
      {openFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

          {/* Overlay */}
          <div
            className="absolute inset-0"
            onClick={() => setOpenFilters(false)}
          />

          {/* Modal */}
          <div
            className="
              relative
              w-full max-w-md
              bg-surface-dark
              border border-[#12202a]
              rounded-lg
              p-5
              max-h-[90%]
              overflow-y-auto
            "
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filtros</h3>
              <button
                onClick={() => setOpenFilters(false)}
                className="text-gray-400"
              >
                ✕
              </button>
            </div>

            <ExpenseFilters
              filters={filters}
              locations={locations}
              categories={categories}
              onChange={setFilters}
              onSearch={() => {
                handleSearch();
                setOpenFilters(false);
              }}
              onClear={() => {
                handleClear();
                setOpenFilters(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
