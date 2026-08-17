import React from "react";
import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // REQUIRED - toasts are invisible without this

import "./App.css";

import Login from "./Login";
import { AuthProvider } from "./context/AuthContext.jsx";

import AdminDash from "./pages/Admindash.jsx";
import Employees from "./pages/Employees.jsx";
import Managers from "./pages/Managers.jsx";
import HR from "./pages/HR.jsx";
import Departments from "./pages/Departments.jsx";
import HrDash from "./pages/hrdash/HrDash.jsx";
import HrEmployees from "./pages/hrdash/HrEmployees.jsx";
import HrAttendance from "./pages/hrdash/HrAttendance.jsx";
import ManagerDash from "./pages/managerdash/ManagerDash.jsx";
import ManagerEmployees from "./pages/managerdash/ManagerEmployees";
import EmployeeDash from "./pages/empdash/EmployeeDash";
import CompanySettings from "./pages/CompanySettings";
import Attendance from "./pages/Attendance.jsx";
import ManagerAttendance from "./pages/managerdash/ManagerAttendance";
import EmployeeAttendance from "./pages/empdash/EmployeeAttendance.jsx";
import Notifications from "./pages/notifications/Notifications";
import AttendanceReports from "./pages/AttendanceReports";
import Holidays from "./pages/Holidays";
import ApplyLeave from "./pages/ApplyLeave.jsx";
import PendingRequests from "./pages/PendingRequests";
import Settings from "./pages/Settings";

// ================= PROTECTED PAGE =================

const ProtectedPage = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// ================= APP =================

