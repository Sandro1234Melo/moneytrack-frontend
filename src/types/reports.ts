export type ReportFilters = {
  from: string;
  to: string;
  categoryId: string;
  locationId: string;
  paymentMethod: string;
};

export type ReportLookupOption = {
  id: number;
  name: string;
};

export type CategoryDistribution = {
  name: string;
  value: number;
};

export type MonthlyExpense = {
  label: string;
  total: number;
};

export type PaymentMethodTotal = {
  method: number;
  total: number;
};
