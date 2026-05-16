import { Listbox } from "@headlessui/react"
import { ChevronDown } from "lucide-react"

type Option = {
  value: number | string
  label: string
}

type SelectVariant = "primary" | "secondary" | "danger"

type SelectProps = {
  value: number | string
  onChange: (value: number | string) => void
  options: Option[]
  placeholder?: string
  variant?: SelectVariant
  className?: string
}

const variantStyles: Record<SelectVariant, string> = {
  primary: "bg-gray-900 text-white border-gray-700 focus:ring-purple-500",
  secondary: "bg-gray-800 text-gray-200 border-gray-600 focus:ring-gray-400",
  danger: "bg-gray-900 text-red-400 border-red-600 focus:ring-red-500"
}

export const Select = ({
  value,
  onChange,
  options,
  placeholder = "Selecionar",
  variant = "primary",
  className = ""
}: SelectProps) => {
  const selected = options.find(opt => opt.value === value)

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button
          className={`
            w-full flex items-center justify-between
            h-8 px-3 border rounded-md
            focus:outline-none focus:ring-2
            ${variantStyles[variant]}
            ${className}
          `}
        >
            <span>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown size={16} />
        </Listbox.Button>

        <Listbox.Options
          className="
            absolute z-50 mt-1 w-full
            bg-gray-900 border border-gray-700
            rounded-md shadow-lg
            max-h-60 overflow-auto
            scrollbar-hide
          "
        >
          {options.map(opt => (
            <Listbox.Option
              key={opt.value}
              value={opt.value}
              className={({ active, selected }) =>
                `
                cursor-pointer px-3 py-2
                ${active ? "bg-purple-600 text-white" : "text-gray-200"}
                ${selected ? "bg-purple-700 text-white" : ""}
              `
              }
            >
              {opt.label}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  )
}

Select.displayName = "Select"
