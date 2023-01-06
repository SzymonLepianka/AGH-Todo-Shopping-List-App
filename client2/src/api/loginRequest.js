import { API_URL } from "./config";
import axios from "axios";

export const loginRequest = async (username, password) => {
  const response = await axios.post(
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
  );
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Login failed");
  }
};
