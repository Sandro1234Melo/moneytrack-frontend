type Props = {
  user: {
    full_name?: string;
    full_Name?: string; // mantém compatibilidade
    email: string;
    profile_image_url?: string;
  };
};

const UserProfileCard: React.FC<Props> = ({ user }) => {
  const name = user.full_name || user.full_Name || "Usuário";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className="
        bg-surface-dark border border-[#12202a]
        rounded-xl p-4 flex gap-4 items-center
      "
    >
      {/* AVATAR */}
      <div
        className="
          w-12 h-12 rounded-full overflow-hidden
          bg-purple-600 flex items-center justify-center
        "
      >
        {user.profile_image_url ? (
          <img
            src={user.profile_image_url}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white font-semibold">
            {initial}
          </span>
        )}
      </div>

      {/* INFO */}
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-400">{user.email}</p>
      </div>
    </div>
  );
};

export default UserProfileCard;