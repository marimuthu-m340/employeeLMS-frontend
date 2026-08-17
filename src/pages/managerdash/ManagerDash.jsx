import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaClipboardList,
} from "react-icons/fa";

import Sidebar from "../../components/Sidebar";
import { getManagerDashboard } from "../../api/managersApi";// path adjust// adjust path
import { getHolidays } from "../../api/holidaysApi"; // FIX: was missing on this dashboard
import "./ManagerDash.css";

const ManagerDash = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [summary, setSummary] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    pendingLeaves: 0,
  });
  const [attendanceOverview, setAttendanceOverview] = useState({
    present: 0,
    absent: 0,
    onLeave: 0,
  });
  const [teamStats, setTeamStats] = useState({
    activeEmployees: 0,
    onLeave: 0,
    totalMembers: 0,
  });
  const [leaveRequests, setLeaveRequests] = useState([]);

  // FIX: holidays state was never declared on this dashboard
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        // manager id login panna store panna user object la irundhu edukurom
        const user = JSON.parse(localStorage.getItem("user"));
        const managerId = user?.id;

        if (!managerId) {
          setError("Manager not logged in");
          setLoading(false);
          return;
        }
const res = await getManagerDashboard(managerId);

setSummary(res.summary);
setAttendanceOverview(res.attendanceOverview);
setTeamStats(res.teamStats);
setLeaveRequests(res.leaveRequests);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // FIX: this whole effect was missing on ManagerDash — same pattern
  // used in EmployeeDash.jsx, view-only here (no add/edit/delete UI).
  useEffect(() => {
    const loadHolidays = async () => {
      try {
        const result = await getHolidays();

        if (result.success) {
          setHolidays(result.data);
        }
      } catch (error) {
        console.error("Holiday Fetch Error:", error);
      }
    };

    loadHolidays();
  }, []);

  return (
    <div className="managerdash-layout">
      <Sidebar
        role="manager"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="managerdash-main">

        <div className="managerdash-content">
          {loading ? (
            <p className="managerdash-loading">Loading dashboard...</p>
          ) : error ? (
            <p className="managerdash-error">{error}</p>
          ) : (
            <>
              <div className="managerdash-summary-grid">
                <div className="managerdash-summary-card">
                  <div className="managerdash-summary-icon blue">
                    <FaUsers />
                  </div>
                  <div>
                    <p>Total Employees</p>
                    <h2>{summary.totalEmployees}</h2>
                  </div>
                </div>

                <div className="managerdash-summary-card">
                  <div className="managerdash-summary-icon green">
                    <FaUserCheck />
                  </div>
                  <div>
                    <p>Present Today</p>
                    <h2>{summary.presentToday}</h2>
                  </div>
                </div>

                <div className="managerdash-summary-card">
                  <div className="managerdash-summary-icon red">
                    <FaUserTimes />
                  </div>
                  <div>
                    <p>Absent Today</p>
                    <h2>{summary.absentToday}</h2>
                  </div>
                </div>

                <div className="managerdash-summary-card">
                  <div className="managerdash-summary-icon orange">
                    <FaClipboardList />
                  </div>
                  <div>
                    <p>Pending Leaves</p>
                    <h2>{summary.pendingLeaves}</h2>
                  </div>
                </div>
              </div>

              <div className="managerdash-row">
                <div className="managerdash-card">
                  <h3>Attendance Overview</h3>
                  <div className="managerdash-overview-list">
                    <div className="managerdash-overview-item">
                      <span>Present</span>
                      <strong className="text-green">{attendanceOverview.present}</strong>
                    </div>
                    <div className="managerdash-overview-item">
                      <span>Absent</span>
                      <strong className="text-red">{attendanceOverview.absent}</strong>
                    </div>
                    <div className="managerdash-overview-item">
                      <span>On Leave</span>
                      <strong className="text-orange">{attendanceOverview.onLeave}</strong>
                    </div>
                  </div>
                </div>

                <div className="managerdash-card">
                  <h3>Team Overview</h3>
                  <div className="managerdash-overview-list">
                    <div className="managerdash-overview-item">
                      <span>Active Employees</span>
                      <strong className="text-green">{teamStats.activeEmployees}</strong>
                    </div>
                    <div className="managerdash-overview-item">
                      <span>Employees On Leave</span>
                      <strong className="text-orange">{teamStats.onLeave}</strong>
                    </div>
                    <div className="managerdash-overview-item">
                      <span>Total Team Members</span>
                      <strong>{teamStats.totalMembers}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="managerdash-card">
                <h3>Employee Leave Requests</h3>
                <div className="managerdash-table-wrapper">
                  <table className="managerdash-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Reason</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests.length > 0 ? (
                        leaveRequests.map((req) => (
                          <tr key={req.id}>
                            <td>{req.employeeName}</td>
                            <td>{req.fromDate}</td>
                            <td>{req.toDate}</td>
                            <td>{req.reason}</td>
                            <td>
                              <span
                                className={`managerdash-status ${
                                  req.status === "Pending"
                                    ? "status-pending"
                                    : req.status === "Approved"
                                    ? "status-approved"
                                    : "status-rejected"
                                }`}
                              >
                                {req.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="managerdash-no-data">
                            No Leave Requests
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FIX: Upcoming Holidays section — view only, no add/edit/delete.
                  Only SUPER_ADMIN should manage holidays; this dashboard
                  only reads and displays them. */}
              <div className="managerdash-card">
                <h3>Upcoming Holidays</h3>

                <div className="holiday-list">
                  {holidays.length > 0 ? (
                    holidays.map((h) => {
                      const date = new Date(h.holiday_date);

                      return (
                        <div className="holiday-item" key={h.id}>
                          <div className="holiday-date">
                            <strong>{date.getDate()}</strong>
                            <span>
                              {date.toLocaleString("en-US", {
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>

                          <div className="holiday-details">
                            <strong>{h.holiday_name}</strong>
                            <span>{h.holiday_type}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="managerdash-no-data">No Upcoming Holidays</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};  

export default ManagerDash;