// Niken's Cake Store - Main Script (JITTER FIXED VERSION)
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

// ✅ FIX: Debounce function untuk prevent jitter
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

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

// ✅ FIX: Load products dengan optimasi performance
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('nikenProducts')) || [];
    const productsGrid = document.getElementById('productsGrid');
    
    // ✅ FIX: Clear content dengan cara yang lebih smooth
    while (productsGrid.firstChild) {
        productsGrid.removeChild(productsGrid.firstChild);
    }

    if (products.length === 0) {
        const emptyElement = document.createElement('p');
        emptyElement.className = 'empty-cart';
        emptyElement.textContent = 'Belum ada produk tersedia';
        productsGrid.appendChild(emptyElement);
        return;
    }

    // ✅ FIX: Gunakan document fragment untuk prevent multiple reflows
    const fragment = document.createDocumentFragment();

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img" 
                 onerror="this.src='https://via.placeholder.com/300x200/f0f0f0/666?text=No+Image'">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">Rp ${product.price.toLocaleString('id-ID')}</p>
                <button class="add-to-cart" data-id="${product.id}">Tambah ke Keranjang</button>
            </div>
        `;
        fragment.appendChild(productCard);
    });

    // ✅ FIX: Single DOM update
    productsGrid.appendChild(fragment);
}

// ✅ FIX: Debounced version untuk rapid calls
const debouncedLoadProducts = debounce(loadProducts, 50);

// Add to Cart Function - OPTIMIZED
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

// Update Cart UI - OPTIMIZED
function updateCartUI() {
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
    
    // Update cart modal if open
    if (document.getElementById('cartModal') && document.getElementById('cartModal').style.display === 'flex') {
        renderCartModal();
    }
}

// ✅ FIX: Render Cart Modal dengan optimasi
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
    
    // ✅ FIX: Gunakan fragment untuk cart items
    const fragment = document.createDocumentFragment();
    
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
        fragment.appendChild(cartItem);
    });
    
    // ✅ FIX: Clear dan update sekaligus
    cartItems.innerHTML = '';
    cartItems.appendChild(fragment);
    cartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

// Cart Modal System - OPTIMIZED
function initializeCartModal() {
    const cartModal = document.getElementById('cartModal');
    const closeCartModal = document.querySelector('.close-cart-modal');

    if (cartModal && closeCartModal) {
        // ✅ FIX: Gunakan debounced function
        document.querySelector('.cart-icon').addEventListener('click', (e) => {
            e.preventDefault();
            cartModal.style.display = 'flex';
            setTimeout(() => renderCartModal(), 10); // Small delay untuk smoothness
        });

        // Close Cart Modal
        closeCartModal.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });
    }
}

// Cart Item Controls - OPTIMIZED
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

// Update Quantity - OPTIMIZED
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

// Remove from Cart - OPTIMIZED
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cartCount -= cart[itemIndex].quantity;
        cart.splice(itemIndex, 1);
        updateCartUI();
        showNotification('❌ Item dihapus dari keranjang');
    }
}

// REAL Manual Payment System untuk Niken's Cake Store
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
            <h4>🛍️ Ringkasan Pesanan</h4>
            <div class="order-items">
                ${cart.map(item => `
                    <div class="order-item">
                        <span>${item.name} (${item.quantity}x)</span>
                        <span>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <strong>Total: Rp ${total.toLocaleString('id-ID')}</strong>
            </div>
        </div>
        
        <h4>💳 Pilih Metode Pembayaran:</h4>
        
        <div class="payment-method" onclick="selectPaymentMethod('bank')">
            <div class="payment-icon">🏦</div>
            <div class="payment-details">
                <h5>Transfer Bank</h5>
                <p>BCA, BRI, Mandiri</p>
            </div>
            <input type="radio" name="payment" id="bank">
        </div>
        
        <div class="payment-method" onclick="selectPaymentMethod('qris')">
            <div class="payment-icon">📱</div>
            <div class="payment-details">
                <h5>QRIS</h5>
                <p>Scan QR Code - All Banks & E-Wallet</p>
            </div>
            <input type="radio" name="payment" id="qris">
        </div>
        
        <div class="payment-method" onclick="selectPaymentMethod('ewallet')">
            <div class="payment-icon">💳</div>
            <div class="payment-details">
                <h5>E-Wallet</h5>
                <p>Gopay, OVO, Dana, LinkAja</p>
            </div>
            <input type="radio" name="payment" id="ewallet">
        </div>
        
        <div id="paymentInstructions" style="display: none; margin-top: 20px;">
            <div class="payment-instructions">
                <h4 id="instructionTitle">Instruksi Pembayaran</h4>
                <div id="instructionContent"></div>
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
        const orderId = 'NK' + Date.now().toString().slice(-6); // Generate simple order ID
        
        switch(method) {
            case 'bank':
                instructionContent.innerHTML = `
                    <div class="real-payment-instructions">
                        <div class="payment-header">
                            <h4>🏦 Transfer Bank</h4>
                            <div class="order-id">Order ID: <strong>${orderId}</strong></div>
                        </div>
                        
                        <div class="bank-accounts">
                            <div class="account-card">
                                <div class="bank-name">BCA</div>
                                <div class="account-number">123 456 7890</div>
                                <div class="account-holder">NIKEN'S CAKE STORE</div>
                                <button class="copy-btn" onclick="copyToClipboard('1234567890')">
                                    📋 Salin No. Rekening
                                </button>
                            </div>
                            
                            <div class="account-card">
                                <div class="bank-name">BRI</div>
                                <div class="account-number">555 012 3456</div>
                                <div class="account-holder">NIKEN'S CAKE STORE</div>
                                <button class="copy-btn" onclick="copyToClipboard('5550123456')">
                                    📋 Salin No. Rekening
                                </button>
                            </div>
                        </div>
                        
                        <div class="payment-amount">
                            <div class="total-amount">
                                💰 Total Transfer: <strong>Rp ${total.toLocaleString('id-ID')}</strong>
                            </div>
                            <small>Transfer tepat sesuai jumlah di atas</small>
                        </div>
                        
                        <div class="payment-steps">
                            <h5>📝 Cara Bayar:</h5>
                            <ol>
                                <li>Transfer <strong>Rp ${total.toLocaleString('id-ID')}</strong> ke rekening BCA/BRI di atas</li>
                                <li><strong>Screenshot bukti transfer</strong></li>
                                <li>Klik tombol "Konfirmasi via WhatsApp" di bawah</li>
                                <li>Kirim screenshot bukti transfer di WhatsApp</li>
                                <li>Kami proses order dalam 1-2 jam</li>
                            </ol>
                        </div>
                        
                        <button class="btn whatsapp-confirm-btn" onclick="confirmPayment('${orderId}', ${total}, 'bank')">
                            📱 Konfirmasi Pembayaran via WhatsApp
                        </button>
                    </div>
                `;
                break;
                
            case 'qris':
                instructionContent.innerHTML = `
                    <div class="real-payment-instructions">
                        <div class="payment-header">
                            <h4>📱 QRIS Payment</h4>
                            <div class="order-id">Order ID: <strong>${orderId}</strong></div>
                        </div>
                        
                        <div class="payment-steps">
                            <h5>💡 Cara Bayar dengan QRIS:</h5>
                            <ol>
                                <li>Klik tombol "Minta QRIS Code" di bawah</li>
                                <li>Kami akan kirim QRIS code via WhatsApp</li>
                                <li>Scan QR code dengan aplikasi bank/e-wallet Anda</li>
                                <li>Bayar <strong>Rp ${total.toLocaleString('id-ID')}</strong></li>
                                <li>Kirim screenshot bukti bayar</li>
                                <li>Order diproses dalam 1-2 jam</li>
                            </ol>
                        </div>
                        
                        <button class="btn whatsapp-confirm-btn" onclick="confirmPayment('${orderId}', ${total}, 'qris')">
                            📱 Minta QRIS Code via WhatsApp
                        </button>
                    </div>
                `;
                break;
                
            case 'ewallet':
                instructionContent.innerHTML = `
                    <div class="real-payment-instructions">
                        <div class="payment-header">
                            <h4>💳 E-Wallet</h4>
                            <div class="order-id">Order ID: <strong>${orderId}</strong></div>
                        </div>
                        
                        <div class="ewallet-accounts">
                            <div class="account-card">
                                <div class="bank-name">Gopay</div>
                                <div class="account-number">0812 3456 7890</div>
                                <div class="account-holder">Niken Store</div>
                                <button class="copy-btn" onclick="copyToClipboard('081234567890')">
                                    📋 Salin No. HP
                                </button>
                            </div>
                            
                            <div class="account-card">
                                <div class="bank-name">DANA</div>
                                <div class="account-number">0812 3456 7890</div>
                                <div class="account-holder">Niken Store</div>
                                <button class="copy-btn" onclick="copyToClipboard('081234567890')">
                                    📋 Salin No. HP
                                </button>
                            </div>
                        </div>
                        
                        <div class="payment-amount">
                            <div class="total-amount">
                                💰 Total Transfer: <strong>Rp ${total.toLocaleString('id-ID')}</strong>
                            </div>
                            <small>Transfer tepat sesuai jumlah di atas</small>
                        </div>
                        
                        <div class="payment-steps">
                            <h5>📝 Cara Bayar:</h5>
                            <ol>
                                <li>Transfer ke nomor Gopay/DANA di atas</li>
                                <li><strong>Screenshot bukti transfer</strong></li>
                                <li>Klik tombol "Konfirmasi via WhatsApp" di bawah</li>
                                <li>Kirim screenshot bukti transfer</li>
                                <li>Kami proses order dalam 1-2 jam</li>
                            </ol>
                        </div>
                        
                        <button class="btn whatsapp-confirm-btn" onclick="confirmPayment('${orderId}', ${total}, 'e-wallet')">
                            📱 Konfirmasi Pembayaran via WhatsApp
                        </button>
                    </div>
                `;
                break;
        }
    }
}

