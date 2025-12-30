import { initAuth, currentUser, signIn, signUp, signOut, getUserProfile } from './auth.js';
import { loadProducts, getProductsByCategory, searchProducts } from './products.js';
import { loadCart, addToCart, removeFromCart, getCartTotal, getCartCount, getCartItemsWithProducts } from './cart.js';
import { showToast, openModal, closeModal, toggleDropdown, closeDropdown, createProductCard, formatPrice } from './ui.js';

let allProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
  await initAuth();
  await initializeApp();
});

async function initializeApp() {
  await loadProducts().then(products => {
    allProducts = products;
  });

  if (currentUser) {
    await loadCart();
  }

  initializeEventListeners();
  displayProducts(allProducts);
  updateCartUI();
  initializeScrollAnimations();
}

function initializeEventListeners() {
  const authModal = document.getElementById('authModal');
  const authTabs = document.querySelectorAll('.auth-tab');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const closeAuthModal = document.getElementById('closeAuthModal');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const cartIcon = document.getElementById('cartIcon');
  const closeCart = document.getElementById('closeCart');
  const cartSidebar = document.getElementById('cartSidebar');
  const modalOverlay = document.getElementById('modalOverlay');
  const userMenu = document.getElementById('userMenu');
  const userIcon = document.getElementById('userIcon');
  const userDropdown = document.getElementById('userDropdown');
  const categoryCards = document.querySelectorAll('.category-card');
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  const startSellingBtn = document.getElementById('startSellingBtn');
  const sellLink = document.getElementById('sellLink');

  authTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const tabName = e.target.getAttribute('data-tab');
      document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));

      document.querySelector(`.auth-form[data-form="${tabName}"]`).classList.add('active');
      e.target.classList.add('active');
    });
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      await signIn(email, password);
      closeModal('authModal');
      showToast('Signed in successfully');
      window.location.reload();
    } catch (error) {
      document.getElementById('loginError').textContent = error.message;
      document.getElementById('loginError').classList.remove('hidden');
    }
  });

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
      await signUp(email, password, fullName);
      closeModal('authModal');
      showToast('Account created! Please sign in');
      document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      document.querySelector('.auth-form[data-form="login"]').classList.add('active');
      document.querySelector('.auth-tab[data-tab="login"]').classList.add('active');
    } catch (error) {
      document.getElementById('signupError').textContent = error.message;
      document.getElementById('signupError').classList.remove('hidden');
    }
  });

  closeAuthModal.addEventListener('click', () => closeModal('authModal'));
  modalOverlay.addEventListener('click', () => {
    closeModal('authModal');
    closeModal('cartSidebar');
  });

  loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('authModal');
  });

  logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await signOut();
    showToast('Signed out successfully');
    window.location.reload();
  });

  cartIcon.addEventListener('click', () => {
    cartSidebar.classList.toggle('hidden');
    if (!cartSidebar.classList.contains('hidden')) {
      modalOverlay.classList.remove('hidden');
      updateCartDisplay();
    }
  });

  closeCart.addEventListener('click', () => {
    cartSidebar.classList.add('hidden');
    modalOverlay.classList.add('hidden');
  });

  userIcon.addEventListener('click', () => {
    userDropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!userMenu.contains(e.target)) {
      userDropdown.classList.add('hidden');
    }
  });

  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.getAttribute('data-category');
      const filtered = getProductsByCategory(category);
      displayProducts(filtered);
      showToast(`Showing ${category} products`);
      document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' });
    });
  });

  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });

  startSellingBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!currentUser) {
      openModal('authModal');
      showToast('Please sign in to become a seller');
    } else {
      showToast('Seller registration coming soon!');
    }
  });

  sellLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (!currentUser) {
      openModal('authModal');
    } else {
      showToast('Seller dashboard coming soon!');
    }
  });
}

function performSearch() {
  const query = document.getElementById('searchInput').value.trim();

  if (query === '') {
    displayProducts(allProducts);
    return;
  }

  const results = searchProducts(query);
  if (results.length > 0) {
    displayProducts(results);
    showToast(`Found ${results.length} products`);
  } else {
    displayProducts([]);
    showToast('No products found');
  }
}

function displayProducts(products) {
  const productsGrid = document.getElementById('productsGrid');
  productsGrid.innerHTML = '';

  if (products.length === 0) {
    productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No products found.</p>';
    return;
  }

  products.forEach((product, index) => {
    const card = createProductCard(product, async (prod) => {
      try {
        if (!currentUser) {
          openModal('authModal');
          showToast('Please sign in to add items to cart');
          return;
        }

        await addToCart(prod.id, 1);
        showToast(`${prod.name} added to cart!`);
        updateCartUI();
      } catch (error) {
        showToast(`Error: ${error.message}`);
      }
    });

    card.style.animationDelay = `${index * 0.1}s`;
    productsGrid.appendChild(card);
  });

  addHoverEffects();
}

function updateCartUI() {
  const cartBadge = document.getElementById('cartBadge');
  const count = getCartCount();
  cartBadge.textContent = count;
}

function updateCartDisplay() {
  const cartItemsList = document.getElementById('cartItemsList');
  const cartTotal = document.getElementById('cartTotal');
  const items = getCartItemsWithProducts();

  if (items.length === 0) {
    cartItemsList.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-muted);">Your cart is empty</p>';
    cartTotal.textContent = 'K0';
    return;
  }

  cartItemsList.innerHTML = items.map(item => `
    <div class="cart-item">
      <img src="${item.product?.image_url}" alt="${item.product?.name}" class="cart-item-image">
      <div class="cart-item-info">
        <h4>${item.product?.name}</h4>
        <p>${formatPrice(item.product?.price)}</p>
      </div>
      <div class="cart-item-quantity">
        <button onclick="decreaseQuantity('${item.id}')">-</button>
        <span>${item.quantity}</span>
        <button onclick="increaseQuantity('${item.id}')">+</button>
      </div>
      <button onclick="removeCartItem('${item.id}')" class="cart-item-remove">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');

  const total = getCartTotal();
  cartTotal.textContent = formatPrice(total);
}

window.decreaseQuantity = async (cartItemId) => {
  const item = document.querySelector(`[data-cart-id="${cartItemId}"]`);
  if (!item) return;

  const quantity = parseInt(item.dataset.quantity || 1) - 1;

  if (quantity <= 0) {
    await removeFromCart(cartItemId);
  } else {
    await loadCart().then(() => {
      updateCartUI();
      updateCartDisplay();
    });
  }
};

window.increaseQuantity = async (cartItemId) => {
  await loadCart().then(() => {
    updateCartUI();
    updateCartDisplay();
  });
};

window.removeCartItem = async (cartItemId) => {
  await removeFromCart(cartItemId);
  updateCartUI();
  updateCartDisplay();
  showToast('Item removed from cart');
};

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

window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  const hero = document.querySelector('.hero');

  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  if (hero && window.scrollY < window.innerHeight) {
    hero.style.backgroundPositionY = window.scrollY * 0.5 + 'px';
  }
});
