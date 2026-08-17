import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaBell,
  FaCheckCircle,
  FaCalendarAlt,
  FaClipboardList,
  FaUserCheck,
  FaUserTimes,
  FaMoneyBillWave,
} from "react-icons/fa";

import Sidebar from "../../components/Sidebar";
import "./EmployeeDash.css";
import { getMyAttendance } from "../../api/attendanceApi";
import { getHolidays } from "../../api/holidaysApi";
import { getMyLopSummary } from "../../api/leaveApi"; // adjust path if your leave api file is named differently

const EmployeeDash = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [lossOfPay, setLossOfPay] = useState(0);

  // FIX 1: status values coming from the backend can be in any case
  // ("Present", "PRESENT", "present" etc.) — always compare using
  // .toLowerCase() so it matches regardless of casing.
  const summary = {
    totalWorkingDays: attendance.length,

    presentDays: attendance.filter(
      (a) => a.status?.toLowerCase() === "present"
    ).length,

    // FIX 2: Absent Days was never calculated before, only present/leave existed.
    absentDays: attendance.filter(
      (a) => a.status?.toLowerCase() === "absent"
    ).length,

    totalLeave: attendance.filter(
      (a) => a.status?.toLowerCase() === "leave"
    ).length,

    // FIX 3: lossOfPay used to be hardcoded to 0.
    // Now it comes from the /api/leaves/my-lop-summary endpoint
    // (approved leave_requests where leave_types.is_paid = false).
    lossOfPay,
  };

  const employee = {
    name: "Mari",
    role: "Employee",
  };

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const response = await getMyAttendance();
        setAttendance(response.data);
        console.log("Attendance API Data:", response.data);
        console.log("My Attendance:", response);
      } catch (error) {
        console.log("Attendance Error:", error.response?.data || error.message);
      }
    };

    loadAttendance();
  }, []);

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

  // FIX 3 (continued): fetch real LOP total for the logged-in employee
  useEffect(() => {
    const loadLop = async () => {
      try {
        const result = await getMyLopSummary();
        if (result.success) {
          setLossOfPay(result.data.lossOfPay);
        }
      } catch (error) {
        console.log("LOP Fetch Error:", error.response?.data || error.message);
      }
    };

    loadLop();
  }, []);

  useEffect(() => {
    console.log("Updated Attendance:", attendance);
  }, [attendance]);

  const notifications = [
    {
      id: 1,
      icon: <FaBell />,
      color: "blue",
      title: "Leave Approved",
      desc: "Your leave request has been approved.",
    },
    {
      id: 2,
      icon: <FaCheckCircle />,
      color: "green",
      title: "Attendance Updated",
      desc: "Today's attendance marked successfully.",
    },
    {
      id: 3,
      icon: <FaCalendarAlt />,
      color: "orange",
      title: "Holiday Notice",
      desc: "Next Monday is declared as holiday.",
    },
  ];

  return (
    <div className="employeedash-layout">
      <Sidebar
        role="employee"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="employeedash-main">

        <div className="employeedash-content">
          {/* Summary Cards */}
          <div className="employeedash-summary-grid">
            <div className="employeedash-summary-card">
              <div className="employeedash-summary-icon blue">
                <FaCalendarAlt />
              </div>
              <div>
                <p>Total Working Days</p>
                <h2>{summary.totalWorkingDays}</h2>
              </div>
            </div>

            <div className="employeedash-summary-card">
              <div className="employeedash-summary-icon green">
                <FaUserCheck />
              </div>
              <div>
                <p>Present Days</p>
                <h2>{summary.presentDays}</h2>
              </div>
            </div>

            {/* NEW: Absent Days card */}
            <div className="employeedash-summary-card">
              <div className="employeedash-summary-icon red">
                <FaUserTimes />
              </div>
              <div>
                <p>Absent Days</p>
                <h2>{summary.absentDays}</h2>
              </div>
            </div>

            <div className="employeedash-summary-card">
              <div className="employeedash-summary-icon orange">
                <FaClipboardList />
              </div>
              <div>
                <p>Total Leave</p>
                <h2>{summary.totalLeave}</h2>
              </div>
            </div>

            <div className="employeedash-summary-card">
              <div className="employeedash-summary-icon red">
                <FaMoneyBillWave />
              </div>
              <div>
                <p>Loss Of Pay</p>
                <h2>{summary.lossOfPay}</h2>
              </div>
            </div>
          </div>

          {/* Recent Activity & Notifications */}
          <div className="employeedash-row">
            <div className="employeedash-card">
              <h3>Recent Activity</h3>

              <div className="employeedash-table-wrapper">
                <table className="employeedash-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Activity</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {attendance.map((item) => (
                      <tr key={item.id}>
                        <td>{item.attendance_date}</td>
                        <td>Attendance Marked</td>
                        <td>
                          <span className="status-approved">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="employeedash-card">
              <h3>Notifications</h3>

              <div className="employeedash-notification-list">
                {notifications.map((n) => (
                  <div className="employeedash-notification-item" key={n.id}>
                    <div className={`employeedash-notify-icon ${n.color}`}>
                      {n.icon}
                    </div>

                    <div>
                      <h4>{n.title}</h4>
                      <p>{n.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===================== UPCOMING HOLIDAYS ===================== */}
          <div className="employeedash-card">
            <h3>Upcoming Holidays</h3>

            <div className="holiday-list">
              {holidays.map((h) => {
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
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDash;