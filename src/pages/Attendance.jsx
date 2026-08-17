import React, { useState, useEffect, useMemo } from "react";
import "./Attendance.css";
import Sidebar from "../components/Sidebar";
import { getAttendance,getAdminAttendanceSummary } from "../api/attendanceApi";
import { getDepartments } from "../api/departmentsApi";


function Attendance() {

  // ================= CONSTANTS =================

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const years = [2025, 2026, 2027, 2028];
  const today = new Date();

  // ================= STATES =================

  const [date, setDate] = useState("");
  const [month, setMonth] = useState(months[today.getMonth()]);
  const [year, setYear] = useState(String(today.getFullYear()));
  const monthIndex = months.indexOf(month);
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizeDate = (value) => {
    if (!value) return "";
    const parsed = new Date(value);
    return isNaN(parsed) ? "" : parsed.toISOString().slice(0, 10);
  };

  const roles = useMemo(
    () => [...new Set(attendanceData.map((item) => item.role).filter(Boolean))],
    [attendanceData]
  );

  const filteredAttendance = useMemo(() => {
    const selectedYear = Number(year);

    return attendanceData.filter((item) => {
      const itemDate = item.attendance_date ? new Date(item.attendance_date) : null;

      if (date && normalizeDate(item.attendance_date) !== date) {
        return false;
      }

      if (month && monthIndex >= 0) {
        if (!itemDate || itemDate.getMonth() !== monthIndex) {
          return false;
        }
      }

      if (year) {
        if (!itemDate || itemDate.getFullYear() !== selectedYear) {
          return false;
        }
      }

      if (department) {
        const itemDepartment = String(
          item.department_id ?? item.departmentId ?? item.department ?? item.department_name ?? ""
        );

        if (itemDepartment !== String(department)) {
          return false;
        }
      }

      if (role && String(item.role || "").toLowerCase() !== String(role).toLowerCase()) {
        return false;
      }

      return true;
    });
  }, 
  [attendanceData, date, month, monthIndex, year, department, role]);
  const [attendanceOverview, setAttendanceOverview] = useState({
  employees: {
    present: 0,
    absent: 0,
    leave: 0,
  },
  managers: {
    present: 0,
    absent: 0,
    leave: 0,
  },
});



  const attendanceSummary = useMemo(() => {
    const totalEmployees = new Set(
      filteredAttendance.map((item) => item.employee_id || item.employee_name)
    ).size;
    const presentCount = filteredAttendance.filter((item) => item.status === "PRESENT").length;
    const absentCount = filteredAttendance.filter((item) => item.status === "ABSENT").length;
    const halfDayCount = filteredAttendance.filter(
      (item) => item.status === "HALF_DAY" || item.status === "HALF DAY"
    ).length;
    const leaveCount = filteredAttendance.filter((item) => item.status === "LEAVE").length;
    const holidayCount = filteredAttendance.filter((item) => item.status === "HOLIDAY").length;
    const lopCount = filteredAttendance.filter((item) =>
      ["LOP", "LOSS_OF_PAY", "LWP"].includes(item.status)
    ).length;

    return {
      totalEmployees,
      presentCount,
      absentCount,
      halfDayCount,
      leaveCount,
      holidayCount,
      lopCount,
    };
  }, [filteredAttendance]);

  const firstWeekday = monthIndex >= 0 ? new Date(Number(year), monthIndex, 1).getDay() : 0;
  const daysInMonth = monthIndex >= 0 ? new Date(Number(year), monthIndex + 1, 0).getDate() : 31;

  const calendarStatusByDay = useMemo(() => {
    const statusMap = {};

    filteredAttendance.forEach((item) => {
      const itemDate = item.attendance_date ? new Date(item.attendance_date) : null;
      if (!itemDate || isNaN(itemDate)) return;
      if (itemDate.getFullYear() !== Number(year)) return;
      if (itemDate.getMonth() !== monthIndex) return;
      statusMap[itemDate.getDate()] = statusMap[itemDate.getDate()] || item.status || "PRESENT";
    });

    return statusMap;
  }, [filteredAttendance, monthIndex, year]);

  // ================= FETCH ATTENDANCE =================

  const fetchAttendance = async () => {
    try {
      const result = await getAttendance();

      console.log("Admin Attendance:", result);

      if (result.success) {
        setAttendanceData(result.data || []);
      }
    } catch (error) {
      console.log("Attendance Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceOverview = async () => {
  try {
    const result = await getAdminAttendanceSummary();

    console.log("Attendance Overview:", result);

    if (result.success) {
      setAttendanceOverview(result.data);
    }
  } catch (error) {
    console.error(error);
  }
};

  // ================= FETCH DEPARTMENTS =================

  const fetchDepartments = async () => {
    try {
      const result = await getDepartments();

      console.log("Departments Data:", result);

      if (Array.isArray(result)) {
        setDepartments(result);
      } else if (result.success) {
        setDepartments(result.data || []);
      }
    } catch (error) {
      console.log("Departments Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchAttendance();
    fetchDepartments();
    fetchAttendanceOverview();
  }, []);

  const resetFilters = () => {
    setDate("");
    setMonth(months[today.getMonth()]);
    setYear(String(today.getFullYear()));
    setDepartment("");
    setRole("");
  };

  return (
     <div className="admin-layout">

    <Sidebar
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      role="admin"
    />

    <div className="attendance-page">

      {/* Header */}
      <div className="attendance-header">
        <h1>Attendance</h1>
        <p>Manage employee attendance and LOP</p>
      </div>


      {/* Overview Cards */}
      <div className="attendance-cards">

        <div className="attendance-card">
          <h3>Total Employees</h3>
          <span>
            {new Set(filteredAttendance.map((item) => item.employee_id || item.employee_name)).size}
          </span>
        </div>

        <div className="attendance-card">
          <h3>Present</h3>
          <span>{attendanceSummary.presentCount}</span>
        </div>

        <div className="attendance-card">
          <h3>Absent</h3>
          <span>{attendanceSummary.absentCount}</span>
        </div>

        <div className="attendance-card">
          <h3>Half Day</h3>
          <span>{attendanceSummary.halfDayCount}</span>
        </div>

      </div>

{/* Attendance Overview */}
<div className="attendance-overview">

  <div className="overview-box">
    <h2>Employees</h2>

    <div className="overview-row">
      <span>Present</span>
      <strong>{attendanceOverview.employees.present}</strong>
    </div>

    <div className="overview-row">
      <span>Absent</span>
      <strong>{attendanceOverview.employees.absent}</strong>
    </div>

    <div className="overview-row">
      <span>Leave</span>
      <strong>{attendanceOverview.employees.leave}</strong>
    </div>
  </div>

  <div className="overview-box">
    <h2>Managers</h2>

    <div className="overview-row">
      <span>Present</span>
      <strong>{attendanceOverview.managers.present}</strong>
    </div>

    <div className="overview-row">
      <span>Absent</span>
      <strong>{attendanceOverview.managers.absent}</strong>
    </div>

    <div className="overview-row">
      <span>Leave</span>
      <strong>{attendanceOverview.managers.leave}</strong>
    </div>
  </div>

</div>

      {/* Filters */}
      <div className="attendance-filter">

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">Select Month</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)}>
          {years.map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              {yearOption}
            </option>
          ))}
        </select>

        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option key="all" value="">
            Select Department
          </option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.department_name}
            </option>
          ))}
        </select>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="HR">HR</option>
                    <option value="Manager">Manager</option>
          <option value="Employee">Employee</option>

          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <button type="button" onClick={resetFilters}>
          Reset
        </button>
      </div>




      {/* Calendar */}
      <div className="attendance-calendar">

        <h2>
          {month} {year}
        </h2>

        <div className="calendar-grid">

          {
            ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
            .map(day=>(
              <div className="calendar-head" key={day}>
                {day}
              </div>
            ))
          }


          {Array.from({ length: firstWeekday }, (_, index) => (
            <div className="calendar-day empty" key={`empty-${index}`}></div>
          ))}

          {Array.from({ length: daysInMonth }, (_, index) => {
            const dayNumber = index + 1;
            const status = calendarStatusByDay[dayNumber] || "";
            const statusClass = status.toLowerCase().includes("absent")
              ? "absent"
              : status.toLowerCase().includes("half")
              ? "half-day"
              : status.toLowerCase().includes("leave")
              ? "leave"
              : status.toLowerCase().includes("holiday")
              ? "holiday"
              : status.toLowerCase().includes("lop")
              ? "lop"
              : status.toLowerCase().includes("present")
              ? "present"
              : "";

            return (
              <div className={`calendar-day ${statusClass}`} key={dayNumber}>
                <span>{dayNumber}</span>
                {status && (
                  <small className={statusClass} title={status}>
                    ●
                  </small>
                )}
              </div>
            );
          })}

        </div>

      </div>
  
