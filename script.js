// Niken's Cake Store - Main Script
// Developed by Ricco
// Contact: WhatsApp +62 856-9190-2750 | Email: riocco112@gmail.com

// Data Management
let cart = [];
let cartCount = 0;
const cartCountElement = document.querySelector('.cart-count');

// Store Information
const STORE_INFO = {
    whatsapp: '+6285691902750',
    email: 'riocco112@gmail.com',
    address: 'Serang Banten, Jalan Perintis IV Griya Baladika Asri',
    name: 'Niken\'s Cake Store'
};

// Initialize default products if none exist
function initializeDefaultProducts() {
    const defaultProducts = [
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

    const existingProducts = JSON.parse(localStorage.getItem('nikenProducts'));
    if (!existingProducts || existingProducts.length === 0) {
        localStorage.setItem('nikenProducts', JSON.stringify(defaultProducts));
    }
}

// Initialize Admin Credentials - FIXED
function initializeAdminCredentials() {
    try {
        const existingCredentials = localStorage.getItem('nikenAdmin');
        if (!existingCredentials) {
            const defaultCredentials = {
                username: 'admin',
                password: 'admin123'
            };
            localStorage.setItem('nikenAdmin', JSON.stringify(defaultCredentials));
            console.log('✅ Default admin credentials created');
        } else {
            console.log('✅ Admin credentials loaded');
        }
    } catch (error) {
        console.error('Error initializing credentials:', error);
        // Force reset credentials
        localStorage.setItem('nikenAdmin', JSON.stringify({
            username: 'admin',
            password: 'admin123'
        }));
    }
}

// Load products from localStorage
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('nikenProducts')) || [];
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="empty-cart">Belum ada produk tersedia</p>';
        return;
    }

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
    const products = JSON.parse(localStorage.getItem('nikenProducts')) || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showNotification('Produk tidak ditemukan!');
        return;
    }

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
    showNotification(`✅ ${product.name} ditambahkan ke keranjang!`);
}

// Update Cart UI
function updateCartUI() {
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
    
    // Update cart modal if open
    if (document.getElementById('cartModal') && document.getElementById('cartModal').style.display === 'flex') {
        renderCartModal();
    }
}

// Render Cart Modal
function renderCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
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
function initializeCartModal() {
    const cartModal = document.getElementById('cartModal');
    const closeCartModal = document.querySelector('.close-cart-modal');

    if (cartModal && closeCartModal) {
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
    }
}

// Cart Item Controls
function initializeCartControls() {
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
}

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
        showNotification('❌ Item dihapus dari keranjang');
    }
}

// Payment System
function showPaymentOptions() {
    if (cart.length === 0) {
        showNotification('Keranjang kosong! Tambah produk dulu ya.');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const paymentModal = document.getElementById('paymentModal');
    const paymentContent = document.getElementById('paymentContent');
    
    if (!paymentModal || !paymentContent) return;
    
    paymentContent.innerHTML = `
        <div class="order-summary">
            <h4>Ringkasan Pesanan</h4>
            <p>Total: <strong>Rp ${total.toLocaleString('id-ID')}</strong></p>
        </div>
        
        <h4>Pilih Metode Pembayaran:</h4>
        
        <div class="payment-method" onclick="selectPaymentMethod('bank')">
            <div class="payment-icon">🏦</div>
            <div class="payment-details">
                <h5>Transfer Bank</h5>
                <p>BCA, BNI, BRI, Mandiri</p>
            </div>
            <input type="radio" name="payment" id="bank">
        </div>
        
        <div class="payment-method" onclick="selectPaymentMethod('qris')">
            <div class="payment-icon">📱</div>
            <div class="payment-details">
                <h5>QRIS</h5>
                <p>Scan QR Code</p>
            </div>
            <input type="radio" name="payment" id="qris">
        </div>
        
        <div class="payment-method" onclick="selectPaymentMethod('ewallet')">
            <div class="payment-icon">💳</div>
            <div class="payment-details">
                <h5>E-Wallet</h5>
                <p>Gopay, OVO, Dana</p>
            </div>
            <input type="radio" name="payment" id="ewallet">
        </div>
        
        <div id="paymentInstructions" style="display: none; margin-top: 20px;">
            <div class="payment-instructions">
                <h4 id="instructionTitle">Instruksi Pembayaran</h4>
                <div id="instructionContent"></div>
                <button class="btn confirm-order-btn" onclick="processOrder()">Konfirmasi Order</button>
            </div>
        </div>
    `;
    
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.style.display = 'none';
    }
    paymentModal.style.display = 'flex';
}

