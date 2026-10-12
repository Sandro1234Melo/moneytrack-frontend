import { getApiAssetUrl } from "../../api/axios";

type UserAvatarProps = {
  name: string;
  imageUrl?: string | null;
  onClick: () => void;
};

const UserAvatar: React.FC<UserAvatarProps> = ({ name, imageUrl, onClick }) => {
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <button
      onClick={onClick}
      className="
        h-9 w-9 overflow-hidden rounded-full
        bg-purple-600 text-white
        flex items-center justify-center
        font-semibold
        hover:bg-purple-700
        transition
      "
      title={name}
    >
      {imageUrl ? <img src={getApiAssetUrl(imageUrl)} alt={`Foto de ${name}`} className="h-full w-full object-cover" /> : initials}
    </button>
  );
};

export default UserAvatar;
