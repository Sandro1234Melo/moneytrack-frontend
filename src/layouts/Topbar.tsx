import { useState } from "react";
import UserAvatar from "../components/user/UserAvatar";
import UserMenu from "../components/user/UserMenu";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../utils/auth";

const Topbar = () => {
  const user = getLoggedUser();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <header
      className="
        h-14
        px-6
        flex items-center justify-between
        border-b border-[#12202a]
        bg-gradient-to-r from-[#050514] to-[#090922]
      "
    >
      <div className="text-sm text-gray-400">
        {/* opcional: título da página */}
      </div>

      <div className="relative">
        <UserAvatar
          name={user.full_Name}
          onClick={() => setOpenMenu(prev => !prev)}
        />

        {openMenu && (
          <UserMenu onLogout={handleLogout} />
        )}
      </div>
    </header>
  );
};

export default Topbar;
