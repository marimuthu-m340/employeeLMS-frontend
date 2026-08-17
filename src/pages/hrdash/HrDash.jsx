import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaUserTie,
  FaUserFriends,
  FaBuilding,
} from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import "./HrDash.css";
import { getDashboardStats } from "../../api/dashboardApi";
import { getPendingLeaves } from "../../api/leaveApi";
import { getHolidays } from "../../api/holidaysApi";

const HrDash = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

const loadDashboard = async () => {
  try {
    const res = await getDashboardStats();

    const data = res.data;
   setDepartmentWiseEmployees(
  data.departmentWiseEmployees || []
);

    setSummary({
      totalEmployees: data.totalEmployees,
      totalManagers: data.totalManagers,
      totalHR: data.totalHR,
      totalDepartments: data.totalDepartments,
    });

    setAttendanceOverview({
      present: data.present,
      absent: data.absent,
      onLeave: data.leave,
    });

    setEmployeeStats({
      newJoinees: data.newJoinees,
      activeEmployees: data.activeEmployees,
      inactiveEmployees: data.inactiveEmployees,
    });

    setDepartmentWiseEmployees(
  data.departmentWiseEmployees || []
);



  } catch (err) {
    console.error(err);
  }
};

const loadManagerLeaves = async () => {
  try {

    const res = await getPendingLeaves();
    console.log("LEAVE DATA:", res.data);

    console.log("Pending Manager Leaves:", res);

    setManagerLeaveRequests(
      res.data || []
    );

  } catch (err) {

    console.error(
      "Manager Leave Fetch Error:",
      err
    );

  }
};

const fetchUpcomingHolidays = async () => {
  try {
    const result = await getHolidays();

    if (result.success) {
      setHolidays(result.data);
    }
  } catch (error) {
    console.error("Holiday Fetch Error:", error);
  }
};



  // ===================== STATIC DATA (backend integration pinnal) =====================

const [summary, setSummary] = useState({
  totalEmployees: 0,
  totalManagers: 0,
  totalHR: 0,
  totalDepartments: 0,
});

const [attendanceOverview, setAttendanceOverview] = useState({
  present: 0,
  absent: 0,
  onLeave: 0,
});

 const [employeeStats, setEmployeeStats] = useState({
  newJoinees: 0,
  activeEmployees: 0,
  inactiveEmployees: 0,
});
const [departmentWiseEmployees, setDepartmentWiseEmployees] = useState([]);


 const [managerLeaveRequests, setManagerLeaveRequests] = useState([]);
 const [holidays, setHolidays] = useState([]);

  useEffect(() => {
  loadDashboard();
  loadManagerLeaves();
  fetchUpcomingHolidays();
}, []);
  return (
    <div className="hrdash-layout">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        role="hr"
      />

      <main className="hrdash-main">

        <div className="hrdash-content">
          {/* ===================== SUMMARY CARDS ===================== */}

          <div className="hrdash-summary-grid">
            <div className="hrdash-summary-card">
              <div className="hrdash-summary-icon blue">
                <FaUsers />
              </div>
              <div>
                <p>Total Employees</p>
                <h2>{summary.totalEmployees}</h2>
              </div>
            </div>

            <div className="hrdash-summary-card">
              <div className="hrdash-summary-icon purple">
                <FaUserTie />
              </div>
              <div>
                <p>Total Managers</p>
                <h2>{summary.totalManagers}</h2>
              </div>
            </div>

            <div className="hrdash-summary-card">
              <div className="hrdash-summary-icon green">
                <FaUserFriends />
              </div>
              <div>
                <p>Total HR</p>
                <h2>{summary.totalHR}</h2>
              </div>
            </div>

            <div className="hrdash-summary-card">
              <div className="hrdash-summary-icon orange">
                <FaBuilding />
              </div>
              <div>
                <p>Total Departments</p>
                <h2>{summary.totalDepartments}</h2>
              </div>
            </div>
          </div>

          {/* ===================== OVERVIEW ROW ===================== */}

          <div className="hrdash-row">
            <div className="hrdash-card">
              <h3>Attendance Overview</h3>

              <div className="hrdash-overview-list">
                <div className="hrdash-overview-item">
                  <span>Present</span>
                  <strong className="text-green">
                    {attendanceOverview.present}
                  </strong>
                </div>
                <div className="hrdash-overview-item">
                  <span>Absent</span>
                  <strong className="text-red">
                    {attendanceOverview.absent}
                  </strong>
                </div>
                <div className="hrdash-overview-item">
                  <span>On Leave</span>
                  <strong className="text-orange">
                    {attendanceOverview.onLeave}
                  </strong>
                </div>
              </div>
            </div>

            <div className="hrdash-card">
              <h3>Employee Statistics</h3>

              <div className="hrdash-overview-list">
                <div className="hrdash-overview-item">
                  <span>New Joinees (This Month)</span>
                  <strong>{employeeStats.newJoinees}</strong>
                </div>
                <div className="hrdash-overview-item">
                  <span>Active Employees</span>
                  <strong className="text-green">
                    {employeeStats.activeEmployees}
                  </strong>
                </div>
                <div className="hrdash-overview-item">
                  <span>Inactive Employees</span>
                  <strong className="text-red">
                    {employeeStats.inactiveEmployees}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* ===================== DEPARTMENT WISE OVERVIEW ===================== */}

          <div className="hrdash-card">
            <h3>Department wise Employee Overview</h3>

            <div className="hrdash-dept-list">
              {departmentWiseEmployees.map((dept) => (
                <div className="hrdash-dept-item" key={dept.department}>
                  <span>{dept.department}</span>

                  <div className="hrdash-dept-bar-wrapper">
                    <div
                      className="hrdash-dept-bar"
                      style={{
                        width: `${(dept.count / summary.totalEmployees) * 100}%`,
                      }}
                    ></div>
                  </div>

                  <strong>{dept.count}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* ===================== MANAGER LEAVE REQUESTS ===================== */}

          <div className="hrdash-card">
            <h3>Manager's Leave Requests</h3>

            <div className="hrdash-table-wrapper">
              <table className="hrdash-table">
                <thead>
                  <tr>
                    <th>Manager</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
               <tbody>
  {managerLeaveRequests.length > 0 ? (
    managerLeaveRequests.map((req) => (
      <tr key={req.id}>
        
        {/* Manager Name */}
        <td>
      {req.applicant_name || "-"}
        </td>

        {/* From Date */}
        <td>
          {req.from_date}
        </td>

        {/* To Date */}
        <td>
          {req.to_date}
        </td>

        {/* Reason */}
        <td>
          {req.reason}
        </td>

        {/* Status */}
        <td>
          <span
            className={`hrdash-status ${
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
      <td colSpan="5" className="hrdash-no-data">
        No pending leave requests
      </td>
    </tr>
  )}
</tbody>
              </table>
            </div>
          </div>

          {/* ===================== UPCOMING HOLIDAYS ===================== */}

          <div className="holidays-section">
            <div className="panel-header">
              <div>
                <h3>Upcoming Holidays</h3>
                <p>Company holiday calendar</p>
              </div>
            </div>

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

export default HrDash;