import PurchaseItemRow from "./PurchaseItemRow";

const PurchaseItemsTable = ({ items, setItems, categories }: any) => {
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

      <div className="grid grid-cols-5 text-sm text-blue-100 px-4 py-2">
        <span>Produto</span>
        <span>Categoria</span>
        <span>Qtd</span>
        <span>Preço</span>
        <span></span>
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
