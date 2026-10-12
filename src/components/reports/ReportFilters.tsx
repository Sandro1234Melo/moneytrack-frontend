import FormSelect from "../molecules/select-field";
import type { ReportFilters as ReportFiltersType, ReportLookupOption } from "../../types/reports";

type Props = {
  filters: ReportFiltersType;
  onChange: (filters: ReportFiltersType) => void;
  categories: ReportLookupOption[];
  locations: ReportLookupOption[];
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
          value={filters.from}
          onChange={e => onChange({ ...filters, from: e.target.value })}
          className="input-primary w-full"
        />
      </div>

      <div>
        <label className="text-sm">Até</label>
        <input
          type="date"
          value={filters.to}
          onChange={e => onChange({ ...filters, to: e.target.value })}
          className="input-primary w-full"
        />
      </div>

      <FormSelect
        label="Categoria"
        value={filters.categoryId}
        onChange={value => onChange({ ...filters, categoryId: String(value) })}
        options={[
          { value: "", label: "Todas as categorias" },
          ...categories.map(category => ({ value: category.id, label: category.name }))
        ]}
      />

      <FormSelect
        label="Local"
        value={filters.locationId}
        onChange={value => onChange({ ...filters, locationId: String(value) })}
        options={[
          { value: "", label: "Todos os locais" },
          ...locations.map(location => ({ value: location.id, label: location.name }))
        ]}
      />

      <FormSelect
        label="Pagamento"
        value={filters.paymentMethod}
        onChange={value => onChange({ ...filters, paymentMethod: String(value) })}
        options={[
          { value: "", label: "Todas as formas" },
          { value: 0, label: "Dinheiro" },
          { value: 1, label: "Débito" },
          { value: 2, label: "Crédito" },
          { value: 3, label: "PIX" },
          { value: 4, label: "Transferência" },
          { value: 5, label: "MB Way" },
          { value: 6, label: "Vale alimentação" }
        ]}
      />
    </div>
  );
};

export default ReportFilters;
