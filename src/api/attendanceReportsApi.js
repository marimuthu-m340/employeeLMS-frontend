import axios from "axios";

const API_URL = "https://employeelms-backend-1.onrender.com/api/attendance-reports";

export const getAttendanceReports = async () => {
  try {
    const response = await axios.get(API_URL);

    return response.data;
  } catch (error) {
    console.error("Attendance Reports API Error:", error);
    throw error;
  }
};