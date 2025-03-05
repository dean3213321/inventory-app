import React, { useEffect, useRef } from "react";
import $ from "jquery"; // Import jQuery (required by DataTables)
import "datatables.net-dt";
import "datatables.net-select-dt";
import "datatables.net-responsive-dt";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "./styling/Users.css";

// Import the necessary button extensions and their CSS
import "datatables.net-buttons-dt";
import "datatables.net-buttons/js/buttons.colVis.min";
import "datatables.net-buttons/js/buttons.html5.min";
import "datatables.net-buttons/js/buttons.print.min";
import "datatables.net-buttons-dt/css/buttons.dataTables.min.css"; // Button CSS File

const Users = () => {
  const tableRef = useRef(null);
  const buttonContainerRef = useRef(null);

  const columns = [
    { title: "Name", data: "name" },
    { title: "Username", data: "username" },
    { title: "Lastlogin", data: "email" },
  ];

  const data = [
    { name: "Dean", username: "D", email: "dean@westfields.edu.ph" },
    { name: "Robert", username: "R", email: "Robert@westfields.edu.ph" },
  ];

  useEffect(() => {
    if (tableRef.current) {
      // Initialize the DataTable using jQuery
      const dt = $(tableRef.current).DataTable({
        responsive: true,
        select: true,
        buttons: ["copy", "csv", "excel", "print",],
      });

      // Move the buttons to the custom container
      dt.buttons().container().appendTo(buttonContainerRef.current);

      // Cleanup on unmount
      return () => {
        dt.destroy();
      };
    }
  }, []);

  return (
    <div className="usersbody">
      {/* DataTable */}
      <h1>Users</h1>
      <table ref={tableRef} className="display cell-border">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>{row[col.data]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div ref={buttonContainerRef} className="custom-button-container"></div>
    </div>
  );
};

export default Users;
