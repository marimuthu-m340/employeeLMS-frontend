import axios from "axios";

const managerApi = axios.create({
  baseURL: "http://localhost:5000/api/managers",
  headers: {
    "Content-Type": "application/json",
  },
});

// Token automatically send
managerApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getManagers = async () => {
  const response = await managerApi.get("/");
  return response.data;
};  

export const createManager = async (managerData) => {
  const response = await managerApi.post("/", managerData);
  return response.data;
};

export const getManagerEmployees = async () => {
  const response = await managerApi.get("/employees");
  return response.data;
};

export const getManagerEmployeeById = async (id) => {
  const response = await managerApi.get(`/employees/${id}`);
  return response.data;
};

export const getManagerDashboard = async (managerId) => {
  const response = await managerApi.get(`/${managerId}/dashboard`);
  return response.data;
};

export default managerApi;