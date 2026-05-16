import { Plus } from "lucide-react"
import { IconButton } from "../atoms/icon-button"
import { Label } from "../atoms/label"
import { Select } from "../atoms/select"

type Option = {
  value: number | string
  label: string
}

type SelectWithActionProps = {
  label: string
  value: number | string
  onChange: (value: number | string) => void
  options: Option[]
  onActionClick: () => void
  placeholder?: string
  selectVariant?: "primary" | "secondary" | "danger"
  buttonVariant?: "primary" | "secondary" | "danger" | "ghost"
}

export const SelectWithAction = ({
  label,
  value,
  onChange,
  options,
  onActionClick,
  placeholder = "Selecionar",
  selectVariant = "primary",
  buttonVariant = "primary"
}: SelectWithActionProps) => {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Select
            value={value}
            onChange={onChange}
            options={options}
            placeholder={placeholder}
            variant={selectVariant}
          />
        </div>

        <IconButton
          icon={<Plus size={18} />}
          onClick={onActionClick}
          variant={buttonVariant}
          title="Adicionar"
        />
      </div>
    </div>
  )
}

SelectWithAction.displayName = "SelectWithAction"
