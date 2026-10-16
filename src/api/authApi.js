import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

export const loginUser = async (email, password) => {
  const response = await axios.post(
`${API_BASE_URL}/api/auth/login`,    {
      email,
      password,
    }
  );

  return response;
};