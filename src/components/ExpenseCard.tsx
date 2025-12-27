import ExpenseItemRow from "./ExpenseItemRow";
import { formatDateBR } from "../utils/formatDate";


type ExpenseItem = {
  id: number;
  description: string;
  amount: number;
  categoryName?: string;
};

type Props = {
  expense: {
    id: number;
    date: string;
    locationName?: string | null;
    items: ExpenseItem[];
  };
};

const ExpenseCard: React.FC<Props> = ({ expense }) => {
  const total = expense.items.reduce((sum, i) => sum + i.amount, 0);
  const quantity = expense.items.length;

  return (
    <div className="bg-[#071122] rounded-xl border border-[#12202a] p-5">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between text-sm text-gray-300 mb-4">
        <div>Local : <span className="text-white">{expense.locationName ?? "—"}</span></div>
        <div>Data : <span className="text-white">{formatDateBR(expense.date)}</span></div>
        <div>Quantidade : <span className="text-white">{quantity}</span></div>
        <div className="font-semibold text-primary-light">
          Valor : € {total.toFixed(2)}
        </div>
      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-12 text-xs uppercase text-gray-400 pb-2 border-b border-[#1f2a37]">
        <div className="col-span-1"></div>
        <div className="col-span-5">Produto</div>
        <div className="col-span-3">Categoria</div>
        <div className="col-span-3 text-right">Preço</div>
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
