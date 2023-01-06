import axios from "axios";
import { API_URL } from "./config";

export const createShoppingListRequest = async (shoppingList, token) => {
  const response = await axios.post(
    `${API_URL}/shoppingLists`,
    {
      name: shoppingList.name,
      date: shoppingList.date,
      completed: false,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status === 200) {
    return response.data;
  }
};
