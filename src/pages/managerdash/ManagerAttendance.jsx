  import React, { useEffect, useState } from "react";
  import { FaSearch } from "react-icons/fa";

  import Sidebar from "../../components/Sidebar";
  import { getEmployees } from "../../api/employeeApi";
  import { createAttendance, getAttendance } from "../../api/attendanceApi";
  import "./ManagerAttendance.css";

  const ManagerAttendance = () => {

    // ================= STATES =================

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState({
 employee_id:"",
 attendance_date:"",
 status:"PRESENT",
 remarks:"",
});
    const loggedInUser = JSON.parse(
      localStorage.getItem("user")
    );

    // ================= FETCH EMPLOYEES =================

    const fetchEmployees = async () => {

      try {

        setLoading(true);

        const result = await getEmployees();

        if (result.success) {

          const employeeList = result.data || [];

          let managerEmployees = [];

          if (
            loggedInUser.role === "MANAGER_ADMIN"
          ) {

            managerEmployees = employeeList;

          } else {

            managerEmployees =
              employeeList.filter(
                (emp) =>
                  String(emp.manager_id) ===
                  String(loggedInUser.id)
              );

          }

          setEmployees(managerEmployees);
          setFilteredEmployees(managerEmployees);

        }

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

    // ================= FETCH ATTENDANCE =================

  const fetchAttendance = async () => {

    try {

      const result = await getAttendance();

      console.log("Attendance Data:", result.data);

      if(result.success){
        setAttendance(result.data || []);
      }

    } catch(error){

      console.log("Attendance Fetch Error:", error);

    }

  };

    useEffect(() => {

      fetchEmployees();
      fetchAttendance();

    }, []);

    // ================= SEARCH =================

    useEffect(() => {

      const data = employees.filter((emp) =>

        emp.full_name
          ?.toLowerCase()
          .includes(search.toLowerCase())

      );

      setFilteredEmployees(data);

    }, [search, employees]);

    const handleMarkAttendance = async () => {
    try {
      if (!attendanceData.employee_id) {
        alert("Please select an employee");
        return;
      }

      if (!attendanceData.attendance_date) {
        alert("Please select attendance date");
        return;
      }
      console.log("MARK ATTENDANCE PAYLOAD:", {
  employee_id: attendanceData.employee_id,
  attendance_date: attendanceData.attendance_date,
  status: attendanceData.status,
  remarks: attendanceData.remarks,
  marked_by: loggedInUser.id,
});

     const response = await createAttendance({
 employee_id: attendanceData.employee_id,
 attendance_date: attendanceData.attendance_date,
 status: attendanceData.status,
 remarks: attendanceData.remarks,
 marked_by: loggedInUser.id,
});

      if (response.success) {
        alert("Attendance marked successfully!");

        setAttendanceData({
 employee_id:"",
 attendance_date:"",
 status:"PRESENT",
 remarks:"",
});

        fetchEmployees();
        fetchAttendance();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to mark attendance");
    }
  };

    return (
    <div className="manageremployees-layout">

    <Sidebar
      role="manager"
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    />

    <main className="manageremployees-main">

      {/* ================= CONTENT ================= */}

      <div className="manageremployees-content">

        <div className="manageremployees-card">

          <h2>Employee Attendance</h2>

          <p>
            Mark attendance for your team members.
          </p>
          {/* ================= ATTENDANCE FORM ================= */}

  <div className="form-grid">

    <div className="form-group">
      <label>Employee</label>

  <select
value={attendanceData.employee_id}
onChange={(e)=>
setAttendanceData({
...attendanceData,
employee_id:e.target.value
})
}
>
    <option value="">Select Employee</option>

    {filteredEmployees.map((emp) => (
      <option key={emp.id} value={emp.id}>
        {emp.full_name}
      </option>
    ))}
  </select>

    </div>

    <div className="form-group">
      <label>Date</label>

    <input
    type="date"
    value={attendanceData.attendance_date}
    onChange={(e) =>
      setAttendanceData({
        ...attendanceData,
        attendance_date: e.target.value,
      })
    }
  />
    </div>

    <div className="form-group">
      <label>Status</label>
  <select
    value={attendanceData.status}
    onChange={(e) =>
      setAttendanceData({
        ...attendanceData,
        status: e.target.value,
      })
    }
  >
    <option value="PRESENT">PRESENT</option>
    <option value="ABSENT">ABSENT</option>
    <option value="HALF_DAY">HALF_DAY</option>
    <option value="LEAVE">LEAVE</option>
  </select>

    </div>

    <div className="form-group full-width">

      <label>Remarks</label>

    <textarea
    rows="3"
    placeholder="Enter remarks..."
    value={attendanceData.remarks}
    onChange={(e) =>
      setAttendanceData({
        ...attendanceData,
        remarks: e.target.value,
      })
    }
  />

    </div>

  </div>

  <div className="attendance-btn-area">
  <button
    className="managerattendance-btn"
    onClick={handleMarkAttendance}
  >
    Mark Attendance
  </button>


  </div>
  {/* ================= ATTENDANCE TABLE ================= */}

  <div className="manageremployees-card">

    <h3>Attendance Records</h3>

    <div className="manageremployees-table-wrapper">

      <table className="manageremployees-table">

        <thead>

          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>

        </thead>

       <tbody>
  {attendance.map((item) => (
    <tr key={item.id}>
      <td>
        <div className="employee-info">
          <div className="employee-avatar">
            {item.employee_name?.charAt(0).toUpperCase()}
          </div>

          <span className="employee_name">
            {item.employee_name}
          </span>
        </div>
      </td>

      <td>{item.attendance_date}</td>

      <td>{item.status}</td>

      <td>{item.remarks || "-"}</td>
    </tr>
  ))}
</tbody>

         
        
       

      </table>

    </div>

  </div>

        </div>

      </div>

    </main>

  </div>
    );
  };

  export default ManagerAttendance; 