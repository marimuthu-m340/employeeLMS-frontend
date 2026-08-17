import axios from "axios";

const managerAttendanceApi = axios.create({
  baseURL: "http://localhost:5000/api/manager-attendance",
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= GET =================
export const getManagerAttendance = async () => {
  const response = await managerAttendanceApi.get("/");
  return response.data;
};

// ================= GET REPORTS (all managers, or one manager if managerId passed) =================
export const getManagerAttendanceReports = async (managerId) => {
  const url = managerId ? `/?manager_id=${managerId}` : "/";
  const response = await managerAttendanceApi.get(url);
  return response.data;
};

// ================= CREATE =================
export const createManagerAttendance = async (attendance) => {
  const response = await managerAttendanceApi.post("/", attendance);
  return response.data;
};

// ================= UPDATE =================
export const updateManagerAttendance = async (id, attendance) => {
  const response = await managerAttendanceApi.put(`/${id}`, attendance);
  return response.data;
};

// ================= DELETE =================
export const deleteManagerAttendance = async (id) => {
  const response = await managerAttendanceApi.delete(`/${id}`);
  return response.data;
};

export default managerAttendanceApi;