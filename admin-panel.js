// Admin Panel Functionality for Niken's Cake Store - INSTANT VERSION
// Developed by Ricco
// Contact: WhatsApp +62 856-9190-2750 | Email: riocco112@gmail.com

let products = JSON.parse(localStorage.getItem('nikenProducts')) || [];
let orders = JSON.parse(localStorage.getItem('nikenOrders')) || [];
let adminCredentials = JSON.parse(localStorage.getItem('nikenAdmin')) || { 
    username: 'admin', 
    password: 'admin123' 
};

// Store Information
const STORE_INFO = {
    whatsapp: '+6285691902750',
    email: 'riocco112@gmail.com',
    address: 'Serang Banten, Jalan Perintis IV Griya Baladika Asri',
    name: 'Niken\'s Cake Store'
};

// INSTANT SYNC SYSTEM - TANPA DELAY
let lastOrderCount = 0;

function startInstantSync() {
    // Simpan jumlah order terakhir
    lastOrderCount = orders.length;
    
    // REAL-TIME: Cek perubahan localStorage setiap 500ms (0.5 detik)
    setInterval(() => {
        checkForNewOrders();
    }, 500);
    
    // Juga refresh saat tab menjadi aktif
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            checkForNewOrders();
        }
    });
    
    // Listen untuk storage events (perubahan dari tab lain)
    window.addEventListener('storage', function(e) {
        if (e.key === 'nikenOrders' || e.key === 'nikenBackup') {
            checkForNewOrders();
        }
    });
}

// FUNGSI BARU: Cek orders baru secara real-time
function checkForNewOrders() {
    const previousOrderCount = orders.length;
    
    // Load data terbaru
    const localOrders = JSON.parse(localStorage.getItem('nikenOrders')) || [];
    const backupData = JSON.parse(localStorage.getItem('nikenBackup'));
    
    if (backupData && backupData.orders) {
        orders = backupData.orders;
    } else {
        orders = localOrders;
    }
    
    // Jika ada order baru
    if (orders.length > previousOrderCount) {
        playNewOrderSound();
        showNotification('🎉 ORDER BARU DITERIMA!');
        loadDashboardStats();
        loadOrders();
        loadProducts();
    }
}

// Sound Notification untuk Order Baru
function playNewOrderSound() {
    try {
        // Create instant beep sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 1000;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Sound notification not supported');
    }
}

// Notification System
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
        background: #e91e63;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
        max-width: 300px;
        font-weight: bold;
        font-size: 14px;
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

// Auto Backup System
function autoBackup() {
    const backupData = {
        products: products,
        orders: orders,
        admin: adminCredentials,
        backupTime: new Date().toISOString()
    };
    
    localStorage.setItem('nikenBackup', JSON.stringify(backupData));
}

// Loading Management
function showLoading() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }
}

function hideLoading() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

// Tab Navigation
function openTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    // Refresh data when switching tabs
    if (tabName === 'dashboard') {
        loadDashboardStats();
    } else if (tabName === 'products') {
        loadProducts();
    } else if (tabName === 'orders') {
        loadOrders();
    } else if (tabName === 'settings') {
        loadSettings();
    }
}

// Dashboard Functions
function loadDashboardStats() {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'Menunggu Pembayaran').length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('totalRevenue').textContent = `Rp ${totalRevenue.toLocaleString('id-ID')}`;
}

