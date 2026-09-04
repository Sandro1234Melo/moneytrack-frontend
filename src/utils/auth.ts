import { getCurrencySymbol } from "./currency";

export function normalizeUser(raw: any) {
  if (!raw) return null;

  const token = raw.token ?? raw.Token;

  const currencyCode =
    raw.currencyCode ??
    raw.currency_Code ??
    raw.currency_code ??
    "EUR";

  const countryCode =
    raw.countryCode ??
    raw.country_Code ??
    raw.country_code ??
    "PT";

  const fullName =
    raw.fullName ??
    raw.full_Name ??
    raw.full_name ??
    raw.name ??
    "Usuário";

  const profileImageUrl =
    raw.profileImageUrl ??
    raw.profile_Image_Url ??
    raw.profile_image_url ??
    "";

  return {
    ...raw,
    token,
    fullName,
    full_Name: raw.full_Name ?? fullName,
    full_name: raw.full_name ?? fullName,
    profileImageUrl,
    profile_Image_Url: profileImageUrl,
    profile_image_url: profileImageUrl,
    countryCode,
    country_Code: raw.country_Code ?? countryCode,
    country_code: raw.country_code ?? countryCode,
    currencyCode,
    currency_Code: raw.currency_Code ?? currencyCode,
    currency_code: raw.currency_code ?? currencyCode,
    currencySymbol: getCurrencySymbol(currencyCode)
  };
}

export function getLoggedUser() {
  const user = sessionStorage.getItem("user");
  if (!user) return null;

  try {
    return normalizeUser(JSON.parse(user));
  } catch {
    return null;
  }
}
