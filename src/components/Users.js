import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-select-dt";
import "datatables.net-responsive-dt";
import "datatables.net-dt/css/dataTables.dataTables.min.css";

DataTable.use(DT);

const Users = () => {
  return (
    <div className="usersbody">
      <h1>Users</h1>
      <DataTable
        className="display cell-border" // Add classes for bordered table
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Username</th>
            <th>Status</th>
            <th>Last Login</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>dsa</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
          </tr>
          {/* Add more rows as needed */}
          <tr>
            <td>2</td>
            <td>John Doe</td>
            <td>johndoe</td>
            <td>Active</td>
            <td>2024-03-08 10:00:00</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Jane Smith</td>
            <td>janesmith</td>
            <td>Inactive</td>
            <td>2024-03-01 14:30:00</td>
          </tr>
        </tbody>
      </DataTable>
    </div>
  );
};

export default Users;
