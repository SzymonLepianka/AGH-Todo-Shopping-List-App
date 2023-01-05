import { API_URL } from "./config"

export default (username, password) => {
    return fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    })
        .then(response => {
            if (response.ok) {
                // console.log(response)
                return response.statusText
            } else {
                throw new Error('Register failed')
            }
        })
}