function App() {

  useEffect(() => {
  const applyTheme = () => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }

    console.log("APP THEME:", document.body.className);
  };

  applyTheme();

  window.addEventListener("storage", applyTheme);

  return () => {
    window.removeEventListener("storage", applyTheme);
  };
}, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Mounted once at the top level - toast.success()/toast.error()
            calls anywhere in the app will render here */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />

        <Routes>
          {/* ================= LOGIN ================= */}

          <Route path="/" element={<Login />} />

          <Route
            path="/hr"
            element={
              <ProtectedPage allowedRoles={["HR"]}>
                <HrDash />
              </ProtectedPage>
            }
          />

          <Route
            path="/hr/employees"
            element={
              <ProtectedPage allowedRoles={["HR"]}>
                <HrEmployees />
              </ProtectedPage>
            }
          />

          <Route
            path="/hr/attendance"
            element={
              <ProtectedPage allowedRoles={["HR"]}>
                <HrAttendance />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedPage allowedRoles={["SUPER_ADMIN"]}>
                <AdminDash />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/employees"
            element={
              <ProtectedPage allowedRoles={["SUPER_ADMIN"]}>
                <Employees />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/managers"
            element={
              <ProtectedPage allowedRoles={["SUPER_ADMIN", "HR"]}>
                <Managers />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/hr"
            element={
              <ProtectedPage allowedRoles={["SUPER_ADMIN"]}>
                <HR />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/departments"
            element={
              <ProtectedPage allowedRoles={["SUPER_ADMIN"]}>
                <Departments />
              </ProtectedPage>
            }
          />

          <Route
            path="/manager"
            element={
              <ProtectedPage allowedRoles={["MANAGER", "MANAGER_ADMIN"]}>
                <ManagerDash />
              </ProtectedPage>
            }
          />

          <Route
            path="/manager/employees"
            element={
              <ProtectedPage allowedRoles={["MANAGER", "MANAGER_ADMIN"]}>
                <ManagerEmployees />
              </ProtectedPage>
            }
          />

          <Route
            path="/manager/attendance"
            element={
              <ProtectedPage allowedRoles={["MANAGER", "MANAGER_ADMIN"]}>
                <ManagerAttendance />
              </ProtectedPage>
            }
          />

          <Route
            path="/employee"
            element={
              <ProtectedPage allowedRoles={["EMPLOYEE"]}>
                <EmployeeDash />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/company-settings"
            element={
              <ProtectedPage allowedRoles={["SUPER_ADMIN"]}>
                <CompanySettings />
              </ProtectedPage>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedPage allowedRoles={["SUPER_ADMIN"]}>
                <Attendance />
              </ProtectedPage>
            }
          />

          <Route
            path="/employee/attendance"
            element={
              <ProtectedPage allowedRoles={["EMPLOYEE"]}>
                <EmployeeAttendance />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/notifications"
            element={
              <ProtectedPage allowedRoles={["SUPER_ADMIN"]}>
                <Notifications />
              </ProtectedPage>
            }
          />

          <Route
            path="/hr/notifications"
            element={
              <ProtectedPage allowedRoles={["HR"]}>
                <Notifications />
              </ProtectedPage>
            }
          />

          <Route
            path="/manager/notifications"
            element={
              <ProtectedPage allowedRoles={["MANAGER", "MANAGER_ADMIN"]}>
                <Notifications />
              </ProtectedPage>
            }
          />

          <Route
            path="/employee/notifications"
            element={
              <ProtectedPage allowedRoles={["EMPLOYEE"]}>
                <Notifications />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/attendance/reports"
            element={
              <ProtectedPage allowedRoles={["SUPER_ADMIN"]}>
                <AttendanceReports />
              </ProtectedPage>
            }
          />

          <Route
            path="/hr/attendance/reports"
            element={
              <ProtectedPage allowedRoles={["HR"]}>
                <AttendanceReports />
              </ProtectedPage>
            }
          />

          <Route
            path="/manager/attendance/reports"
            element={
              <ProtectedPage allowedRoles={["MANAGER", "MANAGER_ADMIN"]}>
                <AttendanceReports />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/holidays"
            element={
              <ProtectedPage allowedRoles={["SUPER_ADMIN"]}>
                <Holidays />
              </ProtectedPage>
            }
          />
          <Route
            path="/employee/leave-management"
            element={
              <ProtectedPage allowedRoles={["EMPLOYEE"]}>
                <ApplyLeave />
              </ProtectedPage>
            }
          />
          <Route
            path="/admin/leave-management"
            element={
              <ProtectedPage allowedRoles={["SUPER_ADMIN"]}>
                <PendingRequests />
              </ProtectedPage>
            }
          />

          <Route
            path="/hr/leave-management"
            element={
              <ProtectedPage allowedRoles={["HR"]}>
                <ApplyLeave />
              </ProtectedPage>
            }
          />

          <Route
            path="/manager/leave-management"
            element={
              <ProtectedPage allowedRoles={["MANAGER", "MANAGER_ADMIN"]}>
                <ApplyLeave />
              </ProtectedPage>
            }
          />
          <Route
            path="/admin/pending-requests"
            element={
              <ProtectedPage allowedRoles={["SUPER_ADMIN"]}>
                <PendingRequests />
              </ProtectedPage>
            }
          />

          <Route
            path="/hr/pending-requests"
            element={
              <ProtectedPage allowedRoles={["HR"]}>
                <PendingRequests />
              </ProtectedPage>
            }
          />

          <Route
            path="/manager/pending-requests"
            element={
              <ProtectedPage allowedRoles={["MANAGER", "MANAGER_ADMIN"]}>
                <PendingRequests />
              </ProtectedPage>
            }
          />

          <Route
            path="/employee/pending-requests"
            element={
              <ProtectedPage allowedRoles={["EMPLOYEE"]}>
                <PendingRequests />
              </ProtectedPage>
            }
          />

          <Route
  path="/admin/settings"
  element={
    <ProtectedPage allowedRoles={["SUPER_ADMIN"]}>
      <Settings />
    </ProtectedPage>
  }
/>

<Route
  path="/hr/settings"
  element={
    <ProtectedPage allowedRoles={["HR"]}>
      <Settings />
    </ProtectedPage>
  }
/>

<Route
  path="/manager/settings"
  element={
    <ProtectedPage allowedRoles={["MANAGER", "MANAGER_ADMIN"]}>
      <Settings />
    </ProtectedPage>
  }
/>

<Route
  path="/employee/settings"
  element={
    <ProtectedPage allowedRoles={["EMPLOYEE"]}>
      <Settings />
    </ProtectedPage>
  }
/>

          {/* ================= INVALID URL ================= */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;