import React, { useState, useEffect } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-select-dt";
import "datatables.net-responsive-dt";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "./styling/Users.css";

// Import necessary button extensions and their CSS
import "datatables.net-buttons-dt";
import "datatables.net-buttons/js/buttons.colVis.min";
import "datatables.net-buttons/js/buttons.html5.min";
import "datatables.net-buttons/js/buttons.print.min";
import "datatables.net-buttons-dt/css/buttons.dataTables.min.css";

DataTable.use(DT);

const Users = () => {
  const [data, setData] = useState([]);

  // Fetch teacher data from the API endpoint
  useEffect(() => {
    fetch('/api/users/teachers')
      .then(response => response.json())
      .then(teacherData => setData(teacherData))
      .catch(error => console.error("Error fetching teacher data:", error));
  }, []);

  // Define columns including the position field
  const columns = [
    { title: "First Name", data: "fname" },
    { title: "Last Name", data: "lname" },
    { title: "Email", data: "email" },
    { title: "Position", data: "position" },
  ];

  return (
    <div className="users-page">
      <div className="users-header">
        <h3>Teacher Users</h3>
      </div>
      <div className="users-table">
        <DataTable
          className="display cell-border"
          columns={columns}
          data={data}
          options={{
            responsive: true,
            select: true,
            dom: '<"d-flex justify-content-between"lf>rt<"d-flex justify-content-between"ip>B',
            buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
          }}
        />
      </div>
    </div>
  );
};

export default Users;
