import { Label } from "../atoms/label"
import { Select } from "../atoms/select"

type Option = {
  value: number | string
  label: string
}

type SelectFieldProps = {
  label: string
  value: number | string
  onChange: (value: number | string) => void
  options: Option[]
  placeholder?: string
  variant?: "primary" | "secondary" | "danger"
  className?: string
}

export const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Selecionar",
  variant = "primary",
  className = ""
}: SelectFieldProps) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <Label>
        {label}
      </Label>

      <Select
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        variant={variant}
      />
    </div>
  )
}

SelectField.displayName = "SelectField"
