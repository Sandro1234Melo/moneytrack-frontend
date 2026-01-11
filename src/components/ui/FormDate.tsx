// components/FormDate.tsx
type FormDateProps = {
  label?: string
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}

const FormDate: React.FC<FormDateProps> = ({
  label,
  value,
  onChange,
  className = "",
  placeholder
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-blue-100">
          {label}
        </label>
      )}

      <input
        type="date"
        value={value}
        placeholder={placeholder}
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
      />
    </div>
  )
}

export default FormDate
