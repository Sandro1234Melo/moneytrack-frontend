type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ open, title, onClose, children }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#0b0b2a] w-full max-w-md rounded-xl p-6">

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400">✕</button>
        </div>

        {children}

      </div>
    </div>
  );
};

export default Modal;
