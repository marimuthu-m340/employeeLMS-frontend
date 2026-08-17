import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Settings.css";
import { getProfile, updateProfile } from "../api/profileApi";
import { changePassword } from "../api/profileApi";
import { updateTheme } from "../api/profileApi";

const Settings = () => {
const user = JSON.parse(localStorage.getItem("user"));
const sidebarRole =
  user.role === "SUPER_ADMIN"
    ? "admin"
    : user.role === "HR"
    ? "hr"
    : user.role === "MANAGER" || user.role === "MANAGER_ADMIN"
    ? "manager"
    : "employee";
const [profile, setProfile] = useState({
  username: "",
  email: "",
  role: "",
  department: "",
  designation: "",
});

  const [theme, setTheme] = useState({
    mode: "Light",
    compact: false,
    notifications: true,
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleThemeChange = (e) => {
    const { name, value, type, checked } = e.target;

    setTheme({
      ...theme,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSecurityChange = (e) => {
    setSecurity({
      ...security,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    window.location.reload();
  };

  useEffect(() => {
  loadProfile();
   const savedTheme = localStorage.getItem("theme");

  if(savedTheme === "dark"){
    setTheme({
      ...theme,
      mode:"Dark"
    });

    document.body.classList.add("dark-theme");
  }
}, []);


const loadProfile = async () => {
  try {
    const res = await getProfile(user.id);

    setProfile({
      username: res.data.data.username,
      email: res.data.data.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
    });

  } catch (err) {
    console.log(err);
  }
};  

const handleSave = async () => {

  try {

    const res = await updateProfile(user.id, profile);

    if (res.data.success) {

      alert("Profile Updated Successfully");

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          username: profile.username,
          email: profile.email,
        })
      );

    }

  } catch (err) {

    console.log(err);

  }

};

const handleChangePassword = async () => {

  try {

    const res = await changePassword(security);

    if (res.data.success) {
      alert("Password Changed Successfully");

      setSecurity({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }

  } catch (err) {

    alert(
      err.response?.data?.message || "Password Change Failed"
    );

  }

};

const handleThemeSave = async () => {
  try {
      console.log("SAVE CLICKED", theme);
    const res = await updateTheme(theme.mode.toLowerCase());

    if (res.data.success) {
if (theme.mode.toLowerCase() === "dark")  {
        
  document.body.classList.add("dark-theme");
  localStorage.setItem("theme", "dark");
    console.log("BODY CLASS:", document.body.className);
} else {
  document.body.classList.remove("dark-theme");
  localStorage.setItem("theme", "light");
    console.log("BODY CLASS:", document.body.className);
}
      alert("Theme Updated");
    }

  } catch (err) {
    console.log(err);
  }
};
return (
  <div className="settings-layout">
   <Sidebar role={sidebarRole} />

    <div className="settings-container">

      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your profile, appearance and account security.</p>
      </div>

      {/* ================= Profile ================= */}

      <div className="settings-card">

        <div className="card-title">
          👤 Profile Settings
        </div>

        <div className="settings-grid">

          <div className="form-group">
            <label>Username</label>

            <input
              type="text"
              value={profile.username}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  username: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  email: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Role</label>

            <input
              type="text"
              value={profile.role}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Department</label>

            <input
              type="text"
              value={profile.department}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Designation</label>

            <input
              type="text"
              value={profile.designation}
              disabled
            />
          </div>

        </div>

        <div className="settings-actions">
          <button
            className="save-btn"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>

      </div>

      {/* ================= Theme ================= */}

      <div className="settings-card">

        <div className="card-title">
          🎨 Theme Settings
        </div>

        <div className="settings-grid">

          <div className="form-group">
            <label>Theme Mode</label>

            <select
              name="mode"
              value={theme.mode}
              onChange={handleThemeChange}
            >
              <option>Light</option>
              <option>Dark</option>
            </select>
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="compact"
                checked={theme.compact}
                onChange={handleThemeChange}
              />
              Compact Layout
            </label>
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="notifications"
                checked={theme.notifications}
                onChange={handleThemeChange}
              />
              Enable Notifications
            </label>
          </div>

        </div>

        <div className="settings-actions">
          <button
            className="save-btn"
            onClick={handleThemeSave}
          >
            Save Theme
          </button>
        </div>

      </div>

      {/* ================= Security ================= */}

      <div className="settings-card">

        <div className="card-title">
          🔒 Security Settings
        </div>

        <div className="settings-grid">

          <div className="form-group">
            <label>Current Password</label>

            <input
              type="password"
              name="currentPassword"
              value={security.currentPassword}
              onChange={handleSecurityChange}
            />
          </div>

          <div className="form-group">
            <label>New Password</label>

            <input
              type="password"
              name="newPassword"
              value={security.newPassword}
              onChange={handleSecurityChange}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              value={security.confirmPassword}
              onChange={handleSecurityChange}
            />
          </div>

        </div>

        <div className="settings-actions">
          <button
            className="save-btn"
            onClick={handleChangePassword}
          >
            Change Password
          </button>
        </div>

      </div>

      <div className="settings-actions">

        <button
          className="reset-btn"
          onClick={handleReset}
        >
          Reset
        </button>

      </div>

    </div>
  </div>
);
}
export default Settings;