import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Sidebar.css";

const Sidebar = ({ sidebarOpen, setSidebarOpen, role = "admin" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ================= AUTH =================
  const { logout, user } = useAuth();

  // ================= LOGOUT MODAL =================
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ================= DROPDOWN STATE =================
  // tracks which collapsible menu is currently open: "attendance" | "leave" | null
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const isActive = (path) => location.pathname === path;

  // ================= CONFIRM LOGOUT =================
  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/", { replace: true });
  };

  // ================= CANCEL LOGOUT =================
  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const base =
    role === "admin"
      ? "/admin"
      : role === "hr"
      ? "/hr"
      : role === "manager"
      ? "/manager"
      : "/employee";

  const roleLabel =
    role === "admin"
      ? "Super Admin"
      : role === "hr"
      ? "HR"
      : role === "manager"
      ? "Manager"
      : "Employee";

  const roleInitials =
    role === "admin" ? "SA" : role === "hr" ? "HR" : role === "manager" ? "MG" : "EM";

  return (
    <>
      {/* =========================================================
          UNIFIED TOP NAVBAR
          Single shared design for every dashboard/page — replaces
          the per-page top-navbar blocks that used to live inside
          each dashboard file.
      ========================================================= */}
      <header className="app-topbar">
        <button
          className="app-topbar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          &#9776;
        </button>

        <div className="app-topbar-search">
          <span>&#8981;</span>
          <input type="text" placeholder="Search here..." />
        </div>

        <div className="app-topbar-right">
          <div className="app-topbar-profile">
            <div className="app-topbar-avatar">{roleInitials}</div>

            <div className="app-topbar-profile-info">
              <h4>{user?.username || roleLabel}</h4>
              <p>{roleLabel}</p>
            </div>

            <span>&#8964;</span>
          </div>
        </div>
      </header>

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        {/* ================= LOGO ================= */}
        <div className="sidebar-logo">
          <div className="logo-icon">♛</div>

          <div className="logo-text">
            <h2>EMPLOYEE LMS</h2>

            <p>
              {role === "admin"
                ? "SUPER ADMIN PORTAL"
                : role === "hr"
                ? "HR PORTAL"
                : role === "manager"
                ? "MANAGER PORTAL"
                : "EMPLOYEE PORTAL"}
            </p>
          </div>
        </div>

        {/* ================= SIDEBAR MENU ================= */}
        <nav className="sidebar-menu">
          {/* Dashboard */}
          <div
            className={`menu-item ${isActive(base) ? "active" : ""}`}
            onClick={() => navigate(base)}
          >
            <span>⌂</span>
            <span>Dashboard</span>
          </div>

          {/* Employees */}
          {role !== "employee" && (
            <div
              className={`menu-item ${
                isActive(`${base}/employees`) ? "active" : ""
              }`}
              onClick={() => navigate(`${base}/employees`)}
            >
              <span>♙</span>
              <span>Employees</span>
            </div>
          )}

          {/* Managers */}
          {(role === "admin" || role === "hr") && (
            <div
              className={`menu-item ${
                isActive("/admin/managers") ? "active" : ""
              }`}
              onClick={() => navigate("/admin/managers")}
            >
              <span>♙</span>
              <span>Managers</span>
            </div>
          )}

          {role === "admin" && (
            <>
              {/* HR */}
              <div
                className={`menu-item ${isActive("/admin/hr") ? "active" : ""}`}
                onClick={() => navigate("/admin/hr")}
              >
                <span>♙</span>
                <span>HR</span>
              </div>

              {/* Departments */}
              <div
                className={`menu-item ${
                  isActive("/admin/departments") ? "active" : ""
                }`}
                onClick={() => navigate("/admin/departments")}
              >
                <span>▦</span>
                <span>Departments</span>
              </div>

              <div
                className={`menu-item ${
                  isActive("/admin/company-settings") ? "active" : ""
                }`}
                onClick={() => navigate("/admin/company-settings")}
              >
                <span>⚙️</span>
                <span>Company Settings</span>
              </div>
            </>
          )}

          {/* Attendance (collapsible) */}
          <div
            className={`menu-item has-submenu ${
              openMenu === "attendance" ? "expanded" : ""
            }`}
            onClick={() => toggleMenu("attendance")}
          >
            <span>▣</span>
            <span>{role === "employee" ? "My Attendance" : "Attendance"}</span>
            <span className="dropdown-arrow">▾</span>
          </div>

          {openMenu === "attendance" && (
            <div className="submenu">
              <div
                className={`submenu-item ${
                  isActive(`${base}/attendance`) ? "active" : ""
                }`}
                onClick={() => navigate(`${base}/attendance`)}
              >
                Attendance Overview
              </div>
              <div
                className={`submenu-item ${
                  isActive(`${base}/attendance/reports`) ? "active" : ""
                }`}
                onClick={() => navigate(`${base}/attendance/reports`)}
              >
                Attendance Reports
              </div>
            </div>
          )}

         {/* Leave Management */}
{/* ================= LEAVE ================= */}

{role === "admin" ? (
  <div
    className={`menu-item ${
      isActive("/admin/pending-requests") ? "active" : ""
    }`}
    onClick={() => navigate("/admin/pending-requests")}
  >
    <span>📝</span>
    <span>Leave Requests</span>
  </div>
) : (
  <>
    <div
      className={`menu-item ${
        isActive(`${base}/leave-management`) ? "active" : ""
      }`}
      onClick={() => navigate(`${base}/leave-management`)}
    >
      <span>📝</span>
      <span>Leave Management</span>

      <span
        className="dropdown-arrow"
        onClick={(e) => {
          e.stopPropagation();
          toggleMenu("leave");
        }}
      >
        {openMenu === "leave" ? "▴" : "▾"}
      </span>
    </div>

    {openMenu === "leave" && (
      <div className="submenu">
        <div
          className={`submenu-item ${
            isActive(`${base}/pending-requests`) ? "active" : ""
          }`}
          onClick={() => navigate(`${base}/pending-requests`)}
        >
          Pending Requests
        </div>
      </div>
    )}
  </>
)}

          <div
            className={`menu-item ${
              isActive(`${base}/notifications`) ? "active" : ""
            }`}
            onClick={() => navigate(`${base}/notifications`)}
          >
            <span>♢</span>
            <span>Notifications</span>
          </div>

         <div
  className={`menu-item ${
    isActive(`${base}/settings`) ? "active" : ""
  }`}
  onClick={() => navigate(`${base}/settings`)}
>
  <span>⚙</span>
  <span>Settings</span>
</div>
        </nav>

        {/* ================= PROFILE ================= */}
        <div className="sidebar-profile">
          <div className="profile-avatar">
            {role === "admin"
              ? "SA"
              : role === "hr"
              ? "HR"
              : role === "manager"
              ? "MG"
              : "EM"}
          </div>

          <div className="profile-info">
            <h4>
              {user?.username ||
                (role === "admin"
                  ? "Super Admin"
                  : role === "hr"
                  ? "HR"
                  : role === "manager"
                  ? "Manager"
                  : "Employee")}
            </h4>
            <p>{user?.email || "company.com"}</p>
            <span>● Online</span>
          </div>
        </div>

        {/* ================= LOGOUT BUTTON ================= */}
        <div className="logout-btn" onClick={() => setShowLogoutModal(true)}>
          <span>⇥</span>
          <span>Logout</span>
        </div>
      </aside>

      {/* ================= LOGOUT CONFIRMATION MODAL ================= */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <div className="logout-modal-icon">⇥</div>
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to logout?</p>

            <div className="logout-modal-actions">
              <button
                className="logout-cancel-btn"
                onClick={handleCancelLogout}
              >
                Cancel
              </button>
              <button
                className="logout-confirm-btn"
                onClick={handleConfirmLogout}
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;