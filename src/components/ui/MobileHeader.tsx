import { Bell, Menu, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import UserAvatar from "../user/UserAvatar";
import { getLoggedUser } from "../../utils/auth";
import { getApiAssetUrl } from "../../api/axios";

type Props = { title: string; onMenuClick: () => void };

const MobileHeader: React.FC<Props> = ({ title, onMenuClick }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getLoggedUser());

  useEffect(() => {
    const updateUser = () => setUser(getLoggedUser());
    window.addEventListener("moneytrack:user-updated", updateUser);
    return () => window.removeEventListener("moneytrack:user-updated", updateUser);
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between bg-[#020513]/85 px-5 backdrop-blur-xl lg:hidden">
      <button onClick={onMenuClick} className="grid h-11 w-11 place-items-center rounded-2xl text-white active:bg-white/10"><Menu size={30} /></button>
      <h1 className="max-w-[46vw] truncate text-2xl font-bold tracking-tight">{title}</h1>
      <div className="flex items-center gap-2">
        <div className="scale-95"><ThemeToggle /></div>
        <button className="relative grid h-11 w-11 place-items-center rounded-full bg-white/[0.06]"><Bell size={22} /><span className="absolute right-2 top-2 h-3 w-3 rounded-full bg-violet-500" /></button>
        {user ? (
          <UserAvatar
            name={user.full_Name ?? user.fullName ?? "Usuário"}
            imageUrl={getApiAssetUrl(user.profile_Image_Url ?? user.profile_image_url ?? user.profileImageUrl)}
            onClick={() => navigate("/settings")}
            className="h-11 w-11 bg-white/[0.08]"
          />
        ) : (
          <button onClick={() => navigate("/settings")} className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.08]"><User size={22} /></button>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
