import React, { useEffect, useState } from "react";
import {
FaSearch,
FaPlus,
FaEye,
FaEdit,
FaTrash,
FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getManagers } from "../api/managersApi";


import {
getEmployees,
getDepartments,
createEmployee,
updateEmployee,
deleteEmployee,
} from "../api/employeeApi";

import Sidebar from "../components/Sidebar";
import "./Employees.css";

const Employees = () => {
const [sidebarOpen, setSidebarOpen] = useState(false);

const [search, setSearch] = useState("");
const [departmentFilter, setDepartmentFilter] =
useState("All Departments");

const [showModal, setShowModal] = useState(false);
const [showViewModal, setShowViewModal] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);

const [selectedEmployee, setSelectedEmployee] =
useState(null);

const [employees, setEmployees] = useState([]);
const [managers, setManagers] = useState([]);
const [departments, setDepartments] = useState([]);

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [formLoading, setFormLoading] = useState(false);
const [deletingId, setDeletingId] = useState(null);

const [employeeForm, setEmployeeForm] = useState({
  fullName: "",
  email: "",
  phone: "",
  department: "",
  departmentId: "",
  managerId: "",   // NEW
  position: "",
  joiningDate: "",
  employmentType: "Full Time",
  status: "Active",
});

// =====================================================
// FETCH MANAGERS  ✅ FIXED
// =====================================================
const fetchManagers = async () => {
  try {
    const result = await getManagers();

    console.log("Managers API:", result);

    if (result.success) {
      setManagers(result.data);
    }
  } catch (err) {
    console.log(err);
  }
};

// =====================================================
// FETCH EMPLOYEES
// =====================================================

const fetchEmployees = async () => {
try {
setLoading(true);
setError("");

  const result = await getEmployees();

  console.log(
    "EMPLOYEES API RESPONSE:",
    result
  );

  if (
    result &&
    result.success === true
  ) {
    const employeeList =
      Array.isArray(result.data)
        ? result.data
        : [];

    const formattedEmployees =
      employeeList.map((employee) => ({
        id: employee.id || "",
        employeeCode:
          employee.employee_code || "",
        userId:
          employee.user_id || "",
        name:
          employee.full_name || "",
        email:
          employee.email || "",
        phone:
          employee.phone || "",
        departmentId:
          employee.department_id || "",
        department:
          employee.department_name ||
          employee.department ||
          "",
         managerId:
        employee.manager_id || "", 
        position:
          employee.designation || "",
        joiningDate:
          employee.joining_date || "",
        employmentType:
          employee.employment_type ||
          "Full Time",
        status:
          employee.status ||
          "Active",
      }));

    setEmployees(
      formattedEmployees
    );
  } else {
    setEmployees([]);

    setError(
      result?.message ||
        "Failed to fetch employees"
    );
  }
} catch (error) {
  console.error(
    "FETCH EMPLOYEES ERROR:",
    error.response?.data ||
      error.message
  );

  setEmployees([]);

  setError(
    error.response?.data?.message ||
      "Failed to fetch employees. Please check the backend server."
  );
} finally {
  setLoading(false);
}

};

// =====================================================
// FETCH DEPARTMENTS
// =====================================================

const fetchDepartments = async () => {
try {
const result =
await getDepartments();

  console.log(
    "DEPARTMENTS API RESPONSE:",
    result
  );

  if (
    result &&
    result.success === true
  ) {
    const departmentList =
      Array.isArray(result.data)
        ? result.data
        : [];

    setDepartments(
      departmentList
    );
  } else {
    console.error(
      "FAILED TO FETCH DEPARTMENTS:",
      result?.message
    );

    setDepartments([]);
  }
} catch (error) {
  console.error(
    "FETCH DEPARTMENTS ERROR:",
    error.response?.data ||
      error.message
  );

  setDepartments([]);
}

};

// =====================================================
// INITIAL LOAD
// =====================================================

