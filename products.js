// =============================================
//  PRODUCTS PAGE LOGIC
// =============================================

let allProducts = [];
let currentCategory = 'all';

const categoryContainer = document.getElementById('categoryContainer');
const productsGrid = document.getElementById('productsGrid');
const productCountEl = document.getElementById('productCount');

// ===== INIT =====
if (categoryContainer && productsGrid) {
    initProductsPage();
}

async function initProductsPage() {
    await loadCategories();
    await loadProducts('all');
}

// ===== LOAD CATEGORIES =====
async function loadCategories() {
    try {
        const res = await fetch('https://fakestoreapi.com/products/categories');
        if (!res.ok) throw new Error('Failed');
        const categories = await res.json();
        renderCategories(categories);
    } catch (err) {
        categoryContainer.innerHTML = `<p class="text-red-400 text-sm">Failed to load categories.</p>`;
    }
}

function renderCategories(categories) {
    categoryContainer.innerHTML = '';

    // "All" button
    const allBtn = document.createElement('button');
    allBtn.className = 'category-btn active px-5 py-2 rounded-full text-sm font-semibold bg-white border-2 border-gray-200 text-gray-700';
    allBtn.textContent = 'All';
    allBtn.dataset.cat = 'all';
    allBtn.onclick = () => selectCategory('all', allBtn);
    categoryContainer.appendChild(allBtn);

    // Category buttons
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-btn px-5 py-2 rounded-full text-sm font-semibold bg-white border-2 border-gray-200 text-gray-700';
        btn.textContent = formatCategory(cat);
        btn.dataset.cat = cat;
        btn.onclick = () => selectCategory(cat, btn);
        categoryContainer.appendChild(btn);
    });
}

function selectCategory(category, btnEl) {
    // Update active state
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');

    currentCategory = category;
    loadProducts(category);
}

