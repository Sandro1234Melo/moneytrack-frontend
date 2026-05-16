import { X } from "lucide-react";
import Sidebar from "../Sidebar";

type Props = {
  open: boolean;
  onClose: () => void;
};

const MobileDrawer: React.FC<Props> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">

      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div className="absolute left-0 top-0 bottom-0 w-64 bg-[#14171f] shadow-xl">
        
        <div className="flex justify-end p-4">
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <Sidebar />
      </div>
    </div>
  );
};

export default MobileDrawer;
