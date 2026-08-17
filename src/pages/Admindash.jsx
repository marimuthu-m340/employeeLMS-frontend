  import React, { useState, useEffect } from "react";
  import {
    FaUsers,
    FaUserTie,
    FaUserFriends,
    FaBuilding,
    FaPlus,
    FaCalendarAlt,
    FaClipboardList,
  } from "react-icons/fa";

  import "./Admindash.css";
  import Sidebar from "../components/Sidebar";
  import CompanyOverview from "../components/CompanyOverview";
  import { getDashboardStats } from "../api/dashboardApi";
  import { getHolidays } from "../api/holidaysApi"; 
  import { useNavigate } from "react-router-dom";
  import { getAdminAttendanceSummary } from "../api/attendanceApi";


  const AdminDash = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigate = useNavigate();

    const [stats, setStats] = useState({

    totalEmployees: 0,
    totalManagers: 0,
    totalHR: 0,
    totalDepartments: 0,
  });
  const [holidays, setHolidays] = useState([]);

  const [attendanceReport, setAttendanceReport] = useState({
  employees:{
    present:0,
    absent:0,
    leave:0
  },
  managers:{
    present:0,
    absent:0,
    leave:0
  }
});
useEffect(() => {
 fetchDashboardStats();
 fetchUpcomingHolidays();
 fetchAttendanceReport();
}, []);

  const fetchDashboardStats = async () => {
    try {
      const result = await getDashboardStats();

      console.log("Dashboard Stats:", result);

      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };    

  const fetchUpcomingHolidays = async () => {
  try {
    const result = await getHolidays();

    console.log("Holidays:", result);

    if(result.success){
      setHolidays(result.data);
    }

  } catch(error){
    console.error("Holiday Fetch Error:", error);
  }
};

    const summary = [
      {
        key: "employees",
        icon: <FaUsers />,
        label: "Total Employees",
        value: stats.totalEmployees,
        note: "Compared to last month",
        accent: "blue",
      },
      {
        key: "managers",
        icon: <FaUserTie />,
        label: "Total Managers",
        value: stats.totalManagers,
        note: "Compared to last month",
        accent: "purple",
      },
      {
        key: "hr",
        icon: <FaUserFriends />,
        label: "Total HR",
        value: stats.totalHR,
        note: "Compared to last month",
        accent: "teal",
      },
      {
        key: "departments",
        icon: <FaBuilding />,
        label: "All Departments",
        value: stats.totalDepartments,
        note: "New department added",
        accent: "green",
      },
    ];

    const fetchAttendanceReport = async () => {

try {

const result = await getAdminAttendanceSummary();

console.log(
"Admin Attendance Report:",
result
);


if(result.success){

 setAttendanceReport(result.data);

}


}
catch(error){

console.error(
"Attendance Report Error:",
error
);

}

};  

    // Employee growth statistics — plotted as an SVG line chart (no chart lib installed)
    const employeeGrowth = [180, 195, 205, 218, 232, 248];
    const growthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

    const maxGrowth = Math.max(...employeeGrowth);
    const minGrowth = Math.min(...employeeGrowth);
    const chartW = 480;
    const chartH = 160;
    const points = employeeGrowth.map((val, i) => {
      const x = (i / (employeeGrowth.length - 1)) * chartW;
      const y =
        chartH - ((val - minGrowth) / (maxGrowth - minGrowth || 1)) * (chartH - 20) - 10;
      return `${x},${y}`;
    });
    const linePoints = points.join(" ");
    const areaPoints = `0,${chartH} ${linePoints} ${chartW},${chartH}`;

    // Attendance overview — rendered as a CSS conic-gradient donut
  const attendance = {
    present: stats.present || 0,
    absent: stats.absent || 0,
    leave: stats.leave || 0,
  };
  const totalAttendance =
    attendance.present +
    attendance.absent +
    attendance.leave;
    const presentPct = (attendance.present / totalAttendance) * 100;
    const absentPct = (attendance.absent / totalAttendance) * 100;
  const leavePct =
    (attendance.leave / totalAttendance) * 100;
  const donutStyle = {
    background: `conic-gradient(
      #22c55e 0% ${presentPct}%,
      #ef4444 ${presentPct}% ${presentPct + absentPct}%,
      #3b82f6 ${presentPct + absentPct}% ${
        presentPct + absentPct + leavePct
      }%
    )`,
  };
  const quickActions = [
    {
      icon: <FaUsers />,
      title: "Add Employee",
      desc: "Create a new employee",
      path: "/admin/employees",
    },
    {
      icon: <FaUserTie />,
      title: "Add Manager",
      desc: "Create a new manager",
      path: "/admin/managers",
    },
    {
      icon: <FaUserFriends />,
      title: "Add HR",
      desc: "Create a new HR account",
      path: "/admin/hr",
    },
    {
      icon: <FaBuilding />,
      title: "Add Department",
      desc: "Create a new department",
      path: "/admin/departments",
    },
    {
      icon: <FaCalendarAlt />,
      title: "Create Holiday",
      desc: "Add a company holiday",
      path: "/admin/holidays",
    },
    {
      icon: <FaClipboardList />,
      title: "View Reports",
      desc: "Attendance & HR reports",
      path: "/admin/attendance/reports",
    },
  ];
    
    return (
      <div className="admin-dashboard">
        <Sidebar
          role="admin"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="main-content">
          <div className="dashboard-content">
            {/* Page Header */}

            {/* Summary Cards */}
            <div className="summary-cards">
              {summary.map((card) => (
                <div className={`summary-card accent-${card.accent}`} key={card.key}>
                  <div className="summary-card-top">
                    <div className="summary-icon">{card.icon}</div>
                    <span className="summary-badge">{card.change}</span>
                  </div>
                  <div className="summary-info">
                    <p>{card.label}</p>
                    <h2>{card.value}</h2>
                    <span>{card.note}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Employee Overview & Attendance Overview */}
            <div className="statistics-grid">
              <div className="dashboard-panel">
                <div className="panel-header">
                  <div>
                    <h3>Employee Overview</h3>
                    <p>Employee growth statistics</p>
                  </div>
                  <select className="panel-select" defaultValue="6">
                    <option value="3">Last 3 Months</option>
                    <option value="6">Last 6 Months</option>
                    <option value="12">Last 12 Months</option>
                  </select>
                </div>

                <div className="line-chart-wrap">
                  <svg
                    viewBox={`0 0 ${chartW} ${chartH}`}
                    className="line-chart-svg"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <polygon points={areaPoints} fill="url(#growthFill)" />
                    <polyline
                      points={linePoints}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {points.map((p, i) => {
                      const [x, y] = p.split(",");
                      return (
                        <circle key={i} cx={x} cy={y} r="4" fill="#2563eb" />
                      );
                    })}
                  </svg>
                  <div className="chart-labels">
                    {growthLabels.map((l) => (
                      <span key={l}>{l}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="dashboard-panel">
                <div className="panel-header">
                  <div>
                    <h3>Attendance Overview</h3>
                    <p>Today's attendance</p>
                  </div>
                  <span className="live-badge">
                    <i></i> Live
                  </span>
                </div>

                <div className="attendance-content">
                  <div className="attendance-donut" style={donutStyle}>
                    <div className="attendance-donut-hole">
                      <strong>{attendance.present}</strong>
                      <span>Present</span>
                    </div>
                  </div>

                  <div className="attendance-list">
                    <div className="attendance-item">
                      <span className="attendance-dot present"></span>
                      <span>Present</span>
                      <strong>{attendance.present}</strong>
                    </div>
                    <div className="attendance-item">
                      <span className="attendance-dot absent"></span>
                      <span>Absent</span>
                      <strong>{attendance.absent}</strong>
                    </div>
                    <div className="attendance-item">
                      <span className="attendance-dot late"></span>
                      <span>Leave</span>
                      <strong>{attendance.leave}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
              <div className="panel-header">
                <div>
                  <h3>Quick Actions</h3>
                  <p>Manage your organization</p>
                </div>
              </div>

              <div className="quick-actions-grid">
                {quickActions.map((action, i) => (
  <button
    className="quick-action-card"
    key={i}
    onClick={() => navigate(action.path)}
  >
                      <div className="quick-action-icon">{action.icon}</div>
                    <div>
                      <strong>{action.title}</strong>
                      <span>{action.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Holidays */}
            <div className="holidays-section">
              <div className="panel-header">
                <div>
                  <h3>Upcoming Holidays</h3>
                  <p>Company holiday calendar</p>
                </div>
                <button
  type="button"
  className="create-holiday-btn"
  onClick={() => navigate("/admin/holidays")}
>
  + Create Holiday
</button>
              </div>

              <div className="holiday-list">
            {holidays.map((h) => {

  const date = new Date(h.holiday_date);

  return (
    <div className="holiday-item" key={h.id}>

      <div className="holiday-date">
        <strong>
          {date.getDate()}
        </strong>

        <span>
          {date.toLocaleString(
            "en-US",
            {
              month:"short",
              year:"numeric"
            }
          )}
        </span>
      </div>


      <div className="holiday-details">

        <strong>
          {h.holiday_name}
        </strong>

        <span>
          {h.holiday_type}
        </span>

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

  export default AdminDash;