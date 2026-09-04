import { useEffect, useState } from "react";

type UserAvatarProps = {
  name: string;
  imageUrl?: string | null;
  onClick: () => void;
  className?: string;
};

const UserAvatar: React.FC<UserAvatarProps> = ({ name, imageUrl, onClick, className = "" }) => {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => setImageFailed(false), [imageUrl]);

  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <button
      onClick={onClick}
      className={`
        w-9 h-9 rounded-full
        bg-purple-600 text-white
        flex items-center justify-center
        font-semibold
        hover:bg-purple-700
        transition
        overflow-hidden
        ${className}
      `}
      title={name}
    >
      {imageUrl && !imageFailed ? (
        <img src={imageUrl} alt={`Foto de ${name}`} className="h-full w-full object-cover" onError={() => setImageFailed(true)} />
      ) : initials}
    </button>
  );
};

export default UserAvatar;
