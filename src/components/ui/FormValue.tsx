type FormValueProps = {
  label?: string
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const FormValue = ({
  label,
  value,
  onChange,
  placeholder = "0,00",
  className = ""
}: FormValueProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-gray-400">
          {label}
        </label>
      )}

      <input
        type="number"
        step="0.01"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          input-primary w-full h-8
          bg-gray-900 text-white
          border border-gray-700
          rounded px-3
          focus:outline-none focus:ring-2
          focus:ring-blue-500
          ${className}
        `}
      />
    </div>
  )
}

export default FormValue
