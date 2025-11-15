// Admin Panel Functionality for Niken's Cake Store - MULTI-DEVICE FIX
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
        products = defaultProducts;
    }
}

// Auto Refresh System dengan Google Sheets Sync
let refreshInterval;

function startAutoRefresh() {
    // Refresh data setiap 5 detik + sync dari Google Sheets
    refreshInterval = setInterval(() => {
        loadDashboardStats();
        loadOrders();
        syncFromGoogleSheets();
    }, 5000);
}

// FUNGSI BARU: Sync dari Google Sheets
function syncFromGoogleSheets() {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwQdC25lTkhXgJvJfW3gR9JzQ7Y7Y5c5b5b5b5b5b5b5b5b5b5b/exec';
    
    fetch(scriptURL + '?action=getOrders')
    .then(response => response.json())
    .then(cloudOrders => {
        if (cloudOrders && cloudOrders.length > 0) {
            // Bandingkan dengan local orders
            const localOrders = JSON.parse(localStorage.getItem('nikenOrders')) || [];
            
            cloudOrders.forEach(cloudOrder => {
                const orderExists = localOrders.some(localOrder => localOrder.id === cloudOrder.id);
                if (!orderExists) {
                    localOrders.push(cloudOrder);
                    console.log('✅ New order synced from cloud:', cloudOrder.id);
                }
            });
            
            localStorage.setItem('nikenOrders', JSON.stringify(localOrders));
            orders = localOrders;
            loadOrders();
            loadDashboardStats();
        }
    })
    .catch(error => {
        console.log('❌ Cloud sync offline, using localStorage only');
    });
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
    const productsList = document.getElementById('productsList');
    
    // Load products from localStorage
    const localProducts = JSON.parse(localStorage.getItem('nikenProducts')) || [];
    products = localProducts;
    
    if (products.length === 0) {
        productsList.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <p>No products yet. Add your first product above!</p>
                </td>
            </tr>
        `;
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
}

function addProduct() {
    const name = document.getElementById('newProductName').value.trim();
    const price = parseInt(document.getElementById('newProductPrice').value);
    const image = document.getElementById('newProductImage').value.trim();
    const description = document.getElementById('newProductDesc').value.trim();

    if (!name || !price || !image || !description) {
        alert('Please fill all fields!');
        return;
    }

    if (price <= 0) {
        alert('Price must be greater than 0!');
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
    
    alert('✅ Product added successfully!');
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
    
    alert('✅ Product deleted successfully!');
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
        alert('✅ Product updated successfully!');
    }
}

function saveProducts() {
    localStorage.setItem('nikenProducts', JSON.stringify(products));
}

// Orders Management
function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    const noOrders = document.getElementById('noOrders');

    // Load orders from localStorage
    const localOrders = JSON.parse(localStorage.getItem('nikenOrders')) || [];
    orders = localOrders;

    if (orders.length === 0) {
        ordersList.innerHTML = '';
        noOrders.style.display = 'block';
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
    
    alert(`✅ Order #${orderId} marked as ${order.status}`);
}

function saveOrders() {
    localStorage.setItem('nikenOrders', JSON.stringify(orders));
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
        alert('Please enter either new username or password!');
        return;
    }

    localStorage.setItem('nikenAdmin', JSON.stringify(adminCredentials));
    
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    loadSettings();
    
    alert('✅ Admin credentials updated successfully!');
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
    
    alert('✅ Data exported successfully!');
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
    
    // Reset to defaults
    products = [];
    orders = [];
    adminCredentials = { username: 'admin', password: 'admin123' };
    
    localStorage.setItem('nikenAdmin', JSON.stringify(adminCredentials));
    
    loadDashboardStats();
    loadProducts();
    loadOrders();
    loadSettings();
    
    alert('🗑️ All data has been cleared! Website reset to default.');
}

// Manual Sync Button
function addSyncButton() {
    const syncBtn = `<button class="btn btn-warning" onclick="manualSync()" style="margin: 10px;">
        <i class="fas fa-sync-alt"></i> Sync Orders Now
    </button>`;
    
    // Tambah tombol di dashboard
    const formSection = document.querySelector('.form-section');
    if (formSection) {
        formSection.insertAdjacentHTML('afterbegin', syncBtn);
    }
}

function manualSync() {
    syncFromGoogleSheets();
    alert('🔄 Manual sync started!');
}

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    console.log('👨‍💼 Admin Panel Loaded - MULTI-DEVICE VERSION');
    console.log('📞 Contact: ' + STORE_INFO.whatsapp);
    console.log('📧 Email: ' + STORE_INFO.email);
    
    // Initialize default products
    initializeDefaultProducts();
    
    loadDashboardStats();
    loadProducts();
    loadOrders();
    loadSettings();
    
    // Add manual sync button
    addSyncButton();
    
    // Start auto refresh
    startAutoRefresh();
});
