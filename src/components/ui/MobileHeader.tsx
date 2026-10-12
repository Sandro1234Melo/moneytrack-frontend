import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import NotificationMenu from "../user/NotificationMenu";
import UserAvatar from "../user/UserAvatar";
import { getLoggedUser } from "../../utils/auth";

type Props = { title: string; onMenuClick: () => void };

const MobileHeader: React.FC<Props> = ({ title, onMenuClick }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getLoggedUser());

  useEffect(() => {
    const refreshUser = () => setUser(getLoggedUser());
    window.addEventListener("moneytrack:user-updated", refreshUser);
    return () => window.removeEventListener("moneytrack:user-updated", refreshUser);
  }, []);

  const userName = user?.full_Name ?? user?.fullName ?? user?.full_name ?? "Usuário";
  const imageUrl = user?.profile_Image_Url ?? user?.profile_image_url ?? user?.profileImageUrl;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between bg-[#020513]/85 px-5 backdrop-blur-xl lg:hidden">
      <button onClick={onMenuClick} className="grid h-11 w-11 place-items-center rounded-2xl text-white active:bg-white/10"><Menu size={30} /></button>
      <h1 className="max-w-[46vw] truncate text-2xl font-bold tracking-tight">{title}</h1>
      <div className="flex items-center gap-2">
        <div className="scale-95"><ThemeToggle /></div>
        <div className="scale-95"><NotificationMenu /></div>
        <UserAvatar name={userName} imageUrl={imageUrl} onClick={() => navigate("/settings")} />
      </div>
    </header>
  );
};

export default MobileHeader;
