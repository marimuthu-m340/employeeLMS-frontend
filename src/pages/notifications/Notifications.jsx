import Sidebar from "../../components/Sidebar";
import "./Notifications.css";
import { useEffect, useState } from "react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../../api/notificationsApi";

const Notifications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all" | "unread" | "read"

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const result = await getNotifications();

      if (result.success) {
        setNotifications(result.data || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const role =
    user?.role === "SUPER_ADMIN"
      ? "admin"
      : user?.role === "HR"
      ? "hr"
      : user?.role === "MANAGER" || user?.role === "MANAGER_ADMIN"
      ? "manager"
      : "employee";

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const visibleNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.is_read;
    if (filter === "read") return n.is_read;
    return true;
  });

  const handleCardClick = async (item) => {
    if (item.is_read) return;

    // optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n))
    );

    try {
      await markAsRead(item.id);
    } catch (error) {
      console.log(error);
      fetchNotifications(); // revert on failure
    }
  };

  const handleMarkAllRead = async () => {
    // optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

    try {
      await markAllAsRead();
    } catch (error) {
      console.log(error);
      fetchNotifications(); // revert on failure
    }
  };

  return (
    <div className="notifications-layout">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        role={role}
      />

      <main className="main-content">

        {/* ================= PAGE ================= */}

        <div className="notifications-page">
          <div className="notifications-header">
            <div>
              <h1>Notifications</h1>
              <p>View all system notifications and updates.</p>
            </div>

            <button className="mark-read-btn" onClick={handleMarkAllRead}>
              Mark All as Read
            </button>
          </div>

          <div className="notification-filter">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={filter === "unread" ? "active" : ""}
              onClick={() => setFilter("unread")}
            >
              Unread
            </button>
            <button
              className={filter === "read" ? "active" : ""}
              onClick={() => setFilter("read")}
            >
              Read
            </button>
          </div>

          <div className="notifications-list">
            {loading ? (
              <p>Loading...</p>
            ) : visibleNotifications.length === 0 ? (
              <p>No notifications to show.</p>
            ) : (
              visibleNotifications.map((item) => (
                <div
                  key={item.id}
                  className={`notification-card ${
                    item.is_read ? "read" : "unread"
                  }`}
                  onClick={() => handleCardClick(item)}
                  style={{ cursor: item.is_read ? "default" : "pointer" }}
                >
                  <div className="notification-icon-box">🔔</div>

                  <div className="notification-content">
                    <h3>{item.title}</h3>
                    <p>{item.message}</p>
                    <span>{new Date(item.created_at).toLocaleString()}</span>
                  </div>

                  {!item.is_read && (
                    <div className="notification-status">New</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;