import axios from "axios";
import { API_URL } from "./config";

export const updateShoppingListRequest = async (shoppingList, token) => {
  const response = await axios.put(
    `${API_URL}/shoppingLists/${shoppingList._id}`,
    {
      name: shoppingList.name,
      completed: shoppingList.completed,
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
