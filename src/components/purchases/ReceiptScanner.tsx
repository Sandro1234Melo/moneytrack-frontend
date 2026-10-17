import { useRef, useState } from "react";
import { Camera, LoaderCircle, ScanLine, Upload } from "lucide-react";
import type { ReceiptScanResult } from "../../types/purchases";
import { scanReceiptLocally } from "../../utils/receiptOcr";

type Props = { onResult: (result: ReceiptScanResult) => void };

export default function ReceiptScanner({ onResult }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const scan = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Selecione uma imagem da nota.");
    if (file.size > 10 * 1024 * 1024) return alert("A imagem deve ter no máximo 10 MB.");

    try {
      setLoading(true);
      setProgress(0);
      const result = await scanReceiptLocally(file, setProgress);
      if (!result.items.length) return alert("Não foi possível identificar itens. Tente uma foto mais nítida, com os preços visíveis, ou preencha manualmente.");
      onResult(result);
    } catch {
      alert("Não foi possível ler a nota neste dispositivo. Tente uma foto mais nítida ou preencha manualmente.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <section className="rounded-3xl border border-violet-500/30 bg-violet-600/10 p-4">
      <input ref={inputRef} className="hidden" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={event => scan(event.target.files?.[0])} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3"><ScanLine className="text-violet-300"/><div><p className="font-bold">Ler nota por foto</p><p className="text-sm text-slate-300">A foto é analisada neste dispositivo e os dados ficam para sua revisão.</p></div></div>
        <button type="button" disabled={loading} onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 font-bold disabled:opacity-60">
          {loading ? <LoaderCircle className="animate-spin" size={18}/> : <Camera size={18}/>} {loading ? `Lendo${progress ? ` ${progress}%` : "..."}` : "Escanear"}
        </button>
      </div>
      {!loading && <button type="button" onClick={() => inputRef.current?.click()} className="mt-3 inline-flex items-center gap-2 text-sm text-violet-200"><Upload size={15}/> Enviar uma imagem</button>}
    </section>
  );
}
