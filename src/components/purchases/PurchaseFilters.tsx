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

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

        {/* Data início */}
        <div>
          <label className="text-sm text-gray-400">De</label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={e =>
              onChange({ ...filters, fromDate: e.target.value })
            }
            className="input-primary w-full"
          />
        </div>

        {/* Data fim */}
        <div>
          <label className="text-sm text-gray-400">Até</label>
          <input
            type="date"
            value={filters.toDate}
            onChange={e =>
              onChange({ ...filters, toDate: e.target.value })
            }
            className="input-primary w-full"
          />
        </div>

        {/* Local */}
        <div>
          <label className="text-sm text-gray-400">Local</label>
          <select
            value={filters.locationId}
            onChange={e =>
              onChange({
                ...filters,
                locationId: e.target.value
                  ? Number(e.target.value)
                  : ""
              })
            }
            className="input-primary w-full"
          >
            <option value="">Todos</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Valor mínimo */}
        <div>
          <label className="text-sm text-gray-400">Valor mín.</label>
          <input
            type="number"
            value={filters.minValue}
            onChange={e =>
              onChange({ ...filters, minValue: e.target.value })
            }
            className="input-primary w-full"
          />
        </div>

        {/* Valor máximo */}
        <div>
          <label className="text-sm text-gray-400">Valor máx.</label>
          <input
            type="number"
            value={filters.maxValue}
            onChange={e =>
              onChange({ ...filters, maxValue: e.target.value })
            }
            className="input-primary w-full"
          />
        </div>

      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={onClear}
          className="text-sm text-gray-400 hover:text-gray-200"
        >
          Limpar filtros
        </button>
      </div>

    </div>
  );
};

export type { Filters };
export default PurchaseFilters;
