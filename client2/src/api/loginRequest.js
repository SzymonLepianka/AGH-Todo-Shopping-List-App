import { API_URL } from "./config";
import axios from "axios";

export const loginRequest = (username, password) => {
  return axios
    .post(
      `${API_URL}/login`,
      {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Login failed");
      }
    });
};