// ===== LOAD PRODUCTS =====
async function loadProducts(category) {
    showSkeletons();
    try {
        let url = 'https://fakestoreapi.com/products';
        if (category !== 'all') {
            url = `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed');
        const products = await res.json();

        if (category === 'all') {
            allProducts = products;
        }

        renderProducts(products);
    } catch (err) {
        productsGrid.innerHTML = `
      <div class="col-span-3 text-center py-20 text-gray-400">
        <i class="fa-solid fa-circle-exclamation text-4xl mb-4"></i>
        <p class="font-medium">Failed to load products. Please try again.</p>
        <button onclick="loadProducts('${category}')" class="mt-4 btn btn-outline text-indigo-600 border-indigo-300 rounded-full px-6">
          Retry
        </button>
      </div>
    `;
    }
}

function showSkeletons() {
    productsGrid.innerHTML = Array(6).fill(0).map(() => `
    <div class="skeleton rounded-2xl h-80"></div>
  `).join('');
    if (productCountEl) productCountEl.textContent = '';
}

function renderProducts(products) {
    if (productCountEl) {
        productCountEl.textContent = `${products.length} product${products.length !== 1 ? 's' : ''} found`;
    }

    if (products.length === 0) {
        productsGrid.innerHTML = `
      <div class="col-span-3 text-center py-16 text-gray-400">
        <i class="fa-solid fa-box-open text-5xl mb-4"></i>
        <p class="font-medium">No products found in this category.</p>
      </div>
    `;
        return;
    }

    productsGrid.innerHTML = products.map(p => `
    <div class="product-card bg-white rounded-2xl overflow-hidden flex flex-col">
      <div class="relative bg-gray-50 h-56 flex items-center justify-center p-5 overflow-hidden cursor-pointer" onclick='openProductModal(${JSON.stringify(p).replace(/'/g, "&#39;")})'>
        <img src="${p.image}" alt="${p.title}" class="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-110" loading="lazy" />
      </div>
      <div class="p-5 flex flex-col flex-1">
        <div class="flex items-start justify-between gap-2 mb-2">
          <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full leading-tight">${formatCategory(p.category)}</span>
          <span class="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
            <i class="fa-solid fa-star" style="color:#f59e0b"></i>
            ${p.rating.rate} (${p.rating.count})
          </span>
        </div>
        <h3 class="font-semibold text-gray-900 text-sm mb-3 leading-snug flex-1" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${p.title}</h3>
        <p class="text-lg font-bold text-gray-900 mb-4">$${p.price.toFixed(2)}</p>
        <div class="flex gap-2 mt-auto">
          <button onclick='openProductModal(${JSON.stringify(p).replace(/'/g, "&#39;")})' class="flex-1 btn border-2 border-indigo-200 text-indigo-600 rounded-xl py-2 text-sm font-semibold hover:bg-indigo-50 hover:border-indigo-400 transition-all bg-white">
            <i class="fa-regular fa-eye mr-1"></i> Details
          </button>
          <button onclick="addToCart(${p.id}, '${p.title.replace(/'/g, "\\'").replace(/"/g, '\\"')}', ${p.price}, '${p.image}')" class="flex-1 btn btn-primary rounded-xl py-2 text-sm font-semibold text-white">
            <i class="fa-solid fa-cart-plus mr-1"></i> Add
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== CART SIDEBAR (Products Page) =====
function renderCart() {
    const cartItemsList = document.getElementById('cartItemsList');
    const mobileCartItemsList = document.getElementById('mobileCartItemsList');
    const cartTotalEl = document.getElementById('cartTotal');
    const mobileCartTotalEl = document.getElementById('mobileCartTotal');
    const cartItemCountEl = document.getElementById('cartItemCount');
    const emptyCart = document.getElementById('emptyCart');
    const mobileEmptyCart = document.getElementById('mobileEmptyCart');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartItemCountEl) cartItemCountEl.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
    if (cartTotalEl) cartTotalEl.textContent = `$${totalPrice.toFixed(2)}`;
    if (mobileCartTotalEl) mobileCartTotalEl.textContent = `$${totalPrice.toFixed(2)}`;

    const cartHTML = cart.length === 0 ? '' : cart.map(item => `
    <div class="cart-item-enter flex gap-3 bg-gray-50 rounded-xl p-3">
      <img src="${item.image}" alt="${item.title}" class="w-12 h-12 object-contain bg-white rounded-lg flex-shrink-0" />
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-gray-800 leading-tight" style="display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;">${item.title}</p>
        <p class="text-xs text-gray-500 mt-0.5">$${item.price.toFixed(2)} each</p>
        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center gap-2">
            <button onclick="decreaseQty(${item.id})" class="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold flex items-center justify-center transition-colors">-</button>
            <span class="text-sm font-semibold text-gray-800 min-w-[20px] text-center">${item.quantity}</span>
            <button onclick="addToCart(${item.id}, '${item.title.replace(/'/g, "\\'")}', ${item.price}, '${item.image}')" class="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold flex items-center justify-center transition-colors">+</button>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-indigo-600">$${(item.price * item.quantity).toFixed(2)}</span>
            <button onclick="removeFromCart(${item.id})" class="text-red-400 hover:text-red-600 transition-colors p-0.5">
              <i class="fa-solid fa-trash text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

    if (cartItemsList) {
        if (emptyCart) emptyCart.style.display = cart.length === 0 ? 'block' : 'none';
        const existingItems = cartItemsList.querySelectorAll('.cart-item-enter');
        existingItems.forEach(el => el.remove());
        if (cart.length > 0) {
            cartItemsList.insertAdjacentHTML('afterbegin', cartHTML);
        }
    }

    if (mobileCartItemsList) {
        if (mobileEmptyCart) mobileEmptyCart.style.display = cart.length === 0 ? 'block' : 'none';
        const existingItems = mobileCartItemsList.querySelectorAll('.cart-item-enter');
        existingItems.forEach(el => el.remove());
        if (cart.length > 0) {
            mobileCartItemsList.insertAdjacentHTML('afterbegin', cartHTML);
        }
    }
}

// Toggle mobile cart drawer
function toggleCartSidebar() {
    const overlay = document.getElementById('mobileCartOverlay');
    const drawer = document.getElementById('mobileCartDrawer');
    if (!overlay || !drawer) return;

    const isOpen = !drawer.classList.contains('translate-x-full');
    if (isOpen) {
        drawer.classList.add('translate-x-full');
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    } else {
        drawer.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        renderCart();
    }
}

// Initialize cart on products page
renderCart();