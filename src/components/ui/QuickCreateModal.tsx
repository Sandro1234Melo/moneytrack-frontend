import { useState, useEffect } from "react";
import { Button } from "./Button";
import { Input } from "./Input";

type Field = {
  name: string;
  label: string;
  type?: "text" | "number";
  placeholder?: string;
};

type Props = {
  open: boolean;
  title: string;
  fields: Field[];
  onClose: () => void;
  onSubmit: (data: any) => Promise<void> | void;
};

const QuickCreateModal: React.FC<Props> = ({
  open,
  title,
  fields,
  onClose,
  onSubmit
}) => {
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (open) {
      const initial: any = {};
      fields.forEach(f => (initial[f.name] = ""));
      setForm(initial);
    }
  }, [open, fields]);

  if (!open) return null;

  const handleChange = (name: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-6 rounded-lg w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>

        <div className="space-y-4">
          {fields.map(field => (
            <Input
              key={field.name}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.name] || ""}
              onChange={(value) =>
                handleChange(field.name, value)
              }
            />
          ))}
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button
            label="Cancelar"
            variant="secondary"
            onClick={onClose}
          />
          
          <Button
            label="Salvar"
            variant="primary"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default QuickCreateModal;
