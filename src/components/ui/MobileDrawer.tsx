import Sidebar from "../Sidebar";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const MobileDrawer: React.FC<Props> = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu de navegação">

      <button
        type="button"
        aria-label="Fechar menu"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <aside className="fixed left-0 top-0 h-[100dvh] w-[292px] max-w-[88vw] overflow-y-auto bg-[#07101f] shadow-xl">
        
        <Sidebar mobile onNavigate={onClose} />
      </aside>
    </div>
  );
};

export default MobileDrawer;
