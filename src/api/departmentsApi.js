import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

const departmentApi = axios.create({
 baseURL: `${API_BASE_URL}/api/departments`,
});

export const getDepartments = async () => {
  const response = await departmentApi.get("/");
  return response.data;
};

export default departmentApi;