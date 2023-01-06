import { API_URL } from "./config";

export default (shoppingList, token) => {
  return fetch(`${API_URL}/shoppingLists/${shoppingList._id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: shoppingList.name,
      completed: shoppingList.completed,
    }),
  }).then((response) => response.json());
};
