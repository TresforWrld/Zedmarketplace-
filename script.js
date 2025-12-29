// Zed Marketplace - Interactive JavaScript

// ===== Product Data =====
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        category: "Electronics",
        price: "K450",
        rating: 4.8,
        reviews: 234,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        badge: "Best Seller"
    },
    {
        id: 2,
        name: "Smart Watch Series 5",
        category: "Electronics",
        price: "K890",
        rating: 4.9,
        reviews: 189,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
        badge: "New"
    },
    {
        id: 3,
        name: "Premium Leather Jacket",
        category: "Fashion",
        price: "K1,200",
        rating: 4.7,
        reviews: 156,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop",
        badge: "Hot Deal"
    },
    {
        id: 4,
        name: "iPhone 14 Pro Max",
        category: "Phones",
        price: "K15,500",
        rating: 4.9,
        reviews: 423,
        image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=300&fit=crop",
        badge: "Popular"
    },
    {
        id: 5,
        name: "Modern Sofa Set",
        category: "Home & Furniture",
        price: "K3,500",
        rating: 4.6,
        reviews: 98,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
        badge: ""
    },
    {
        id: 6,
        name: "Professional DSLR Camera",
        category: "Electronics",
        price: "K4,200",
        rating: 4.8,
        reviews: 167,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
        badge: "Premium"
    },
    {
        id: 7,
        name: "Designer Handbag",
        category: "Fashion",
        price: "K780",
        rating: 4.7,
        reviews: 201,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop",
        badge: "Trending"
    },
    {
        id: 8,
        name: "Samsung Galaxy S23",
        category: "Phones",
        price: "K12,800",
        rating: 4.8,
        reviews: 312,
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop",
        badge: ""
    }
];

// ===== Cart State =====
let cart = {
    items: [],
    count: 0
};

// ===== Initialize Page =====
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    initializeScrollAnimations();
    initializeNavbar();
    initializeCategoryCards();
    initializeSearch();
});

// ===== Load Products =====
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    products.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        productsGrid.appendChild(productCard);
    });
}

// ===== Create Product Card =====
function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const stars = generateStars(product.rating);
    
    card.innerHTML = `
        <div class="product-image-container">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
        </div>
        <div class="product-content">
            <div class="product-category">${product.category}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-rating">
                ${stars}
                <span>(${product.reviews})</span>
            </div>
            <div class="product-price">${product.price}</div>
            <button class="add-to-cart-btn" onclick="addToCart('${product.name}', '${product.price}')">
                <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
        </div>
    `;
    
    return card;
}

// ===== Generate Star Rating =====
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// ===== Add to Cart =====
function addToCart(productName, price) {
    cart.count++;
    cart.items.push({ name: productName, price: price });
    
    // Update cart badge
    const cartBadge = document.getElementById('cartBadge');
    cartBadge.textContent = cart.count;
    cartBadge.style.animation = 'none';
    cartBadge.offsetHeight; // Trigger reflow
    cartBadge.style.animation = 'pulse 0.5s ease';
    
    // Show toast notification
    showToast(`${productName} added to cart!`);
}

// ===== Show Toast Notification =====
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message p');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== Initialize Scroll Animations =====
function initializeScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
}

// ===== Initialize Navbar =====
function initializeNavbar() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Cart icon click
    const cartIcon = document.getElementById('cartIcon');
    cartIcon.addEventListener('click', () => {
        if (cart.items.length > 0) {
            const cartItems = cart.items.map(item => item.name).join(', ');
            showToast(`Cart: ${cartItems}`);
        } else {
            showToast('Your cart is empty');
        }
    });
}

// ===== Initialize Category Cards =====
function initializeCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            filterProducts(category);
        });
    });
}

// ===== Filter Products by Category =====
function filterProducts(category) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    const filteredProducts = products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
    );
    
    if (filteredProducts.length > 0) {
        filteredProducts.forEach((product, index) => {
            const productCard = createProductCard(product, index);
            productsGrid.appendChild(productCard);
        });
        showToast(`Showing ${category} products`);
    } else {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No products found in this category.</p>';
        showToast(`No ${category} products available`);
    }
}

// ===== Initialize Search =====
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    const performSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query === '') {
            // Reset to all products
            const productsGrid = document.getElementById('productsGrid');
            productsGrid.innerHTML = '';
            products.forEach((product, index) => {
                const productCard = createProductCard(product, index);
                productsGrid.appendChild(productCard);
            });
            return;
        }
        
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
        
        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = '';
        
        if (filteredProducts.length > 0) {
            filteredProducts.forEach((product, index) => {
                const productCard = createProductCard(product, index);
                productsGrid.appendChild(productCard);
            });
            showToast(`Found ${filteredProducts.length} products`);
        } else {
            productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No products found matching your search.</p>';
            showToast('No products found');
        }
    };
    
    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Add Hover Effects to Product Cards =====
function addHoverEffects() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize hover effects after products load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addHoverEffects, 500);
});

// ===== Parallax Effect for Hero Section =====
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.scrollY;
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// ===== Console Welcome Message =====
console.log('%c Welcome to Zed Marketplace! ', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 5px;');