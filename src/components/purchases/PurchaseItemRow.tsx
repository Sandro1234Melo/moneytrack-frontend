const PurchaseItemRow = ({ item, categories, onChange, onRemove }: any) => {
  return (
    <div className="grid grid-cols-5 gap-2 px-4 py-2 items-center">

      <input
        value={item.description}
        onChange={e => onChange("description", e.target.value)}
        className="input-primary"
        placeholder="Produto"
      />

      <select
        value={item.categoryId ?? ""}
        onChange={e => onChange("categoryId", Number(e.target.value))}
        //className="input-primary"
      >
        <option value="">Categoria</option>

        {categories.map((cat: any) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        min={1}
        value={item.quantity}
        onChange={e => onChange("quantity", Number(e.target.value))}
        className="input-primary"
      />

      <input
        type="number"
        step="0.01"
        value={item.price}
        onChange={e => onChange("price", Number(e.target.value))}
        className="input-primary"
      />

      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-400"
      >
        🗑
      </button>

    </div>
  );
};

export default PurchaseItemRow;
