import api from "../api/axios";

export type ShoppingListStatus = "Draft" | "InProgress" | "Completed" | "Converted" | string;

export type ShoppingListItem = {
  id: number;
  description: string;
  categoryId: number;
  categoryName: string;
  quantity: number;
  price: number | null;
  total: number;
  checked: boolean;
};

export type ShoppingList = {
  id: number;
  userId: number;
  name: string;
  locationId: number | null;
  locationName: string | null;
  plannedDate: string;
  status: ShoppingListStatus;
  createdAt: string;
  totalItems: number;
  checkedItems: number;
  estimatedTotal: number;
  progressPercent: number;
  items: ShoppingListItem[];
};

export type ShoppingListCreatePayload = {
  userId: number;
  name: string;
  locationId: number | null;
  plannedDate: string | null;
  items: Array<{
    description: string;
    categoryId: number;
    quantity: number;
    price: number | null;
    checked: boolean;
  }>;
};

export type ShoppingListItemPayload = {
  description: string;
  categoryId: number;
  quantity: number;
  price: number | null;
  checked: boolean;
};

export const getShoppingListsByUser = (userId: number, params?: { search?: string; status?: string }) => {
  return api.get<ShoppingList[]>(`/shoppinglists/user/${userId}`, { params });
};

export const getShoppingListSummary = (userId: number) => {
  return api.get(`/shoppinglists/user/${userId}/summary`);
};

export const createShoppingList = (payload: ShoppingListCreatePayload) => {
  return api.post<ShoppingList>("/shoppinglists", payload);
};

export const updateShoppingList = (id: number, payload: { name: string; locationId: number | null; plannedDate: string | null }) => {
  return api.put<ShoppingList>(`/shoppinglists/${id}`, payload);
};

export const deleteShoppingList = (id: number) => {
  return api.delete(`/shoppinglists/${id}`);
};

export const executeShoppingList = (id: number) => {
  return api.post<ShoppingList>(`/shoppinglists/${id}/execute`);
};

export const convertShoppingList = (id: number, payload: { paymentMethod: number; locationId: number | null }) => {
  return api.post(`/shoppinglists/${id}/convert`, payload);
};

export const addShoppingListItem = (listId: number, payload: ShoppingListItemPayload) => {
  return api.post<ShoppingList>(`/shoppinglists/${listId}/items`, payload);
};

export const updateShoppingListItem = (listId: number, itemId: number, payload: ShoppingListItemPayload) => {
  return api.put<ShoppingList>(`/shoppinglists/${listId}/items/${itemId}`, payload);
};

export const checkShoppingListItem = (listId: number, itemId: number, checked: boolean) => {
  return api.patch<ShoppingList>(`/shoppinglists/${listId}/items/${itemId}/check`, { checked });
};

export const deleteShoppingListItem = (listId: number, itemId: number) => {
  return api.delete<ShoppingList>(`/shoppinglists/${listId}/items/${itemId}`);
};
