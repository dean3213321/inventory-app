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

// GET all products (Modified to include ID)
app.get('/api/products', (req, res) => {
    const sql = "SELECT id, product_name AS item, quantity, DATE_FORMAT(date, '%m-%d-%Y') AS date FROM inventory_bookstore";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching products:", err);
            res.status(500).json({ error: "Failed to fetch products" });
            return;
        }
        res.json(results);
    });
});

// POST (add) a new product
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
          // Return the newly created ID.  VERY IMPORTANT.
        const newProduct = {
            id: result.insertId, // Get the auto-incremented ID
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

// PUT (update) an existing product
app.put('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10); // Get ID from URL, convert to number
    const { item, quantity } = req.body;

    if (!item || quantity === undefined || isNaN(parseInt(quantity))) {
        return res.status(400).json({ error: "Item name and quantity are required, and quantity must be a number." });
    }

    const sql = "UPDATE inventory_bookstore SET product_name = ?, quantity = ? WHERE id = ?";
    db.query(sql, [item, quantity, productId], (err, result) => {
        if (err) {
            console.error("Error updating product:", err);
            res.status(500).json({ error: "Failed to update product" });
            return;
        }
        if (result.affectedRows === 0) {
            // No rows were updated (product ID not found)
            res.status(404).json({ error: "Product not found" });
        } else {
          res.status(200).json({ message: "Product updated successfully" });
        }

    });
});

// DELETE a product
app.delete('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10); // Get ID, convert to number

    const sql = "DELETE FROM inventory_bookstore WHERE id = ?";
    db.query(sql, [productId], (err, result) => {
        if (err) {
            console.error("Error deleting product:", err);
            res.status(500).json({ error: "Failed to delete product" });
            return;
        }
        if (result.affectedRows === 0) {
            // No rows were deleted (product ID not found)
            res.status(404).json({ error: "Product not found" });
        } else {
          res.status(200).json({message : 'Product deleted successfully'});
        }
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
        const totalSupplies = results[0].totalSupplies || 0;
        res.json({ totalSupplies });
    });
});

// GET low stock items
app.get('/api/low-stock', (req, res) => {
    const sql = "SELECT COUNT(*) AS lowStockItems FROM inventory_bookstore WHERE quantity <= 10";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching low stock items:", err);
            res.status(500).json({ error: "Failed to fetch low stock items" });
            return;
        }
        const lowStockItems = results[0].lowStockItems;
        res.json({ lowStockItems });
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});