// Products Management
function loadProducts() {
    showLoading();
    
    const productsList = document.getElementById('productsList');
    
    // Load from multiple sources for reliability
    const localProducts = JSON.parse(localStorage.getItem('nikenProducts')) || [];
    const backupData = JSON.parse(localStorage.getItem('nikenBackup'));
    
    if (backupData && backupData.products) {
        products = backupData.products;
    } else {
        products = localProducts;
    }
    
    if (products.length === 0) {
        productsList.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <p>No products yet. Add your first product above!</p>
                </td>
            </tr>
        `;
        hideLoading();
        return;
    }

    productsList.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${product.image}" alt="${product.name}" class="product-image" 
                     onerror="this.src='https://via.placeholder.com/60x60/f0f0f0/666?text=No+Image'">
            </td>
            <td><strong>${product.name}</strong></td>
            <td>Rp ${product.price.toLocaleString('id-ID')}</td>
            <td>${product.description}</td>
            <td>
                <button class="btn btn-warning" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        productsList.appendChild(row);
    });
    
    hideLoading();
}

function addProduct() {
    const name = document.getElementById('newProductName').value.trim();
    const price = parseInt(document.getElementById('newProductPrice').value);
    const image = document.getElementById('newProductImage').value.trim();
    const description = document.getElementById('newProductDesc').value.trim();

    if (!name || !price || !image || !description) {
        showNotification('Please fill all fields!');
        return;
    }

    if (price <= 0) {
        showNotification('Price must be greater than 0!');
        return;
    }

    const newProduct = {
        id: Date.now(),
        name: name,
        price: price,
        image: image,
        description: description
    };

    products.push(newProduct);
    saveProducts();
    loadProducts();
    
    // Clear form
    document.getElementById('newProductName').value = '';
    document.getElementById('newProductPrice').value = '';
    document.getElementById('newProductImage').value = '';
    document.getElementById('newProductDesc').value = '';
    
    showNotification('✅ Product added successfully!');
    loadDashboardStats();
}

function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    products = products.filter(p => p.id !== productId);
    saveProducts();
    loadProducts();
    loadDashboardStats();
    
    showNotification('✅ Product deleted successfully!');
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newName = prompt('Enter new product name:', product.name);
    const newPrice = prompt('Enter new price:', product.price);
    const newImage = prompt('Enter new image URL:', product.image);
    const newDesc = prompt('Enter new description:', product.description);

    if (newName && newPrice && newImage && newDesc) {
        product.name = newName;
        product.price = parseInt(newPrice);
        product.image = newImage;
        product.description = newDesc;
        
        saveProducts();
        loadProducts();
        showNotification('✅ Product updated successfully!');
    }
}

function saveProducts() {
    localStorage.setItem('nikenProducts', JSON.stringify(products));
    autoBackup();
}

// Orders Management
function loadOrders() {
    showLoading();
    
    const ordersList = document.getElementById('ordersList');
    const noOrders = document.getElementById('noOrders');

    // Load from multiple sources for reliability
    const localOrders = JSON.parse(localStorage.getItem('nikenOrders')) || [];
    const backupData = JSON.parse(localStorage.getItem('nikenBackup'));
    
    if (backupData && backupData.orders) {
        orders = backupData.orders;
    } else {
        orders = localOrders;
    }

    if (orders.length === 0) {
        ordersList.innerHTML = '';
        noOrders.style.display = 'block';
        hideLoading();
        return;
    }

    noOrders.style.display = 'none';
    ordersList.innerHTML = '';

    // Sort orders by date (newest first)
    const sortedOrders = [...orders].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    sortedOrders.forEach(order => {
        const row = document.createElement('tr');
        const orderDate = new Date(order.timestamp).toLocaleDateString('id-ID');
        const itemsText = order.items.map(item => `${item.name} (${item.quantity}x)`).join(', ');
        
        row.innerHTML = `
            <td><strong>#${order.id}</strong></td>
            <td>
                <strong>${order.customerName}</strong><br>
                <small>📞 ${order.customerPhone}</small><br>
                <small>🏠 ${order.customerAddress}</small>
            </td>
            <td>${itemsText}</td>
            <td>Rp ${order.total.toLocaleString('id-ID')}</td>
            <td>
                <span class="order-status status-${getStatusClass(order.status)}">
                    ${order.status}
                </span>
            </td>
            <td>${orderDate}</td>
            <td>
                <button class="btn btn-success" onclick="updateOrderStatus(${order.id}, 'completed')">
                    <i class="fas fa-check"></i> Complete
                </button>
                <button class="btn btn-warning" onclick="viewOrderDetails(${order.id})">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn" onclick="contactCustomer(${order.id})" style="background: #25D366;">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </button>
            </td>
        `;
        ordersList.appendChild(row);
    });
    
    hideLoading();
}

function getStatusClass(status) {
    const statusMap = {
        'Menunggu Pembayaran': 'pending',
        'Paid': 'paid', 
        'Completed': 'completed'
    };
    return statusMap[status] || 'pending';
}

function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const itemsDetails = order.items.map(item => 
        `- ${item.name} (${item.quantity}x) = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`
    ).join('\n');

    const message = `
Order Details:
──────────────
Order ID: #${order.id}
Customer: ${order.customerName}
Phone: ${order.customerPhone}
Address: ${order.customerAddress}
Payment: ${order.paymentMethod}
Status: ${order.status}
Total: Rp ${order.total.toLocaleString('id-ID')}

Items:
${itemsDetails}

Order Date: ${new Date(order.timestamp).toLocaleString('id-ID')}
    `.trim();

    alert(message);
}

function contactCustomer(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const whatsappUrl = `https://wa.me/${order.customerPhone.replace('+', '').replace(/\D/g, '')}?text=Halo%20${encodeURIComponent(order.customerName)}%2C%20saya%20dari%20${encodeURIComponent(STORE_INFO.name)}%20mengenai%20order%20%23${order.id}`;
    window.open(whatsappUrl, '_blank');
}

function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const statusMap = {
        'completed': 'Completed'
    };

    order.status = statusMap[newStatus] || newStatus;
    saveOrders();
    loadOrders();
    loadDashboardStats();
    
    showNotification(`✅ Order #${orderId} marked as ${order.status}`);
}

