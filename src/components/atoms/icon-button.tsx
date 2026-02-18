type IconButtonVariant = "primary" | "secondary" | "danger" | "ghost"
type IconButtonSize = "sm" | "md" | "lg"

type IconButtonProps = {
  icon: React.ReactNode
  onClick?: () => void
  variant?: IconButtonVariant
  size?: IconButtonSize
  title?: string
  type?: "button" | "submit" | "reset"
  className?: string
}

const variantStyles: Record<IconButtonVariant, string> = {
  primary: "bg-purple-600 hover:bg-purple-700 text-white",
  secondary: "bg-gray-700 hover:bg-gray-600 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  ghost: "bg-transparent hover:bg-gray-800 text-gray-300"
}

const sizeStyles: Record<IconButtonSize, string> = {
  sm: "w-7 h-7",
  md: "w-8 h-8",
  lg: "w-10 h-10"
}

export const IconButton = ({
  icon,
  onClick,
  variant = "primary",
  size = "md",
  title,
  type = "button",
  className = ""
}: IconButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      title={title}
      className={`
        flex items-center justify-center
        rounded-md
        transition-colors
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {icon}
    </button>
  )
}

IconButton.displayName = "IconButton"
