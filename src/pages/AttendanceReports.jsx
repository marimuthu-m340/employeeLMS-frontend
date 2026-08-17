import React, { useState, useEffect } from "react";
import "./AttendanceReports.css";
import Sidebar from "../components/Sidebar";
import { getAttendanceReports } from "../api/attendanceReportsApi";
import { getManagerAttendanceReports } from "../api/managerAttendanceApi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getDepartments } from "../api/departmentsApi";

const AttendanceReports = () => {
  const loggedInUser =
    JSON.parse(localStorage.getItem("user")) || {};
  const role = loggedInUser.role;

  // Who sees what
  const canViewEmployees = role === "SUPER_ADMIN" || role === "HR";
  const canViewAllManagers =
    role === "SUPER_ADMIN" || role === "HR" || role === "MANAGER_ADMIN";
  const isOwnManagerView = role === "MANAGER";

  const sidebarRole =
    role === "SUPER_ADMIN"
      ? "admin"
      : role === "HR"
      ? "hr"
      : "manager";

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ================= EMPLOYEE REPORT STATE =================
  const [filteredReports, setFilteredReports] = useState([]);
  const [employee, setEmployee] = useState("");
  const [reports, setReports] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState("");

  // ================= MANAGER REPORT STATE =================
  const [managerReports, setManagerReports] = useState([]);
  const [filteredManagerReports, setFilteredManagerReports] = useState([]);

  // ================= TAB (only when both sections visible) =================
  const [activeTab, setActiveTab] = useState(
    canViewEmployees ? "employees" : "managers"
  );

  useEffect(() => {
    if (canViewEmployees) {
      fetchReports();
      fetchDepartments();
    }

    if (canViewAllManagers || isOwnManagerView) {
      fetchManagerReports();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDepartments = async () => {
    try {
      const result = await getDepartments();
      console.log("Departments:", result);
      setDepartments(result);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchReports = async () => {
    try {
      const result = await getAttendanceReports();

      if (result.success) {
        setReports(result.data);
        setFilteredReports(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchManagerReports = async () => {
    try {
      const managerId = isOwnManagerView
        ? loggedInUser.managerId
        : null;

      const result = await getManagerAttendanceReports(managerId);

      console.log("Manager Reports:", result);

      if (result.success) {
        setManagerReports(result.data || []);
        setFilteredManagerReports(result.data || []);
      }
    } catch (error) {
      console.log("Manager Reports Error:", error);
    }
  };

  // ================= EXPORT - EMPLOYEES =================
  const exportToExcel = () => {
    const excelData = reports.map((item) => ({
      Employee: item.employee_name,
      Department: item.department_name,
      Date: item.attendance_date,
      Status: item.status,
      Remarks: item.remarks,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Attendance Reports"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(data, "Attendance_Report.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Attendance Report", 14, 20);

    const tableColumn = [
      "Employee",
      "Department",
      "Date",
      "Status",
      "Remarks",
    ];

    const tableRows = reports.map((item) => [
      item.employee_name,
      item.department_name,
      item.attendance_date,
      item.status,
      item.remarks,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save("Attendance_Report.pdf");
  };

  // ================= EXPORT - MANAGERS =================
  const exportManagersToExcel = () => {
    const excelData = managerReports.map((item) => ({
      Manager: item.manager_name,
      Department: item.department,
      Date: item.attendance_date,
      Status: item.status,
      Remarks: item.remarks,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Manager Attendance"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(data, "Manager_Attendance_Report.xlsx");
  };

  const exportManagersToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Manager Attendance Report", 14, 20);

    const tableColumn = ["Manager", "Department", "Date", "Status", "Remarks"];

    const tableRows = managerReports.map((item) => [
      item.manager_name,
      item.department,
      item.attendance_date,
      item.status,
      item.remarks,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save("Manager_Attendance_Report.pdf");
  };

  // ================= SUMMARY - EMPLOYEES =================
  const summary = {
    present: filteredReports.filter(
      (item) => item.status === "PRESENT"
    ).length,

    absent: filteredReports.filter(
      (item) => item.status === "ABSENT"
    ).length,

    leave: filteredReports.filter(
      (item) => item.status === "LEAVE"
    ).length,

    total: filteredReports.length,
  };

  summary.attendance =
    summary.total > 0
      ? ((summary.present / summary.total) * 100).toFixed(1)
      : 0;

  // ================= SUMMARY - MANAGERS =================
  const managerSummary = {
    present: filteredManagerReports.filter(
      (item) => item.status === "PRESENT"
    ).length,

    absent: filteredManagerReports.filter(
      (item) => item.status === "ABSENT"
    ).length,

    leave: filteredManagerReports.filter(
      (item) => item.status === "LEAVE"
    ).length,

    total: filteredManagerReports.length,
  };

  managerSummary.attendance =
    managerSummary.total > 0
      ? (
          (managerSummary.present / managerSummary.total) *
          100
        ).toFixed(1)
      : 0;

  const handleSearch = () => {
    console.log("Selected Department:", department);
    console.log("Selected Employee:", employee);

    const filtered = reports.filter((item) => {
      const departmentMatch =
        !department || item.department_name === department;

      const employeeMatch =
        !employee || String(item.employee_id) === String(employee);

      return departmentMatch && employeeMatch;
    });

    setFilteredReports(filtered);
  };

  const showEmployeeSection =
    canViewEmployees &&
    (!canViewAllManagers || activeTab === "employees");

  const showManagerSection =
    (canViewAllManagers || isOwnManagerView) &&
    (!canViewEmployees || activeTab === "managers");

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        role={sidebarRole}
      />

      {/* Main Content */}
      <div className="attendance-page">
        {/* Header */}
        <div className="reports-header">
          <div>
            <h1>Attendance Reports</h1>
            <p>Generate and analyze attendance reports.</p>
          </div>
        </div>

        {/* Tabs - only when this login can see BOTH employees & managers */}
        {canViewEmployees && canViewAllManagers && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab("employees")}
              style={{
                padding: "8px 18px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                cursor: "pointer",
                background:
                  activeTab === "employees" ? "#2563eb" : "#fff",
                color: activeTab === "employees" ? "#fff" : "#333",
              }}
            >
              Employees
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("managers")}
              style={{
                padding: "8px 18px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                cursor: "pointer",
                background:
                  activeTab === "managers" ? "#2563eb" : "#fff",
                color: activeTab === "managers" ? "#fff" : "#333",
              }}
            >
              Managers
            </button>
          </div>
        )}

        {/* ===================== EMPLOYEE REPORT SECTION ===================== */}
        {showEmployeeSection && (
          <>
            {/* Filters */}
            <div className="report-filters">
              <input type="date" />
              <input type="date" />

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">All Departments</option>

                {departments.map((dept) => (
                  <option
                    key={dept.id}
                    value={dept.department_name}
                  >
                    {dept.department_name}
                  </option>
                ))}
              </select>

              <select
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
              >
                <option value="">All Employees</option>

                {[
                  ...new Map(
                    reports.map((item) => [item.employee_id, item])
                  ).values(),
                ].map((item) => (
                  <option
                    key={item.employee_id}
                    value={item.employee_id}
                  >
                    {item.employee_name}
                  </option>
                ))}
              </select>

              <select>
                <option>All Status</option>
                <option>Present</option>
                <option>Absent</option>
                <option>Half Day</option>
                <option>Leave</option>
              </select>

              <button className="search-btn" onClick={handleSearch}>
                Search
              </button>
            </div>

            <div className="summary-card">
              <h4>Present</h4>
              <h2>{summary.present}</h2>
            </div>

            <div className="summary-card">
              <h4>Absent</h4>
              <h2>{summary.absent}</h2>
            </div>

            <div className="summary-card">
              <h4>Leave</h4>
              <h2>{summary.leave}</h2>
            </div>

            <div className="summary-card">
              <h4>Attendance %</h4>
              <h2>{summary.attendance}%</h2>
            </div>

            {/* Table */}
            <div className="reports-table-wrapper">
              <div className="table-header">
                <h2>Employee Attendance Report</h2>

                <div className="table-actions">
                  <button className="excel-btn" onClick={exportToExcel}>
                    Export Excel
                  </button>

                  <button className="pdf-btn" onClick={exportToPDF}>
                    Export PDF
                  </button>
                </div>
              </div>

              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length > 0 ? (
                    filteredReports.map((item) => (
                      <tr key={item.id}>
                        <td>{item.employee_name}</td>
                        <td>{item.department_name}</td>
                        <td>{item.attendance_date}</td>
                        <td>{item.status}</td>
                        <td>{item.remarks}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No attendance reports found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ===================== MANAGER REPORT SECTION ===================== */}
        {showManagerSection && (
          <>
            <div className="summary-card">
              <h4>Present</h4>
              <h2>{managerSummary.present}</h2>
            </div>

            <div className="summary-card">
              <h4>Absent</h4>
              <h2>{managerSummary.absent}</h2>
            </div>

            <div className="summary-card">
              <h4>Leave</h4>
              <h2>{managerSummary.leave}</h2>
            </div>

            <div className="summary-card">
              <h4>Attendance %</h4>
              <h2>{managerSummary.attendance}%</h2>
            </div>

            <div className="reports-table-wrapper">
              <div className="table-header">
                <h2>
                  {isOwnManagerView
                    ? "My Attendance Report"
                    : "Manager Attendance Report"}
                </h2>

                <div className="table-actions">
                  <button
                    className="excel-btn"
                    onClick={exportManagersToExcel}
                  >
                    Export Excel
                  </button>

                  <button
                    className="pdf-btn"
                    onClick={exportManagersToPDF}
                  >
                    Export PDF
                  </button>
                </div>
              </div>

              <table className="reports-table">
                <thead>
                  <tr>
                    {!isOwnManagerView && <th>Manager</th>}
                    <th>Department</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredManagerReports.length > 0 ? (
                    filteredManagerReports.map((item) => (
                      <tr key={item.id}>
                        {!isOwnManagerView && (
                          <td>{item.manager_name}</td>
                        )}
                        <td>{item.department}</td>
                        <td>{item.attendance_date}</td>
                        <td>{item.status}</td>
                        <td>{item.remarks || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isOwnManagerView ? 4 : 5}>
                        No attendance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AttendanceReports;