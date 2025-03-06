import "./styling/Sales.css";

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

const Sales = () => {
  const columns = [
    { title: "Productname", data: "productname" },
    { title: "Instock", data: "instock" },
    { title: "Buyingprice", data: "buyingprice" },
    { title: "Sellingprice", data: "sellingprice" },
    { title: "Date", data: "date" },
  ];

  const data = [
    {
      productname: "Uniform",
      instock: "55",
      buyingprice: "5000",
      sellingprice: "8000",
      date: "03-03-2025",
    },
    {
        productname: "Uniform",
        instock: "55",
        buyingprice: "5000",
        sellingprice: "8000",
        date: "03-03-2025",
      },
      {
        productname: "Uniform",
        instock: "55",
        buyingprice: "5000",
        sellingprice: "8000",
        date: "03-03-2025",
      },
      
  ];

  return (
    <div className="sales-page">
      <div className="sales-header">
        <h3>Sales</h3>
        <h3 className="Addsales">Add Sales</h3>
      </div>
      <div className="sales-table">
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

export default Sales;
