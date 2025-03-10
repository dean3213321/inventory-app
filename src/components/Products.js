import { useState, useEffect } from "react";
import "./styling/Products.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-select-dt";
import "datatables.net-responsive-dt";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "./styling/Users.css";

// DataTables button extensions
import "datatables.net-buttons-dt";
import "datatables.net-buttons/js/buttons.colVis.min";
import "datatables.net-buttons/js/buttons.html5.min";
import "datatables.net-buttons/js/buttons.print.min";
import "datatables.net-buttons-dt/css/buttons.dataTables.min.css";

// React Bootstrap modal components
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { Alert } from "react-bootstrap";

DataTable.use(DT);

const Products = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newSellingPrice, setNewSellingPrice] = useState("");
  const [updateItem, setUpdateItem] = useState(""); // Item name for updating
  const [updateQuantity, setUpdateQuantity] = useState(""); // Quantity for updating
  const [updateSellingPrice, setUpdateSellingPrice] = useState("");
  const [updateId, setUpdateId] = useState(null); // ID of item being updated
  const [error, setError] = useState(null);
  const [totalSupplies, setTotalSupplies] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);

  const columns = [
    { title: "Item", data: "item" },
    { title: "Quantity", data: "quantity" },
    { title: "Date", data: "date" },
    { title: "Selling Price", data: "selling_price"},
    {
      title: "Actions",
      data: null, // Important: No data source for this column
      render: function (data, type, row) {
        // Custom render function
        return `
                    <button class="btn btn-primary btn-sm update-button" data-id="${row.id}">
                        <i class="bi bi-pencil-fill"></i> Update
                    </button>
                    <button class="btn btn-danger btn-sm delete-button" data-id="${row.id}">
                        <i class="bi bi-trash-fill"></i> Delete
                    </button>
                `;
      },
      orderable: false, // Disable sorting on this column
      searchable: false, // Disable searching on this column
    },
  ];

  // Fetch product data, total supplies, and low stock items on component mount
  //and refetch the products
  const fetchData = async () => {
    try {
      // Fetch products
      const productsResponse = await fetch(
        "http://localhost:5000/api/products"
      );
      if (!productsResponse.ok) {
        throw new Error(
          `HTTP error fetching products! status: ${productsResponse.status}`
        );
      }
      const productsData = await productsResponse.json();
      setData(productsData);

      // Fetch total supplies
      const totalSuppliesResponse = await fetch(
        "http://localhost:5000/api/total-supplies"
      );
      if (!totalSuppliesResponse.ok) {
        throw new Error(
          `HTTP error fetching total supplies! status: ${totalSuppliesResponse.status}`
        );
      }
      const totalSuppliesData = await totalSuppliesResponse.json();
      setTotalSupplies(totalSuppliesData.totalSupplies);

      // Fetch low stock items
      const lowStockResponse = await fetch(
        "http://localhost:5000/api/low-stock"
      );
      if (!lowStockResponse.ok) {
        throw new Error(
          `HTTP error fetching low stock items! status: ${lowStockResponse.status}`
        );
      }
      const lowStockData = await lowStockResponse.json();
      setLowStockItems(lowStockData.lowStockItems);

      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array: runs only once on mount

  // Handle form submission (add product)
  const validateInputs = (quantity, sellingPrice) => {
    if (isNaN(quantity)) {
      throw new Error("Quantity must be a valid number.");
    }
    if (isNaN(sellingPrice)) {
      throw new Error("Selling price must be a valid number.");
    }
  };
  
  const handleSubmit = async () => {
    try {
      // Parse values to numbers
      const quantity = parseInt(newQuantity, 10); // Integer
      const sellingPrice = parseFloat(newSellingPrice); // Float (for decimals)
  
      // Validate parsed values
      validateInputs(quantity, sellingPrice);
  
      // Send POST request to add new product
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          item: newItem, 
          quantity: quantity, // Send as number
          selling_price: sellingPrice, // Send as number
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
  
      // Refetch data to get updated list with IDs
      await fetchData();
  
      // Reset form/state on success
      setNewItem("");
      setNewQuantity("");
      setNewSellingPrice("");
      setShowAddModal(false);
      setError(null);
  
      // Show success alert
      setShowAlert(true);
  
      // Hide alert after 3 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting data:", error);
      setError(error.message);
    }
  };

  // Handle update
  const handleUpdate = async () => {
    try {
      // Parse quantity and sellingPrice as numbers
      const quantity = parseFloat(updateQuantity);
      const sellingPrice = parseFloat(updateSellingPrice);
  
      // Validate numbers
      if (isNaN(quantity)) {
        throw new Error("Quantity must be a valid number.");
      }
      if (isNaN(sellingPrice)) {
        throw new Error("Selling price must be a valid number.");
      }
  
      const response = await fetch(
        `http://localhost:5000/api/products/${updateId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            item: updateItem,
            quantity: quantity,
            selling_price: sellingPrice, // Ensure this matches the backend field name
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
  
      fetchData(); // Refetch to update the table
      setShowUpdateModal(false);
      setError(null);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating product:", error);
      setError(error.message);
    }
  };
  

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return; // Exit if user cancels
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      fetchData(); // Refetch to update the table
      setError(null);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      console.error("Error deleting product:", error);
      setError(error.message);
    }
  };

  // Function to open the update modal and populate data
  const openUpdateModal = (rowData) => {
    setUpdateId(rowData.id);
    setUpdateItem(rowData.item);
    setUpdateQuantity(rowData.quantity);
    setUpdateSellingPrice(rowData.selling_price);
    setShowUpdateModal(true);
  };

  // Event listener for button clicks (delegation)
  useEffect(() => {
    const table = document.querySelector(".products-table table"); // Target the actual table element

    if (table) {
      const handleClick = (event) => {
        const updateButton = event.target.closest(".update-button");
        const deleteButton = event.target.closest(".delete-button");

        if (updateButton) {
          const id = updateButton.dataset.id;
          // Find the row data.  This is crucial!
          const rowData = data.find((row) => row.id === parseInt(id, 10));
          if (rowData) {
            openUpdateModal(rowData);
          }
        } else if (deleteButton) {
          const id = deleteButton.dataset.id;
          handleDelete(parseInt(id, 10)); // Convert id to number
        }
      };

      table.addEventListener("click", handleClick);

      // Cleanup function: Remove event listener when component unmounts
      return () => {
        table.removeEventListener("click", handleClick);
      };
    }
  }, [data]); // Dependency on `data` is important for re-binding events

  return (
    <div className="products-page">
      <div className="products-header">
        <h2>Products</h2>
        <h3
          className="Addproducts"
          onClick={() => setShowAddModal(true)}
          style={{ cursor: "pointer" }}
        >
          <i
            class="bi bi-cart-plus-fill"
            style={{ fontSize: "1.8rem", marginRight: "8px" }}
          ></i>
          Add Products
        </h3>
      </div>

      <div className="products-box">
        {/* Display dynamic values here */}
        <div className="product-box">
          <i
            className="bi bi-box-fill"
            style={{ fontSize: "2rem", marginBottom: "1rem" }}
          ></i>
          <h4>Total Supplies</h4>
          <p>{totalSupplies}</p> {/* Use the state variable */}
        </div>
        <div className="product-box">
          <i
            className="bi bi-exclamation-triangle-fill"
            style={{ fontSize: "2rem", marginBottom: "1rem" }}
          ></i>
          <h4>Low Stock Items</h4>
          <p>{lowStockItems}</p> {/* Use the state variable */}
        </div>
      </div>

      <div className="products-table">
        {error && <p className="error-message">Error: {error}</p>}

        {showAlert && (
          <Alert
            variant="success"
            onClose={() => setShowAlert(false)}
            dismissible
            className="w-50 mx-auto text-center"
          >
            Operation Successful
          </Alert>
        )}

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

      {/* Add Product Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        className="modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-1">Item Name</p>
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="form-control w-75"
          />

          <p className="mt-3 mb-1">Quantity</p>
          <input
            type="number"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            className="form-control w-75"
          />
          <p className="mt-3 mb-1">Selling Price</p>
          <input
            type="number"
            value={newSellingPrice}
            onChange={(e) => setNewSellingPrice(e.target.value)}
            className="form-control w-75"
          />

          {error && <p className="text-danger mt-2">Error: {error}</p>}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Product Modal */}
      <Modal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-1">Item Name</p>
          <input
            type="text"
            value={updateItem}
            onChange={(e) => setUpdateItem(e.target.value)}
            className="form-control w-75"
          />

          <p className="mt-3 mb-1">Quantity</p>
          <input
            type="number"
            value={updateQuantity}
            onChange={(e) => setUpdateQuantity(e.target.value)}
            className="form-control w-75"
          />
          <p className="mt-3 mb-1">Selling Price</p>
          <input
            type="text"
            value={updateSellingPrice}
            onChange={(e) => setUpdateSellingPrice(e.target.value)}
            className="form-control w-75"
          />
          {error && <p className="text-danger mt-2">Error: {error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Products;
