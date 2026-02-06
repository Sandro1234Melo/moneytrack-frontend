type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<Props> = ({ open, title, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative bg-[#0b0f1a] w-full max-w-md rounded-xl p-6 border border-white/10">
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400">
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;
