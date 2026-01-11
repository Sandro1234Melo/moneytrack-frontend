import { Plus } from "lucide-react";
import { Button } from "../ui/Button";

type Props = {
  onSave: () => void;
  onCancel: () => void;
  onAddItem: () => void;
};

const PurchaseActions: React.FC<Props> = ({
  onSave,
  onCancel,
  onAddItem
}) => {
  return (
    <div className="flex justify-between items-center mt-8">
      
      <Button
        label="Adicionar Item"
        variant="gradient"
        onClick={onAddItem}
        icon={Plus} 
      />

      <div className="flex gap-3">
        <Button
          label="Cancelar"
          variant="secondary"
          onClick={onCancel}
        />

        <Button
          label="Salvar"
          variant="primary"
          onClick={onSave}
        />
      </div>
    </div>
  );
};

export default PurchaseActions;
