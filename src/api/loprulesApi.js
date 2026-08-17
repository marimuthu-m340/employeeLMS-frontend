const API_URL = "http://localhost:5000/api/loprules";

export const getLopRules = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch LOP rules");
  }

  return response.json();
};

export const updateLopRules = async (data) => {
  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update LOP rules");
  }

  return response.json();
};