let label = document.getElementById('label');
let ShoppingCart = document.getElementById('shopping-cart');

let basket = JSON.parse(localStorage.getItem("data")) || [];
let shopItemsData = [];  // Declare as an empty array to hold fetched product data

// Function to fetch products from the database
async function fetchProductData() {
    try {
        const response = await fetch("http://localhost:5000/products");
        if (!response.ok) {
            throw new Error("Failed to fetch products from database.");
        }
        shopItemsData = await response.json();
        generateCartItems(); // Generate cart items after data is loaded
        TotalAmount(); // Calculate total after items are generated
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Fetch products on load
fetchProductData();

// Initial calculation of total cart quantity
let calculation = () => {
    let cartIconNumber = document.getElementById("cartAmount");
    cartIconNumber.innerHTML = basket.reduce((acc, item) => acc + item.item, 0);
};

// Display initial cart count
calculation();

// Generate Cart Items Display
let generateCartItems = () => {
    console.log(basket.length);
    if (basket.length !== 0) {
        
        ShoppingCart.innerHTML = basket.map((x) => {
            let { id, item } = x;
            let search = shopItemsData.find((y) => y.id === parseInt(id)) || {};

            return `
            <div class="cart-item">
                <img width="100" src=${search.img} alt="" />
                <div class="details">
                    <div class="title-price-x">
                        <h4 class="title-price">
                            <p>${search.title}</p>
                            <p class="cart-item-price">$${search.price}</p>
                        </h4>
                        <i onclick="removeItem('${id}')" class="bi bi-x-lg"></i>
                    </div>
                    <div class="buttons">
                        <i onclick="decrement('${id}')" class="bi bi-dash"></i>
                        <div id="quantity-${id}" class="quantity">${item}</div>
                        <i onclick="increment('${id}')" class="bi bi-plus"></i>
                    </div>
                    <h3>$${item * search.price}</h3>
                </div>
            </div>`;
        }).join("");
    } else{
        console.log("cart is empty");
        ShoppingCart.innerHTML = "";
        ShoppingCart.innerHTML = `<h2> Nothing Found In Cart</h2>
        <a href="index.html">
         <button class="HomeButton"> Back To home</button>
         </a>
         <img src="https://media.tenor.com/oyc1rNpEjBkAAAAM/raccoon-washing.gif">
        `;
    }
};

// Increment function
let increment = (id) => {
    id = parseInt(id); // Ensure id is an integer
    let search = basket.find((x) => x.id === id);

    if (!search) {
        basket.push({ id: id, item: 1 });
    } else {
        search.item += 1;
    }

    localStorage.setItem("data", JSON.stringify(basket));
    update(id);
    generateCartItems(); // Re-render cart items
};

// Decrement function
let decrement = (id) => {
    id = parseInt(id);
    let search = basket.find((x) => x.id === id);

    if (!search || search.item === 0) return;
    search.item -= 1;

    if (search.item === 0) {
        basket = basket.filter((x) => x.id !== id);
    }

    localStorage.setItem("data", JSON.stringify(basket));
    update(id);
    generateCartItems(); // Re-render cart items
};

// Update quantity in cart and recalculate totals
let update = (id) => {
    let search = basket.find((x) => x.id === id);
    document.getElementById(`quantity-${id}`).innerHTML = search ? search.item : 0;

    calculation();  // Update cart amount
    TotalAmount();  // Update total amount
};

// Remove an item from the cart
let removeItem = (id) => {
    id = parseInt(id);
    basket = basket.filter((x) => x.id !== id);

    localStorage.setItem("data", JSON.stringify(basket));
    generateCartItems();
    calculation();
    TotalAmount();
};

// Calculate and display the total amount
let TotalAmount = () => {
    if (basket.length !== 0 && shopItemsData.length !== 0) {
        let totalAmount = basket.reduce((acc, x) => {
            let product = shopItemsData.find((y) => y.id === x.id) || {};
            return acc + (x.item * (product.price || 0));
        }, 0);

        label.innerHTML = `
        <h2>Total Bill: $${totalAmount.toFixed(2)}</h2>
        <a href="index.html"><button class="shopmore">Shop More</button></a>
        <button onclick="placeorder()" class="checkout">Checkout</button>
        <button onclick="clearCart()" class="removeAll">Clear Cart</button>
        `;
    } else {
        label.innerHTML = basket.length === 0 ? '' : '<h2>Loading...</h2>';
    }
};

let placeorder = async () => {
    console.log("exo mpei edo");
    if (basket.length === 0) {
        alert("Your cart is empty. Add items to the cart before checking out.");
        return;
    }

    // Create an array of product data from the `basket` for the backend
    let products = basket.map((item) => {
        let product = shopItemsData.find((p) => p.id === item.id);
        return {
            title: product.title,
            amount: item.item,
            product_id: product.id
        };
    });

    // Calculate total price for the order
    let totalPrice = products.reduce((acc, item) => {
        let product = shopItemsData.find((p) => p.id === item.product_id);
        return acc + (item.amount * (product.price || 0));
    }, 0).toFixed(2);

    // Create the order object to send
    let order = {
        products: products,
        total_price: totalPrice
    };

    try {
        // Send POST request to the backend server
        let response = await fetch("http://localhost:5001/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        });

        if (response.ok) {
            let data = await response.json();
            alert("Order placed successfully!");
            clearCart(); // Clear the cart after successful order placement
        } else {
            alert("Failed to place order. Please try again.");
            console.error("Error placing order:", response.statusText);
        }
    } catch (error) {
        console.error("Error placing order:", error);
        alert("An error occurred while placing the order. Please try again later.");
    }
};


let clearCart = () => {
    basket = [];
    localStorage.setItem("data", JSON.stringify(basket));
    generateCartItems();  // Re-render to show empty cart message
    calculation();         // Update cart icon count
    TotalAmount();         // Reset total amount display
};

// Initial call to calculate the total amount
TotalAmount();
