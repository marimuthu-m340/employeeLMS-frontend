  import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

  const dashboardApi = axios.create({
baseURL: `${API_BASE_URL}/api/dashboard`,
  });

  export const getDashboardStats = async () => {
    const response = await dashboardApi.get("/stats");
    return response.data;
  };

  export default dashboardApi;