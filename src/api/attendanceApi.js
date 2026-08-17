import axios from "axios";

const attendanceApi = axios.create({
  baseURL: "http://localhost:5000/api/attendance",
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= GET MY ATTENDANCE =================
export const getMyAttendance = async () => {
  const token = localStorage.getItem("token");

  const response = await attendanceApi.get("/my-attendance", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ================= GET ALL ATTENDANCE =================
export const getAttendance = async () => {
  const response = await attendanceApi.get("/");
  return response.data;
};

// ================= CREATE =================
export const createAttendance = async (attendance) => {
  const response = await attendanceApi.post("/", attendance);
  return response.data;
};

// ================= UPDATE =================
export const updateAttendance = async (id, attendance) => {
  const response = await attendanceApi.put(`/${id}`, attendance);
  return response.data;
};

// ================= DELETE =================
export const deleteAttendance = async (id) => {
  const response = await attendanceApi.delete(`/${id}`);
  return response.data;
};

export const getAdminAttendanceSummary = async () => {
  const response = await axios.get(
    "http://localhost:5000/api/attendance/admin-summary"
  );

  return response.data;
};


export default attendanceApi;