<div className="attendance-table-wrapper">
<table className="attendance-table">

<thead>
<tr>
<th>Employee</th>
<th>Date</th>
<th>Status</th>
<th>Remarks</th>
</tr>
</thead>


<tbody>
  {loading ? (
    <tr>
      <td colSpan="4" className="attendance-loading">
        Loading attendance records...
      </td>
    </tr>
  ) : filteredAttendance.length === 0 ? (
    <tr>
      <td colSpan="4" className="attendance-empty">
        No attendance records found for the selected filters.
      </td>
    </tr>
  ) : (
    filteredAttendance.map((item) => (
      <tr key={item.id || `${item.employee_id}-${item.attendance_date}`}>
        <td>{item.employee_name || item.employee_full_name || "Unknown"}</td>
        <td>{normalizeDate(item.attendance_date) || "-"}</td>
        <td>{item.status || "-"}</td>
        <td>{item.remarks || "-"}</td>
      </tr>
    ))
  )}
</tbody>
</table>
</div>


      {/* LOP Summary */}
      <div className="lop-summary">

        <h2>Monthly Summary</h2>

        <div>Present : {attendanceSummary.presentCount}</div>
        <div>Absent : {attendanceSummary.absentCount}</div>
        <div>Half Day : {attendanceSummary.halfDayCount}</div>
        <div>Leave : {attendanceSummary.leaveCount}</div>
        <div>Holiday : {attendanceSummary.holidayCount}</div>

        <h3>Total LOP : {attendanceSummary.lopCount} Days</h3>

      </div>



      {/* Export */}
      <div className="export-buttons">

        <button>
          Export Excel
        </button>

        <button>
          Export PDF
        </button>

      </div>
      </div>
    </div>
  );
}


export default Attendance;