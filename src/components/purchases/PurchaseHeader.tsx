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
};

const PurchaseHeader: React.FC<Props> = ({
  date,
  setDate,
  locationId,
  setLocationId,
  paymentMethod,
  setPaymentMethod,
  locations
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">
      
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