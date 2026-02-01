import FormSelect from "../ui/FormSelect";

export type ReportFilters = {
  fromDate?: string
  toDate?: string
  categoryId?: string
  locationId?: string
  paymentMethod?: string
}

type Props = {
  filters: any;
  onChange: (filters: any) => void;
  categories: any[];
  locations: any[];
};

const ReportFilters = ({
  filters,
  onChange,
  categories,
  locations
}: Props) => {
  return (
    <div className="bg-surface-dark p-4 rounded-lg grid grid-cols-1 md:grid-cols-5 gap-4">

      <div>
        <label className="text-sm">De</label>
        <input
          type="date"
          value={filters.fromDate}
          onChange={e => onChange({ ...filters, fromDate: e.target.value })}
          className="input-primary w-full"
        />
      </div>

      <div>
        <label className="text-sm">Até</label>
        <input
          type="date"
          value={filters.toDate}
          onChange={e => onChange({ ...filters, toDate: e.target.value })}
          className="input-primary w-full"
        />
      </div>

      <FormSelect
        label="Categoria"
        value={filters.categoryId}
        onChange={v => onChange({ ...filters, categoryId: v })}
        options={categories.map(c => ({
          value: c.id,
          label: c.name
        }))}
        placeholder="Todas"
      />

      <FormSelect
        label="Local"
        value={filters.locationId}
        onChange={v => onChange({ ...filters, locationId: v })}
        options={locations.map(l => ({
          value: l.id,
          label: l.name
        }))}
        placeholder="Todos"
      />

      <FormSelect
        label="Pagamento"
        value={filters.paymentMethod}
        onChange={v => onChange({ ...filters, paymentMethod: v })}
        options={[
          { value: 0, label: "Dinheiro" },
          { value: 1, label: "Débito" },
          { value: 2, label: "Crédito" },
          { value: 3, label: "PIX" }
        ]}
        placeholder="Todos"
      />
    </div>
  );
};

export default ReportFilters;
