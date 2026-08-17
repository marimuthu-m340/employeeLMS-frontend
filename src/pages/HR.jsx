import React, { useEffect,useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUserTie,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./HR.css";
import hrApi from "../api/hrApi";
import Sidebar from "../components/Sidebar";

const HR = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] =
    useState("All Departments");

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedHR, setSelectedHR] = useState(null);

  const [hrForm, setHrForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    joiningDate: "",
    employmentType: "Full Time",
    status: "Active",
  });

  const [hrList, setHrList] = useState([
    
  ]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setHrForm({
      ...hrForm,
      [name]: value,
    });
  };

  const resetForm = () => {
    setHrForm({
      fullName: "",
      email: "",
      phone: "",
      joiningDate: "",
      employmentType: "Full Time",
      status: "Active",
    });
  };

  const fetchHR = async () => {

  try {

    const response = await hrApi.get("/");

    setHrList(response.data);

  } catch(error) {

    console.error(
      "Fetch HR Error:",
      error
    );

  }};
  
  // CREATE HR
 const handleCreateHR = async (e) => {
  e.preventDefault();

  try {
    await hrApi.post("/", {
      fullName: hrForm.fullName,
      email: hrForm.email,
      phone: hrForm.phone,
      joiningDate: hrForm.joiningDate,
      employmentType: hrForm.employmentType,
      status: hrForm.status,
    });

   toast.success("✅ New HR Created", {
  position: "top-right",
  autoClose: 3000,
});
    await fetchHR();

    setShowModal(false);

    resetForm();
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to create HR"
    );
  }
};

useEffect(() => {

  fetchHR();

}, []);
  // VIEW HR
  const handleViewHR = (hr) => {
    setSelectedHR(hr);
    setShowViewModal(true);
  };

  // EDIT HR
  const handleEditHR = (hr) => {
    setSelectedHR(hr);
setHrForm({
fullName: hr.full_name,
email: hr.email,
phone: hr.phone,
joiningDate: hr.joining_date,
employmentType: hr.employment_type,
status: hr.status,
});

    setShowEditModal(true);
  };

  // UPDATE HR
  const handleUpdateHR = (e) => {
    e.preventDefault();

    const updatedHRList = hrList.map((hr) =>
      hr.id === selectedHR.id
        ? {
            ...hr,
            name: hrForm.fullName,
            email: hrForm.email,
            phone: hrForm.phone,
            joiningDate: hrForm.joiningDate,
            employmentType: hrForm.employmentType,
            status: hrForm.status,
          }
        : hr
    );

    setHrList(updatedHRList);

    alert("HR Updated Successfully");

    setShowEditModal(false);
    setSelectedHR(null);
    resetForm();
  };

  // DELETE HR
  const handleDeleteHR = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this HR?"
    );

    if (!confirmDelete) return;

    setHrList(
      hrList.filter((hr) => hr.id !== id)
    );

    alert("HR Deleted Successfully");
  };

  // FILTER
  const filteredHR = hrList.filter((hr) => {
 const matchesSearch =
(hr.full_name || "")
.toLowerCase()
.includes(search.toLowerCase()) ||

(hr.email || "")
.toLowerCase()
.includes(search.toLowerCase()) ||

(hr.phone || "")
.toLowerCase()
.includes(search.toLowerCase());


return matchesSearch;

});
const totalHR = hrList.length;

const activeHR = hrList.filter(
  (hr) => hr.status === "Active"
).length;

