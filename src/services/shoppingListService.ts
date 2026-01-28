import api from "../api/axios";

export const getShoppingListsByUser = (userId: number) => {
  return api.get(`/ShoppingLists/user/${userId}`);
};

export const createShoppingList = (userId: number, name: string) => {
  return api.post("/shoppinglists", {
    userId,
    name,
    locationId: null,
    plannedDate: null,
    items: []
  });
};

export const deleteShoppingList = (id: number) => {
  return api.delete(`/ShoppingLists/${id}`);
};

export const convertShoppingList = (id: number) => {
  return api.post(`/ShoppingLists/${id}/convert`);
};
