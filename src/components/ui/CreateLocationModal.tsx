import { useState, useEffect } from "react";
import { Button } from "./Button";

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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div
      className="
        w-full max-w-md
        bg-surface-dark
        border border-[#12202a]
        rounded-lg
        shadow-xl
        p-6
      "
    >
      <h3 className="text-lg font-semibold text-white mb-5">
        {title}
      </h3>

      <div className="space-y-4">
        {fields.map(field => (
          <div key={field.name}>
            <label className="block text-sm text-gray-400 mb-1">
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              placeholder={field.placeholder}
              value={form[field.name] || ""}
              onChange={e =>
                handleChange(field.name, e.target.value)
              }
              className="input-primary w-full"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-6">
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