const inactiveHR = hrList.filter(
  (hr) => hr.status === "Inactive"
).length;

  return (
    <div className="hr-page">

      {/* ================= SIDEBAR ================= */}

      <Sidebar
        role="admin"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* ================= MAIN ================= */}

      <main className="hr-main-content">

        {/* PAGE HEADER */}

        <div className="hr-content">

          <div className="hr-page-header">

            <div>
              <h1>HR Management</h1>
              <p>
                Manage and view all HR members
                in your organization.
              </p>
            </div>

            <button
              className="add-hr-btn"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              <FaPlus />
              Add HR
            </button>

          </div>

          {/* SUMMARY CARDS */}

          <div className="hr-summary">

            <div className="hr-summary-card">

              <div className="hr-summary-icon">
                <FaUserTie />
              </div>

              <div>
                <p>Total HR</p>
                <h2>{totalHR}</h2>
              </div>

            </div>

            <div className="hr-summary-card">

              <div className="hr-summary-icon active">
                ✓
              </div>

              <div>
                <p>Active HR</p>
                <h2>{activeHR}</h2>
              </div>

            </div>

            <div className="hr-summary-card">

              <div className="hr-summary-icon inactive">
                ×
              </div>

              <div>
                <p>Inactive HR</p>
                <h2>{inactiveHR}</h2>
              </div>

            </div>

          </div>

          {/* TABLE */}

          <div className="hr-table-card">

            <div className="hr-table-top">

              <div>
                <h2>HR List</h2>
                <p>
                  All registered HR members
                </p>
              </div>

              <div className="hr-filters">

                <div className="hr-search">

                  <FaSearch />

                  <input
                    type="text"
                    placeholder="Search HR..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />

                </div>
              </div>

            </div>

            <div className="hr-table-wrapper">

              <table className="hr-table">

                <thead>
                  <tr>
                    <th>HR Member</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredHR.length > 0 ? (

                    filteredHR.map((hr) => (

                      <tr key={hr.id}>

                        <td>

                          <div className="hr-info">
                          <div className="hr-avatar">
  {hr.name
    ? hr.name
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .slice(0, 2)
    : "HR"}
</div>
                            <div>

                              <strong>
                                {hr.name}
                              </strong>

                              <span>
                                HR Member
                              </span>

                            </div>

                          </div>

                        </td>

                        <td>{hr.email}</td>


                        <td>

                          <span
                            className={`hr-status ${
                              hr.status ===
                              "Active"
                                ? "hr-status-active"
                                : "hr-status-inactive"
                            }`}
                          >
                            {hr.status}
                          </span>

                        </td>

                        <td>

                          <div className="hr-actions">

                            <button
                              className="hr-view-btn"
                              title="View HR"
                              onClick={() =>
                                handleViewHR(hr)
                              }
                            >
                              <FaEye />
                            </button>

                            <button
                              className="hr-edit-btn"
                              title="Edit HR"
                              onClick={() =>
                                handleEditHR(hr)
                              }
                            >
                              <FaEdit />
                            </button>

                            <button
                              className="hr-delete-btn"
                              title="Delete HR"
                              onClick={() =>
                                handleDeleteHR(
                                  hr.id
                                )
                              }
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
                        className="no-hr"
                      >
                        No HR members found
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </main>

      {/* ================= ADD HR MODAL ================= */}

      {showModal && (

        <div className="hr-modal-overlay">

          <div className="hr-modal">

            <div className="hr-modal-header">

              <div>
                <h2>Add New HR</h2>
                <p>
                  Create a new HR member
                </p>
              </div>

              <button
                className="hr-close-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                <FaTimes />
              </button>

            </div>

            <form
              className="hr-form"
              onSubmit={handleCreateHR}
            >

              <div className="hr-form-field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={hrForm.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="hr-form-field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={hrForm.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  required
                />
              </div>

              <div className="hr-form-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={hrForm.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="hr-form-field">
                <label>Joining Date</label>
                <input
                  type="date"
                  name="joiningDate"
                  value={hrForm.joiningDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="hr-form-field">
                <label>Employment Type</label>

                <select
                  name="employmentType"
                  value={
                    hrForm.employmentType
                  }
                  onChange={handleInputChange}
                >
                  <option>
                    Full Time
                  </option>
                  <option>
                    Part Time
                  </option>
                  <option>
                    Contract
                  </option>
                  <option>
                    Intern
                  </option>
                </select>

              </div>

              <div className="hr-form-field">
                <label>Status</label>

                <select
                  name="status"
                  value={hrForm.status}
                  onChange={handleInputChange}
                >
                  <option>
                    Active
                  </option>
                  <option>
                    Inactive
                  </option>
                </select>

              </div>

              <div className="hr-form-actions">

                <button
                  type="button"
                  className="hr-cancel-btn"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="hr-create-btn"
                >
                  <FaPlus />
                  Create HR
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ================= VIEW MODAL ================= */}

      {showViewModal &&
        selectedHR && (

          <div className="hr-modal-overlay">

            <div className="hr-modal hr-view-modal">

              <div className="hr-modal-header">

                <div>
                  <h2>HR Details</h2>
                  <p>
                    View HR member information
                  </p>
                </div>

                <button
                  className="hr-close-btn"
                  onClick={() =>
                    setShowViewModal(false)
                  }
                >
                  <FaTimes />
                </button>

              </div>

              <div className="hr-details">

                <div className="hr-detail-avatar">

                  {selectedHR.full_name
                    .split(" ")
                    .map(
                      (name) => name[0]
                    )
                    .join("")
                    .slice(0, 2)}

                </div>

                <h2>
                  {selectedHR.full_name}
                </h2>

                <p className="hr-detail-id">
                  HR00{selectedHR.id}
                </p>

                <div className="hr-detail-grid">

                  <div>
                    <strong>Email</strong>
                    <span>
                      {selectedHR.email}
                    </span>
                  </div>

                  <div>
                    <strong>Phone</strong>
                    <span>
                      {selectedHR.phone}
                    </span>
                  </div>

                  <div>
                    <strong>Joining Date</strong>
                    <span>
                      {selectedHR.joining_date}
                    </span>
                  </div>

                  <div>
                    <strong>Employment Type</strong>
                    <span>
                      {selectedHR.employment_type}
                    </span>
                  </div>

                  <div>
                    <strong>Status</strong>
                    <span
                      className={
                        selectedHR.status ===
                        "Active"
                          ? "hr-status-active"
                          : "hr-status-inactive"
                      }
                    >
                      {selectedHR.status}
                    </span>
                  </div>

                </div>

              </div>

              <div className="hr-modal-footer">

                <button
                  className="hr-cancel-btn"
                  onClick={() =>
                    setShowViewModal(false)
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}

      {/* ================= EDIT MODAL ================= */}

      {showEditModal &&
        selectedHR && (

          <div className="hr-modal-overlay">

            <div className="hr-modal">

              <div className="hr-modal-header">

                <div>
                  <h2>Edit HR</h2>
                  <p>
                    Update HR member information
                  </p>
                </div>

                <button
                  className="hr-close-btn"
                  onClick={() =>
                    setShowEditModal(false)
                  }
                >
                  <FaTimes />
                </button>

              </div>

              <form
                className="hr-form"
                onSubmit={handleUpdateHR}
              >

                <div className="hr-form-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={hrForm.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="hr-form-field">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={hrForm.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="hr-form-field">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={hrForm.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>


                <div className="hr-form-field">
                  <label>Joining Date</label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={hrForm.joiningDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="hr-form-field">
                  <label>Employment Type</label>

                  <select
                    name="employmentType"
                    value={
                      hrForm.employmentType
                    }
                    onChange={handleInputChange}
                  >
                    <option>
                      Full Time
                    </option>
                    <option>
                      Part Time
                    </option>
                    <option>
                      Contract
                    </option>
                    <option>
                      Intern
                    </option>
                  </select>

                </div>

                <div className="hr-form-field">
                  <label>Status</label>

                  <select
                    name="status"
                    value={hrForm.status}
                    onChange={handleInputChange}
                  >
                    <option>
                      Active
                    </option>
                    <option>
                      Inactive
                    </option>
                  </select>

                </div>

                <div className="hr-form-actions">

                  <button
                    type="button"
                    className="hr-cancel-btn"
                    onClick={() =>
                      setShowEditModal(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="hr-create-btn"
                  >
                    <FaEdit />
                    Update HR
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

    </div>
  );
};

export default HR;