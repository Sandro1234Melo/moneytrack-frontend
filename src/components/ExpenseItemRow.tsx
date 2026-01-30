import { getLoggedUser } from "../utils/auth";

type Props = {
  index: number;
  item: {
    description: string;
    quantity?: number;
    categoryName?: string;
    amount: number;
  };
};

const ExpenseItemRow: React.FC<Props> = ({ index, item }) => {
  const user = getLoggedUser();
     const currencySymbol = user?.currencySymbol || "€";
     
  return (
    <div className="grid grid-cols-12 text-sm py-2 border-t border-[#1f2a37]">
      <div className="col-span-1 text-gray-400">{index}</div>
      <div className="col-span-4 text-white">{item.description}</div>
      <div className="col-span-3 text-white">{item.quantity?? "—"}</div>
      <div className="col-span-2 text-gray-300">{item.categoryName ?? "—"}</div>
      <div className="col-span-2 text-right text-primary-light font-medium">
        {currencySymbol} {item.amount.toFixed(2)}
      </div>
    </div>
  );
};

export default ExpenseItemRow;
