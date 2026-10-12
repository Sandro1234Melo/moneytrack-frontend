import { getCurrencySymbol } from "./currency";

export type SessionUser = {
  id?: number;
  token?: string;
  email?: string;
  fullName?: string;
  full_Name?: string;
  full_name?: string;
  name?: string;
  countryCode?: string;
  country_Code?: string;
  country_code?: string;
  currencyCode?: string;
  currency_Code?: string;
  currency_code?: string;
  currencySymbol?: string;
  profileImageUrl?: string;
  profile_Image_Url?: string;
  profile_image_url?: string;
  theme?: string;
  accent_Color?: string;
  accent_color?: string;
  compact_Mode?: boolean;
  compact_mode?: boolean;
  interface_Animations?: boolean;
  interface_animations?: boolean;
  notify_Goal_80?: boolean;
  notify_goal_80?: boolean;
  notify_Spending_Increase?: boolean;
  notify_spending_increase?: boolean;
  notify_Pending_Lists?: boolean;
  notify_pending_lists?: boolean;
  [key: string]: unknown;
};

export function normalizeUser(raw: unknown): SessionUser | null {
  if (!raw || typeof raw !== "object") return null;
  const user = raw as SessionUser;

  const currencyCode =
    user.currencyCode ??
    user.currency_Code ??
    user.currency_code ??
    "EUR";

  const countryCode =
    user.countryCode ??
    user.country_Code ??
    user.country_code ??
    "PT";

  const fullName =
    user.fullName ??
    user.full_Name ??
    user.full_name ??
    user.name ??
    "Usuário";

  return {
    ...user,
    fullName,
    full_Name: user.full_Name ?? fullName,
    full_name: user.full_name ?? fullName,
    countryCode,
    country_Code: user.country_Code ?? countryCode,
    country_code: user.country_code ?? countryCode,
    currencyCode,
    currency_Code: user.currency_Code ?? currencyCode,
    currency_code: user.currency_code ?? currencyCode,
    currencySymbol: getCurrencySymbol(currencyCode)
  };
}

export function getLoggedUser(): SessionUser | null {
  const user = sessionStorage.getItem("user");
  if (!user) return null;

  try {
    return normalizeUser(JSON.parse(user));
  } catch {
    return null;
  }
}
