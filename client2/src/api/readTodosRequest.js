import { API_URL } from "./config"

export default (shoppingListId, token) => {
    // zwraca wszystkie zakupy dla danej listy (danego shoppingListId)
    return fetch(`${API_URL}/todos/${shoppingListId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
        }
    })
        .then(response => response.json())
}