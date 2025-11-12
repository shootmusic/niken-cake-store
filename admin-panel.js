// Admin Panel Functionality for Niken's Cake Store - JITTER FIXED
// Developed by Ricco
// Contact: WhatsApp +62 856-9190-2750 | Email: riocco112@gmail.com
// VERSION: 2.0 - Optimized Performance & Stability

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

// ✅ FIX: Debounce function untuk prevent rapid calls
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

// Tab Navigation - OPTIMIZED
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
    
    // Add active class to clicked tab - FIXED
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // ✅ FIX: Gunakan debounced functions untuk prevent jitter
    if (tabName === 'dashboard') {
        debouncedLoadDashboardStats();
    } else if (tabName === 'products') {
        debouncedLoadProducts();
    } else if (tabName === 'orders') {
        debouncedLoadOrders();
    } else if (tabName === 'settings') {
        loadSettings();
    }
}

// Dashboard Functions - OPTIMIZED
function loadDashboardStats() {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'Menunggu Pembayaran').length;
    const processingOrders = orders.filter(order => order.status === 'Diproses').length;
    const totalRevenue = orders
        .filter(order => order.status === 'Selesai')
        .reduce((sum, order) => sum + order.total, 0);

    // ✅ FIX: Single update untuk prevent multiple reflows
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('processingOrders').textContent = processingOrders;
    document.getElementById('totalRevenue').textContent = `Rp ${totalRevenue.toLocaleString('id-ID')}`;
}

// ✅ FIX: Products Management - JITTER FIXED
function loadProducts() {
    const productsList = document.getElementById('productsList');
    
    // ✅ FIX: Clear content dengan cara yang lebih smooth
    while (productsList.firstChild) {
        productsList.removeChild(productsList.firstChild);
    }
    
    if (products.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="5" class="empty-state">
                <i class="fas fa-box-open"></i>
                <p>Belum ada produk. Tambahkan produk pertama di atas!</p>
            </td>
        `;
        productsList.appendChild(emptyRow);
        return;
    }

    // ✅ FIX: Gunakan document fragment untuk prevent multiple reflows
    const fragment = document.createDocumentFragment();

    products.forEach(product => {
        const row = document.createElement('tr');
        // ✅ FIX: Tambahkan CSS class untuk stability
        row.className = 'product-row';
        row.innerHTML = `
            <td>
                <img src="${product.image}" alt="${product.name}" class="product-image" 
                     onerror="this.src='https://via.placeholder.com/60x60/f0f0f0/666?text=No+Image'">
            </td>
            <td><strong>${product.name}</strong></td>
            <td>Rp ${product.price.toLocaleString('id-ID')}</td>
            <td>${product.description}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </td>
        `;
        fragment.appendChild(row);
    });

    // ✅ FIX: Single DOM update
    productsList.appendChild(fragment);
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
    
    // ✅ FIX: Gunakan debounced version untuk smooth update
    debouncedLoadProducts();
    
    // Clear form
    document.getElementById('newProductName').value = '';
    document.getElementById('newProductPrice').value = '';
    document.getElementById('newProductImage').value = '';
    document.getElementById('newProductDesc').value = '';
    
    alert('✅ Produk berhasil ditambahkan!');
    debouncedLoadDashboardStats();
}

function deleteProduct(productId) {
    if (!confirm('Yakin ingin menghapus produk ini?')) {
        return;
    }

    products = products.filter(p => p.id !== productId);
    saveProducts();
    
    // ✅ FIX: Smooth updates
    debouncedLoadProducts();
    debouncedLoadDashboardStats();
    
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
        debouncedLoadProducts();
        alert('✅ Produk berhasil diperbarui!');
    }
}

function saveProducts() {
    localStorage.setItem('nikenProducts', JSON.stringify(products));
}

// ✅ FIX: Orders Management - JITTER FIXED
function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    const noOrders = document.getElementById('noOrders');

    // ✅ FIX: Clear content dengan cara yang lebih smooth
    while (ordersList.firstChild) {
        ordersList.removeChild(ordersList.firstChild);
    }

    if (orders.length === 0) {
        noOrders.style.display = 'block';
        return;
    }

    noOrders.style.display = 'none';

    const sortedOrders = [...orders].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // ✅ FIX: Gunakan document fragment untuk prevent multiple reflows
    const fragment = document.createDocumentFragment();

    sortedOrders.forEach(order => {
        const row = document.createElement('tr');
        // ✅ FIX: Tambahkan CSS class untuk stability
        row.className = 'order-row';
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
                <div class="order-actions">
                    <select class="status-select" onchange="updateOrderStatus(${order.id}, this.value)" style="margin-bottom: 5px;">
                        <option value="processing" ${order.status === 'Diproses' ? 'selected' : ''}>Diproses</option>
                        <option value="completed" ${order.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
                        <option value="cancelled" ${order.status === 'Dibatalkan' ? 'selected' : ''}>Dibatalkan</option>
                    </select>
                    <div class="action-buttons">
                        <button class="btn btn-warning" onclick="viewOrderDetails(${order.id})" style="margin: 2px;">
                            <i class="fas fa-eye"></i> Detail
                        </button>
                        <button class="btn" onclick="contactCustomer(${order.id})" style="background: #25D366; margin: 2px;">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </button>
                    </div>
                </div>
            </td>
        `;
        fragment.appendChild(row);
    });

    // ✅ FIX: Single DOM update
    ordersList.appendChild(fragment);
}

