
const express = require("express");
const  ordersPool  = require("./dborder");  // Separate pool for orders database
const cors = require("cors");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors({
    origin: "http://127.0.0.1:5500"  // Adjust this to your client app's origin
}));

// Use JSON parser
app.use(express.json());


app.listen(5001, () => {
  console.log("server is listening on port 5001");
});


// Create a new order
app.post("/orders", async (req, res) => {
    const {products, total_price } = req.body;

    try {
        const newOrder = await ordersPool.query(
            `INSERT INTO orders (products, total_price, status) 
             VALUES ($1, $2, 'Pending') RETURNING *`,
            [JSON.stringify(products), total_price]
        );

        res.status(201).json(newOrder.rows[0]);
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ message: "Error creating order" });
    }
});

// Get all orders
app.get("/orders", async (req, res) => {
    try {
        const allOrders = await ordersPool.query("SELECT * FROM orders");
        res.json(allOrders.rows);
    } catch (err) {
        console.error("Error retrieving orders:", err);
        res.status(500).json({ message: "Error retrieving orders" });
    }
});



// Update order status by ID
app.put("/orders/status/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        await ordersPool.query(
            "UPDATE orders SET status = $1 WHERE id = $2",
            [status, id]
        );
        res.json({ message: "Order status updated successfully" });
    } catch (err) {
        console.error("Error updating order status:", err);
        res.status(500).json({ message: "Error updating order status" });
    }
});

// Delete an order by ID
app.delete("/orders/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await ordersPool.query("DELETE FROM orders WHERE id = $1", [id]);
        res.json({ message: "Order deleted successfully" });
    } catch (err) {
        console.error("Error deleting order:", err);
        res.status(500).json({ message: "Error deleting order" });
    }
});

module.exports = app;

