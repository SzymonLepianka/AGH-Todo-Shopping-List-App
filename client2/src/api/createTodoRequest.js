import { API_URL } from "./config"

export default (todo, shoppingListId, token) => {
    return fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            name: todo.name,
            amount: todo.amount,
            grammage: todo.grammage,
            completed: false,
            shoppingListId: shoppingListId
        })
    })
        .then(response => response.json())
}