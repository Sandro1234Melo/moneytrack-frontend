import { paymentMethods } from "../../utils/paymentMethods";

import { SelectWithAction } from "../molecules/select-with-action";

import DateField from "../atoms/date-field";
import SelectField from "../molecules/select-field";


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

      <SelectWithAction
        label="Local"
        value={locationId}
        onChange={(v) => setLocationId(v !== "" ? Number(v) : "")}
        options={locations.map(loc => ({
          value: loc.id,
          label: loc.name
        }))}
        onActionClick={onAddLocation}
        placeholder="Selecione o local"
      />

      <DateField
        label="Data"
        value={date}
        onChange={setDate}
      />

      <SelectField
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
