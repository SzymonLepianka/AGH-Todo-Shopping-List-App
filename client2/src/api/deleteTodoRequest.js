import axios from "axios";
import { API_URL } from "./config";

export const deleteTodoRequest = async (todo, token) => {
  await axios.delete(`${API_URL}/todos/${todo._id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
