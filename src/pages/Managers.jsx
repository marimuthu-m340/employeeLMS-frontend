import React, { useEffect,useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { API_BASE_URL } from "../apiConfig";
import managerApi from "../api/managersApi";
import { createManager } from "../api/managersApi";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


import Sidebar from "../components/Sidebar";
import "./Managers.css";

const Managers = () => {

  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
const currentRole = loggedInUser?.role === "HR" ? "hr" : "admin";


  // ================= SIDEBAR =================
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ================= SEARCH =================
  const [search, setSearch] = useState("");

  // ================= DEPARTMENT FILTER =================
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");

  // ================= ADD MODAL =================
  const [showModal, setShowModal] = useState(false);

  // ================= VIEW MODAL =================
  const [selectedManager, setSelectedManager] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // ================= EDIT MODAL =================
  const [showEditModal, setShowEditModal] = useState(false);

  // ================= MANAGER FORM =================
  const [managerForm, setManagerForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    joiningDate: "",
    status: "Active",
  });
  // ================= STATIC MANAGER DATA =================
const [managers, setManagers] = useState([]);

  // ================= INPUT CHANGE =================
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setManagerForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const fetchManagers = async () => {
  try {
    const response = await managerApi.get("/");
    setManagers(response.data.data);
  } catch (error) {
    console.error("Error fetching managers:", error);
  }
};

  // ================= RESET FORM =================
  const resetForm = () => {
    setManagerForm({
      fullName: "",
      email: "",
      phone: "",
      department: "",
      joiningDate: "",
      status: "Active",
    });
  };

  // ================= CREATE MANAGER =================
  const handleCreateManager = async (e) => {
  e.preventDefault();

  try {
      const response = await createManager({
      fullName: managerForm.fullName,
      email: managerForm.email,
      phone: managerForm.phone,
      department: managerForm.department,
      joiningDate: managerForm.joiningDate,
      status: managerForm.status,
    });
    console.log(response.data);
    toast.success("✅ New Manager Created", {
  position: "top-right",
  autoClose: 3000,
  onClick: () => navigate("/notifications"),
});

    // Database-lendhu latest data fetch pannum
  await fetchManagers();

    // Modal close
    setShowModal(false);

    // Form reset
    resetForm();
  } catch (error) {
  console.error("Create Manager Error:", error);
  console.error("Response:", error.response?.data);

  alert(error.response?.data?.error || error.response?.data?.message || "Failed to create manager");
}
};

  // ================= EDIT MANAGER =================
const handleEditManager = async (e) => {
  e.preventDefault();

  if (!selectedManager) return;

  try {
    await managerApi.put(`/${selectedManager.id}`, {
      fullName: managerForm.fullName,
      email: managerForm.email,
      phone: managerForm.phone,
      department: managerForm.department,
      joiningDate: managerForm.joiningDate,
      status: managerForm.status,
    });

    alert("Manager Updated Successfully");

    fetchManagers();

    setShowEditModal(false);
    setSelectedManager(null);

    resetForm();
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
        "Failed to update manager"
    );
  }
};
const handleDeleteManager = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this manager?"
  );

  if (!confirmDelete) return;

  try {
    await managerApi.delete(`/${id}`);

    alert("Manager Deleted Successfully");

    await fetchManagers();
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to delete manager"
    );
  }
};

  // ================= OPEN EDIT MODAL =================
  const openEditModal = (manager) => {
    setSelectedManager(manager);

    setManagerForm({
      fullName: manager.full_name,
      email: manager.email,
      phone: manager.phone || "",
      department: manager.department,
      joiningDate: manager.joining_date || "",
      status: manager.status,
    });

    setShowEditModal(true);
  };

  // ================= OPEN ADD MODAL =================
  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // ================= FILTER MANAGERS =================
