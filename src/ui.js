export function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');

  toastText.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  const overlay = document.getElementById('modalOverlay');

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  const overlay = document.getElementById('modalOverlay');

  modal.classList.add('hidden');
  overlay.classList.add('hidden');
}

export function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.classList.toggle('hidden');
}

export function closeDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.classList.add('hidden');
}

export function generateStars(rating) {
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

export function formatPrice(price) {
  return `K${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function createProductCard(product, onAddToCart) {
  const card = document.createElement('div');
  card.className = 'product-card';

  const stars = generateStars(product.rating || 0);

  card.innerHTML = `
    <div class="product-image-container">
      ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
      <img src="${product.image_url}" alt="${product.name}" class="product-image" loading="lazy">
    </div>
    <div class="product-content">
      <div class="product-category">${product.category}</div>
      <h3 class="product-name">${product.name}</h3>
      <div class="product-rating">
        ${stars}
        <span>(${product.reviews_count || 0})</span>
      </div>
      <div class="product-price">${formatPrice(product.price)}</div>
      <button class="add-to-cart-btn" data-product-id="${product.id}">
        <i class="fas fa-shopping-cart"></i> Add to Cart
      </button>
    </div>
  `;

  const addBtn = card.querySelector('.add-to-cart-btn');
  addBtn.addEventListener('click', () => onAddToCart(product));

  return card;
}