useEffect(() => {
fetchEmployees();
fetchDepartments();
fetchManagers();
}, []);

// =====================================================
// HANDLE INPUT CHANGE
// =====================================================

const handleInputChange = (e) => {
const {
name,
value,
} = e.target;

if (
  name === "department"
) {
  const selectedDepartment =
    departments.find(
      (department) =>
        String(
          department.id
        ) ===
        String(value)
    );

  setEmployeeForm(
    (prevForm) => ({
      ...prevForm,
      department:
        selectedDepartment?.department_name ||
        "",
      departmentId:
        value,
    })
  );

  return;
}

setEmployeeForm(
  (prevForm) => ({
    ...prevForm,
    [name]: value,
  })
);

};

// =====================================================
// RESET FORM
// =====================================================

const resetEmployeeForm = () => {
setEmployeeForm({
fullName: "",
email: "",
phone: "",
department: "",
departmentId: "",
managerId: "",
position: "",
joiningDate: "",
employmentType:
"Full Time",
status: "Active",
});
};

// =====================================================
// OPEN ADD MODAL
// =====================================================

const handleOpenAddModal = () => {
resetEmployeeForm();
setError("");
setShowModal(true);
};

// =====================================================
// CLOSE ADD MODAL
// =====================================================

const handleCloseAddModal = () => {
if (formLoading) {
return;
}

setShowModal(false);
resetEmployeeForm();

};

// =====================================================
// CREATE EMPLOYEE
// =====================================================

const handleCreateEmployee =
async (e) => {
e.preventDefault();

  if (
    !employeeForm.fullName.trim()
  ) {
    alert(
      "Please enter employee name"
    );
    return;
  }

  if (
    !employeeForm.email.trim()
  ) {
    alert(
      "Please enter employee email"
    );
    return;
  }

  if (
    !employeeForm.departmentId
  ) {
    alert(
      "Please select a department"
    );
    return;
  }

  if (
    !employeeForm.position.trim()
  ) {
    alert(
      "Please enter employee position"
    );
    return;
  }

  if (
    !employeeForm.joiningDate
  ) {
    alert(
      "Please select joining date"
    );
    return;
  }

  try {
    setFormLoading(true);
    setError("");

    const employeeData = {
      fullName:
        employeeForm.fullName.trim(),

      email:
        employeeForm.email.trim(),

      phone:
        employeeForm.phone.trim(),

      department:
        employeeForm.department,

      departmentId:
        employeeForm.departmentId,
        
      managerId:
        employeeForm.managerId, // NEW

      position:
        employeeForm.position.trim(),

      joiningDate:
        employeeForm.joiningDate,

      employmentType:
        employeeForm.employmentType,

      status:
        employeeForm.status,
    };

    console.log(
      "CREATE EMPLOYEE DATA:",
      employeeData
    );

    const result =
      await createEmployee(
        employeeData
      );

    console.log(
      "CREATE EMPLOYEE RESPONSE:",
      result
    );

    if (
      result &&
      result.success === true
    ) {
     toast.success("✅ New Employee Created", {
    position: "top-right",
    autoClose: 3000,
    onClick: () => navigate("/notifications"),
  });

      setShowModal(false);

      resetEmployeeForm();

      await fetchEmployees();
    } else {
      alert(
        result?.message ||
          "Failed to create employee"
      );
    }
  } catch (error) {
    console.error(
      "CREATE EMPLOYEE ERROR:",
      error.response?.data ||
        error.message
    );

    alert(
      error.response?.data?.message ||
        "Failed to create employee"
    );
  } finally {
    setFormLoading(false);
  }
};

// =====================================================
// OPEN VIEW MODAL
// =====================================================

const handleViewEmployee = (
employee
) => {
setSelectedEmployee(
employee
);

setShowViewModal(true);

};

// =====================================================
// CLOSE VIEW MODAL
// =====================================================

const handleCloseViewModal =
() => {
if (deletingId) {
return;
}

  setShowViewModal(false);

  setSelectedEmployee(null);
};

