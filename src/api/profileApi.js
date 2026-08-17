import axios from "axios";

const BASE_URL = "http://localhost:5000/api/profile";

export const getProfile = (id) => {
  return axios.get(`${BASE_URL}/${id}`);
};

export const updateProfile = (id, data) => {
  return axios.put(`${BASE_URL}/${id}`, data);
};
export const changePassword = (data) => {
  const token = localStorage.getItem("token");

  return axios.put(
    "http://localhost:5000/api/settings/change-password",
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
    "http://localhost:5000/api/settings/theme",
    { theme },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
