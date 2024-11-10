let shop = document.getElementById('shop');
let allProducts = []; // Store all products to filter later

// Retrieve basket from localStorage or initialize an empty array
let basket = JSON.parse(localStorage.getItem("data")) || [];

// Function to fetch products from the API and then generate shop items
const fetchProducts = async () => {
    try {
        const response = await fetch("http://localhost:5000/products"); // Adjust API endpoint as needed
        if (!response.ok) throw new Error("Failed to fetch products from the server");

        const productsData = await response.json();
        console.log("Products fetched:", productsData);

        allProducts = productsData; // Save all products for filtering
        generateShop(allProducts); // Generate shop items based on fetched products
        calculation(); // Update cart icon amount
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

// Function to render the shop items
let generateShop = (productsData) => {
    shop.innerHTML = productsData.map((product) => {
        let { id, title, img, price, description } = product;

        // Find corresponding quantity in basket or set to 0 if not found
        let search = basket.find((item) => item.id === id) || { item: 0 };

        return `
            <div id=product-id-${id} class="item">
                <img width="220" src=${img} alt="">
                <div class="details">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <div class="price-quantity">
                        <h2>$${price}</h2>
                        <div class="buttons">
                            <i onclick="decrement(${id})" class="bi bi-dash"></i>
                            <div id="quantity-${id}" class="quantity">
                                ${search.item} <!-- Displays quantity from basket data -->
                            </div>
                            <i onclick="increment(${id})" class="bi bi-plus"></i>
                        </div>
                    </div>
                </div>
            </div>`;
    }).join("");
};

// Function to filter products based on the search input
const filterProducts = () => {
    let searchInput = document.getElementById("searchInput").value.toLowerCase();
    let filteredProducts = allProducts.filter(product => {
        return product.title.toLowerCase().includes(searchInput) || 
               product.description.toLowerCase().includes(searchInput);
    });
    generateShop(filteredProducts); // Render filtered products
};

// Function to increment item quantity
let increment = (id) => {
    let item = basket.find((x) => x.id === id);

    if (!item) {
        basket.push({ id: id, item: 1 });
    } else {
        item.item += 1;
    }

    update(id);
    localStorage.setItem("data", JSON.stringify(basket)); // Save to localStorage after update
};

// Function to decrement item quantity
let decrement = (id) => {
    let item = basket.find((x) => x.id === id);

    if (!item || item.item === 0) return;

    item.item -= 1;

    if (item.item === 0) basket = basket.filter((x) => x.id !== id); // Remove from basket if quantity is zero

    update(id);
    localStorage.setItem("data", JSON.stringify(basket)); // Save to localStorage after update
};

// Function to update quantity display and cart calculation
let update = (id) => {
    let item = basket.find((x) => x.id === id);

    // Update the displayed quantity in the shop
    document.getElementById(`quantity-${id}`).innerHTML = item ? item.item : 0;

    calculation(); // Update total items count in cart icon
};

// Function to calculate and display total items in cart icon
let calculation = () => {
    let cartAmount = document.getElementById("cartAmount");
    cartAmount.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

// Initial page load: fetch products, render shop items, and update cart icon
window.onload = () => {
    fetchProducts();
    calculation();
};
