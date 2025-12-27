import React from "react";
import type { LucideIcon } from "lucide-react";

interface GradientButtonProps {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  label,
  icon: Icon,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-white
        bg-gradient-to-r from-purple-600 via-fuchsia-600 to-blue-600
        hover:from-purple-500 hover:to-blue-500 transition-all duration-300
        shadow-lg shadow-purple-900/20 ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
    </button>
  );
};
