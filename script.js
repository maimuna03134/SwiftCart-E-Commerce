// =============================================
//  SHARED UTILITIES & CART MANAGEMENT
// =============================================

// Cart stored in localStorage
let cart = JSON.parse(localStorage.getItem('swiftcart_cart') || '[]');

// Save cart to localStorage
const saveCart = () => {
    localStorage.setItem('swiftcart_cart', JSON.stringify(cart));
};

// Update cart count badge in navbar
const updateCartBadge = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('#navCartCount');
    badges.forEach(badge => {
        if (totalItems > 0) {
            badge.textContent = totalItems > 99 ? '99+' : totalItems;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });
};

// Add to cart
const addToCart = (id, title, price, image) => {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, title, price, image, quantity: 1 });
    }
    saveCart();
    updateCartBadge();
    showToast(`"${title.slice(0, 30)}..." added to cart!`);

    // If on products page, refresh cart display
    if (typeof renderCart === 'function') {
        renderCart();
    }
};

// Remove from cart
const removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartBadge();
    if (typeof renderCart === 'function') {
        renderCart();
    }
};

// Decrease quantity
const decreaseQty = (id) => {
    const item = cart.find(i => i.id === id);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(id);
            return;
        }
    }
    saveCart();
    updateCartBadge();
    if (typeof renderCart === 'function') {
        renderCart();
    }
};

// Show toast notification
const showToast = (msg = 'Done!') => {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast) return;
    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2800);
};

// Newsletter subscribe
const subscribeNewsletter = () => {
    const emailInput = document.getElementById('newsletterEmail');
    if (!emailInput) return;
    const email = emailInput.value.trim();
    if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address!');
        return;
    }
    showToast(`Subscribed! Welcome, ${email}`);
    emailInput.value = '';
};

// Checkout placeholder
const checkout = () => {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    showToast('Proceeding to checkout... 🛍️');
};

// Stars render
const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let html = '';
    for (let i = 0; i < 5; i++) {
        if (i < full) {
            html += '<i class="fa-solid fa-star" style="color:#f59e0b"></i>';
        } else if (i === full && half) {
            html += '<i class="fa-solid fa-star-half-stroke" style="color:#f59e0b"></i>';
        } else {
            html += '<i class="fa-regular fa-star" style="color:#d1d5db"></i>';
        }
    }
    return html;
};

// Category label formatter
const formatCategory = (cat) => {
    return cat.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
    });
}

// =============================================
//  HOME PAGE - TRENDING PRODUCTS
// =============================================
const trendingContainer = document.getElementById('trendingProducts');

if (trendingContainer) {
    loadTrendingProducts();
}

async function loadTrendingProducts() {
    try {
        const res = await fetch('https://fakestoreapi.com/products');
        if (!res.ok) throw new Error('Failed');
        const products = await res.json();

        // Sort by rating.rate descending and pick top 3
        const top3 = products
            .sort((a, b) => b.rating.rate - a.rating.rate)
            .slice(0, 3);

        renderTrending(top3);
    } catch (err) {
        trendingContainer.innerHTML = `
      <div class="col-span-3 text-center py-16 text-gray-400">
        <i class="fa-solid fa-wifi-slash text-4xl mb-4"></i>
        <p>Unable to load products. Please try again later.</p>
      </div>
    `;
    }
}

function renderTrending(products) {
    trendingContainer.innerHTML = products.map(p => `
    <div class="product-card bg-white rounded-2xl overflow-hidden">
      <div class="relative bg-gray-50 h-60 flex items-center justify-center p-6 overflow-hidden">
        <img src="${p.image}" alt="${p.title}" class="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-110" loading="lazy" />
        <div class="card-overlay absolute inset-0 bg-indigo-600/10 flex items-center justify-center gap-3">
        </div>
      </div>
      <div class="p-5">
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full whitespace-nowrap">${formatCategory(p.category)}</span>
          <span class="flex items-center gap-1 text-xs text-gray-500">
            <i class="fa-solid fa-star" style="color:#f59e0b"></i>
            ${p.rating.rate} (${p.rating.count})
          </span>
        </div>
        <h3 class="font-semibold text-gray-900 text-base mb-3 leading-snug line-clamp-2" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${p.title}</h3>
        <p class="text-xl font-bold text-gray-900 mb-4">$${p.price.toFixed(2)}</p>
        <div class="flex gap-2">
          <button onclick='openProductModal(${JSON.stringify(p)})' class="flex-1 btn btn-outline border-2 border-indigo-200 text-indigo-600 rounded-xl py-2 text-sm font-semibold hover:bg-indigo-50 hover:border-indigo-400 transition-all">
            <i class="fa-regular fa-eye mr-1"></i> Details
          </button>
          <button onclick="addToCart(${p.id}, '${p.title.replace(/'/g, "\\'")}', ${p.price}, '${p.image}')" class="flex-1 btn btn-primary rounded-xl py-2 text-sm font-semibold text-white">
            <i class="fa-solid fa-cart-plus mr-1"></i> Add
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// =============================================
//  PRODUCT DETAIL MODAL
// =============================================
const openProductModal = (product) => {
    const modal = document.getElementById('productModal');
    const content = document.getElementById('modalContent');
    if (!modal || !content) return;

    content.innerHTML = `
    <div class="flex flex-col sm:flex-row gap-6 p-6">
      <div class="sm:w-52 flex-shrink-0 bg-gray-50 rounded-xl flex items-center justify-center p-6">
        <img src="${product.image}" alt="${product.title}" class="max-h-52 object-contain" />
      </div>
      <div class="flex-1">
        <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">${formatCategory(product.category)}</span>
        <h2 class="text-xl font-bold text-gray-900 mt-3 mb-2 leading-snug">${product.title}</h2>
        <div class="flex items-center gap-2 mb-3">
          <span class="flex gap-0.5">${renderStars(product.rating.rate)}</span>
          <span class="text-sm text-gray-500">${product.rating.rate} (${product.rating.count} reviews)</span>
        </div>
        <p class="text-gray-500 text-sm leading-relaxed mb-4">${product.description}</p>
        <p class="text-3xl font-bold text-gray-900 mb-5">$${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${product.price}, '${product.image}'); document.getElementById('productModal').close();" class="btn btn-primary w-full rounded-xl py-3 font-semibold text-white">
          <i class="fa-solid fa-cart-plus mr-2"></i> Add to Cart
        </button>
      </div>
    </div>
  `;

    modal.showModal();
};

// Initialize on page load
updateCartBadge();