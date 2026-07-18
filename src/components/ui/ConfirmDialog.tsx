import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

type ConfirmVariant = "danger" | "warning" | "info";

type Props = {
    open: boolean;
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: ConfirmVariant;
    loading?: boolean;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
};

const variantStyles: Record<ConfirmVariant, { icon: string; button: string; glow: string }> = {
    danger: {
        icon: "bg-red-500/15 text-red-300 ring-red-500/30",
        button: "bg-red-600 text-white hover:bg-red-500 focus:ring-red-400",
        glow: "shadow-red-950/30"
    },
    warning: {
        icon: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
        button: "bg-amber-500 text-slate-950 hover:bg-amber-400 focus:ring-amber-300",
        glow: "shadow-amber-950/30"
    },
    info: {
        icon: "bg-violet-500/15 text-violet-300 ring-violet-500/30",
        button: "bg-violet-600 text-white hover:bg-violet-500 focus:ring-violet-400",
        glow: "shadow-violet-950/30"
    }
};

const ConfirmDialog: React.FC<Props> = ({
    open,
    title = "Confirmação",
    message,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    variant = "danger",
    loading = false,
    onConfirm,
    onCancel
}) => {
    if (!open) return null;

    const styles = variantStyles[variant];
    const Icon = variant === "danger" ? Trash2 : AlertTriangle;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={loading ? undefined : onCancel} />

            <div className={`relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#071123] shadow-2xl ${styles.glow}`}>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
                <div className="p-6 sm:p-7">
                    <div className="flex items-start gap-4">
                        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ring-1 ${styles.icon}`}>
                            <Icon size={22} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="text-xl font-bold text-white">{title}</h3>
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    disabled={loading}
                                    className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label="Fechar"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <p className="mt-3 leading-relaxed text-slate-300">{message}</p>
                        </div>
                    </div>

                    <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="rounded-2xl border border-white/10 px-5 py-3 font-semibold text-slate-200 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {cancelLabel}
                        </button>

                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={loading}
                            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-bold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#071123] disabled:cursor-not-allowed disabled:opacity-70 ${styles.button}`}
                        >
                            {loading && <Loader2 className="animate-spin" size={18} />}
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
