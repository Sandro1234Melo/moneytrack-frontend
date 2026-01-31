import { User } from "lucide-react";

type Props = {
  user: {
    full_Name: string;
    email: string;
  };
};

const UserProfileCard: React.FC<Props> = ({ user }) => {
  return (
    <div className="
      bg-surface-dark border border-[#12202a]
      rounded-xl p-4 flex gap-4 items-center
    ">
      <div className="
        w-12 h-12 rounded-full
        bg-purple-600 flex items-center justify-center
      ">
        <User />
      </div>

      <div>
        <p className="font-medium">
          {user.full_Name}
        </p>
        <p className="text-sm text-gray-400">
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserProfileCard;
