import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../utils/auth";
import { getApiAssetUrl } from "../api/axios";
import UserAvatar from "../components/user/UserAvatar";
import UserMenu from "../components/user/UserMenu";
import ThemeToggle from "../components/ThemeToggle";
import NotificationMenu from "../components/user/NotificationMenu";

const Topbar = () => {
  const [user, setUser] = useState(getLoggedUser());
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const updateUser = () => setUser(getLoggedUser());
    window.addEventListener("moneytrack:user-updated", updateUser);
    return () => window.removeEventListener("moneytrack:user-updated", updateUser);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <header className="flex h-16 items-center justify-end gap-4 border-b border-white/5 bg-[#050817]/80 px-8 backdrop-blur-xl">
      <div className="relative hidden w-72 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm outline-none transition focus:border-violet-500/60" placeholder="Buscar..." />
      </div>
      <ThemeToggle />
      <NotificationMenu />
      <div className="relative">
        <UserAvatar name={user.full_Name ?? user.fullName ?? "Usuário"} imageUrl={getApiAssetUrl(user.profileImageUrl ?? user.profile_Image_Url ?? user.profile_image_url)} onClick={() => setOpenMenu((prev) => !prev)} />
        {openMenu && <UserMenu onLogout={handleLogout} />}
      </div>
    </header>
  );
};

export default Topbar;
