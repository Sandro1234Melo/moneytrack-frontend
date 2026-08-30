import { AlertTriangle, X } from "lucide-react";

type Props = {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDialog: React.FC<Props> = ({
  open,
  title = "Confirmação",
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  danger = false,
  loading = false,
  onConfirm,
  onCancel
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={loading ? undefined : onCancel} />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#081222] p-6 shadow-2xl shadow-black/50">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`grid h-12 w-12 place-items-center rounded-2xl ${danger ? "bg-red-500/15 text-red-300" : "bg-violet-500/15 text-violet-300"}`}>
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-50"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-sm leading-6 text-slate-300">{message}</p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-2xl border border-white/10 px-4 py-3 font-semibold text-slate-200 hover:bg-white/5 disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`rounded-2xl px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60 ${danger ? "bg-red-600 hover:bg-red-500" : "bg-gradient-to-r from-violet-600 to-blue-600"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
