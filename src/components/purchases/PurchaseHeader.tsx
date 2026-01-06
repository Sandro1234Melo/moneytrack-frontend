type Props = {
  date: string;
  setDate: (v: string) => void;
  locationId: number | "";
  setLocationId: (v: number | "") => void;
  locations: any[];
};

const PurchaseHeader: React.FC<Props> = ({
  date,
  setDate,
  locationId,
  setLocationId,
  locations
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

      <div>
        <label className="text-sm text-blue-100">Local</label>
        <select
          className=" input-primary w-full bg-gray-900 text-white border border-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-2  focus:ring-blue-500 "
          value={locationId}
          onChange={e => setLocationId(Number(e.target.value))}
          //className="input-primary w-full"
        >
          <option value="" className="bg-gray-900 text-white">
            Selecione o local
            </option>
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm text-blue-100">Data</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="input-primary w-full"
        />
      </div>

    </div>
  );
};

export default PurchaseHeader;
