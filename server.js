const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, "public")))
app.use(cors())
app.use(express.json())

const port = 5000

const db = mysql.createConnection({
    host: "localhost",
    user: "u652554119_admissions",
    password: "Dg6iW4uYOCyzBFfG",
    database: "u652554119_admissions"
})


db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to the database.");
});

// GET all products (existing route - remains unchanged)
app.get('/api/products', (req, res) => {
    const sql = "SELECT product_name AS item, quantity, DATE_FORMAT(date, '%m-%d-%Y') AS date FROM inventory_bookstore";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching products:", err);
            res.status(500).json({ error: "Failed to fetch products" });
            return;
        }
        res.json(results);
    });
});

// POST (add) a new product (existing route - remains unchanged)
app.post('/api/products', (req, res) => {
    const { item, quantity } = req.body;
    if (!item || quantity === undefined || isNaN(parseInt(quantity))) {
        return res.status(400).json({ error: "Item name and quantity are required, and quantity must be a number." });
    }
    const sql = "INSERT INTO inventory_bookstore (product_name, quantity, date) VALUES (?, ?, NOW())";
    db.query(sql, [item, quantity], (err, result) => {
        if (err) {
            console.error("Error adding product:", err);
            res.status(500).json({ error: "Failed to add product" });
            return;
        }
        const newProduct = {
            item: item,
            quantity: quantity,
            date: new Date().toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
            })
        };
        res.status(201).json(newProduct);
    });
});

// GET total supplies
app.get('/api/total-supplies', (req, res) => {
    const sql = "SELECT SUM(quantity) AS totalSupplies FROM inventory_bookstore";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching total supplies:", err);
            res.status(500).json({ error: "Failed to fetch total supplies" });
            return;
        }
        // results[0].totalSupplies might be null if the table is empty.  Handle that.
        const totalSupplies = results[0].totalSupplies || 0; // Default to 0 if null
        res.json({ totalSupplies }); // Send as an object
    });
});

// GET low stock items (assuming low stock is quantity <= 5, adjust as needed)
app.get('/api/low-stock', (req, res) => {
    const sql = "SELECT COUNT(*) AS lowStockItems FROM inventory_bookstore WHERE quantity <= 10"; // Adjust 5 as needed
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching low stock items:", err);
            res.status(500).json({ error: "Failed to fetch low stock items" });
            return;
        }
        const lowStockItems = results[0].lowStockItems; // No need to check for null, COUNT(*) always returns a number
        res.json({ lowStockItems }); // Send as an object
    });
});
// Start the server (existing code - remains unchanged)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});