type UserAvatarProps = {
  name: string;
  onClick: () => void;
};

const UserAvatar: React.FC<UserAvatarProps> = ({ name, onClick }) => {
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
        w-9 h-9 rounded-full
        bg-purple-600 text-white
        flex items-center justify-center
        font-semibold
        hover:bg-purple-700
        transition
      "
      title={name}
    >
      {initials}
    </button>
  );
};

export default UserAvatar;
