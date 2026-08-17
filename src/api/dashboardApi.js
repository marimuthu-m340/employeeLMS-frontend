  import axios from "axios";

  const dashboardApi = axios.create({
    baseURL: "http://localhost:5000/api/dashboard",
  });

  export const getDashboardStats = async () => {
    const response = await dashboardApi.get("/stats");
    return response.data;
  };

  export default dashboardApi;