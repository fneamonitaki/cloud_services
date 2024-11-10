let ordersData = []; // Declare an empty array to hold fetched order data

async function fetchOrderData() {
    try {
        const response = await fetch("http://localhost:5001/orders");
        if (!response.ok) {
            throw new Error("Failed to fetch orders from the database.");
        }

        // Parse the response as JSON
        ordersData = await response.json();
        console.log("Parsed order data:", ordersData);

        // Generate the order items on the page
        generateOrderItems();
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
}

// Function to generate order items
let generateOrderItems = () => {
    const orderContainer = document.getElementById('order-container');
    if (ordersData.length === 0) {
        orderContainer.innerHTML = "<h2>No orders found</h2>";
        return;
    }

    // Create HTML for each order
    orderContainer.innerHTML = ordersData.map(order => {
        const productsList = order.products.map(product => `
            <li><strong>${product.title}</strong> (x${product.amount}) - <span class="product-id">Product ID: ${product.product_id}</span></li>
        `).join("");

        return `
        <div class="order-item">
            <div class="order-header">
                <h3>Order ID: ${order.id}</h3>
                <p class="order-status ${order.status.toLowerCase()}">${order.status}</p>
            </div>
            <ul class="product-list">
                ${productsList}
            </ul>
            <div class="order-footer">
                <p class="total-price">Total Price: <span>$${order.total_price}</span></p>
            </div>
        </div>
        `;
    }).join("");
};

// Call fetchOrderData to load and display the orders
fetchOrderData();
