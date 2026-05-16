import { X } from "lucide-react";

type Props = {
    open: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};

const ConfirmDialog: React.FC<Props> = ({
    open,
    title = "Confirmação",
    message,
    onConfirm,
    onCancel
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-[#0f172a] border border-white/10 rounded-lg p-6 w-full max-w-md z-10">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">
                        {title}
                    </h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-200">
                        <X size={18} />
                    </button>
                </div>

                {/* Message */}
                <p className="text-gray-300 mb-6">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded border border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-500"
                    >
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
