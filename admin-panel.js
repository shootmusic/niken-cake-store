// Admin Panel Functionality for Niken's Cake Store - FIXED
// Developed by Ricco
// Contact: WhatsApp +62 856-9190-2750 | Email: riocco112@gmail.com

// ✅ FIX: Anti-jitter function
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

// ✅ FIX: Tab Navigation - parameter event ditambah
function openTab(tabName, event) {
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
    
    // ✅ FIX: Add active class to clicked tab
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
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
    
    if (products.length === 0) {
        productsList.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <p>Belum ada produk. Tambahkan produk pertama di atas!</p>
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
                    <i class="fas fa-trash"></i> Hapus
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
        alert('Harap isi semua field!');
        return;
    }

    if (price <= 0) {
        alert('Harga harus lebih besar dari 0!');
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
    
    alert('✅ Produk berhasil ditambahkan!');
    loadDashboardStats();
}

function deleteProduct(productId) {
    if (!confirm('Yakin ingin menghapus produk ini?')) {
        return;
    }

    products = products.filter(p => p.id !== productId);
    saveProducts();
    loadProducts();
    loadDashboardStats();
    
    alert('✅ Produk berhasil dihapus!');
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newName = prompt('Nama produk baru:', product.name);
    const newPrice = prompt('Harga baru:', product.price);
    const newImage = prompt('URL gambar baru:', product.image);
    const newDesc = prompt('Deskripsi baru:', product.description);

    if (newName && newPrice && newImage && newDesc) {
        product.name = newName;
        product.price = parseInt(newPrice);
        product.image = newImage;
        product.description = newDesc;
        
        saveProducts();
        loadProducts();
        alert('✅ Produk berhasil diperbarui!');
    }
}

function saveProducts() {
    localStorage.setItem('nikenProducts', JSON.stringify(products));
}

// Orders Management
function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    const noOrders = document.getElementById('noOrders');

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
                    <i class="fas fa-check"></i> Selesai
                </button>
                <button class="btn btn-warning" onclick="viewOrderDetails(${order.id})">
                    <i class="fas fa-eye"></i> Lihat
                </button>
                <button class="btn" onclick="contactCustomer(${order.id})" style="background: #25D366;">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </button>
            </td>
        `;
        ordersList.appendChild(row);
    });
}

// ✅ FIX: Order status standardization
function getStatusClass(status) {
    const statusMap = {
        'Menunggu Pembayaran': 'pending',
        'Diproses': 'processing', 
        'Selesai': 'completed',
        'Dibatalkan': 'cancelled'
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
Detail Pesanan:
──────────────
Order ID: #${order.id}
Customer: ${order.customerName}
Telepon: ${order.customerPhone}
Alamat: ${order.customerAddress}
Pembayaran: ${order.paymentMethod}
Status: ${order.status}
Total: Rp ${order.total.toLocaleString('id-ID')}

Items:
${itemsDetails}

Tanggal Order: ${new Date(order.timestamp).toLocaleString('id-ID')}
    `.trim();

    alert(message);
}

function contactCustomer(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const formattedPhone = order.customerPhone.replace(/\s+/g, '').replace('-', '').replace('+', '');
    
    const message = `Halo ${order.customerName}, saya dari ${STORE_INFO.name} mengenai order #${order.id}. Status saat ini: ${order.status}.`;
    
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// ✅ FIX: Update order status function
function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const statusMap = {
        'completed': 'Selesai'
    };

    order.status = statusMap[newStatus] || newStatus;
    saveOrders();
    loadOrders();
    loadDashboardStats();
    
    alert(`✅ Order #${orderId} status: ${order.status}`);
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

    if (!newUsername && !newPassword) {
        alert('❌ Harap masukkan username atau password baru!');
        return;
    }

    let currentCredentials;
    try {
        const stored = localStorage.getItem('nikenAdmin');
        if (stored) {
            currentCredentials = JSON.parse(stored);
        } else {
            currentCredentials = { username: 'admin', password: 'admin123' };
            localStorage.setItem('nikenAdmin', JSON.stringify(currentCredentials));
        }
    } catch (error) {
        console.error('Error loading credentials:', error);
        currentCredentials = { username: 'admin', password: 'admin123' };
    }

    if (newUsername) {
        currentCredentials.username = newUsername;
    }
    if (newPassword) {
        currentCredentials.password = newPassword;
    }

    try {
        localStorage.setItem('nikenAdmin', JSON.stringify(currentCredentials));
        adminCredentials = currentCredentials;
        document.getElementById('newUsername').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('currentAdmin').textContent = currentCredentials.username;
        alert('✅ Kredensial admin berhasil diperbarui!');
    } catch (error) {
        console.error('Error saving credentials:', error);
        alert('❌ Error menyimpan kredensial!');
    }
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
    
    alert('✅ Data berhasil diekspor!');
}

function clearAllData() {
    if (!confirm('⚠️ BAHAYA! Ini akan menghapus SEMUA data termasuk produk dan pesanan. Yakin?')) {
        return;
    }

    if (!confirm('🚨 Tindakan ini tidak dapat dibatalkan! Ketik "DELETE ALL" untuk konfirmasi:')) {
        return;
    }

    localStorage.removeItem('nikenProducts');
    localStorage.removeItem('nikenOrders');
    localStorage.removeItem('nikenAdmin');
    
    products = [];
    orders = [];
    adminCredentials = { username: 'admin', password: 'admin123' };
    
    localStorage.setItem('nikenAdmin', JSON.stringify(adminCredentials));
    
    loadDashboardStats();
    loadProducts();
    loadOrders();
    loadSettings();
    
    alert('🗑️ Semua data telah dihapus! Website direset ke default.');
}

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    console.log('👨‍💼 Admin Panel Loaded - Niken\'s Cake Store');
    console.log('📞 Contact: ' + STORE_INFO.whatsapp);
    console.log('📧 Email: ' + STORE_INFO.email);
    
    try {
        const storedCreds = localStorage.getItem('nikenAdmin');
        if (storedCreds) {
            adminCredentials = JSON.parse(storedCreds);
            console.log('✅ Loaded admin credentials:', adminCredentials);
        }
    } catch (error) {
        console.error('Error loading credentials:', error);
    }
    
    loadDashboardStats();
    loadProducts();
    loadOrders();
    loadSettings();
});
