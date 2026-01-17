type FormTextProps = {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const FormText = ({
  label,
  value,
  onChange,
  placeholder = "",
  className = ""
}: FormTextProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-gray-400">
          {label}
        </label>
      )}

      <input
        type="text"
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

export default FormText