// WhatsApp Payment Confirmation Function
function confirmPayment(orderId, total, method) {
    const customerName = prompt('Masukkan nama lengkap Anda:');
    const customerPhone = prompt('Masukkan nomor WhatsApp Anda:');
    const customerAddress = prompt('Masukkan alamat pengiriman:');
    
    if (!customerName || !customerPhone || !customerAddress) {
        showNotification('Order dibatalkan. Harap isi semua data!');
        return;
    }

    // Save order data sementara
    const orderData = {
        orderId: orderId,
        customerName: customerName,
        customerPhone: customerPhone,
        customerAddress: customerAddress,
        items: JSON.parse(JSON.stringify(cart)),
        total: total,
        paymentMethod: method,
        status: 'Menunggu Pembayaran',
        timestamp: new Date().toISOString()
    };

    // Simpan di localStorage
    const pendingOrders = JSON.parse(localStorage.getItem('nikenPendingOrders')) || [];
    pendingOrders.push(orderData);
    localStorage.setItem('nikenPendingOrders', JSON.stringify(pendingOrders));

    // Generate WhatsApp message
    const itemsList = cart.map(item => 
        `• ${item.name} (${item.quantity}x) = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`
    ).join('%0A');

    let paymentInfo = '';
    if (method === 'bank') {
        paymentInfo = 'Transfer Bank (BCA/BRI)';
    } else if (method === 'qris') {
        paymentInfo = 'QRIS Payment';
    } else if (method === 'e-wallet') {
        paymentInfo = 'E-Wallet (Gopay/DANA)';
    }

    const whatsappMessage = `Halo Niken's Cake Store!%0A%0A` +
                           `Saya ingin konfirmasi pembayaran:%0A%0A` +
                           `📋 *ORDER ID:* ${orderId}%0A` +
                           `👤 *Nama:* ${customerName}%0A` +
                           `📞 *WhatsApp:* ${customerPhone}%0A` +
                           `🏠 *Alamat:* ${customerAddress}%0A%0A` +
                           `🛒 *Detail Order:*%0A${itemsList}%0A%0A` +
                           `💰 *Total:* Rp ${total.toLocaleString('id-ID')}%0A` +
                           `💳 *Metode:* ${paymentInfo}%0A%0A` +
                           `Saya sudah transfer dan akan kirim bukti screenshot di chat ini.`;

    const whatsappUrl = `https://wa.me/6285691902750?text=${whatsappMessage}`;
    
    // Close modal dan buka WhatsApp
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        paymentModal.style.display = 'none';
    }
    
    // Reset cart
    cart = [];
    cartCount = 0;
    updateCartUI();
    
    // Show success message
    showNotification(`✅ Order ${orderId} berhasil! Buka WhatsApp untuk konfirmasi pembayaran.`);
    
    // Open WhatsApp setelah delay
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 2000);
}

