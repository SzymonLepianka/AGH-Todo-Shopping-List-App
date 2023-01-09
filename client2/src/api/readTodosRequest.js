import axios from "axios";
import { API_URL } from "./config";

export const readTodosRequest = async (shoppingListId, token) => {
  const response = await axios.get(`${API_URL}/todos/${shoppingListId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (response.status === 200) {
    return response.data;
  }
};
