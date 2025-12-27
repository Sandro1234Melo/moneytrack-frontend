type Props = {
  index: number;
  item: {
    description: string;
    categoryName?: string;
    amount: number;
  };
};

const ExpenseItemRow: React.FC<Props> = ({ index, item }) => {
  return (
    <div className="grid grid-cols-12 text-sm py-2 border-t border-[#1f2a37]">
      <div className="col-span-1 text-gray-400">{index}</div>
      <div className="col-span-5 text-white">{item.description}</div>
      <div className="col-span-3 text-gray-300">{item.categoryName ?? "—"}</div>
      <div className="col-span-3 text-right text-primary-light font-medium">
        R$ {item.amount.toFixed(2)}
      </div>
    </div>
  );
};

export default ExpenseItemRow;
