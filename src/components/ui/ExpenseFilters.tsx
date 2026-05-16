
import FormDate from "../atoms/date-field";
import FormValue from "./FormValue";
import { Button } from "./Button";
import FormText from "./FormText";
import SelectField from "../molecules/select-field";


type Filters = {
  fromDate: string;
  toDate: string;
  locationId: number | "";
  categoryId: number | "";
  noteId: string;
  description: string;
  minValue: string;
  maxValue: string;
};

type Props = {
  filters: Filters;
  locations: any[];
  categories: any[];
  onChange: (filters: Filters) => void;
  onSearch: () => void;
  onClear: () => void;
};

const ExpenseFilters: React.FC<Props> = ({
  filters,
  locations,
  categories,
  onChange,
  onSearch,
  onClear
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12 xl:items-end">
        <div className="xl:col-span-2">
          <FormValue
            label="Nota"
            value={filters.noteId}
            onChange={(value) => onChange({ ...filters, noteId: value })}
          />
        </div>

        <div className="xl:col-span-3">
          <FormText
            label="Produto"
            value={filters.description}
            placeholder="Descrição do produto"
            onChange={(value) => onChange({ ...filters, description: value })}
          />
        </div>

        <div className="xl:col-span-2">
          <SelectField
            label="Categoria"
            placeholder="Todas"
            value={filters.categoryId ?? ""}
            onChange={(value) => onChange({ ...filters, categoryId: value ? Number(value) : "" })}
            options={categories.map((cat: any) => ({ value: cat.id, label: cat.name }))}
          />
        </div>

        <div className="xl:col-span-2">
          <SelectField
            label="Local"
            placeholder="Todos"
            value={filters.locationId ?? ""}
            onChange={(value) => onChange({ ...filters, locationId: value ? Number(value) : "" })}
            options={locations.map((loc: any) => ({ value: loc.id, label: loc.name }))}
          />
        </div>

        <div className="xl:col-span-1">
          <FormDate label="De" value={filters.fromDate} onChange={(value) => onChange({ ...filters, fromDate: value })} />
        </div>

        <div className="xl:col-span-1">
          <FormDate label="Até" value={filters.toDate} onChange={(value) => onChange({ ...filters, toDate: value })} />
        </div>

        <div className="xl:col-span-1">
          <FormValue
            label="Valor máx."
            value={filters.maxValue}
            onChange={(value) => onChange({ ...filters, maxValue: value })}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button label="Limpar" variant="secondary" onClick={onClear} />
        <Button label="Buscar" variant="primary" onClick={onSearch} />
      </div>
    </div>
  );
};

export type { Filters };
export default ExpenseFilters;
