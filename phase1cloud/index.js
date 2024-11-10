const express = require("express");
const cors = require("cors");
const pool = require("./db");  // Importing pool correctly from db.js
const app = express();
const multer = require('multer');
const path = require('path');

app.use(cors({
    origin: "http://127.0.0.1:5500"  // Adjust this to your client app's origin
}));

app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'images'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use('/images', express.static(path.join(__dirname, 'images')));

app.listen(5000, () => {
  console.log("server is listening on port 5000");
});

// Get all products
app.get("/products", async (req, res) => {
    try {
        const allProducts = await pool.query("SELECT * FROM products");
        res.json(allProducts.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Get a product by ID
app.get("/products/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
        res.json(product.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Get products by title
app.get("/products/title/:title", async (req, res) => {
    const { title } = req.params;
    try {
        const productsByTitle = await pool.query("SELECT * FROM products WHERE title = $1", [title]);
        res.json(productsByTitle.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Create a product
app.post('/products', upload.single('img'), async (req, res) => {
    try {
        const { title, price = 0.0, quantity = 0, description = "" } = req.body;
        const imgPath = req.file ? `/images/${req.file.filename}` : null;

        const newProduct = await pool.query(
            "INSERT INTO products (title, img, price, quantity, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [title, imgPath, price, quantity, description]
        );

        res.json(newProduct.rows[0]);
    } catch (err) {
        console.error("Error creating product:", err.message);
        res.status(500).send("Server Error");
    }
});

// Update price of a product by ID
app.put("/product/price/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { price } = req.body;

        const updateProduct = await pool.query("UPDATE products SET price = $1 WHERE id = $2", [price, id]);
        res.json("Product price was updated!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error updating product price");
    }
});

// Update title of a product by ID
app.put("/product/title/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        const updateTitleProduct = await pool.query("UPDATE products SET title = $1 WHERE id = $2", [title, id]);
        res.json("Product title was updated!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error updating product title");
    }
});


// Delete a product by ID
app.delete("/product/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteProduct = await pool.query("DELETE FROM products WHERE id = $1", [id]);
        res.json("Product was successfully deleted!");
    } catch (err) {
        console.error(err.message);
    }
});


