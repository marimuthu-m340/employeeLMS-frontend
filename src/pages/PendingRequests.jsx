import React, { useState, useEffect } from "react";
import "./PendingRequests.css";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import { getPendingLeaves, decideLeave } from "../api/leaveApi";
import { FaSearch, FaBell } from "react-icons/fa";

// Mount this SAME component at:
//   /manager/leave-management   (role="manager")
//   /hr/leave-management        (role="hr")
//   /admin/leave-management     (role="admin")
// Backend /api/leaves/pending already filters by req.user.role, so no props needed
// beyond what Sidebar needs for its own display.

const PendingRequests = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null); // row currently mid-action

  const sidebarRole =
    user?.role === "SUPER_ADMIN"
      ? "admin"
      : user?.role === "HR"
      ? "hr"
      : user?.role === "MANAGER" || user?.role === "MANAGER_ADMIN"
      ? "manager"
      : "employee";

  const fetchPending = async () => {
    try {
      setLoading(true);

      const response = await getPendingLeaves();

      if (response && response.success) {
        setRequests(Array.isArray(response.data) ? response.data : []);
      } else {
        setRequests([]);
        toast.error(response?.message || "Failed to load pending requests");
      }
    } catch (err) {
      console.error("Pending Error:", err);
      setRequests([]);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Server error while loading pending requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleDecision = async (id, action) => {
    if (action === "reject") {
      const confirmReject = window.confirm("Are you sure you want to reject this leave request?");
      if (!confirmReject) return;
    }

    const remarks = window.prompt(
      action === "approve" ? "Remarks (optional):" : "Reject reason (optional):",
      ""
    );

    setActingId(id);
    try {
      const data = await decideLeave(id, action, remarks || "");
      if (data.success) {
        toast.success(`Leave request ${action === "approve" ? "approved" : "rejected"}!`);
        setRequests((prev) => prev.filter((r) => r.id !== id));
      } else {
        toast.error(data.message || "Action failed, please try again");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error, please try again");
    } finally {
      setActingId(null);
    }
  };

  // Column header changes based on who is applying to this dashboard's queue,
  // but the value itself now comes from the single applicant_name field.
  const applicantColumnLabel =
    user?.role === "HR" ? "Manager" : user?.role === "SUPER_ADMIN" ? "HR" : "Employee";

  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} role={sidebarRole} />

      <main className="pending-requests-page">
        <div className="pending-requests-container">
          <div className="page-header">
            <h2>Pending Leave Requests</h2>
            <p>Review and take action on requests waiting for your approval</p>
          </div>

          <div className="requests-card">
            {loading ? (
              <p className="status-text">Loading...</p>
            ) : requests.length === 0 ? (
              <p className="status-text empty-state">No pending requests right now 🎉</p>
            ) : (
              <div className="table-scroll">
                <table className="requests-table">
                  <thead>
                    <tr>
                      <th>{applicantColumnLabel}</th>
                      <th>Leave Type</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Days</th>
                      <th>Reason</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id}>
                        <td>{req.applicant_name}</td>
                        <td>{req.leave_types?.leave_name}</td>
                        <td>{req.from_date}</td>
                        <td>{req.to_date}</td>
                        <td>{req.total_days}</td>
                        <td className="reason-cell">{req.reason}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-approve"
                              disabled={actingId === req.id}
                              onClick={() => handleDecision(req.id, "approve")}
                            >
                              Approve
                            </button>
                            <button
                              className="btn-reject"
                              disabled={actingId === req.id}
                              onClick={() => handleDecision(req.id, "reject")}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default PendingRequests;