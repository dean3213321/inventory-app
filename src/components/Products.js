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
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

DataTable.use(DT);

const Products = () => {
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState([]);
    const [newItem, setNewItem] = useState("");
    const [newQuantity, setNewQuantity] = useState("");
    const [error, setError] = useState(null);
    const [totalSupplies, setTotalSupplies] = useState(0); // Initialize to 0
    const [lowStockItems, setLowStockItems] = useState(0);   // Initialize to 0

    const columns = [
        { title: "Item", data: "item" },
        { title: "Quantity", data: "quantity" },
        { title: "Date", data: "date" },
    ];

    // Fetch product data, total supplies, and low stock items on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products (existing code)
                const productsResponse = await fetch('http://localhost:5000/api/products');
                if (!productsResponse.ok) {
                    throw new Error(`HTTP error fetching products! status: ${productsResponse.status}`);
                }
                const productsData = await productsResponse.json();
                setData(productsData);

                // Fetch total supplies
                const totalSuppliesResponse = await fetch('http://localhost:5000/api/total-supplies');
                if (!totalSuppliesResponse.ok) {
                    throw new Error(`HTTP error fetching total supplies! status: ${totalSuppliesResponse.status}`);
                }
                const totalSuppliesData = await totalSuppliesResponse.json();
                setTotalSupplies(totalSuppliesData.totalSupplies);

                // Fetch low stock items
                const lowStockResponse = await fetch('http://localhost:5000/api/low-stock');
                if (!lowStockResponse.ok) {
                    throw new Error(`HTTP error fetching low stock items! status: ${lowStockResponse.status}`);
                }
                const lowStockData = await lowStockResponse.json();
                setLowStockItems(lowStockData.lowStockItems);

                setError(null); // Clear any previous errors
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message);
            }
        };

        fetchData();
    }, []); // Empty dependency array: runs only once on mount


    // Handle form submission (add product) - Remains Unchanged
    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ item: newItem, quantity: newQuantity }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const addedProduct = await response.json();
            setData([...data, addedProduct]);

            setNewItem("");
            setNewQuantity("");
            setShowModal(false);
            setError(null);

            //After successfully adding the new product you should fetch the
            // total supplies and low stock items *again* to update the counts.
            fetchData(); //Calling the fetchdata again.

        } catch (error) {
            console.error("Error submitting data:", error);
            setError(error.message);
        }
    };
	//Added a new Fetchdata for updating the counts in product boxes.
    const fetchData = async () => {
            try {
                // Fetch products (existing code)
                const productsResponse = await fetch('http://localhost:5000/api/products');
                if (!productsResponse.ok) {
                    throw new Error(`HTTP error fetching products! status: ${productsResponse.status}`);
                }
                const productsData = await productsResponse.json();
                setData(productsData);

                // Fetch total supplies
                const totalSuppliesResponse = await fetch('http://localhost:5000/api/total-supplies');
                if (!totalSuppliesResponse.ok) {
                    throw new Error(`HTTP error fetching total supplies! status: ${totalSuppliesResponse.status}`);
                }
                const totalSuppliesData = await totalSuppliesResponse.json();
                setTotalSupplies(totalSuppliesData.totalSupplies);

                // Fetch low stock items
                const lowStockResponse = await fetch('http://localhost:5000/api/low-stock');
                if (!lowStockResponse.ok) {
                    throw new Error(`HTTP error fetching low stock items! status: ${lowStockResponse.status}`);
                }
                const lowStockData = await lowStockResponse.json();
                setLowStockItems(lowStockData.lowStockItems);

                setError(null); // Clear any previous errors
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message);
            }
        };


    return (
        <div className="products-page">
            <div className="products-header">
                <h2>Products</h2>
                <h3 className="Addproducts" onClick={() => setShowModal(true)} style={{ cursor: "pointer" }}>Add Products</h3>
            </div>

            <div className="products-box">
                {/* Display dynamic values here */}
                <div className="product-box">
                    <i className="bi bi-box-fill" style={{ fontSize: "2rem", marginBottom: "1rem" }}></i>
                    <h4>Total Supplies</h4>
                    <p>{totalSupplies}</p> {/* Use the state variable */}
                </div>
                <div className="product-box">
                    <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "2rem", marginBottom: "1rem" }}></i>
                    <h4>Low Stock Items</h4>
                    <p>{lowStockItems}</p> {/* Use the state variable */}
                </div>
            </div>

            <div className="products-table">
                {error && <p className="error-message">Error: {error}</p>}

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
			<Modal show={showModal} onHide={() => setShowModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>Add New Item</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>Item Name</p>
					<input
						type="text"
						value={newItem}
						onChange={(e) => setNewItem(e.target.value)}
					/>
					<p>Quantity</p>
					<input
						type="number"
						value={newQuantity}
						onChange={(e) => setNewQuantity(e.target.value)}
					/>
					{error && <p className="error-message">Error: {error}</p>}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>
						Close
					</Button>
					<Button variant="primary" onClick={handleSubmit}>Submit</Button>
				</Modal.Footer>
			</Modal>
        </div>
    );
};

export default Products;