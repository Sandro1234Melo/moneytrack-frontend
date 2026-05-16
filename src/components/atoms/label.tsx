type LabelVariant = "default" | "muted" | "error"

type LabelProps = {
  children: React.ReactNode
  htmlFor?: string
  variant?: LabelVariant
  className?: string
}

const variantStyles: Record<LabelVariant, string> = {
  default: "text-blue-100",
  muted: "text-gray-400",
  error: "text-red-400"
}

export const Label = ({
  children,
  htmlFor,
  variant = "default",
  className = ""
}: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`
        text-sm font-medium
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </label>
  )
}

Label.displayName = "Label"
