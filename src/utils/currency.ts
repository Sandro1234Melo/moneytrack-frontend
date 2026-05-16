export const currencyMap: Record<string, string> = {
  BRL: "R$",
  EUR: "€",
  USD: "$",
  GBP: "£"
};

export function getCurrencySymbol(currencyCode?: string) {
  if (!currencyCode) return "";
  return currencyMap[currencyCode] ?? currencyCode;
}
