import React from "react";
import type { LucideIcon } from "lucide-react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "gradient";

interface ButtonProps {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  variant?: ButtonVariant;
  className?: string;
  type?: "button" | "submit";
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-blue-600 hover:bg-blue-500
    text-white
    shadow-blue-900/20
  `,
  secondary: `
    bg-transparent
    border border-gray-600
    text-gray-200
    hover:bg-gray-800
  `,
  danger: `
    bg-red-600 hover:bg-red-500
    text-white
    shadow-red-900/20
  `,
  gradient: `
    bg-gradient-to-r from-purple-600 via-fuchsia-600 to-blue-600
    hover:from-purple-500 hover:to-blue-500
    text-white
    shadow-purple-900/20
  `,
};

export const Button: React.FC<ButtonProps> = ({
  label,
  icon: Icon,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        flex items-center gap-2
        px-5 py-1
        rounded-lg
        font-medium
        transition-all duration-300
        shadow-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
    </button>
  );
};
