import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

const API_URL = `${API_BASE_URL}/api/leaves`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// =====================================================
// GET LEAVE TYPES
// =====================================================

export const getLeaveTypes = async () => {
  try {
    const response = await axios.get(
      API_URL + "/types",
      getAuthHeader()
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET LEAVE TYPES API ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// =====================================================
// GET MY LOP (LOSS OF PAY) SUMMARY
// Used by EmployeeDash.jsx for the "Loss Of Pay" summary card
// =====================================================

export const getMyLopSummary = async () => {
  try {
    const response = await axios.get(
      API_URL + "/my-lop-summary",
      getAuthHeader()
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET MY LOP SUMMARY API ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// =====================================================
// APPLY LEAVE
// =====================================================

export const applyLeave = async (leaveData) => {
  try {
    const response = await axios.post(
      API_URL + "/apply",
      leaveData,
      getAuthHeader()
    );

    return response.data;
  } catch (error) {
    console.error(
      "APPLY LEAVE API ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// =====================================================
// GET PENDING LEAVE REQUESTS (role-based, handled by backend)
// =====================================================

export const getPendingLeaves = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
`${API_BASE_URL}/api/leaves/pending`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// =====================================================
// APPROVE / REJECT A LEAVE REQUEST
// action: "approve" | "reject"
// =====================================================

export const decideLeave = async (
  leaveId,
  action,
  remarks
) => {
  try {
    const response = await axios.put(
      `${API_URL}/${leaveId}/decision`,
      {
        action,
        remarks,
      },
      getAuthHeader()
    );

    return response.data;
  } catch (error) {
    console.error(
      "LEAVE DECISION ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};