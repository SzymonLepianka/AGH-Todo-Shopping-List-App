import axios from "axios";
import { API_URL } from "./config";

export const deleteShoppingListRequest = async (shoppingList, token) => {
  await axios.delete(`${API_URL}/shoppingLists/${shoppingList._id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
