import PurchaseItemRow from "./PurchaseItemRow";

const PurchaseItemsTable = ({ items, setItems, categories, onAddCategory }: any) => {
  const updateItem = (index: number, field: string, value: any) => {
    const copy = [...items];
    copy[index][field] = value;
    setItems(copy);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="border border-[#12202a] rounded">

      <div className="grid grid-cols-12 text-sm text-blue-100 px-4 py-2">
        <div className="col-span-4">Produto</div>

        <div className="col-span-3 flex items-center gap-2">
          <span>Categoria</span>
        </div>

        <div className="col-span-2">Qtd</div>
        <div className="col-span-2">Preço</div>
        <div className="col-span-1"></div>
      </div>

      {items.map((item: any, index: number) => (
        <PurchaseItemRow
          key={index}
          item={item}
          categories={categories}
          onChange={(field: string, value: any) =>
            updateItem(index, field, value)
          }
          onRemove={() => removeItem(index)}
        />
      ))}
    </div>
  );
};

export default PurchaseItemsTable;
