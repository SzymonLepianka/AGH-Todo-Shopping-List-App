import { API_URL } from "./config"

export default (shoppingList, token) => {
    return fetch(`${API_URL}/shoppingLists`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            name: shoppingList.name,
            date: shoppingList.date,
            completed: false
        })
    })
        .then(response => response.json())
}