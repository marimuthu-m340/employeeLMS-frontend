import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaBell,
  FaCalendarAlt,
  FaUserCheck,
  FaUserTimes,
  FaUmbrellaBeach,
} from "react-icons/fa";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import { getMyAttendance } from "../../api/attendanceApi";
import "./EmployeeAttendance.css";

const EmployeeAttendance = () => {
  const { user } = useAuth();

  const [attendance, setAttendance] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Current Month & Year
  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );

  const [selectedYear, setSelectedYear] = useState(
    currentDate.getFullYear()
  );

  // Load Attendance
  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const response = await getMyAttendance();

        console.log("API Response:", response);

        if (response.success) {
          setAttendance(response.data);
        }
      } catch (error) {
        console.log(
          "Attendance Error:",
          error.response?.data || error.message
        );
      }
    };

    loadAttendance();
  }, []);

  // Filter Attendance (for summary cards + table, by selected month/year)
  const filteredAttendance = attendance.filter((item) => {
    const date = new Date(item.attendance_date);

    return (
      date.getMonth() + 1 === Number(selectedMonth) &&
      date.getFullYear() === Number(selectedYear)
    );
  });

  // FIX: status values from the backend can come in any case
  // ("Present" / "PRESENT" / "present"). Always normalize with
  // .toLowerCase() before comparing so this stays in sync with
  // EmployeeDash.jsx and admin-summary route.
  const summary = {
    workingDays: filteredAttendance.length,

    presentDays: filteredAttendance.filter(
      (item) => item.status?.toLowerCase() === "present"
    ).length,

    absentDays: filteredAttendance.filter(
      (item) => item.status?.toLowerCase() === "absent"
    ).length,

    leaveDays: filteredAttendance.filter(
      (item) => item.status?.toLowerCase() === "leave"
    ).length,
  };

  // Format a JS Date object as YYYY-MM-DD (local, not UTC)
  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Find attendance status for a given calendar date
  const getStatusForDate = (date) => {
    const dateStr = formatDate(date);

    const record = attendance.find(
      (item) => item.attendance_date === dateStr
    );

    return record ? record.status : null;
  };

  // Apply color class to each calendar tile based on attendance status
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return null;

    const status = getStatusForDate(date)?.toLowerCase();

    if (status === "present") return "tile-present";
    if (status === "absent") return "tile-absent";
    if (status === "leave") return "tile-leave";

    return null;
  };

  // Keep the calendar's visible month in sync with the Month/Year filter
  const activeStartDate = new Date(selectedYear, selectedMonth - 1, 1);

  // If the user manually flips pages on the calendar, keep the
  // Month/Year dropdowns in sync too
  const handleActiveStartDateChange = ({ activeStartDate: newDate }) => {
    if (!newDate) return;

    setSelectedMonth(newDate.getMonth() + 1);
    setSelectedYear(newDate.getFullYear());
  };

  return (
    <>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        role="employee"
      />

      <main className="employeeattendance-main">

        <div className="attendance-filter">
          <select
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(Number(e.target.value))
            }
          >
            <option value={1}>January</option>
            <option value={2}>February</option>
            <option value={3}>March</option>
            <option value={4}>April</option>
            <option value={5}>May</option>
            <option value={6}>June</option>
            <option value={7}>July</option>
            <option value={8}>August</option>
            <option value={9}>September</option>
            <option value={10}>October</option>
            <option value={11}>November</option>
            <option value={12}>December</option>
          </select>

          <select
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(Number(e.target.value))
            }
          >
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
            <option value={2028}>2028</option>
          </select>
        </div>

        {/* Summary Cards */}

        <div className="attendance-summary">

          <div className="summary-card working-card">
            <div className="summary-icon">
              <FaCalendarAlt />
            </div>

            <div className="summary-content">
              <h4>Working Days</h4>
              <h2>{summary.workingDays}</h2>
              <p>Total Attendance</p>
            </div>
          </div>

          <div className="summary-card present-card">
            <div className="summary-icon">
              <FaUserCheck />
            </div>

            <div className="summary-content">
              <h4>Present</h4>
              <h2>{summary.presentDays}</h2>
              <p>Successfully Attended</p>
            </div>
          </div>

          <div className="summary-card absent-card">
            <div className="summary-icon">
              <FaUserTimes />
            </div>

            <div className="summary-content">
              <h4>Absent</h4>
              <h2>{summary.absentDays}</h2>
              <p>Missed Attendance</p>
            </div>
          </div>

          <div className="summary-card leave-card">
            <div className="summary-icon">
              <FaUmbrellaBeach />
            </div>

            <div className="summary-content">
              <h4>Leave</h4>
              <h2>{summary.leaveDays}</h2>
              <p>Approved Leave</p>
            </div>
          </div>

        </div>

        <div className="attendance-calendar-card">
          <div className="calendar-header">
            <h3>Attendance Calendar</h3>
            <p>Select a date to view attendance</p>
          </div>

          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
            activeStartDate={activeStartDate}
            onActiveStartDateChange={handleActiveStartDateChange}
          />

          {/* Legend */}
          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-dot legend-present"></span>
              Present
            </div>
            <div className="legend-item">
              <span className="legend-dot legend-absent"></span>
              Absent
            </div>
            <div className="legend-item">
              <span className="legend-dot legend-leave"></span>
              Leave
            </div>
          </div>
        </div>

      </main>
    </>
  );
};

export default EmployeeAttendance;