// Order status standardization - FIXED
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

    // Format nomor WhatsApp - FIXED
    const formattedPhone = order.customerPhone.replace(/\s+/g, '').replace('-', '').replace('+', '');
    
    const message = `Halo ${order.customerName}, saya dari ${STORE_INFO.name} mengenai order #${order.id}. Status saat ini: ${order.status}.`;
    
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const statusMap = {
        'processing': 'Diproses',
        'completed': 'Selesai', 
        'cancelled': 'Dibatalkan'
    };

    order.status = statusMap[newStatus] || newStatus;
    saveOrders();
    
    // ✅ FIX: Smooth updates
    debouncedLoadOrders();
    debouncedLoadDashboardStats();
    
    alert(`✅ Order #${orderId} status: ${order.status}`);
}

function saveOrders() {
    localStorage.setItem('nikenOrders', JSON.stringify(orders));
}

// Settings Management - OPTIMIZED
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

// Data Management - OPTIMIZED
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
    
    // ✅ FIX: Smooth updates setelah reset
    setTimeout(() => {
        loadDashboardStats();
        loadProducts();
        loadOrders();
        loadSettings();
    }, 100);
    
    alert('🗑️ Semua data telah dihapus! Website direset ke default.');
}

// ✅ FIX: Debounced versions untuk smooth performance
const debouncedLoadDashboardStats = debounce(loadDashboardStats, 50);
const debouncedLoadProducts = debounce(loadProducts, 50);
const debouncedLoadOrders = debounce(loadOrders, 50);

// ✅ FIX: Initialize Admin Panel dengan optimasi
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
    
    // ✅ FIX: Load data dengan delay untuk prevent initial jitter
    setTimeout(() => {
        loadDashboardStats();
        loadProducts();
        loadOrders();
        loadSettings();
    }, 100);
});

// ✅ FIX: CSS untuk Admin Panel stability (Tambahkan di CSS admin panel)
const adminPanelStyles = `
/* Admin Panel Stability Fixes */
.product-row, .order-row {
    transform: translateZ(0);
    backface-visibility: hidden;
}

.action-buttons {
    display: flex;
    gap: 5px;
    flex-wrap: nowrap;
    transform: translateZ(0);
}

.order-actions {
    transform: translateZ(0);
    min-width: 200px;
}

.status-select {
    transform: translateZ(0);
    transition: all 0.2s ease;
}

.status-select:focus {
    border-color: var(--pink);
    outline: none;
}

.product-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
    transform: translateZ(0);
}

.empty-state {
    text-align: center;
    padding: 40px !important;
    color: #666;
    transform: translateZ(0);
}

.empty-state i {
    font-size: 48px;
    margin-bottom: 15px;
    display: block;
    color: #ccc;
}
`;

// ✅ FIX: Inject stability CSS
const style = document.createElement('style');
style.textContent = adminPanelStyles;
document.head.appendChild(style);

console.log(`
╔══════════════════════════════════════╗
║        ADMIN PANEL - NIKEN'S         ║
║           CAKE STORE                 ║
║                                      ║
║     📞 ${STORE_INFO.whatsapp}        ║
║     📧 ${STORE_INFO.email}           ║
║     📍 ${STORE_INFO.address}         ║
║                                      ║
║     🛍️  Product Management           ║
║     📦 Order Management              ║
║     📊 Dashboard Analytics           ║
║     ⚙️  Settings & Backup            ║
║                                      ║
║     Developed by: Ricco              ║
║     Version: 2.0 (Jitter Fixed)      ║
║     Performance: Optimized           ║
╚══════════════════════════════════════╝
`);
