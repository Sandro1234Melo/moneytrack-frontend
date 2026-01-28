import { Calendar, MapPin, Trash2, CheckCircle } from "lucide-react";

export default function ShoppingListCard({ list, onDelete }: any) {
  const totalItems = list.items?.length ?? 0;

  return (
    <div className="bg-surface-dark border border-[#12202a] rounded-xl p-4">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {list.name}
          </h3>

          <div className="flex flex-wrap gap-4 text-xs text-gray-400 mt-1">
            {list.plannedDate && (
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(list.plannedDate).toLocaleDateString()}
              </span>
            )}

            {list.locationName && (
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {list.locationName}
              </span>
            )}
          </div>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded-full ${
            list.status === "DRAFT"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-green-500/20 text-green-400"
          }`}
        >
          {list.status === "DRAFT" ? "Rascunho" : "Convertida"}
        </span>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-400">
          {totalItems} itens
        </span>

        <div className="flex gap-3">
          {list.status === "DRAFT" && (
            <button className="text-green-400 hover:text-green-300">
              <CheckCircle size={18} />
            </button>
          )}

          <button
            onClick={onDelete}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