// =====================================================
// OPEN EDIT MODAL
// =====================================================

const handleEditEmployee = (
employee
) => {
setSelectedEmployee(
employee
);

setEmployeeForm({
  fullName:
    employee.name || "",

  email:
    employee.email || "",

  phone:
    employee.phone || "",

  department:
    employee.department || "",

  departmentId:
    employee.departmentId || "",

  managerId:
    employee.managerId || "",

  position:
    employee.position || "",

  joiningDate:
    employee.joiningDate || "",

  employmentType:
    employee.employmentType ||
    "Full Time",

  status:
    employee.status ||
    "Active",
});

setShowEditModal(true);

};

// =====================================================
// CLOSE EDIT MODAL
// =====================================================

const handleCloseEditModal =
() => {
if (formLoading) {
return;
}

  setShowEditModal(false);

  setSelectedEmployee(null);

  resetEmployeeForm();
};

// =====================================================
// UPDATE EMPLOYEE
// =====================================================

const handleUpdateEmployee =
async (e) => {
e.preventDefault();

  if (!selectedEmployee) {
    return;
  }

  if (
    !employeeForm.fullName.trim()
  ) {
    alert(
      "Please enter employee name"
    );
    return;
  }

  if (
    !employeeForm.email.trim()
  ) {
    alert(
      "Please enter employee email"
    );
    return;
  }

  if (
    !employeeForm.departmentId
  ) {
    alert(
      "Please select a department"
    );
    return;
  }

  try {
    setFormLoading(true);
    setError("");

    const employeeData = {
      fullName:
        employeeForm.fullName.trim(),

      email:
        employeeForm.email.trim(),

      phone:
        employeeForm.phone.trim(),

      department:
        employeeForm.department,

      departmentId:
        employeeForm.departmentId,

      managerId:
         employeeForm.managerId,

      position:
        employeeForm.position.trim(),

      joiningDate:
        employeeForm.joiningDate,

      employmentType:
        employeeForm.employmentType,

      status:
        employeeForm.status,
    };

    console.log(
      "UPDATE EMPLOYEE DATA:",
      employeeData
    );

    const result =
      await updateEmployee(
        selectedEmployee.id,
        employeeData
      );

    console.log(
      "UPDATE EMPLOYEE RESPONSE:",
      result
    );

    if (
      result &&
      result.success === true
    ) {
      alert(
        "Employee Updated Successfully"
      );

      setShowEditModal(false);

      setSelectedEmployee(
        null
      );

      resetEmployeeForm();

      await fetchEmployees();
    } else {
      alert(
        result?.message ||
          "Failed to update employee"
      );
    }
  } catch (error) {
    console.error(
      "UPDATE EMPLOYEE ERROR:",
      error.response?.data ||
        error.message
    );

    alert(
      error.response?.data?.message ||
        "Failed to update employee"
    );
  } finally {
    setFormLoading(false);
  }
};

// =====================================================
// DELETE EMPLOYEE
// =====================================================

const handleDeleteEmployee =
async (employee) => {
if (
!employee ||
!employee.id
) {
return;
}

  const confirmDelete =
    window.confirm(
      "Are you sure you want to delete this employee?"
    );

  if (!confirmDelete) {
    return;
  }

  try {
    setDeletingId(
      employee.id
    );

    setError("");

    const result =
      await deleteEmployee(
        employee.id
      );

    console.log(
      "DELETE EMPLOYEE RESPONSE:",
      result
    );

    if (
      result &&
      result.success === true
    ) {
      alert(
        "Employee Deleted Successfully"
      );

      setShowViewModal(false);

      setSelectedEmployee(
        null
      );

      await fetchEmployees();
    } else {
      alert(
        result?.message ||
          "Failed to delete employee"
      );
    }
  } catch (error) {
    console.error(
      "DELETE EMPLOYEE ERROR:",
      error.response?.data ||
        error.message
    );

    alert(
      error.response?.data?.message ||
        "Failed to delete employee"
    );
  } finally {
    setDeletingId(null);
  }
};

