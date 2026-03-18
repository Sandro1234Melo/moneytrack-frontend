import ExpenseItemRow from "./ExpenseItemRow";
import { formatDateBR } from "../utils/formatDate";
import { cn } from "../lib/utils";
import { getLoggedUser } from "../utils/auth";
import { paymentMethods } from "../utils/paymentMethods";

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
    paymentMethod?: string | null;

    items: ExpenseItem[];
  };
  className?: string;
};

const ExpenseCard: React.FC<Props> = ({ expense, className }) => {
  const user = getLoggedUser();
  const currencySymbol = user?.currencySymbol || "€";

  const total = expense.items.reduce((sum, i) => sum + i.amount, 0);
  const quantity = expense.items.reduce((sum, i) => sum + (i.quantity ?? 0), 0);

  const getPaymentMethodLabel = (value?: number | null) => {
  const method = paymentMethods.find(m => m.value === value);
  return method?.label ?? "—";
};

  return (
    <div
      className={cn(
        "bg-[#071122] rounded-xl border border-[#12202a] p-5",
        className,
      )}
    >
      {/* HEADER */}
      <div className="space-y-3 text-sm mb-5">
        {/* Linha 1 */}
        <div className="space-y-4 text-sm mb-5">
          {/* linha principal */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="text-gray-300">
                Nota: <span className="text-white">{expense.id ?? "—"}</span>
              </div>

              <div className="text-gray-400">
                Data: {formatDateBR(expense.date)}
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-gray-400">Qtd: {quantity}</div>

              <div className="font-semibold text-primary-light">
                {currencySymbol} {total.toFixed(2)}
              </div>
            </div>
          </div>

          {/* informações adicionais */}
          <div className="space-y-1 text-gray-300">
            <div className="truncate">
              Forma de pagamento:{" "}
              <span className="text-white">
                {getPaymentMethodLabel(Number(expense.paymentMethod))}
              </span>
            </div>

            <div className="truncate">
              Local:{" "}
              <span className="text-white">{expense.locationName ?? "—"}</span>
            </div>
          </div>
        </div>

        {/* Linha 2 */}
        <div className="flex justify-between text-gray-400">
          <span>Data: {formatDateBR(expense.date)}</span>
          <span>Qtd: {quantity}</span>
          <span className="font-semibold text-primary-light">
            {currencySymbol} {total.toFixed(2)}
          </span>
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
        <ExpenseItemRow key={item.id} index={index + 1} item={item} />
      ))}
    </div>
  );
};

export default ExpenseCard;
