import type { ReceiptScanResult } from "../types/purchases";

const ignoredLine = /\b(total|subtotal|iva|imposto|troco|cart[aã]o|multibanco|dinheiro|pagamento|mb\s*way|nif|obrigad[oa]|cash|visa|mastercard)\b/i;
const priceAtEnd = /(?:€\s*)?(\d{1,4}[,.]\d{2})\s*€?\s*$/;
const datePattern = /\b(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})\b/;

const toPrice = (value: string) => Number(value.replace(/\./g, "").replace(",", "."));

function extractDate(text: string) {
  const match = text.match(datePattern);
  if (!match) return "";
  const [, day, month, rawYear] = match;
  const year = rawYear.length === 2 ? `20${rawYear}` : rawYear;
  const result = new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00`);
  return Number.isNaN(result.getTime()) ? "" : `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function extractMerchant(lines: string[]) {
  return lines.find(line =>
    line.length >= 3 &&
    /[a-záàâãéêíóôõúç]/i.test(line) &&
    !/^(nif|data|documento|fatura|recibo|loja|morada)/i.test(line) &&
    !ignoredLine.test(line) &&
    !priceAtEnd.test(line)
  ) ?? "";
}

function extractItems(lines: string[]) {
  return lines.flatMap(line => {
    if (ignoredLine.test(line)) return [];
    const priceMatch = line.match(priceAtEnd);
    if (!priceMatch) return [];

    const price = toPrice(priceMatch[1]);
    if (!Number.isFinite(price) || price < 0) return [];

    let description = line.slice(0, priceMatch.index).replace(/[|_]+/g, " ").trim();
    if (description.length < 2 || !/[a-záàâãéêíóôõúç]/i.test(description)) return [];

    let quantity = 1;
    const quantityMatch = description.match(/^(\d+(?:[,.]\d+)?)\s*(?:x|un|uni|kg|lt)\b\s*/i);
    if (quantityMatch) {
      quantity = Number(quantityMatch[1].replace(",", "."));
      description = description.slice(quantityMatch[0].length).trim();
    }
    if (!Number.isFinite(quantity) || quantity <= 0 || !description) return [];

    return [{ description, quantity, price, suggestedCategory: "" }];
  });
}

/** Reads a receipt entirely in the browser. The image is never sent to the API. */
export async function scanReceiptLocally(file: File, onProgress: (progress: number) => void): Promise<ReceiptScanResult> {
  // Keep the OCR engine out of the initial application bundle; it is only needed after the user picks a receipt.
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("por", 1, {
    logger: message => {
      if (message.status === "recognizing text") onProgress(Math.round(message.progress * 100));
    }
  });

  try {
    const { data } = await worker.recognize(file);
    const lines = data.text.split(/\r?\n/).map(line => line.replace(/\s+/g, " ").trim()).filter(Boolean);
    return {
      date: extractDate(data.text),
      merchant: extractMerchant(lines),
      items: extractItems(lines)
    };
  } finally {
    await worker.terminate();
  }
}