// Copy to Clipboard Function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('✅ Nomor berhasil disalin!');
    }).catch(() => {
        // Fallback untuk browser lama
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('✅ Nomor berhasil disalin!');
    });
}

// ✅ FIX: Notification system dengan optimasi
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
        font-family: system-ui, -apple-system, sans-serif;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Admin Login System - OPTIMIZED
function initializeAdminLogin() {
    const adminBtn = document.getElementById('adminBtn');
    const adminModal = document.getElementById('adminModal');
    const closeModal = document.querySelector('.close-modal');
    const paymentModal = document.getElementById('paymentModal');
    const closePaymentModal = document.querySelector('.close-payment-modal');

    if (adminBtn && adminModal) {
        // ✅ FIX: Gunakan proper event handling
        adminBtn.addEventListener('click', (e) => {
            e.preventDefault();
            adminModal.style.display = 'flex';
        });

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                adminModal.style.display = 'none';
            });
        }

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

    // Close modals when clicking outside - OPTIMIZED
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

// Contact Form - OPTIMIZED
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

// ✅ FIX: Initialize dengan optimasi performance
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Niken\'s Cake Store...');
    
    // Force reset credentials to ensure they work
    localStorage.setItem('nikenAdmin', JSON.stringify({
        username: 'admin',
        password: 'admin123'
    }));
    
    initializeAdminCredentials();
    initializeDefaultProducts();
    
    // ✅ FIX: Load data dengan delay untuk prevent initial jitter
    setTimeout(() => {
        loadProducts();
        initializeCartModal();
        initializeCartControls();
        initializeAdminLogin();
        initializeContactForm();
        initializeSmoothScroll();
    }, 100);
    
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
║     Version: 4.3 (Jitter Fixed)      ║
║     Year: 2023                       ║
╚══════════════════════════════════════╝
`);