const [departments,setDepartments] = useState([]);

 const fetchDepartments = async () => {
  try {

    const response = await fetch(
      `${API_BASE_URL}/api/departments`
        );

    const data = await response.json();

    setDepartments(data);

  } catch(error) {

    console.error(
      "Department fetch error:",
      error
    );

  }
};
  useEffect(() => {

    fetchManagers();

    fetchDepartments();

  }, []);

  const filteredManagers = managers.filter((manager) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (manager.full_name || "").toLowerCase().includes(searchText) ||
      (manager.email || "").toLowerCase().includes(searchText) ||
      (manager.department || "").toLowerCase().includes(searchText);
   

    const matchesDepartment =
      departmentFilter === "All Departments" ||
      manager.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  // ================= AVATAR INITIALS =================
 const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="manager-layout">

      {/* ================= SIDEBAR ================= */}
     <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} role={currentRole} />
      

      {/* ================= MAIN CONTENT ================= */}
      <main className="main-content">


        {/* ================= MANAGER PAGE ================= */}
        <section className="managers-page">

          {/* ================= HEADER ================= */}
          <div className="managers-header">

            <div>
              <h1>Managers</h1>

              <p>
                Manage and view all managers in your organization.
              </p>
            </div>

            <button
              className="add-manager-btn"
              onClick={openAddModal}
            >
              <FaPlus />
              Add Manager
            </button>

          </div>

          {/* ================= SUMMARY CARDS ================= */}
          <div className="manager-summary">

            {/* TOTAL */}
            <div className="manager-summary-card">
              <div className="summary-card-icon total-icon">
                <FaUsers />
              </div>

              <div>
                <p>Total Managers</p>
                <h2>{managers.length}</h2>
              </div>
            </div>

            {/* ACTIVE */}
            <div className="manager-summary-card">
              <div className="summary-card-icon active-icon">
                <FaCheckCircle />
              </div>

              <div>
                <p>Active Managers</p>

                <h2>
                  {
                    managers.filter(
                      (manager) => manager.status === "Active"
                    ).length
                  }
                </h2>
              </div>
            </div>

            {/* INACTIVE */}
            <div className="manager-summary-card">
              <div className="summary-card-icon inactive-icon">
                <FaTimesCircle />
              </div>

              <div>
                <p>Inactive Managers</p>

                <h2>
                  {
                    managers.filter(
                      (manager) => manager.status === "Inactive"
                    ).length
                  }
                </h2>
              </div>
            </div>

          </div>

          {/* ================= TABLE CARD ================= */}
          <div className="managers-table-card">

            {/* TABLE HEADER */}
            <div className="manager-table-top">

              <div>
                <h2>Manager List</h2>

                <p>
                  All registered managers
                </p>
              </div>

              {/* FILTERS */}
              <div className="manager-filters">

                {/* SEARCH */}
                <div className="manager-search">
                  <FaSearch />

                  <input
                    type="text"
                    placeholder="Search manager..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* DEPARTMENT */}
                <select
                  className="manager-department-filter"
                  value={departmentFilter}
                  onChange={(e) =>
                    setDepartmentFilter(e.target.value)
                  }
                >
                  <option value="All Departments">
                    All Departments
                  </option>
 {
  departments.map((dept)=>(

    <option
      key={dept.id}
      value={dept.department_name}
    >
      {dept.department_name}
    </option>

  ))
}
                </select>

              </div>

            </div>

            {/* ================= TABLE ================= */}
            <div className="manager-table-wrapper">

              <table className="manager-table">

                <thead>
                  <tr>
                    <th>Manager</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredManagers.length > 0 ? (
                    filteredManagers.map((manager) => (

                      <tr key={manager.id}>

                        {/* MANAGER */}
                        <td>
                          <div className="manager-info">

                            <div className="manager-avatar">
                              {getInitials(manager.full_name)}
                            </div>

                            <div>
                              <strong>
                                {manager.full_name}
                              </strong>

                              <span>
                               MGR-{manager.id.slice(0,8)}
                              </span>
                            </div>

                          </div>
                        </td>

                        {/* EMAIL */}
                        <td>
                          {manager.email}
                        </td>

                        {/* DEPARTMENT */}
                        <td>
                          <span className="department-badge">
                            {manager.department}
                          </span>
                        </td>

                        {/* POSITION */}

                        {/* STATUS */}
                        <td>
                          <span
                            className={`manager-status ${
                              manager.status === "Active"
                                ? "manager-status-active"
                                : "manager-status-inactive"
                            }`}
                          >
                            {manager.status}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td>
                          <div className="manager-actions">

                            {/* VIEW */}
                            <button
                              className="manager-view-action"
                              title="View Manager"
                              onClick={() => {
                                setSelectedManager(manager);
                                setShowViewModal(true);
                              }}
                            >
                              <FaEye />
                            </button>

                            {/* EDIT */}
                            <button
                              className="manager-edit-action"
                              title="Edit Manager"
                              onClick={() =>
                                openEditModal(manager)
                              }
                            >
                              <FaEdit />
                            </button>
                            <button
  className="manager-delete-action"
  title="Delete Manager"
  onClick={() => handleDeleteManager(manager.id)}
>
  <FaTrash />
</button>

                          </div>
                        </td>

                      </tr>

                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="no-manager-data"
                      >
                        <h3>No Managers Found</h3>
                        <p>
                          Try changing your search or department filter.
                        </p>
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </section>

      </main>

      {/* ================= ADD MANAGER MODAL ================= */}
      {showModal && (
        <div className="manager-modal-overlay">

          <div className="manager-modal">

            <div className="manager-modal-header">

              <div>
                <h2>Add New Manager</h2>

                <p>
                  Create a new manager account
                </p>
              </div>

              <button
                type="button"
                className="manager-modal-close"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                <FaTimes />
              </button>

            </div>

            <form
              className="manager-form"
              onSubmit={handleCreateManager}
            >

              {/* FULL NAME */}
              <div className="manager-form-field">
                <label>Full Name</label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter manager name"
                  value={managerForm.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="manager-form-field">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={managerForm.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* PHONE */}
              <div className="manager-form-field">
                <label>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={managerForm.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* DEPARTMENT */}
              <div className="manager-form-field">
                <label>Department</label>

                <select
  name="department"
  value={managerForm.department}
  onChange={handleInputChange}
  required
>
  <option value="">
    Select Department
  </option>

  {
    departments.map((dept) => (
      <option 
        key={dept.id}
        value={dept.department_name}
      >
        {dept.department_name}
      </option>
    ))
  }

</select>
              </div>

              {/* JOINING DATE */}
              <div className="manager-form-field">
                <label>Joining Date</label>
<input
  type="date"
  name="joiningDate"
  value={managerForm.joiningDate}
  onChange={handleInputChange}
  required
/>
              </div>

              {/* STATUS */}
              <div className="manager-form-field">
                <label>Status</label>

                <select
                  name="status"
                  value={managerForm.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

              {/* ACTIONS */}
              <div className="manager-form-actions">

                <button
                  type="button"
                  className="manager-cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="manager-save-btn"
                >
                  <FaPlus />
                  Create Manager
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ================= VIEW MANAGER MODAL ================= */}
      {showViewModal && selectedManager && (
        <div className="manager-modal-overlay">

          <div className="manager-modal manager-view-modal">

            <div className="manager-modal-header">

              <div>
                <h2>Manager Details</h2>

                <p>
                  View manager information
                </p>
              </div>

              <button
                type="button"
                className="manager-modal-close"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedManager(null);
                }}
              >
                <FaTimes />
              </button>

            </div>

            <div className="manager-details">

              <div className="manager-detail-avatar">
                {getInitials(selectedManager.full_name)}
              </div>

              <h2>
                {selectedManager.full_name}
              </h2>

              <p className="manager-detail-id">
               MGR-{selectedManager.id.slice(0,8)}
              </p>

              <div className="manager-detail-grid">

                <div className="manager-detail-item">
                  <div className="manager-detail-icon">
                    @
                  </div>

                  <div>
                    <small>Email</small>
                    <strong>
                      {selectedManager.email}
                    </strong>
                  </div>
                </div>

                <div className="manager-detail-item">
                  <div className="manager-detail-icon">
                    #
                  </div>

                  <div>
                    <small>Phone</small>
                    <strong>
                      {selectedManager.phone || "Not Available"}
                    </strong>
                  </div>
                </div>

                <div className="manager-detail-item">
                  <div className="manager-detail-icon">
                    D
                  </div>

                  <div>
                    <small>Department</small>
                    <strong>
                      {selectedManager.department}
                    </strong>
                  </div>
                </div>

                <div className="manager-detail-item">
                  <div className="manager-detail-icon">
                    P
                  </div>
                </div>

                <div className="manager-detail-item">
                  <div className="manager-detail-icon">
                    J
                  </div>

                  <div>
                    <small>Joining Date</small>
                    <strong>
                      {selectedManager.joining_date || "Not Available"}
                    </strong>
                  </div>
                </div>

              </div>

              <div className="manager-detail-status">

                <span>
                  Account Status
                </span>

                <strong
                  className={
                    selectedManager.status === "Active"
                      ? "manager-status-active"
                      : "manager-status-inactive"
                  }
                >
                  {selectedManager.status}
                </strong>

              </div>

            </div>

            <div className="manager-modal-footer">

              <button
                type="button"
                className="manager-cancel-btn"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedManager(null);
                }}
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================= EDIT MANAGER MODAL ================= */}
      {showEditModal && selectedManager && (
        <div className="manager-modal-overlay">

          <div className="manager-modal">

            <div className="manager-modal-header">

              <div>
                <h2>Edit Manager</h2>

                <p>
                  Update manager information
                </p>
              </div>

              <button
                type="button"
                className="manager-modal-close"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedManager(null);
                  resetForm();
                }}
              >
                <FaTimes />
              </button>

            </div>

            <form
              className="manager-form"
              onSubmit={handleEditManager}
            >

              <div className="manager-form-field">
                <label>Full Name</label>

                <input
                  type="text"
                  name="fullName"
                  value={managerForm.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="manager-form-field">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={managerForm.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="manager-form-field">
                <label>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  value={managerForm.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="manager-form-field">
                <label>Department</label>

                <select
                  name="department"
                  value={managerForm.department}
                  onChange={handleInputChange}
                  required
                >
                 {
  departments.map((dept) => (
    <option
      key={dept.id}
      value={dept.department_name}
    >
      {dept.department_name}
    </option>
  ))
}
                </select>
              </div>

              <div className="manager-form-field">
                <label>Joining Date</label>

                <input
  type="date"
  name="joiningDate"
  value={managerForm.joiningDate}
  onChange={handleInputChange}
  required/>
              </div>

              <div className="manager-form-field">
                <label>Status</label>

                <select
                  name="status"
                  value={managerForm.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

              <div className="manager-form-actions">

                <button
                  type="button"
                  className="manager-cancel-btn"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedManager(null);
                    resetForm();
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="manager-save-btn"
                >
                  <FaEdit />
                  Update Manager
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Managers;