function selectPaymentMethod(method) {
    // Remove selected class from all
    document.querySelectorAll('.payment-method').forEach(pm => {
        pm.classList.remove('selected');
        pm.querySelector('input').checked = false;
    });
    
    // Add selected class to clicked
    const selectedMethod = document.querySelector(`[onclick="selectPaymentMethod('${method}')"]`);
    if (selectedMethod) {
        selectedMethod.classList.add('selected');
        selectedMethod.querySelector('input').checked = true;
    }
    
    // Show instructions
    const instructions = document.getElementById('paymentInstructions');
    const instructionContent = document.getElementById('instructionContent');
    
    if (instructions && instructionContent) {
        instructions.style.display = 'block';
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        switch(method) {
            case 'bank':
                instructionContent.innerHTML = `
                    <p><strong>Transfer ke Rekening Bank:</strong></p>
                    <p>BCA: 123-456-7890<br>a.n. Niken's Cake Store</p>
                    <p>BNI: 987-654-3210<br>a.n. Niken's Cake Store</p>
                    <p><strong>Total: Rp ${total.toLocaleString('id-ID')}</strong></p>
                    <p>Setelah transfer, konfirmasi melalui WhatsApp: <strong>${STORE_INFO.whatsapp}</strong></p>
                `;
                break;
            case 'qris':
                instructionContent.innerHTML = `
                    <p><strong>Scan QR Code berikut:</strong></p>
                    <p style="text-align: center; background: #f0f0f0; padding: 20px; border-radius: 10px;">
                        [QR CODE WILL APPEAR HERE]<br>
                        <small>Gunakan aplikasi bank/e-wallet untuk scan</small>
                    </p>
                    <p><strong>Total: Rp ${total.toLocaleString('id-ID')}</strong></p>
                    <p>Konfirmasi via WhatsApp: <strong>${STORE_INFO.whatsapp}</strong></p>
                `;
                break;
            case 'ewallet':
                instructionContent.innerHTML = `
                    <p><strong>Transfer ke E-Wallet:</strong></p>
                    <p>Gopay: 0812-3456-7890<br>a.n. Niken Store</p>
                    <p>OVO: 0812-3456-7890<br>a.n. Niken Store</p>
                    <p>DANA: 0812-3456-7890<br>a.n. Niken Store</p>
                    <p><strong>Total: Rp ${total.toLocaleString('id-ID')}</strong></p>
                    <p>Konfirmasi via WhatsApp: <strong>${STORE_INFO.whatsapp}</strong></p>
                `;
                break;
        }
    }
}

