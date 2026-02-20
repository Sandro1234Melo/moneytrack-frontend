import { Label } from "../atoms/label"

type DateFieldProps = {
  label?: string
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}

const DateField = ({
  label,
  value,
  onChange,
  className = "",
  placeholder
}: DateFieldProps) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <Label>
          {label}
        </Label>
      )}

      <input
        type="date"
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="
          w-full h-8
          bg-gray-900 text-white
          border border-gray-700
          rounded-md px-3
          focus:outline-none focus:ring-2
          focus:ring-purple-500
        "
      />
    </div>
  )
}

DateField.displayName = "DateField"

export default DateField
