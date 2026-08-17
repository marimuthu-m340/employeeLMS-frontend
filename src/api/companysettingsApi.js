  const API_URL = "http://localhost:5000/api/companysettings";

  export const getCompanySettings = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch company settings");
    }

    return response.json();
  };

  export const updateCompanySettings = async (data) => {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update company settings");
    }

    return response.json();
  };