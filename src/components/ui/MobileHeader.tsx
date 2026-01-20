import { Menu } from "lucide-react";

type Props = {
  title: string;
  onMenuClick: () => void;
};

const MobileHeader: React.FC<Props> = ({ title, onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#0b0f1a] border-b border-white/10 flex items-center justify-between px-4 z-50 lg:hidden">
      <button onClick={onMenuClick} className="text-white">
        <Menu size={24} />
      </button>

      <h1 className="text-sm font-semibold text-white">
        {title}
      </h1>

      {/* Espaço para alinhar */}
      <div className="w-6" />
    </header>
  );
};

export default MobileHeader;