function saveOrders() {
    localStorage.setItem('nikenOrders', JSON.stringify(orders));
    autoBackup();
}

// Settings Management
function loadSettings() {
    document.getElementById('currentAdmin').textContent = adminCredentials.username;
}

function updateAdminCredentials() {
    const newUsername = document.getElementById('newUsername').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();

    if (newUsername) {
        adminCredentials.username = newUsername;
    }
    if (newPassword) {
        adminCredentials.password = newPassword;
    }

    if (!newUsername && !newPassword) {
        showNotification('Please enter either new username or password!');
        return;
    }

    localStorage.setItem('nikenAdmin', JSON.stringify(adminCredentials));
    
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    loadSettings();
    
    showNotification('✅ Admin credentials updated successfully!');
}

// Data Management
function exportData() {
    const data = {
        products: products,
        orders: orders,
        admin: adminCredentials,
        storeInfo: STORE_INFO,
        exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `niken-cake-store-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('✅ Data exported successfully!');
}

function clearAllData() {
    if (!confirm('⚠️ DANGER! This will delete ALL data including products and orders. Are you absolutely sure?')) {
        return;
    }

    if (!confirm('🚨 This action cannot be undone! Type "DELETE ALL" to confirm:')) {
        return;
    }

    localStorage.removeItem('nikenProducts');
    localStorage.removeItem('nikenOrders');
    localStorage.removeItem('nikenAdmin');
    localStorage.removeItem('nikenBackup');
    
    // Reset to defaults
    products = [];
    orders = [];
    adminCredentials = { username: 'admin', password: 'admin123' };
    
    localStorage.setItem('nikenAdmin', JSON.stringify(adminCredentials));
    
    loadDashboardStats();
    loadProducts();
    loadOrders();
    loadSettings();
    
    showNotification('🗑️ All data has been cleared! Website reset to default.');
}

// Initialize Admin Panel dengan Instant Sync
document.addEventListener('DOMContentLoaded', function() {
    console.log('👨‍💼 Admin Panel Loaded - INSTANT SYNC VERSION');
    console.log('📞 Contact: ' + STORE_INFO.whatsapp);
    console.log('📧 Email: ' + STORE_INFO.email);
    
    // Add CSS for notifications
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
    
    loadDashboardStats();
    loadProducts();
    loadOrders();
    loadSettings();
    
    // START INSTANT SYNC - REAL-TIME!
    startInstantSync();
    
    // Auto backup setiap 1 menit
    setInterval(autoBackup, 60000);
    
    console.log('⚡ INSTANT SYNC ACTIVATED - Orders update in 0.5 seconds!');
});
