export type NamedOption = {
  id: number;
  name: string;
};

export type PurchaseItem = {
  id?: number;
  description: string;
  categoryId: number | string;
  categoryName?: string;
  quantity: number;
  price?: number;
  unitPrice?: number;
  amount?: number;
};

export type Purchase = {
  id: number;
  date: string;
  locationId?: number | null;
  locationName?: string | null;
  paymentMethod?: number;
  paymentMethodName?: string;
  amount?: number;
  items: PurchaseItem[];
};

export type PurchasePayload = {
  date: string;
  locationId: number;
  paymentMethod: number;
  items: Array<{
    description: string;
    categoryId: number;
    quantity: number;
    price: number;
  }>;
};

export type ReceiptScanResult = {
  date: string;
  merchant: string;
  items: Array<{ description: string; quantity: number; price: number; suggestedCategory: string }>;
};
