import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaEye,
} from "react-icons/fa";

import { getEmployees } from "../../api/employeeApi";
import Sidebar from "../../components/Sidebar";
import "./ManagerEmployees.css";

const ManagerEmployees = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Logged in Manager
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  // ================= FETCH EMPLOYEES =================

  const fetchEmployees = async () => {

    try {

      setLoading(true);
      setError("");

      const result = await getEmployees();
      console.log("EMPLOYEES API RESULT:", result);

      if (result.success) {

        const employeeList = result.data || [];

        console.log("LOGGED IN USER:", loggedInUser);
console.log("EMPLOYEE LIST:", employeeList);

employeeList.forEach((emp) => {
  console.log(
    "Employee Manager ID:",
    emp.manager_id,
    "Logged Manager ID:",
    loggedInUser.id
  );
});

        // Manager-ku assign pannirukkura employees mattum
     let managerEmployees = [];

if (loggedInUser.role === "MANAGER_ADMIN") {
  // Main Manager - Show All Employees
  managerEmployees = employeeList;
} else {
  // Normal Manager - Show Only Assigned Employees
  managerEmployees = employeeList.filter(
    (emp) =>
      String(emp.manager_id) === String(loggedInUser.id)
  );
}

        const formattedEmployees =
          managerEmployees.map((emp) => ({
            id: emp.id,
            employeeCode: emp.employee_code,
            name: emp.full_name,
            email: emp.email,
            phone: emp.phone,
            department:
              emp.department_name,
            status: emp.status,
          }));

        setEmployees(formattedEmployees);
        setFilteredEmployees(formattedEmployees);

      }

    } catch (err) {

      console.log(err);

      setError(
        "Unable to fetch employees."
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchEmployees();

  }, []);

  // ================= SEARCH =================

  useEffect(() => {

    const data = employees.filter((emp) =>

      emp.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      emp.employeeCode
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      emp.email
        ?.toLowerCase()
        .includes(search.toLowerCase())

    );

    setFilteredEmployees(data);

  }, [search, employees]);

  // ================= SUMMARY =================

  const totalEmployees = employees.length;

  const activeEmployees =
    employees.filter(
      (e) => e.status === "Active"
    ).length;

  const inactiveEmployees =
    employees.filter(
      (e) => e.status === "Inactive"
    ).length;

  // ================= VIEW =================

  const handleViewEmployee = (
    employee
  ) => {

    setSelectedEmployee(employee);
    setShowViewModal(true);

  };

  const closeViewModal = () => {

    setSelectedEmployee(null);
    setShowViewModal(false);

  };

  const getInitials = (name) => {

    if (!name) return "NA";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  };
    return (
    <div className="manageremployees-layout">

      <Sidebar
        role="manager"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="manageremployees-main">
        <div className="manageremployees-content">

          {/* ================= SUMMARY ================= */}

          <div className="manageremployees-summary-grid">

            <div className="manageremployees-summary-card">
              <h4>Total Employees</h4>
              <h2>{totalEmployees}</h2>
            </div>

            <div className="manageremployees-summary-card">
              <h4>Active Employees</h4>
              <h2>{activeEmployees}</h2>
            </div>

            <div className="manageremployees-summary-card">
              <h4>Inactive Employees</h4>
              <h2>{inactiveEmployees}</h2>
            </div>

          </div>

          {/* ================= TABLE ================= */}

          <div className="manageremployees-card">

            <h3>Employees</h3>

            <div className="manageremployees-table-wrapper">

              <table className="manageremployees-table">

                <thead>

                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>
                      <td
                        colSpan="7"
                        className="manageremployees-no-data"
                      >
                        Loading...
                      </td>
                    </tr>

                  ) : filteredEmployees.length === 0 ? (

                    <tr>
                      <td
                        colSpan="7"
                        className="manageremployees-no-data"
                      >
                        No Employees Found
                      </td>
                    </tr>

                  ) : (

                    filteredEmployees.map((employee) => (

                      <tr key={employee.id}>

                        <td>{employee.employeeCode}</td>

                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >

                            <div className="profile-avatar small">
                              {getInitials(employee.name)}
                            </div>

                            {employee.name}

                          </div>
                        </td>

                        <td>{employee.department}</td>

                        <td>{employee.email}</td>

                        <td>{employee.phone}</td>

                        <td>

                          <span
                            className={`manageremployees-status ${
                              employee.status === "Active"
                                ? "status-active"
                                : employee.status === "Inactive"
                                ? "status-inactive"
                                : "status-leave"
                            }`}
                          >
                            {employee.status}
                          </span>

                        </td>

                        <td>

                          <button
                            className="manageremployees-view-btn"
                            onClick={() =>
                              handleViewEmployee(employee)
                            }
                          >
                            <FaEye />
                          </button>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>
                    {/* ================= VIEW MODAL ================= */}

          {showViewModal && selectedEmployee && (

            <div className="manageremployees-modal-overlay">

              <div className="manageremployees-modal">

                <div className="manageremployees-modal-header">

                  <h2>Employee Details</h2>

                  <button
                    className="manageremployees-close-btn"
                    onClick={closeViewModal}
                  >
                    ×
                  </button>

                </div>

                <div className="manageremployees-modal-body">

                  <div className="manageremployees-detail-row">
                    <span className="manageremployees-detail-label">
                      Employee ID
                    </span>
                    <span className="manageremployees-detail-value">
                      {selectedEmployee.employeeCode}
                    </span>
                  </div>

                  <div className="manageremployees-detail-row">
                    <span className="manageremployees-detail-label">
                      Name
                    </span>
                    <span className="manageremployees-detail-value">
                      {selectedEmployee.name}
                    </span>
                  </div>

                  <div className="manageremployees-detail-row">
                    <span className="manageremployees-detail-label">
                      Department
                    </span>
                    <span className="manageremployees-detail-value">
                      {selectedEmployee.department}
                    </span>
                  </div>

                  <div className="manageremployees-detail-row">
                    <span className="manageremployees-detail-label">
                      Email
                    </span>
                    <span className="manageremployees-detail-value">
                      {selectedEmployee.email}
                    </span>
                  </div>

                  <div className="manageremployees-detail-row">
                    <span className="manageremployees-detail-label">
                      Phone
                    </span>
                    <span className="manageremployees-detail-value">
                      {selectedEmployee.phone}
                    </span>
                  </div>

                  <div className="manageremployees-detail-row">
                    <span className="manageremployees-detail-label">
                      Status
                    </span>

                    <span
                      className={`manageremployees-status ${
                        selectedEmployee.status === "Active"
                          ? "status-active"
                          : selectedEmployee.status === "Inactive"
                          ? "status-inactive"
                          : "status-leave"
                      }`}
                    >
                      {selectedEmployee.status}
                    </span>

                  </div>

                </div>

                <div className="manageremployees-modal-footer">

                  <button
                    className="manageremployees-close"
                    onClick={closeViewModal}
                  >
                    Close
                  </button>

                </div>

              </div>

            </div>

          )}

        </div>

      </main>

    </div>

  );

};

export default ManagerEmployees;