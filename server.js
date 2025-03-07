require('dotenv').config();

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

// Use PORT from environment or default to 5000
const port = process.env.PORT || 5000;

// Create a database connection using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to the database.");
});

// GET all products (Modified to include ID)
app.get('/api/products', (req, res) => {
    const sql = "SELECT id, product_name AS item, quantity, selling_price, DATE_FORMAT(date, '%m-%d-%Y') AS date FROM inventory_bookstore";
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
    const { item, quantity, selling_price } = req.body;

    // Validate all required fields and their types
    if (!item || quantity === undefined || selling_price === undefined) {
        return res.status(400).json({ error: "Item name, quantity, and selling price are required." });
    }
    if (isNaN(quantity) || isNaN(selling_price)) {
        return res.status(400).json({ error: "Quantity and selling price must be valid numbers." });
    }

    const sql = "INSERT INTO inventory_bookstore (product_name, quantity, selling_price, date) VALUES (?, ?, ?, NOW())";
    db.query(sql, [item, quantity, selling_price], (err, result) => {
        if (err) {
            console.error("Error adding product:", err);
            res.status(500).json({ error: "Failed to add product" });
            return;
        }

        // Return the newly created product
        const newProduct = {
            id: result.insertId, // Get the auto-incremented ID
            item: item,
            quantity: quantity,
            selling_price: selling_price,
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
    const { item, quantity, selling_price } = req.body; // Use selling_price
  
    // Validate selling_price
    if (isNaN(selling_price)) {
      console.error("Invalid selling price:", selling_price);
      return res.status(400).json({ error: "Selling price must be a valid number." });
    }
  
    // SQL query to update the product
    const sql = "UPDATE inventory_bookstore SET product_name = ?, quantity = ?, selling_price = ? WHERE id = ?";
    db.query(sql, [item, quantity, selling_price, productId], (err, result) => {
      if (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({ error: "Failed to update product" });
      }
      if (result.affectedRows === 0) {
        // No rows were updated (product ID not found)
        return res.status(404).json({ error: "Product not found" });
      }
      // Success
      res.status(200).json({ message: "Product updated successfully" });
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


// GET all users with "teacher" in their position
app.get('/api/users/teachers', (req, res) => {
    const sql = "SELECT id, fname, lname, email, position, isactive FROM user WHERE position NOT IN ('Student', 'Gatepass', 'Intern') AND isactive = 1";
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching teacher data:", err);
        return res.status(500).json({ error: "Failed to fetch teacher data" });
      }
      res.json(results);
    });
  });

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});