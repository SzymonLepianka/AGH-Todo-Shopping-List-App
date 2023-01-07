import axios from "axios";
import { API_URL } from "./config";

export const updateTodoRequest = async (todo, token) => {
  const response = await axios.put(
    `${API_URL}/todos/${todo._id}`,
    {
      name: todo.name,
      completed: todo.completed,
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
