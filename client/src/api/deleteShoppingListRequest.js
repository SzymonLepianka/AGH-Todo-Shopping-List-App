import { API_URL } from "./config"

export default (shoppingList, token) => {
    return fetch(`${API_URL}/shoppingLists/${shoppingList._id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
        }
    })
}