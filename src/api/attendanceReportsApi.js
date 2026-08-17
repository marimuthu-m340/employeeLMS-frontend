import axios from "axios";

const API_URL = "http://localhost:5000/api/attendance-reports";

export const getAttendanceReports = async () => {
  try {
    const response = await axios.get(API_URL);

    return response.data;
  } catch (error) {
    console.error("Attendance Reports API Error:", error);
    throw error;
  }
};