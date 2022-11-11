import { API_URL } from "./config"

export default (shoppingList, token) => {
    return fetch(`${API_URL}/shoppingLists`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            text: shoppingList.text,
            date: shoppingList.date,
            completed: false
        })
    })
        .then(response => response.json())
}