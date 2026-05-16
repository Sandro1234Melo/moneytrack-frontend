import React from "react";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavItemProps {
  name: string;
  path: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({ name, path, icon: Icon, onClick }) => {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-brand-dark text-white dark:bg-brand-light dark:text-surface-dark"
            : "text-gray-700 dark:text-gray-300 hover:bg-panel-light dark:hover:bg-panel-dark"
        }`
      }
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{name}</span>
    </NavLink>
  );
};
