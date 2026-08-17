import axios from "axios";

const notificationApi = axios.create({
  baseURL: "http://localhost:5000/api/notifications",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the auth token on every request.
// NOTE: change "token" below if your login flow stores it under a different key.
notificationApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ================= GET ALL (optionally "unread" | "read") =================

export const getNotifications = async (status) => {
  const response = await notificationApi.get("/", {
    params: status ? { status } : {},
  });
  return response.data;
};

// ================= UNREAD COUNT =================

export const getUnreadCount = async () => {
  const response = await notificationApi.get("/unread-count");
  return response.data;
};

// ================= MARK ONE AS READ =================

export const markAsRead = async (id) => {
  const response = await notificationApi.put(`/${id}/read`);
  return response.data;
};

// ================= MARK ALL AS READ =================

export const markAllAsRead = async () => {
  const response = await notificationApi.put("/mark-all-read");
  return response.data;
};

// ================= CREATE (manual/internal use) =================

export const createNotification = async (notification) => {
  const response = await notificationApi.post("/", notification);
  return response.data;
};

export default notificationApi;