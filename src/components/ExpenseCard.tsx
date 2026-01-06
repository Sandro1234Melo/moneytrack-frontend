import ExpenseItemRow from "./ExpenseItemRow";
import { formatDateBR } from "../utils/formatDate";
import { cn } from "../lib/utils";


type ExpenseItem = {
  id: number;
  description: string;
  amount: number;
  quantity?: number;
  categoryName?: string;
};

type Props = {
  expense: {
    id: number;
    date: string;
    locationName?: string | null;
    items: ExpenseItem[];
  };
  className?: string;
};

const ExpenseCard: React.FC<Props> = ({ expense, className }) => {
  const total = expense.items.reduce((sum, i) => sum + i.amount, 0);
  const quantity = expense.items.reduce((sum, i) => sum + (i.quantity ?? 0), 0);

  return (
    <div className={cn("bg-[#071122] rounded-xl border border-[#12202a] p-5", className)}>
      {/* HEADER */}
      <div className="flex flex-wrap justify-between text-sm text-gray-300 mb-4">
        <div>Nota : <span className="text-white">{expense.id ?? "—"}</span></div>
        <div>Local : <span className="text-white">{expense.locationName ?? "—"}</span></div>
        <div>Data : <span className="text-white">{formatDateBR(expense.date)}</span></div>
        <div>Quantidade Total : <span className="text-white">{quantity}</span></div>
        <div className="font-semibold text-primary-light">
          Valor : € {total.toFixed(2)}
        </div>
      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-12 text-xs uppercase text-gray-400 pb-2 border-b border-[#1f2a37]">
        <div className="col-span-1"></div>
        <div className="col-span-4">Produto</div>
        <div className="col-span-3">Quantidade</div>
        <div className="col-span-2">Categoria</div>
        <div className="col-span-2 text-right">Preço</div>
      </div>

      {/* ITEMS */}
      {expense.items.map((item, index) => (
        <ExpenseItemRow
          key={item.id}
          index={index + 1}
          item={item}
        />
      ))}
    </div>
  );
};

export default ExpenseCard;