function processOrder() {
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    
    if (!selectedPayment) {
        showNotification('Pilih metode pembayaran terlebih dahulu!');
        return;
    }

    const customerName = prompt('Masukkan nama lengkap Anda:');
    const customerPhone = prompt('Masukkan nomor WhatsApp Anda:');
    const customerAddress = prompt('Masukkan alamat pengiriman:');
    
    if (!customerName || !customerPhone || !customerAddress) {
        showNotification('Order dibatalkan. Harap isi semua data!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const paymentMethod = selectedPayment.id;

    // Save order to localStorage
    const newOrder = {
        id: Date.now(),
        customerName: customerName,
        customerPhone: customerPhone,
        customerAddress: customerAddress,
        items: JSON.parse(JSON.stringify(cart)), // Deep copy
        total: total,
        paymentMethod: paymentMethod,
        status: 'Menunggu Pembayaran',
        timestamp: new Date().toISOString()
    };

    // Get existing orders and add new one
    const existingOrders = JSON.parse(localStorage.getItem('nikenOrders')) || [];
    existingOrders.push(newOrder);
    localStorage.setItem('nikenOrders', JSON.stringify(existingOrders));

    // Show success message
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        paymentModal.style.display = 'none';
    }
    
    showNotification(`✅ Order berhasil! No. Order: #${newOrder.id}. Admin akan menghubungi Anda.`);
    
    // Reset cart
    cart = [];
    cartCount = 0;
    updateCartUI();
    
    // Auto send WhatsApp message
    const itemsList = cart.map(item => 
        `- ${item.name} (${item.quantity}x) = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`
    ).join('\n');
    
    const whatsappMessage = `Halo ${STORE_INFO.name}! Saya ${customerName} ingin order:\n\n${itemsList}\n\n💰 Total: Rp ${total.toLocaleString('id-ID')}\n💳 Metode: ${paymentMethod}\n📦 Alamat: ${customerAddress}\n📞 WhatsApp: ${customerPhone}\n\nSilakan konfirmasi ketersediaan dan biaya pengiriman. Terima kasih!`;
    
    const whatsappUrl = `https://wa.me/${STORE_INFO.whatsapp.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`;
    
    setTimeout(() => {
        if (confirm('Buka WhatsApp untuk konfirmasi order?')) {
            window.open(whatsappUrl, '_blank');
        }
    }, 2000);
}

// Notification system
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--pink);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Admin Login System
function initializeAdminLogin() {
    const adminBtn = document.getElementById('adminBtn');
    const adminModal = document.getElementById('adminModal');
    const closeModal = document.querySelector('.close-modal');
    const paymentModal = document.getElementById('paymentModal');
    const closePaymentModal = document.querySelector('.close-payment-modal');

    if (adminBtn && adminModal) {
        adminBtn.addEventListener('click', () => {
            adminModal.style.display = 'flex';
        });

        closeModal.addEventListener('click', () => {
            adminModal.style.display = 'none';
        });

        // Admin Login Form - FIXED VERSION
        const adminLoginForm = document.getElementById('adminLoginForm');
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const username = document.getElementById('adminUsername').value;
                const password = document.getElementById('adminPassword').value;
                
                console.log('🔐 Login attempt:', username);
                
                // Get admin credentials
                let adminCredentials;
                try {
                    const stored = localStorage.getItem('nikenAdmin');
                    console.log('📦 Stored credentials:', stored);
                    
                    if (stored) {
                        adminCredentials = JSON.parse(stored);
                    } else {
                        // Create default if not exist
                        adminCredentials = { username: 'admin', password: 'admin123' };
                        localStorage.setItem('nikenAdmin', JSON.stringify(adminCredentials));
                    }
                } catch (error) {
                    console.error('Error loading credentials:', error);
                    adminCredentials = { username: 'admin', password: 'admin123' };
                }
                
                console.log('🔑 Checking:', username, 'vs', adminCredentials.username);
                
                if (username === adminCredentials.username && password === adminCredentials.password) {
                    showNotification('✅ Login berhasil! Mengarahkan ke Admin Panel...');
                    adminModal.style.display = 'none';
                    
                    // Clear form
                    document.getElementById('adminUsername').value = '';
                    document.getElementById('adminPassword').value = '';
                    
                    // Redirect to admin panel
                    setTimeout(() => {
                        window.open('admin-panel.html', '_blank');
                    }, 1000);
                } else {
                    showNotification('❌ Username atau password salah!');
                }
            });
        }
    }

    if (closePaymentModal && paymentModal) {
        closePaymentModal.addEventListener('click', () => {
            paymentModal.style.display = 'none';
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (adminModal && e.target === adminModal) {
            adminModal.style.display = 'none';
        }
        const cartModal = document.getElementById('cartModal');
        if (cartModal && e.target === cartModal) {
            cartModal.style.display = 'none';
        }
        if (paymentModal && e.target === paymentModal) {
            paymentModal.style.display = 'none';
        }
    });
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Create email body
            const emailBody = `Name: ${name}%0AEmail: ${email}%0AMessage: ${message}%0A%0A---%0ADari Website: ${STORE_INFO.name}`;
            const mailtoLink = `mailto:${STORE_INFO.email}?subject=Contact from ${STORE_INFO.name}&body=${emailBody}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            showNotification('✅ Membuka aplikasi email... Silakan kirim pesan Anda.');
            contactForm.reset();
        });
    }
}

// Smooth scrolling for navigation links - FIXED
function initializeSmoothScroll() {
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Emergency Reset Function
function resetAdminSystem() {
    localStorage.setItem('nikenAdmin', JSON.stringify({
        username: 'admin',
        password: 'admin123'
    }));
    console.log('🔄 Admin system reset to default');
    alert('✅ System reset! Use: admin / admin123');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Niken\'s Cake Store...');
    
    // Force reset credentials to ensure they work
    localStorage.setItem('nikenAdmin', JSON.stringify({
        username: 'admin',
        password: 'admin123'
    }));
    
    initializeAdminCredentials();
    initializeDefaultProducts();
    loadProducts();
    initializeCartModal();
    initializeCartControls();
    initializeAdminLogin();
    initializeContactForm();
    initializeSmoothScroll();
    
    // Add CSS animation for notification
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    console.log('🍰 Niken\'s Cake Store Website Loaded Successfully!');
    console.log('📞 Contact: ' + STORE_INFO.whatsapp);
    console.log('📧 Email: ' + STORE_INFO.email);
    console.log('👨‍💻 Developed by Ricco');
    console.log('💡 For emergency reset, type: resetAdminSystem()');
});

// Developer credit in console
console.log(`
╔══════════════════════════════════════╗
║         NIKEN'S CAKE STORE           ║
║        Complete E-Commerce           ║
║                                      ║
║     📞 ${STORE_INFO.whatsapp}        ║
║     📧 ${STORE_INFO.email}           ║
║     📍 ${STORE_INFO.address}         ║
║                                      ║
║     🛒 Shopping Cart                 ║
║     💳 Payment System                ║
║     👨‍💼 Admin Panel                 ║
║     📱 Responsive Design             ║
║                                      ║
║     Developed by: Ricco              ║
║     Version: 4.2 (Fixed Login)       ║
║     Year: 2023                       ║
╚══════════════════════════════════════╝
`);
