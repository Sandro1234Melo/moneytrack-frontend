import FormDate from "../ui/FormDate";
import FormSelect from "../ui/FormSelect";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 items-end">

      {/* Local */}
      <FormSelect
        label="Local"
        value={locationId}
        placeholder="Selecione o local"
        onChange={(v) => setLocationId(v ? Number(v) : "")}
        options={locations.map(loc => ({
          value: loc.id,
          label: loc.name
        }))}
      />

      {/* Data */}
      <FormDate
        label="Data"
        value={date}
        onChange={setDate}
      />

    </div>
  );
};

export default PurchaseHeader;
