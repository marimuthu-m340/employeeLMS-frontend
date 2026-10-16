import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

const BASE_URL = `${API_BASE_URL}/api/profile`;

export const getProfile = (id) => {
  return axios.get(`${BASE_URL}/${id}`);
};

export const updateProfile = (id, data) => {
  return axios.put(`${BASE_URL}/${id}`, data);
};
export const changePassword = (data) => {
  const token = localStorage.getItem("token");

  return axios.put(
`${API_BASE_URL}/api/settings/change-password`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const updateTheme = (theme) => {
  const token = localStorage.getItem("token");

  return axios.put(
`${API_BASE_URL}/api/settings/theme`,
    { theme },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
