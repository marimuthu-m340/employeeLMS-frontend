import axios from "axios";

const departmentApi = axios.create({
  baseURL: "http://localhost:5000/api/departments",
});

export const getDepartments = async () => {
  const response = await departmentApi.get("/");
  return response.data;
};

export default departmentApi;