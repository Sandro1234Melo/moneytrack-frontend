type Option = {
  value: number | string
  label: string
}

type FormSelectProps = {
  label: string
  value: number | string
  onChange: (value: number | string) => void
  options: Option[]
  placeholder?: string
  className?: string
}

const FormSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Selecionar",
  className = ""
}: FormSelectProps) => {
  return (
    <div>
      <label className="text-sm text-blue-100">
        {label}
      </label>

      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`
          input-primary w-full
          bg-gray-900 text-white
          border border-gray-700
          rounded px-2 py-1
          focus:outline-none focus:ring-2
          focus:ring-blue-500
          ${className}
        `}
      >
        <option value="" className="bg-gray-900 text-white">
          {placeholder}
        </option>

        {options.map(opt => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-gray-900 text-white"
          >
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FormSelect
