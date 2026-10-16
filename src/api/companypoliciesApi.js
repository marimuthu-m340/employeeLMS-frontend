import { API_BASE_URL } from "../apiConfig";
const API_URL = `${API_BASE_URL}/api/companypolicies`;
// GET
export const getCompanyPolicies = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch company policies");
  }

  return await response.json();
};

// UPDATE
export const updateCompanyPolicies = async (data) => {
  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update company policies");
  }

  return await response.json();
};