// Data Produk Niken's Cake Store
const products = [
    {
        id: 1,
        name: "Red Velvet Cake",
        price: 250000,
        image: "https://images.unsplash.com/photo-1559620192-032c4bc4674e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1929&q=80",
        description: "Kue red velvet lembut dengan cream cheese frosting"
    },
    {
        id: 2,
        name: "Chocolate Delight",
        price: 280000,
        image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1928&q=80",
        description: "Kue cokelat premium dengan lapisan ganache"
    },
    {
        id: 3,
        name: "Strawberry Dream",
        price: 230000,
        image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
        description: "Kue strawberry segar dengan buttercream"
    },
    {
        id: 4,
        name: "Rainbow Cake",
        price: 320000,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1089&q=80",
        description: "Kue pelangi colorful dengan lapisan berwarna-warni"
    }
];

// Cart System
let cart = [];
let cartCount = 0;
const cartCountElement = document.querySelector('.cart-count');

// Render Produk
function renderProducts() {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">Rp ${product.price.toLocaleString('id-ID')}</p>
                <button class="add-to-cart" data-id="${product.id}">Tambah ke Keranjang</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Add to Cart Function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    cartCount++;
    updateCartUI();
    showNotification(`${product.name} ditambahkan ke keranjang!`);
}

// Update Cart UI
function updateCartUI() {
    cartCountElement.textContent = cartCount;
    
    // Update cart modal if open
    if (document.getElementById('cartModal').style.display === 'flex') {
        renderCartModal();
    }
}

// Render Cart Modal
function renderCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Keranjang belanja kosong</p>';
        cartTotal.textContent = 'Rp 0';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Rp ${item.price.toLocaleString('id-ID')}</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" data-id="${item.id}" data-action="decrease">−</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                <button class="remove-btn" data-id="${item.id}">🗑️</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

// Cart Modal System
const cartModal = document.getElementById('cartModal');
const closeCartModal = document.querySelector('.close-cart-modal');

// Open Cart Modal
document.querySelector('.cart-icon').addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.style.display = 'flex';
    renderCartModal();
});

// Close Cart Modal
closeCartModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Cart Item Controls
document.addEventListener('click', (e) => {
    // Add to Cart
    if (e.target.classList.contains('add-to-cart')) {
        const productId = parseInt(e.target.dataset.id);
        addToCart(productId);
    }
    
    // Quantity Controls
    if (e.target.classList.contains('quantity-btn')) {
        const productId = parseInt(e.target.dataset.id);
        const action = e.target.dataset.action;
        updateQuantity(productId, action);
    }
    
    // Remove Item
    if (e.target.classList.contains('remove-btn')) {
        const productId = parseInt(e.target.dataset.id);
        removeFromCart(productId);
    }
});

// Update Quantity
function updateQuantity(productId, action) {
    const item = cart.find(item => item.id === productId);
    
    if (action === 'increase') {
        item.quantity += 1;
        cartCount++;
    } else if (action === 'decrease' && item.quantity > 1) {
        item.quantity -= 1;
        cartCount--;
    }
    
    updateCartUI();
}

// Remove from Cart
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cartCount -= cart[itemIndex].quantity;
        cart.splice(itemIndex, 1);
        updateCartUI();
        showNotification('Item dihapus dari keranjang');
    }
}

// Checkout Function
function checkout() {
    if (cart.length === 0) {
        showNotification('Keranjang kosong! Tambah produk dulu ya.');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Simulate order process
    showNotification(`Order berhasil! Total: Rp ${total.toLocaleString('id-ID')}. Admin akan menghubungi Anda.`);
    
    // Reset cart
    cart = [];
    cartCount = 0;
    updateCartUI();
    cartModal.style.display = 'none';
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--pink);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Admin Login Modal
const adminBtn = document.getElementById('adminBtn');
const adminModal = document.getElementById('adminModal');
const closeModal = document.querySelector('.close-modal');

adminBtn.addEventListener('click', () => {
    adminModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    adminModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === adminModal) {
        adminModal.style.display = 'none';
    }
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Admin Login Form
const adminLoginForm = document.getElementById('adminLoginForm');
adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // Simulasi login admin
    if (username === 'admin' && password === 'admin123') {
        alert('Login berhasil! Dashboard admin Niken\'s Cake Store akan segera tersedia.');
        adminModal.style.display = 'none';
    } else {
        alert('Username atau password salah!');
    }
});

// Contact Form
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Simpan data form
    const formData = {
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toISOString()
    };
    
    console.log('Form data:', formData);
    
    alert('Terima kasih ' + name + '! Pesan Anda telah terkirim. Kami akan menghubungi Anda segera.');
    contactForm.reset();
    showNotification('Pesan berhasil dikirim!');
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    
    // Add CSS animation for notification
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    console.log('Niken\'s Cake Store website loaded successfully!');
    console.log('Website developed by Ricco');
});

// Developer credit in console
console.log(`
╔══════════════════════════════════════╗
║         NIKEN'S CAKE STORE           ║
║        Website E-commerce            ║
║                                      ║
║     Developed by: Ricco              ║
║     Version: 2.0 (with Cart)         ║
║     Year: 2023                       ║
╚══════════════════════════════════════╝
`);
