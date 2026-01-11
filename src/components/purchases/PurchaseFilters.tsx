import FormSelect from "../ui/FormSelect";
import FormDate from "../ui/FormDate";
import FormValue from "../ui/FormValue";
import { Button } from "../ui/Button";

type Filters = {
  fromDate: string;
  toDate: string;
  locationId: number | "";
  minValue: string;
  maxValue: string;
};

type Props = {
  filters: Filters;
  locations: any[];
  onChange: (filters: Filters) => void;
  onClear: () => void;
};

const PurchaseFilters: React.FC<Props> = ({
  filters,
  locations,
  onChange,
  onClear
}) => {
  return (
    <div className="bg-surface-dark border border-[#12202a] rounded-lg p-4">

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">

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
    <div className="flex justify-end">
      <Button
        label="Limpar"
        variant="secondary"
        onClick={onClear}
      />
    </div>
    </div>
  );
};

export type { Filters };
export default PurchaseFilters;
