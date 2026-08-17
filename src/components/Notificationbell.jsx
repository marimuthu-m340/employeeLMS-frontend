import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUnreadCount } from "../api/notificationsApi";

const NotificationBell = ({ notificationsPath = "/notifications" }) => {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const fetchCount = async () => {
    try {
      const res = await getUnreadCount();
      if (res.success) setCount(res.count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCount(); // fires the moment the dashboard mounts / opens

    const interval = setInterval(fetchCount, 30000); // keep it live while the page is open
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="notification-icon"
      onClick={() => navigate(notificationsPath)}
      style={{ cursor: "pointer" }}
    >
      🔔
      {count > 0 && <span>{count > 99 ? "99+" : count}</span>}
    </div>
  );
};

export default NotificationBell;