import axios from "axios";
import { API_URL } from "./config";

export const readShoppingListsRequest = async (token) => {
  const response = await axios.get(`${API_URL}/shoppingLists`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (response.status === 200) {
    return response.data;
  }
};
