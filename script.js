// ===============================
// PRODUCT DATA
// ===============================
const products = [
    {
        id: 1,
        name: "Samsung Galaxy A14",
        price: 2800,
        category: "phones",
        image: "https://via.placeholder.com/300x200?text=Samsung+A14"
    },
    {
        id: 2,
        name: "HP Laptop 15",
        price: 7500,
        category: "electronics",
        image: "https://via.placeholder.com/300x200?text=HP+Laptop"
    },
    {
        id: 3,
        name: "Men's Sneakers",
        price: 850,
        category: "fashion",
        image: "https://via.placeholder.com/300x200?text=Sneakers"
    },
    {
        id: 4,
        name: "Wooden Sofa Set",
        price: 4200,
        category: "home",
        image: "https://via.placeholder.com/300x200?text=Sofa+Set"
    }
];

// ===============================
// CART LOGIC
// ===============================
let cart = [];

// ===============================
// LOAD PRODUCTS
// ===============================
const productsGrid = document.getElementById("productsGrid");

function loadProducts() {
    productsGrid.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img class="product-image" src="${product.image}" alt="${product.name}">
            <div class="product-content">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">ZMW ${product.price}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        `;

        productsGrid.appendChild(card);
    });
}

// ===============================
// ADD TO CART
// ===============================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    cart.push(product);
    updateCartBadge();
    showToast(product.name);
}

// ===============================
// UPDATE CART BADGE
// ===============================
function updateCartBadge() {
    document.getElementById("cartBadge").innerText = cart.length;
}

// ===============================
// TOAST NOTIFICATION
// ===============================
function showToast(productName) {
    const toast = document.getElementById("toast");
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${productName} added to cart!`;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", loadProducts);