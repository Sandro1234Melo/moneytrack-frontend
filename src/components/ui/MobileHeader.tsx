import { Menu, User, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  title: string;
  onMenuClick: () => void;
};

const MobileHeader: React.FC<Props> = ({ title, onMenuClick }) => {
  const navigate = useNavigate();
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <header className="
      fixed top-0 left-0 right-0 h-14
      bg-[#0b0f1a] border-b border-white/10
      flex items-center justify-between
      px-4 z-50 lg:hidden
    ">
      {/* MENU LATERAL */}
      <button onClick={onMenuClick}>
        <Menu size={24} />
      </button>

      {/* TÍTULO */}
      <h1 className="text-sm font-semibold truncate">
        {title}
      </h1>

      {/* USUÁRIO */}
      <div className="relative">
        <button
          onClick={() => setOpenUserMenu(prev => !prev)}
          className="
            w-8 h-8 rounded-full
            bg-white/10
            flex items-center justify-center
            active:bg-white/20
          "
        >
          <User size={18} />
        </button>

        {/* POPOVER */}
        {openUserMenu && (
          <div
            className="
              absolute right-0 mt-2 w-44
              bg-[#0b0f1a]
              border border-white/10
              rounded-lg shadow-lg
              overflow-hidden
            "
          >
            <button
              onClick={() => {
                setOpenUserMenu(false);
                navigate("/settings");
              }}
              className="
                w-full flex items-center gap-2
                px-4 py-3 text-sm
                hover:bg-white/10
              "
            >
              <Settings size={16} />
              Configurações
            </button>

            <button
              onClick={handleLogout}
              className="
                w-full flex items-center gap-2
                px-4 py-3 text-sm text-red-400
                hover:bg-white/10
              "
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
