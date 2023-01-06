import axios from "axios";
import { API_URL } from "./config";

export const createTodoRequest = async (todo, shoppingListId, token) => {
  const response = await axios.post(
    `${API_URL}/todos`,
    {
      name: todo.name,
      amount: todo.amount,
      grammage: todo.grammage,
      completed: false,
      shoppingListId: shoppingListId,
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
