import React, { useEffect, useState } from "react";
import { FaCalendarCheck, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import managerAttendanceApi, {
  getManagerAttendance,
  createManagerAttendance,
} from "../../api/managerAttendanceApi";
import managersApi from "../../api/managersApi";
import Sidebar from "../../components/Sidebar";
import "./HrAttendance.css";

const HrAttendance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [managers, setManagers] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [attendanceForm, setAttendanceForm] = useState({
    managerId: "",
    attendanceDate: "",
    status: "PRESENT",
    remarks: "",
  });

  // =====================================================
  // FETCH MANAGERS
  // =====================================================

  const fetchManagers = async () => {
    try {
      const response = await managersApi.get("/");

      const managerList = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setManagers(managerList);
    } catch (error) {
      console.error("FETCH MANAGERS ERROR:", error.response?.data || error.message);
      setManagers([]);
    }
  };

  // =====================================================
  // FETCH ATTENDANCE HISTORY
  // =====================================================

const fetchAttendance = async () => {
  try {
    setLoading(true);
    setError("");

    const result = await getManagerAttendance();

    if (result.success) {
      setAttendanceList(result.data || []);
    } else {
      setAttendanceList([]);
      setError(result.message || "Failed to fetch attendance");
    }
  } catch (error) {
    console.error(
      "FETCH ATTENDANCE ERROR:",
      error.response?.data || error.message
    );

    setAttendanceList([]);
    setError("Failed to fetch attendance");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchManagers();
    fetchAttendance();
  }, []);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAttendanceForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setAttendanceForm({
      managerId: "",
      attendanceDate: "",
      status: "PRESENT",
      remarks: "",
    });
  };

  // =====================================================
  // MARK ATTENDANCE
  // =====================================================

  const handleMarkAttendance = async (e) => {
    e.preventDefault();

    if (!attendanceForm.managerId) {
      alert("Please select a manager");
      return;
    }
    if (!attendanceForm.attendanceDate) {
      alert("Please select a date");
      return;
    }

    try {
      setFormLoading(true);
      setError("");

      const loggedInUser = JSON.parse(localStorage.getItem("user"));

      const payload = {
  manager_id: attendanceForm.managerId,
  attendance_date: attendanceForm.attendanceDate,
  status: attendanceForm.status,
  remarks: attendanceForm.remarks.trim() || null,
  marked_by: loggedInUser?.id || null,
};
   const response = await createManagerAttendance(payload);

      if (response && response.success === true) {
        alert("Attendance Marked Successfully");
        resetForm();
        await fetchAttendance();
      } else {
        alert(response?.message || "Failed to mark attendance");
      }
    } catch (error) {
      console.error("MARK ATTENDANCE ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to mark attendance");
    } finally {
      setFormLoading(false);
    }
  };

  // =====================================================
  // SUMMARY COUNTS
  // =====================================================

  const totalPresent = attendanceList.filter((a) => a.status === "PRESENT").length;
  const totalAbsent = attendanceList.filter((a) => a.status === "ABSENT").length;
  const totalLate = attendanceList.filter((a) => a.status === "LATE").length;

  const getManagerName = (record) => {
    if (!record) return "Unknown";

    // If attendance record already contains a string name, use it.
    const directName =
      record.manager_name ||
      record.managerName ||
      (typeof record.manager === "string" ? record.manager : null);
    if (directName && String(directName).trim()) {
      return String(directName).trim();
    }

    // Try to resolve by manager id fields.
    const managerId =
      record.manager_id ??
      record.managerId ??
      record.manager?._id ??
      record.manager?.id ??
      record.marked_by;

    if (managerId !== undefined && managerId !== null && String(managerId).trim()) {
      const manager = managers.find(
        (m) =>
          String(m.id) === String(managerId) ||
          String(m._id) === String(managerId) ||
          String(m.manager_id) === String(managerId) ||
          String(m.employee_id) === String(managerId)
      );

      if (manager) {
        return manager.full_name || manager.name || manager.manager_name || "Unknown";
      }
    }

    if (record.manager && typeof record.manager === "object") {
      return (
        record.manager.full_name || record.manager.name || record.manager.manager_name || "Unknown"
      );
    }

    return record.manager_name || record.managerName || "Unknown";
  };

  return (
    <div className="hrattendance-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} role="hr" />
       <main className="hrattendance-main">
        <div className="hrattendance-content">
          {/* ===================== SUMMARY CARDS ===================== */}

          <div className="hrattendance-summary-grid">
            <div className="hrattendance-summary-card">
              <div className="hrattendance-summary-icon blue">
                <FaCalendarCheck />
              </div>
              <div>
                <p>Total Records</p>
                <h2>{attendanceList.length}</h2>
              </div>
            </div>

            <div className="hrattendance-summary-card">
              <div className="hrattendance-summary-icon green">
                <FaCheckCircle />
              </div>
              <div>
                <p>Present</p>
                <h2>{totalPresent}</h2>
              </div>
            </div>

            <div className="hrattendance-summary-card">
              <div className="hrattendance-summary-icon red">
                <FaTimesCircle />
              </div>
              <div>
                <p>Absent</p>
                <h2>{totalAbsent}</h2>
              </div>
            </div>

            <div className="hrattendance-summary-card">
              <div className="hrattendance-summary-icon orange">
                <FaCalendarCheck />
              </div>
              <div>
                <p>Late</p>
                <h2>{totalLate}</h2>
              </div>
            </div>
          </div>

          {/* ===================== MARK ATTENDANCE FORM ===================== */}

          <div className="hrattendance-card">
            <h3>Mark Attendance</h3>

            <form className="hrattendance-form" onSubmit={handleMarkAttendance}>
              <div className="hrattendance-form-field">
                <label>Manager</label>
                <select
                  name="managerId"
                  value={attendanceForm.managerId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Manager</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.full_name || manager.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="hrattendance-form-field">
                <label>Date</label>
                <input
                  type="date"
                  name="attendanceDate"
                  value={attendanceForm.attendanceDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="hrattendance-form-field">
                <label>Status</label>
                <select
                  name="status"
                  value={attendanceForm.status}
                  onChange={handleInputChange}
                >
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                  <option value="LATE">Late</option>
                </select>
              </div>

              <div className="hrattendance-form-field">
                <label>Remarks (optional)</label>
                <input
                  type="text"
                  name="remarks"
                  placeholder="Enter remarks"
                  value={attendanceForm.remarks}
                  onChange={handleInputChange}
                />
              </div>

              <button
                type="submit"
                className="hrattendance-save-btn"
                disabled={formLoading}
              >
                {formLoading ? "Saving..." : "Save Attendance"}
              </button>
            </form>
          </div>

          {/* ===================== ATTENDANCE HISTORY ===================== */}

          <div className="hrattendance-card">
            <h3>Attendance History</h3>

            {loading && (
              <div style={{ textAlign: "center", padding: "30px" }}>
                Loading attendance...
              </div>
            )}

            {!loading && error && (
              <div style={{ textAlign: "center", padding: "30px", color: "red" }}>
                <p>{error}</p>
                <button type="button" onClick={fetchAttendance}>
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="hrattendance-table-wrapper">
                <table className="hrattendance-table">
                  <thead>
                    <tr>
                      <th>Manager</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceList.length > 0 ? (
                      attendanceList.map((record) => (
                        <tr key={record.id}>
                        <td>{getManagerName(record)}</td>
                        <td>{record.attendance_date}</td>
                        <td>
                          <span
                            className={`hrattendance-status status-${record.status?.toLowerCase()}`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td>{record.remarks || "-"}</td>
                      </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="hrattendance-no-data">
                          No attendance records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HrAttendance;