import axios from "axios";
import { API_URL } from "./config";

export const registerRequest = async (username, password) => {
  const response = await axios.post(
    `${API_URL}/register`,
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
  if (response.status === 201) {
    return response.data;
  } else {
    throw new Error("Register failed");
  }
};
