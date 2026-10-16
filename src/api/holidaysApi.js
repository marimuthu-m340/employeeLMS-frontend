import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

const API_URL = `${API_BASE_URL}/api/holidays`;

// ================= GET =================
export const getHolidays = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// ================= CREATE =================
export const createHoliday = async (holiday) => {
  const response = await axios.post(API_URL, holiday);
  return response.data;
};

// ================= UPDATE =================
export const updateHoliday = async (id, holiday) => {
  const response = await axios.put(`${API_URL}/${id}`, holiday);
  return response.data;
};

// ================= DELETE =================
export const deleteHoliday = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};