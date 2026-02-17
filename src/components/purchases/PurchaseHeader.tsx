import { Plus } from "lucide-react";
import { paymentMethods } from "../../utils/paymentMethods";
import FormDate from "../ui/FormDate";
import FormSelect from "../ui/FormSelect";

type Props = {
  date: string;
  setDate: (v: string) => void;
  locationId: number | "";
  setLocationId: (v: number | "") => void;
  locations: any[];
  paymentMethod: number | "";
  setPaymentMethod: (v: number | "") => void;
  onAddLocation: () => void;
};

const PurchaseHeader: React.FC<Props> = ({
  date,
  setDate,
  locationId,
  setLocationId,
  paymentMethod,
  setPaymentMethod,
  locations,
  onAddLocation
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <FormSelect
            label="Local"
            value={locationId}
            placeholder="Selecione o local"
            onChange={(v) => setLocationId(v !== "" ? Number(v) : "")}
            options={locations.map(loc => ({
              value: loc.id,
              label: loc.name
            }))}
          />
        </div>
        
        <button
          type="button"
          onClick={onAddLocation}
                    className="w-8 h-8 flex items-center justify-center
                     rounded-md bg-purple-600 hover:bg-purple-700"
          title="Novo local"
        >
          <Plus size={18} />
        </button>
      </div>

      <FormDate
        label="Data"
        value={date}
        onChange={setDate}
      />

      <FormSelect
        label="Forma de pagamento"
        value={paymentMethod}
        onChange={(v) => setPaymentMethod(v !== "" ? Number(v) : "")}
        options={paymentMethods}
        placeholder="Selecione"
      />
    </div>
  );
};

export default PurchaseHeader;
