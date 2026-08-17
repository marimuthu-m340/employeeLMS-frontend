import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaBuilding,
} from "react-icons/fa";

import departmentApi from "../api/departmentsApi";
import Sidebar from "../components/Sidebar";
import "./Departments.css";

const Departments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [departmentForm, setDepartmentForm] = useState({
    departmentName: "",
  });
  // =====================================================
  // FETCH DEPARTMENTS
  // =====================================================

 const fetchDepartments = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await departmentApi.get("/");
    const payload = response.data;

    console.log("Departments fetch response:", payload);

    if (Array.isArray(payload)) {
      setDepartments(payload);
    } else if (payload && payload.success === true) {
      setDepartments(payload.data || []);
    } else if (payload && Array.isArray(payload.data)) {
      setDepartments(payload.data);
    } else {
      setDepartments([]);
      setError("Failed to fetch departments");
    }

  } catch (error) {
    console.error(error);

    setDepartments([]);

    setError(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to fetch departments"
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchDepartments();
  }, []);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setDepartmentForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetDepartmentForm = () => {
    setDepartmentForm({ departmentName: "" });
  };

  // =====================================================
  // ADD MODAL
  // =====================================================

  const handleOpenAddModal = () => {
    resetDepartmentForm();
    setError("");
    setShowModal(true);
  };

  const handleCloseAddModal = () => {
    if (formLoading) return;

    setShowModal(false);
    resetDepartmentForm();
  };

  // =====================================================
  // CREATE DEPARTMENT
  // =====================================================

  const handleCreateDepartment = async (e) => {
    e.preventDefault();

    if (!departmentForm.departmentName.trim()) {
      alert("Please enter department name");
      return;
    }

    try {
      setFormLoading(true);
      setError("");

      const result = await departmentApi.post("/", {
  department_name: departmentForm.departmentName,
});
      console.log("CREATE DEPARTMENT RESPONSE:", result);

      if (result && result.data && result.data.id) {
        alert("Department Created Successfully");
        setShowModal(false);
        resetDepartmentForm();

        await fetchDepartments();
      } else {
        alert(result?.message || "Failed to create department");
      }
    } catch (error) {
      console.error(
        "CREATE DEPARTMENT ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message || "Failed to create department"
      );
    } finally {
      setFormLoading(false);
    }
  };

  // =====================================================
  // VIEW MODAL
  // =====================================================

  const handleViewDepartment = (department) => {
    setSelectedDepartment(department);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    if (deletingId) return;

    setShowViewModal(false);
    setSelectedDepartment(null);
  };

  // =====================================================
  // EDIT MODAL
  // =====================================================

  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);

    setDepartmentForm({
      departmentName: department.department_name || "",
    });

    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    if (formLoading) return;

    setShowEditModal(false);
    setSelectedDepartment(null);
    resetDepartmentForm();
  };

  // =====================================================
  // UPDATE DEPARTMENT
  // =====================================================

  const handleUpdateDepartment = async (e) => {
    e.preventDefault();

    if (!selectedDepartment) return;

    if (!departmentForm.departmentName.trim()) {
      alert("Please enter department name");
      return;
    }

    try {
      setFormLoading(true);
      setError("");

   const result = await departmentApi.put(`/${selectedDepartment.id}`, {
  department_name: departmentForm.departmentName,
});
      console.log("UPDATE DEPARTMENT RESPONSE:", result);

      if (result && result.data && result.data.id) {
        alert("Department Updated Successfully");

        setShowEditModal(false);
        setSelectedDepartment(null);
        resetDepartmentForm();

        await fetchDepartments();
      } else {
        alert(result?.message || "Failed to update department");
      }
    } catch (error) {
      console.error(
        "UPDATE DEPARTMENT ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message || "Failed to update department"
      );
    } finally {
      setFormLoading(false);
    }
  };

  // =====================================================
  // DELETE DEPARTMENT
  // =====================================================

  const handleDeleteDepartment = async (department) => {
    if (!department || !department.id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(department.id);
      setError("");
const result = await departmentApi.delete(`/${department.id}`);
      console.log("DELETE DEPARTMENT RESPONSE:", result);

      if (result && result.data && result.data.success === true){
        alert("Department Deleted Successfully");

        setShowViewModal(false);
        setSelectedDepartment(null);

        await fetchDepartments();
      } else {
        alert(result?.message || "Failed to delete department");
      }
    } catch (error) {
      console.error(
        "DELETE DEPARTMENT ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message || "Failed to delete department"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // FILTER DEPARTMENTS
  // =====================================================

  const filteredDepartments = departments.filter((department) => {
    const searchText = search.toLowerCase().trim();

    return department.department_name?.toLowerCase().includes(searchText);
  });

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="departments-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="main-content">
        <div className="departments-page">
          <div className="departments-header">
            <div>
              <h1>Departments</h1>
              <p>Manage the departments employees can be assigned to.</p>
            </div>

            <button
              type="button"
              className="add-department-btn"
              onClick={handleOpenAddModal}
            >
              <FaPlus />
              Add Department
            </button>
          </div>

          <div className="department-summary">
            <div className="department-summary-card">
              <div className="summary-card-icon">
                <FaBuilding />
              </div>

              <div>
                <p>Total Departments</p>
                <h2>{departments.length}</h2>
              </div>
            </div>
          </div>

          <div className="departments-table-card">
            <div className="table-top">
              <div>
                <h2>Department List</h2>
                <p>All registered departments</p>
              </div>

              <div className="department-filters">
                <div className="department-search">
                  <FaSearch />

                  <input
                    type="text"
                    placeholder="Search department..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {loading && (
              <div style={{ textAlign: "center", padding: "40px" }}>
                Loading departments...
              </div>
            )}

            {!loading && error && (
              <div style={{ textAlign: "center", padding: "30px", color: "red" }}>
                <p>{error}</p>
                <button type="button" onClick={fetchDepartments}>
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="department-table-wrapper">
                <table className="department-table">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th className="actions-col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDepartments.length > 0 ? (
                      filteredDepartments.map((department) => (
                        <tr key={department.id}>
                          <td>
                            <div className="department-info">
                              <div className="department-avatar">
                                <FaBuilding />
                              </div>
                              <strong>{department.department_name}</strong>
                            </div>
                          </td>
                          <td className="actions-col">
                            <div className="department-actions">
                              <button
                                type="button"
                                className="view-action"
                                title="View Department"
                                onClick={() => handleViewDepartment(department)}
                              >
                                <FaEye />
                              </button>
                              <button
                                type="button"
                                className="edit-action"
                                title="Edit Department"
                                onClick={() => handleEditDepartment(department)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                type="button"
                                className="delete-action"
                                title="Delete Department"
                                onClick={() => handleDeleteDepartment(department)}
                                disabled={deletingId === department.id}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" style={{ textAlign: "center", padding: "30px" }}>
                          No departments found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {showModal && (
            <div className="department-modal-overlay">
              <div className="department-modal">
                <div className="department-modal-header">
                  <div>
                    <h2>Add New Department</h2>
                    <p>Create a new department</p>
                  </div>

                  <button
                    type="button"
                    className="modal-close-btn"
                    onClick={handleCloseAddModal}
                  >
                    <FaTimes />
                  </button>
                </div>

                <form className="department-form" onSubmit={handleCreateDepartment}>
                  <div className="form-field">
                    <label>Department Name</label>

                    <input
                      type="text"
                      name="departmentName"
                      placeholder="Enter department name"
                      value={departmentForm.departmentName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="department-form-actions">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={handleCloseAddModal}
                      disabled={formLoading}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="create-department-btn"
                      disabled={formLoading}
                    >
                      <FaPlus />
                      {formLoading ? "Creating..." : "Create Department"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showViewModal && selectedDepartment && (
            <div className="department-modal-overlay">
              <div className="department-modal view-department-modal">
                <div className="department-modal-header">
                  <div>
                    <h2>Department Details</h2>
                    <p>View department information</p>
                  </div>

                  <button
                    type="button"
                    className="modal-close-btn"
                    onClick={handleCloseViewModal}
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="department-details">
                  <div className="department-detail-avatar">
                    <FaBuilding />
                  </div>

                  <h2>{selectedDepartment.department_name}</h2>

                  <div className="detail-row">
                    <strong>Department ID</strong>
                    <span>{selectedDepartment.id}</span>
                  </div>
                </div>

                <div className="department-form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleCloseViewModal}
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    className="delete-action"
                    onClick={() => handleDeleteDepartment(selectedDepartment)}
                    disabled={deletingId === selectedDepartment.id}
                  >
                    <FaTrash />
                    {deletingId === selectedDepartment.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showEditModal && selectedDepartment && (
            <div className="department-modal-overlay">
              <div className="department-modal">
                <div className="department-modal-header">
                  <div>
                    <h2>Edit Department</h2>
                    <p>Update department information</p>
                  </div>

                  <button
                    type="button"
                    className="modal-close-btn"
                    onClick={handleCloseEditModal}
                  >
                    <FaTimes />
                  </button>
                </div>

                <form className="department-form" onSubmit={handleUpdateDepartment}>
                  <div className="form-field">
                    <label>Department Name</label>

                    <input
                      type="text"
                      name="departmentName"
                      placeholder="Enter department name"
                      value={departmentForm.departmentName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="department-form-actions">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={handleCloseEditModal}
                      disabled={formLoading}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="create-department-btn"
                      disabled={formLoading}
                    >
                      <FaEdit />
                      {formLoading ? "Updating..." : "Update Department"}
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

export default Departments;