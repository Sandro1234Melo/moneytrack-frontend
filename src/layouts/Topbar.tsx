import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../utils/auth";
import UserAvatar from "../components/user/UserAvatar";
import UserMenu from "../components/user/UserMenu";
import ThemeToggle from "../components/ThemeToggle";
import NotificationMenu from "../components/user/NotificationMenu";

const Topbar = () => {
  const [user, setUser] = useState(() => getLoggedUser());
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const refreshUser = () => setUser(getLoggedUser());
    window.addEventListener("moneytrack:user-updated", refreshUser);
    return () => window.removeEventListener("moneytrack:user-updated", refreshUser);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("moneytrack:user-updated"));
    navigate("/login");
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const term = search.trim();
    navigate(term ? `/purchases?search=${encodeURIComponent(term)}` : "/purchases");
  };

  if (!user) return null;

  return (
    <header className="flex h-16 items-center justify-end gap-4 border-b border-white/5 bg-[#050817]/80 px-8 backdrop-blur-xl">
      <form onSubmit={handleSearch} className="relative hidden w-72 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Buscar compras" className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm outline-none transition focus:border-violet-500/60" placeholder="Buscar compras..." />
      </form>
      <ThemeToggle />
      <NotificationMenu />
      <div className="relative">
        <UserAvatar
          name={user.full_Name ?? user.fullName ?? "Usuário"}
          imageUrl={user.profile_Image_Url ?? user.profile_image_url ?? user.profileImageUrl}
          onClick={() => setOpenMenu((prev) => !prev)}
        />
        {openMenu && <UserMenu onLogout={handleLogout} />}
      </div>
    </header>
  );
};

export default Topbar;
