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
    },
    {
        id: 5,
        name: "Tiramisu Classic",
        price: 270000,
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
        description: "Tiramisu authentic dengan kopi Italia"
    },
    {
        id: 6,
        name: "Cheesecake Premium",
        price: 290000,
        image: "https://images.unsplash.com/photo-1567306301408-9b74779a11af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "Cheesecake lembut dengan topping buah segar"
    }
];

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
        // Di sini bisa redirect ke halaman admin
    } else {
        alert('Username atau password salah!');
    }
});

// Cart Functionality
let cartCount = 0;
const cartCountElement = document.querySelector('.cart-count');

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        cartCount++;
        cartCountElement.textContent = cartCount;
        
        // Animasi tambah ke keranjang
        const button = e.target;
        const originalText = button.textContent;
        button.textContent = 'Ditambahkan!';
        button.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 1500);
        
        // Show notification
        showNotification('Produk berhasil ditambahkan ke keranjang!');
    }
});

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

// Contact Form
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Simpan data form (dalam implementasi nyata, kirim ke server)
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
║     Version: 1.0                     ║
║     Year: 2023                       ║
╚══════════════════════════════════════╝
`);