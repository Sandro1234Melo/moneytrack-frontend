import { Link } from "react-router-dom";

type UserMenuProps = {
  onLogout: () => void;
};

const UserMenu: React.FC<UserMenuProps> = ({ onLogout }) => {
  return (
    <div
      className="
        absolute right-0 mt-2 w-48
        bg-[#0b0b2a]
        border border-[#1f1f3a]
        rounded-lg shadow-lg
        z-50
      "
    >
      <Link
        to="/settings"
        className="block px-4 py-2 text-sm hover:bg-[#151540]"
      >
        Configurações
      </Link>

      <button
        onClick={onLogout}
        className="
          w-full text-left px-4 py-2
          text-sm text-red-400
          hover:bg-[#151540]
        "
      >
        Sair
      </button>
    </div>
  );
};

export default UserMenu;
