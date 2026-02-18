import FormSelect from "../molecules/select-field";
import FormDate from "../atoms/date-field";
import FormValue from "../ui/FormValue";
import { Button } from "../ui/Button";

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

const PurchaseFilters: React.FC<Props> = ({
  filters,
  locations,
  categories,
  onChange,
  onSearch,
  onClear
}) => {
  return (
    <div className="bg-surface-dark border border-[#12202a] rounded-lg p-4">

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">

        <FormValue
          label="Nota"
          value={filters.noteId}
          onChange={(value) =>
            onChange({ ...filters, noteId: value })
          }
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">
            Produto
          </label>
          <input
            type="text"
            value={filters.description}
            onChange={e =>
              onChange({ ...filters, description: e.target.value })
            }
            placeholder="Descrição do produto"
            className="input-primary w-full"
          />
        </div>

        <FormSelect
          label="Categoria"
          placeholder="Todas"
          value={filters.categoryId ?? ""}
          onChange={(value) =>
            onChange({
              ...filters,
              categoryId: value ? Number(value) : ""
            })
          }
          options={categories.map((cat: any) => ({
            value: cat.id,
            label: cat.name
          }))}
        />

        {/* Data início */}
        <div className="flex flex-col gap-1">
          <FormDate
            label="De"
            value={filters.fromDate}
            onChange={(value) =>
              onChange({ ...filters, fromDate: value })
            }
          />
        </div>

        {/* Data fim */}
        <div className="flex flex-col gap-1">
          <FormDate
            label="Até"
            value={filters.toDate}
            onChange={(value) =>
              onChange({ ...filters, toDate: value })
            }
          />
        </div>

        {/* Local */}
        <div className="flex flex-col gap-1">
          <FormSelect
            label="Local"
            placeholder="Todos"
            value={filters.locationId ?? ""}
            onChange={(value) =>
              onChange({
                ...filters,
                locationId: value ? Number(value) : ""
              })
            }
            options={locations.map((loc: any) => ({
              value: loc.id,
              label: loc.name
            }))}
          />
        </div>

        <FormValue
          label="Valor mín."
          value={filters.minValue}
          onChange={(value) =>
            onChange({ ...filters, minValue: value })
          }
        />

        <FormValue
          label="Valor máx."
          value={filters.maxValue}
          onChange={(value) =>
            onChange({ ...filters, maxValue: value })
          }
        />

      </div>

      {/* BOTÃO */}
      <div className="flex justify-end gap-2">
        <Button
          label="Limpar"
          variant="secondary"
          onClick={onClear}
        />

        <Button
          label="Buscar"
          variant="primary"
          onClick={onSearch}
        />
      </div>

    </div>
  );
};

export type { Filters };
export default PurchaseFilters;