// =====================================================
// FILTER EMPLOYEES
// =====================================================

const filteredEmployees =
employees.filter(
(employee) => {
const searchText =
search
.toLowerCase()
.trim();

    const matchesSearch =
      employee.name
        ?.toLowerCase()
        .includes(
          searchText
        ) ||
      employee.email
        ?.toLowerCase()
        .includes(
          searchText
        ) ||
      employee.employeeCode
        ?.toLowerCase()
        .includes(
          searchText
        );

    const matchesDepartment =
      departmentFilter ===
        "All Departments" ||
      employee.department ===
        departmentFilter;

    return (
      matchesSearch &&
      matchesDepartment
    );
  }
);

// =====================================================
// EMPLOYEE INITIALS
// =====================================================

const getEmployeeInitials = (
name
) => {
if (!name) {
return "NA";
}

return name
  .split(" ")
  .filter(Boolean)
  .map(
    (part) => part[0]
  )
  .join("")
  .slice(0, 2)
  .toUpperCase();

};

// =====================================================
// RENDER
// =====================================================

return (
<div className="employees-layout">

  <Sidebar
    sidebarOpen={
      sidebarOpen
    }
    setSidebarOpen={
      setSidebarOpen
    }
  />

  <main className="main-content">

    <div className="employees-page">

      <div className="employees-header">

        <div>
          <h1>
            Employees
          </h1>

          <p>
            Manage and view all employees
            in your organization.
          </p>
        </div>

        <button
          type="button"
          className="add-employee-btn"
          onClick={
            handleOpenAddModal
          }
        >
          <FaPlus />
          Add Employee
        </button>

      </div>

      <div className="employee-summary">

        <div className="employee-summary-card">

          <div className="summary-card-icon">
            👥
          </div>

          <div>
            <p>
              Total Employees
            </p>

            <h2>
              {
                employees.length
              }
            </h2>
          </div>

        </div>

        <div className="employee-summary-card">

          <div className="summary-card-icon active-icon">
            ✓
          </div>

          <div>
            <p>
              Active Employees
            </p>

            <h2>
              {
                employees.filter(
                  (
                    employee
                  ) =>
                    employee.status ===
                    "Active"
                ).length
              }
            </h2>
          </div>

        </div>

        <div className="employee-summary-card">

          <div className="summary-card-icon inactive-icon">
            ×
          </div>

          <div>
            <p>
              Inactive Employees
            </p>

            <h2>
              {
                employees.filter(
                  (
                    employee
                  ) =>
                    employee.status ===
                    "Inactive"
                ).length
              }
            </h2>
          </div>

        </div>

      </div>

      <div className="employees-table-card">

        <div className="table-top">

          <div>
            <h2>
              Employee List
            </h2>

            <p>
              All registered employees
            </p>
          </div>

          <div className="employee-filters">

            <div className="employee-search">

              <FaSearch />

              <input
                type="text"
                placeholder="Search employee..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            <select
              className="department-filter"
              value={
                departmentFilter
              }
              onChange={(e) =>
                setDepartmentFilter(
                  e.target.value
                )
              }
            >

              <option value="All Departments">
                All Departments
              </option>

              {departments.map(
                (
                  department
                ) => (
                  <option
                    key={
                      department.id
                    }
                    value={
                      department.department_name
                    }
                  >
                    {
                      department.department_name
                    }
                  </option>
                )
              )}

            </select>

          </div>

        </div>

        {loading && (
          <div
            style={{
              textAlign:
                "center",
              padding:
                "40px",
            }}
          >
            Loading employees...
          </div>
        )}

        {!loading &&
          error && (
            <div
              style={{
                textAlign:
                  "center",
                padding:
                  "30px",
                color:
                  "red",
              }}
            >
              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={
                  fetchEmployees
                }
              >
                Try Again
              </button>
            </div>
          )}

        {!loading &&
          !error && (
            <div className="employee-table-wrapper">

              <table className="employee-table">

                <thead>

                  <tr>
                    <th>
                      Employee
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Department
                    </th>

                    <th>
                      Position
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {filteredEmployees.length >
                  0 ? (
                    filteredEmployees.map(
                      (
                        employee
                      ) => (
                        <tr
                          key={
                            employee.id
                          }
                        >

                          <td>

                            <div className="employee-info">

                              <div className="employee-avatar">
                                {
                                  getEmployeeInitials(
                                    employee.name
                                  )
                                }
                              </div>

                              <div>

                                <strong>
                                  {
                                    employee.name
                                  }
                                </strong>

                                <span>
                                  {
                                    employee.employeeCode ||
                                    "N/A"
                                  }
                                </span>

                              </div>

                            </div>

                          </td>

                          <td>
                            {
                              employee.email ||
                              "Not Available"
                            }
                          </td>

                          <td>
                            {
                              employee.department ||
                              "Not Available"
                            }
                          </td>

                          <td>
                            {
                              employee.position ||
                              "Not Available"
                            }
                          </td>

                          <td>

                            <span
                              className={
                                "employee-status " +
                                (
                                  employee.status ===
                                  "Active"
                                    ? "status-active"
                                    : "status-inactive"
                                )
                              }
                            >
                              {
                                employee.status
                              }
                            </span>

                          </td>

                          <td>

                            <div className="employee-actions">

                              <button
                                type="button"
                                className="view-action"
                                title="View Employee"
                                onClick={() =>
                                  handleViewEmployee(
                                    employee
                                  )
                                }
                              >
                                <FaEye />
                              </button>

                              <button
                                type="button"
                                className="edit-action"
                                title="Edit Employee"
                                onClick={() =>
                                  handleEditEmployee(
                                    employee
                                  )
                                }
                              >
                                <FaEdit />
                              </button>

                              <button
                                type="button"
                                className="delete-action"
                                title="Delete Employee"
                                onClick={() =>
                                  handleDeleteEmployee(
                                    employee
                                  )
                                }
                                disabled={
                                  deletingId ===
                                  employee.id
                                }
                              >
                                <FaTrash />
                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )
                  ) : (
                    <tr>

                      <td
                        colSpan="6"
                        style={{
                          textAlign:
                            "center",
                          padding:
                            "30px",
                        }}
                      >
                        No employees found
                      </td>

                    </tr>
                  )}

                </tbody>

              </table>

            </div>
          )}

      </div>

      {showModal && (

        <div className="employee-modal-overlay">

          <div className="employee-modal">

            <div className="employee-modal-header">

              <div>
                <h2>
                  Add New Employee
                </h2>

                <p>
                  Create a new employee account
                </p>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={
                  handleCloseAddModal
                }
              >
                <FaTimes />
              </button>

            </div>

            <form
              className="employee-form"
              onSubmit={
                handleCreateEmployee
              }
            >

              <div className="form-field">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter employee name"
                  value={
                    employeeForm.fullName
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                />

              </div>

              <div className="form-field">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={
                    employeeForm.email
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                />

              </div>

              <div className="form-field">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={
                    employeeForm.phone
                  }
                  onChange={
                    handleInputChange
                  }
                />

              </div>

              <div className="form-field">

                <label>
                  Department
                </label>

                <select
                  name="department"
                  value={
                    employeeForm.departmentId
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                >

                  <option value="">
                    Select Department
                  </option>

                  {departments.map(
                    (
                      department
                    ) => (
                      <option
                        key={
                          department.id
                        }
                        value={
                          department.id
                        }
                      >
                        {
                          department.department_name
                        }
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* ✅ FIXED: filter out null user_id + use manager.user_id as value */}
              <div className="form-field">
  <label>Reporting Manager</label>

  <select
    name="managerId"
    value={employeeForm.managerId}
    onChange={handleInputChange}
    required
  >
    <option value="">Select Manager</option>

    {managers
      .filter((manager) => !!manager.user_id)
      .map((manager) => (
        <option
          key={manager.id}
          value={manager.user_id}
        >
          {manager.full_name}
        </option>
      ))}
  </select>
</div>

              <div className="form-field">

                <label>
                  Position
                </label>

                <input
                  type="text"
                  name="position"
                  placeholder="Enter job position"
                  value={
                    employeeForm.position
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                />

              </div>

              <div className="form-field">

                <label>
                  Joining Date
                </label>

                <input
                  type="date"
                  name="joiningDate"
                  value={
                    employeeForm.joiningDate
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                />

              </div>

              <div className="form-field">

                <label>
                  Employment Type
                </label>

                <select
                  name="employmentType"
                  value={
                    employeeForm.employmentType
                  }
                  onChange={
                    handleInputChange
                  }
                >

                  <option value="Full Time">
                    Full Time
                  </option>

                  <option value="Part Time">
                    Part Time
                  </option>

                  <option value="Contract">
                    Contract
                  </option>

                  <option value="Intern">
                    Intern
                  </option>

                </select>

              </div>

              <div className="form-field">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={
                    employeeForm.status
                  }
                  onChange={
                    handleInputChange
                  }
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>

              <div className="employee-form-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={
                    handleCloseAddModal
                  }
                  disabled={
                    formLoading
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="create-employee-btn"
                  disabled={
                    formLoading
                  }
                >

                  <FaPlus />

                  {formLoading
                    ? "Creating..."
                    : "Create Employee"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {showViewModal &&
        selectedEmployee && (

          <div className="employee-modal-overlay">

            <div className="employee-modal view-employee-modal">

              <div className="employee-modal-header">

                <div>
                  <h2>
                    Employee Details
                  </h2>

                  <p>
                    View employee information
                  </p>
                </div>

                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={
                    handleCloseViewModal
                  }
                >
                  <FaTimes />
                </button>

              </div>

              <div className="employee-details">

                <div className="employee-detail-avatar">
                  {
                    getEmployeeInitials(
                      selectedEmployee.name
                    )
                  }
                </div>

                <h2>
                  {
                    selectedEmployee.name
                  }
                </h2>

                <p className="employee-id">
                  {
                    selectedEmployee.employeeCode ||
                    "N/A"
                  }
                </p>

                <div className="detail-row">

                  <strong>
                    Email
                  </strong>

                  <span>
                    {
                      selectedEmployee.email ||
                      "Not Available"
                    }
                  </span>

                </div>

                <div className="detail-row">

                  <strong>
                    Phone
                  </strong>

                  <span>
                    {
                      selectedEmployee.phone ||
                      "Not Available"
                    }
                  </span>

                </div>

                <div className="detail-row">

                  <strong>
                    Department
                  </strong>

                  <span>
                    {
                      selectedEmployee.department ||
                      "Not Available"
                    }
                  </span>

                </div>

                <div className="detail-row">

                  <strong>
                    Position
                  </strong>

                  <span>
                    {
                      selectedEmployee.position ||
                      "Not Available"
                    }
                  </span>

                </div>

                <div className="detail-row">

                  <strong>
                    Joining Date
                  </strong>

                  <span>
                    {
                      selectedEmployee.joiningDate ||
                      "Not Available"
                    }
                  </span>

                </div>

                <div className="detail-row">

                  <strong>
                    Employment Type
                  </strong>

                  <span>
                    {
                      selectedEmployee.employmentType ||
                      "Not Available"
                    }
                  </span>

                </div>

                <div className="detail-row">

                  <strong>
                    Status
                  </strong>

                  <span
                    className={
                      selectedEmployee.status ===
                      "Active"
                        ? "status-active"
                        : "status-inactive"
                    }
                  >
                    {
                      selectedEmployee.status
                    }
                  </span>

                </div>

              </div>

              <div className="employee-form-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={
                    handleCloseViewModal
                  }
                >
                  Close
                </button>

                <button
                  type="button"
                  className="delete-action"
                  onClick={() =>
                    handleDeleteEmployee(
                      selectedEmployee
                    )
                  }
                  disabled={
                    deletingId ===
                    selectedEmployee.id
                  }
                >
                  <FaTrash />

                  {deletingId ===
                  selectedEmployee.id
                    ? "Deleting..."
                    : "Delete"}

                </button>

              </div>

            </div>

          </div>

        )}

      {showEditModal &&
        selectedEmployee && (

          <div className="employee-modal-overlay">

            <div className="employee-modal">

              <div className="employee-modal-header">

                <div>
                  <h2>
                    Edit Employee
                  </h2>

                  <p>
                    Update employee information
                  </p>
                </div>

                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={
                    handleCloseEditModal
                  }
                >
                  <FaTimes />
                </button>

              </div>

              <form
                className="employee-form"
                onSubmit={
                  handleUpdateEmployee
                }
              >

                <div className="form-field">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter employee name"
                    value={
                      employeeForm.fullName
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                  />

                </div>

                <div className="form-field">

                  <label>
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={
                      employeeForm.email
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                  />

                </div>

                <div className="form-field">

                  <label>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={
                      employeeForm.phone
                    }
                    onChange={
                      handleInputChange
                    }
                  />

                </div>

                <div className="form-field">

                  <label>
                    Department
                  </label>

                  <select
                    name="department"
                    value={
                      employeeForm.departmentId
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                  >

                    <option value="">
                      Select Department
                    </option>

                    {departments.map(
                      (
                        department
                      ) => (
                        <option
                          key={
                            department.id
                          }
                          value={
                            department.id
                          }
                        >
                          {
                            department.department_name
                          }
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* ✅ FIXED: filter out null user_id + use manager.user_id as value */}
                <div className="form-field">
  <label>Reporting Manager</label>

  <select
    name="managerId"
    value={employeeForm.managerId}
    onChange={handleInputChange}
    required
  >
    <option value="">Select Manager</option>

    {managers
      .filter((manager) => !!manager.user_id)
      .map((manager) => (
        <option
          key={manager.id}
          value={manager.user_id}
        >
          {manager.full_name}
        </option>
      ))}
  </select>
</div>

                <div className="form-field">

                  <label>
                    Position
                  </label>

                  <input
                    type="text"
                    name="position"
                    placeholder="Enter job position"
                    value={
                      employeeForm.position
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                  />

                </div>

                <div className="form-field">

                  <label>
                    Joining Date
                  </label>

                  <input
                    type="date"
                    name="joiningDate"
                    value={
                      employeeForm.joiningDate
                    }
                    onChange={
                      handleInputChange
                    }
                  />

                </div>

                <div className="form-field">

                  <label>
                    Employment Type
                  </label>

                  <select
                    name="employmentType"
                    value={
                      employeeForm.employmentType
                    }
                    onChange={
                      handleInputChange
                    }
                  >

                    <option value="Full Time">
                      Full Time
                    </option>

                    <option value="Part Time">
                      Part Time
                    </option>

                    <option value="Contract">
                      Contract
                    </option>

                    <option value="Intern">
                      Intern
                    </option>

                  </select>

                </div>

                <div className="form-field">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      employeeForm.status
                    }
                    onChange={
                      handleInputChange
                    }
                  >

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>

                </div>

                <div className="employee-form-actions">

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={
                      handleCloseEditModal
                    }
                    disabled={
                      formLoading
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="create-employee-btn"
                    disabled={
                      formLoading
                    }
                  >

                    <FaEdit />

                    {formLoading
                      ? "Updating..."
                      : "Update Employee"}

                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

    </div>

  </main>

</div>

);
};

export default Employees;