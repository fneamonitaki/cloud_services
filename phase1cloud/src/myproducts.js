let shop = document.getElementById('shop');
let AddItem = document.getElementById('AddProduct');
let allProducts = []; // Store all products to filter later

// Function to fetch products from the API and then generate shop items
const fetchProducts = async () => {
    try {
        console.log("Fetching products...");
        const response = await fetch("http://localhost:5000/products");
        if (!response.ok) throw new Error("Failed to fetch products from the server");

        const productsData = await response.json();
        console.log("Products fetched:", productsData);
       // addProducts();
        allProducts = productsData; // Save all products for filtering
        generateShop(allProducts); // Generate shop items based on fetched products
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

let addProducts = () => {
 return `
 <input type="text" id="add-new-title-${id}" placeholder="Add New Title Product" />
 `;
};

//addProducts();
// Function to render the shop items
let generateShop = (productsData) => {
    shop.innerHTML = productsData.map((product) => {
        let { id, title, img, price, quantity, description } = product;

        return `
            <div id="product-id-${id}" class="item">
                <img width="220" src="${img}" alt="">
                <div class="details">
                    <p>Title: <span id="title-${id}">${title}</span></p>
                    <input type="text" id="new-title-${id}" placeholder="New Title" />
                    <button onclick="updateTitle(${id})" class="update-button">Update Title</button>
                    <div class="price-quantity-my-products">
                        <p>Price: $<span id="price-${id}">${price}</span></p>
                        <input type="number" id="new-price-${id}" placeholder="New Price" />
                        <button onclick="updatePrice(${id})" class="update-button">Update Price</button>
                        <div id="quantity-${id}" class="quantity">
                            <p>Quantity of product: ${quantity}</p>
                        </div>
                        <button onclick="deleteProduct(${id})" class="delete-button">Delete</button>
                    </div>
                </div>
            </div>`;
    }).join("");
};

let updateTitle = async (id) => {
    const newTitleInput = document.getElementById(`new-title-${id}`);
    const newTitle = newTitleInput.value;

    if (!newTitle) {
        alert("Please enter a valid title.");
        return; // Don't proceed if the title is invalid
    }

    try {
        // Make PUT request to the API
        const response = await fetch(`http://localhost:5000/product/title/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: newTitle }) // Send the new title
        });

        if (!response.ok) throw new Error("Failed to update the title");

        // Update the displayed title in the shop
        document.getElementById(`title-${id}`).innerText = newTitle;

        alert("Title updated successfully!");
    } catch (error) {
        console.error("Error updating title:", error);
    }
};

// Function to add a new product
let addNewProduct = async () => {
    const title = document.getElementById("new-product-title").value;
    const price = parseFloat(document.getElementById("new-product-price").value);
    const quantity = parseInt(document.getElementById("new-product-quantity").value, 10);
    const description = document.getElementById("new-product-description").value;
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    // Check for required fields
    if (!title || !file || !price || !quantity || !description) {
        alert("Please fill in all fields.");
        return;
    }

    // Prepare the form data for submission
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("description", description);
    formData.append("img", file);

    try {
        const response = await fetch("http://localhost:5000/products", {
            method: "POST",
            body: formData // Use FormData for file upload
        });

        if (!response.ok) throw new Error("Failed to add the product");

        const addedProduct = await response.json();
        allProducts.push(addedProduct);
        generateShop(allProducts);

        document.getElementById("addProductForm").reset();
        alert("Product added successfully!");
    } catch (error) {
        console.error("Error adding product:", error);
    }
};



// Function to update the price of a product in the database
let updatePrice = async (id) => {
    const newPriceInput = document.getElementById(`new-price-${id}`);
    const newPrice = newPriceInput.value;

    if (!newPrice || newPrice <= 0) {
        alert("Please enter a valid price.");
        return; // Don't proceed if the price is invalid
    }

    try {
        // Make PUT request to the API
        const response = await fetch(`http://localhost:5000/product/price/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ price: newPrice }) // Send the new price
        });

        if (!response.ok) throw new Error("Failed to update the price");

        // Update the displayed price in the shop
        document.getElementById(`price-${id}`).innerText = newPrice;

        alert("Price updated successfully!");
    } catch (error) {
        console.error("Error updating price:", error);
    }
};

// Function to delete a product from the list and the database
let deleteProduct = async (id) => {
    try {
        // Make DELETE request to the API
        const response = await fetch(`http://localhost:5000/product/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error("Failed to delete the product");

        // Filter out the product from the allProducts array
        allProducts = allProducts.filter(product => product.id !== id);
        
        // Re-generate the shop with the updated product list
        generateShop(allProducts);
    } catch (error) {
        console.error("Error deleting product:", error);
    }
};

window.onload = () => {
    fetchProducts();
};
