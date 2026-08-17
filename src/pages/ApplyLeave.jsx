import React, { useState, useEffect } from "react";
import "./ApplyLeave.css";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import { getLeaveTypes, applyLeave } from "../api/leaveApi";
import { getMyProfile } from "../api/employeeApi";
import { FaSearch, FaBell } from "react-icons/fa";

const ApplyLeave = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    leave_type_id: "",
    from_date: "",
    to_date: "",
    reason: "",
    emergency_contact: "",
  });
  const [totalDays, setTotalDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("apply");

  // Fetch Leave Types on mount
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const data = await getLeaveTypes();
        if (data.success) {
          setLeaveTypes(data.data);
        } else {
          toast.error("Failed to load leave types");
        }
      } catch (err) {
        toast.error("Server error while loading leave types");
      }
    };

    fetchLeaveTypes();
  }, []);

  // Fetch My Profile (for Department) on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        console.log("MY PROFILE:", data);

        if (data.success) {
          setProfile(data.data);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    if (storedUser?.role === "EMPLOYEE") {
      fetchProfile();
    }
  }, []);

  // Calculate Total Days whenever from_date/to_date changes
  useEffect(() => {
    if (formData.from_date && formData.to_date) {
      const from = new Date(formData.from_date);
      const to = new Date(formData.to_date);

      if (to >= from) {
        const diffTime = to - from;
        const days = diffTime / (1000 * 60 * 60 * 24) + 1;
        setTotalDays(days);
      } else {
        setTotalDays(0);
      }
    } else {
      setTotalDays(0);
    }
  }, [formData.from_date, formData.to_date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      leave_type_id: "",
      from_date: "",
      to_date: "",
      reason: "",
      emergency_contact: "",
    });
    setTotalDays(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.leave_type_id) {
      toast.error("Please select a leave type");
      return;
    }

    if (!formData.from_date || !formData.to_date) {
      toast.error("From Date and To Date are required");
      return;
    }

    if (totalDays <= 0) {
      toast.error("To Date cannot be before From Date");
      return;
    }

    setLoading(true);

    try {
      const data = await applyLeave(formData);

      if (data.success) {
        alert("Leave applied successfully!");
        handleReset();
      } else {
        alert(data.message || "Failed to submit leave request");
      }
    } catch (err) {
      console.error("Apply Leave Error:", err);
      alert(err.response?.data?.message || "Server error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const sidebarRole =
    user?.role === "SUPER_ADMIN"
      ? "admin"
      : user?.role === "HR"
      ? "hr"
      : user?.role === "MANAGER" || user?.role === "MANAGER_ADMIN"
      ? "manager"
      : "employee";

  return (
    <>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        role={sidebarRole}
      />

      <main className="apply-leave-page">
        <div className="apply-leave-container">
          {/* Header */}
          <div className="page-header">
            <h2>Apply Leave</h2>
            <p>Submit your leave request</p>
          </div>

          <div className="leave-tabs">
            <button
              className={activeTab === "apply" ? "active-tab" : ""}
              onClick={() => setActiveTab("apply")}
              type="button"
            >
              Apply Leave
            </button>

            <button
              className={activeTab === "calendar" ? "active-tab" : ""}
              onClick={() => setActiveTab("calendar")}
              type="button"
            >
              Leave Calendar
            </button>

            <button
              className={activeTab === "lop" ? "active-tab" : ""}
              onClick={() => setActiveTab("lop")}
              type="button"
            >
              LOP Rules
            </button>
          </div>

          {/* Employee Information */}
          <div className="leave-card">
            <h3>
              {user?.role === "EMPLOYEE"
                ? "Employee Information"
                : user?.role === "MANAGER" || user?.role === "MANAGER_ADMIN"
                ? "Manager Information"
                : user?.role === "HR"
                ? "HR Information"
                : "Super Admin Information"}
            </h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={user?.username || ""} readOnly />
              </div>

              <div className="form-group">
                <label>ID</label>
                <input
                  type="text"
                  value={user?.employeeId || user?.managerId || user?.id || ""}
                  readOnly
                />
              </div>

              {user?.role === "EMPLOYEE" && (
                <div className="form-group">
                  <label>Reporting Manager</label>
                  <input type="text" value={profile?.manager_name || "-"} readOnly />
                </div>
              )}

              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  value={
                    user?.role === "EMPLOYEE"
                      ? profile?.department_name || "-"
                      : user?.department || "-"
                  }
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Designation</label>
                <input
                  value={
                    user?.role === "EMPLOYEE"
                      ? profile?.designation || "-"
                      : user?.designation || "-"
                  }
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Leave Details */}
          {activeTab === "apply" && (
            <form onSubmit={handleSubmit}>
              <div className="leave-card">
                <h3>Leave Details</h3>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Leave Type</label>
                    <select
                      name="leave_type_id"
                      value={formData.leave_type_id}
                      onChange={handleChange}
                    >
                      <option value="">Select Leave Type</option>
                      {leaveTypes.map((lt) => (
                        <option key={lt.id} value={lt.id}>
                          {lt.leave_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Total Days</label>
                    <input type="text" value={totalDays} readOnly />
                  </div>

                  <div className="form-group">
                    <label>From Date</label>
                    <input
                      type="date"
                      name="from_date"
                      value={formData.from_date}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>To Date</label>
                    <input
                      type="date"
                      name="to_date"
                      value={formData.to_date}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Reason</label>
                  <textarea
                    rows="5"
                    name="reason"
                    placeholder="Enter leave reason..."
                    value={formData.reason}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Emergency Contact Number</label>
                  <input
                    type="tel"
                    name="emergency_contact"
                    placeholder="Enter mobile number"
                    value={formData.emergency_contact}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="button-group">
                <button type="button" className="reset-btn" onClick={handleReset}>
                  Reset
                </button>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Submitting..." : "Apply Leave"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "calendar" && (
            <div className="leave-card">
              <h3>Leave Calendar</h3>

              <div className="calendar-placeholder">
                <h2>📅 Leave Calendar</h2>

                <p>Here you can view:</p>

                <ul>
                  <li>🟢 Approved Leaves</li>
                  <li>🟡 Pending Leaves</li>
                  <li>🔴 Rejected Leaves</li>
                  <li>🏖 Holidays</li>
                  <li>📆 Weekly Offs</li>
                </ul>

                <p style={{ marginTop: "20px" }}>
                  Calendar UI will be integrated here.
                </p>
              </div>
            </div>
          )}

          {activeTab === "lop" && (
            <div className="leave-card">
              <h3>LOP (Loss of Pay) Rules</h3>

              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                      Attendance Status
                    </th>
                    <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                      LOP Deduction
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>Present</td>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>No LOP</td>
                  </tr>

                  <tr>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>Approved Leave</td>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                      No LOP (if leave balance available)
                    </td>
                  </tr>

                  <tr>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>Half Day</td>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>0.5 Day LOP</td>
                  </tr>

                  <tr>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>Absent</td>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>1 Day LOP</td>
                  </tr>

                  <tr>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                      Holiday / Weekly Off
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>No LOP</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default ApplyLeave;