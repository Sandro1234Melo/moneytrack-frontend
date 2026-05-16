import { getCurrencySymbol } from "./currency";

export function getLoggedUser() {
  const user = sessionStorage.getItem("user");
  if (!user) return null;

  const parsed = JSON.parse(user);

  return {
    ...parsed,
    currencySymbol: getCurrencySymbol(parsed.currency_Code)
  };
}
