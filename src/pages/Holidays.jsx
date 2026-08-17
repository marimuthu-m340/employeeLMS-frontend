import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  getHolidays,
  createHoliday,
  deleteHoliday,
} from "../api/holidaysApi";

import "./Holidays.css";

const Holidays = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [holidays, setHolidays] = useState([]);

  const [formData, setFormData] = useState({
    holiday_name: "",
    holiday_date: "",
    holiday_type: "National Holiday",
    description: "",
  });

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    const result = await getHolidays();
    setHolidays(result.data);
  };

  const handleSubmit = async () => {
    await createHoliday(formData);

    setFormData({
      holiday_name: "",
      holiday_date: "",
      holiday_type: "National Holiday",
      description: "",
    });

    fetchHolidays();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this holiday?")) {
      await deleteHoliday(id);
      fetchHolidays();
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        role="admin"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="holiday-main">

        <h1>Holiday Management</h1>

        <div className="holiday-form">

          <input
            type="text"
            placeholder="Holiday Name"
            value={formData.holiday_name}
            onChange={(e) =>
              setFormData({
                ...formData,
                holiday_name: e.target.value,
              })
            }
          />

          <input
            type="date"
            value={formData.holiday_date}
            onChange={(e) =>
              setFormData({
                ...formData,
                holiday_date: e.target.value,
              })
            }
          />

          <select
            value={formData.holiday_type}
            onChange={(e) =>
              setFormData({
                ...formData,
                holiday_type: e.target.value,
              })
            }
          >
            <option>National Holiday</option>
            <option>Festival</option>
            <option>Company Holiday</option>
          </select>

          <textarea
            rows="3"
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />

          <button onClick={handleSubmit}>
            Add Holiday
          </button>

        </div>

        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {holidays.map((holiday) => (
              <tr key={holiday.id}>

                <td>{holiday.holiday_name}</td>

                <td>{holiday.holiday_date}</td>

                <td>{holiday.holiday_type}</td>

                <td>{holiday.description}</td>

                <td>
                  <button
                    onClick={() =>
                      handleDelete(holiday.id)
                    }
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </main>

    </div>
  );
};

export default Holidays;