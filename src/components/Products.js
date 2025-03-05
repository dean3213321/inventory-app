import "./styling/Products.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-select-dt";
import "datatables.net-responsive-dt";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "./styling/Users.css";

// Import the necessary button extensions and their CSS
import "datatables.net-buttons-dt";
import "datatables.net-buttons/js/buttons.colVis.min";
import "datatables.net-buttons/js/buttons.html5.min";
import "datatables.net-buttons/js/buttons.print.min";
import "datatables.net-buttons-dt/css/buttons.dataTables.min.css"; //Button CSS File

DataTable.use(DT);

const Products = () => {
  const columns = [
    { title: "Name", data: "name" },
    { title: "Item", data: "item" },
    { title: "Quantity", data: "quantity" },
    { title: "Date", data: "date" },
    { title: "Status", data: "status" },
  ];

  const data = [
    {
      name: "Dean",
      item: "book",
      quantity: "5",
      date: "03-05-2025",
      status: "Returned",
    },
    {
      name: "Dean",
      item: "book",
      quantity: "4",
      date: "03-05-2025",
      status: " Not Returned",
    },
    {
      name: "Dean",
      item: "book",
      quantity: "3",
      date: "03-05-2025",
      status: "Returned",
    },
    {
      name: "Dean",
      item: "book",
      quantity: "2",
      date: "03-05-2025",
      status: "Returned",
    },
    {
      name: "Dean",
      item: "book",
      quantity: "1",
      date: "03-05-2025",
      status: "Not Returned",
    },
    {
        name: "Dean",
        item: "book",
        quantity: "5",
        date: "03-05-2025",
        status: "Returned",
      },
      {
        name: "Dean",
        item: "book",
        quantity: "4",
        date: "03-05-2025",
        status: " Not Returned",
      },
      {
        name: "Dean",
        item: "book",
        quantity: "3",
        date: "03-05-2025",
        status: "Returned",
      },
      {
        name: "Dean",
        item: "book",
        quantity: "2",
        date: "03-05-2025",
        status: "Returned",
      },
      {
        name: "Dean",
        item: "book",
        quantity: "1",
        date: "03-05-2025",
        status: "Not Returned",
      },
      {
        name: "Dean",
        item: "book",
        quantity: "5",
        date: "03-05-2025",
        status: "Returned",
      },
      {
        name: "Dean",
        item: "book",
        quantity: "4",
        date: "03-05-2025",
        status: " Not Returned",
      },
      {
        name: "Dean",
        item: "book",
        quantity: "3",
        date: "03-05-2025",
        status: "Returned",
      },
      {
        name: "Dean",
        item: "book",
        quantity: "2",
        date: "03-05-2025",
        status: "Returned",
      },
      {
        name: "Dean",
        item: "book",
        quantity: "1",
        date: "03-05-2025",
        status: "Not Returned",
      },
      {
        name: "Dean",
        item: "book",
        quantity: "5",
        date: "03-05-2025",
        status: "Returned",
      },
      {
        name: "Dean",
        item: "book",
        quantity: "4",
        date: "03-05-2025",
        status: " Not Returned",
      },
      {
        name: "Dean",
        item: "book",
        quantity: "3",
        date: "03-05-2025",
        status: "Returned",
      },
      {
        name: "Dean",
        item: "book",
        quantity: "2",
        date: "03-05-2025",
        status: "Returned",
      },
      {
        name: "Dean",
        item: "book",
        quantity: "1",
        date: "03-05-2025",
        status: "Not Returned",
      },
      {
        name: "Dean",
        item: "book",
        quantity: "5",
        date: "03-05-2025",
        status: "Returned",
      },
      {
        name: "Dean",
        item: "book",
        quantity: "4",
        date: "03-05-2025",
        status: " Not Returned",
      },
      {
        name: "Dean",
        item: "book",
        quantity: "3",
        date: "03-05-2025",
        status: "Returned",
      },
      {
        name: "Dean",
        item: "book",
        quantity: "2",
        date: "03-05-2025",
        status: "Returned",
      },
      {
        name: "Dean",
        item: "book",
        quantity: "1",
        date: "03-05-2025",
        status: "Not Returned",
      },
  ];

  return (
    <div className="products-page">
      <div className="products-header">
        <h2>Products</h2>
        <h3 className="Addproducts">Add Products</h3>
      </div>
      <div className="products-box">
        <div className="product-box">
          <i
            className="bi bi-box-fill"
            style={{ fontSize: "2rem", marginBottom: "1rem" }}
          ></i>
          <h4>Total Supplies</h4>
          <p>278</p>
        </div>
        <div className="product-box">
          <i
            className="bi bi-exclamation-triangle-fill"
            style={{ fontSize: "2rem", marginBottom: "1rem" }}
          ></i>
          <h4>Low Stock Items</h4>
          <p>15</p>
        </div>
      </div>
      <div className="products-table">
        <DataTable
          className="display cell-border"
          columns={columns}
          data={data}
          options={{
            responsive: true,
            select: true,
            dom: "frtBp", // Add 'B' for buttons to the dom option
            buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
          }}
        />
      </div>
    </div>
  );
};

export default Products;
