let cart = [];
const SHIPPING_FEE = 30000;
let discountPercent = 0;
let appliedPromoCode = '';

// Danh sách mã giảm giá hợp lệ
const validPromoCodes = {
    'CHAOBANMOI': { type: 'percent', value: 10, desc: 'Giảm 10%' },
    'THITOTNHA': { type: 'shipping', value: 15000, desc: 'Miễn phí ship 15k' },
    'MUC10': { type: 'fixed', value: 10000, desc: 'Giảm 10k' },
    'MUC20': { type: 'fixed', value: 20000, desc: 'Giảm 20k' },
    'MUC30': { type: 'fixed', value: 30000, desc: 'Giảm 30k' },
    'GIAM10': { type: 'percent', value: 10, desc: 'Giảm 10%' },
    'GIAM20': { type: 'percent', value: 20, desc: 'Giảm 20%' },
    'SALE30': { type: 'percent', value: 30, desc: 'Giảm 30%' }
};

function formatPrice(price) {
    return price.toLocaleString('vi-VN') + 'đ';
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    // ✅ Load mã giảm giá nếu có
    const savedPromo = localStorage.getItem('appliedPromoCode');
    if (savedPromo) {
        appliedPromoCode = savedPromo;
        applyStoredPromo();
    }
    
    renderCart();
    updateSummary();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const itemCount = document.getElementById('itemCount');
    
    itemCount.textContent = cart.length;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Giỏ hàng trống</h3>
                <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
                <button class="shop-now-btn" onclick="window.location.href='../category/product/product.htm'">
                    Mua sắm ngay
                </button>
            </div>
        `;
        document.getElementById('checkoutBtn').disabled = true;
        return;
    }

    document.getElementById('checkoutBtn').disabled = false;

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="item-image">
                <img src="${item.image || 'https://via.placeholder.com/120'}" alt="${item.title}">
            </div>
            <div class="item-details">
                <div class="item-header">
                    <div>
                        <div class="item-name">${item.title}</div>
                        <div class="item-price">${formatPrice(item.price)}</div>
                    </div>
                    <button class="delete-btn" onclick="removeItem(${index})" title="Xóa sản phẩm">
                        🗑️
                    </button>
                </div>
                <div class="item-footer">
                    <div class="quantity-control">
                        <button class="qty-btn" onclick="decreaseQty(${index})" ${item.quantity <= 1 ? 'disabled' : ''}>
                            −
                        </button>
                        <div class="qty-display">${item.quantity}</div>
                        <button class="qty-btn" onclick="increaseQty(${index})">
                            +
                        </button>
                    </div>
                    <div class="item-total">
                        Thành tiền: <span>${formatPrice(item.price * item.quantity)}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function increaseQty(index) {
    cart[index].quantity++;
    saveCart();
    renderCart();
    updateSummary();
}

function decreaseQty(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        saveCart();
        renderCart();
        updateSummary();
    }
}

function removeItem(index) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        cart.splice(index, 1);
        saveCart();
        renderCart();
        updateSummary();
    }
}

function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? SHIPPING_FEE : 0;
    
    let discount = 0;
    let discountText = '';
    
    // Tính discount dựa trên loại mã
    const promo = validPromoCodes[appliedPromoCode];
    if (promo) {
        if (promo.type === 'percent') {
            discount = subtotal * (promo.value / 100);
            discountText = `-${promo.value}%`;
        } else if (promo.type === 'fixed') {
            discount = promo.value;
            discountText = `-${formatPrice(promo.value)}`;
        } else if (promo.type === 'shipping') {
            discount = Math.min(promo.value, shipping);
            discountText = `Miễn phí ship ${formatPrice(promo.value)}`;
        }
    }
    
    const total = subtotal + shipping - discount;

    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('shipping').textContent = formatPrice(shipping);
    document.getElementById('discount').textContent = discountText ? discountText : '-' + formatPrice(discount);
    document.getElementById('total').textContent = formatPrice(total);
    
    // Cập nhật thông tin mã áp dụng
    updatePromoDisplay();
}

function updatePromoDisplay() {
    const promoDisplay = document.getElementById('promoDisplay');
    if (!promoDisplay) return;
    
    if (appliedPromoCode && validPromoCodes[appliedPromoCode]) {
        const promo = validPromoCodes[appliedPromoCode];
        promoDisplay.innerHTML = `
            <div style="background: #dcfce7; border: 1px solid #86efac; padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                <div style="color: #166534; font-weight: 600;">
                    ✅ Mã: <strong>${appliedPromoCode}</strong> - ${promo.desc}
                </div>
                <button onclick="removePromoCode()" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">
                    ✕ Xóa
                </button>
            </div>
        `;
    } else {
        promoDisplay.innerHTML = '';
    }
}

// 🎨 TOAST NOTIFICATION SYSTEM
function showNotification(message, type = 'info', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-text">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('remove');
            setTimeout(() => toast.remove(), 300);
        }
    }, duration);
}

function applyPromo() {
    const promoInput = document.getElementById('promoInput');
    const code = promoInput.value.trim().toUpperCase();

    if (!code) {
        showNotification('Vui lòng nhập mã giảm giá!', 'warning');
        return;
    }

    if (validPromoCodes[code]) {
        appliedPromoCode = code;
        localStorage.setItem('appliedPromoCode', code);
        showNotification(`Áp dụng mã thành công! ${validPromoCodes[code].desc}`, 'success');
        promoInput.value = '';
        updateSummary();
    } else {
        showNotification('Mã giảm giá không hợp lệ', 'error');
        promoInput.value = '';
    }
}

function applyStoredPromo() {
    if (appliedPromoCode && validPromoCodes[appliedPromoCode]) {
        console.log('✅ Mã giảm giá đã áp dụng:', appliedPromoCode);
    }
}

function removePromoCode() {
    appliedPromoCode = '';
    localStorage.removeItem('appliedPromoCode');
    showNotification('Đã xóa mã giảm giá', 'info');
    updateSummary();
}

function checkout() {
    if (cart.length === 0) {
        alert('Giỏ hàng trống!');
        return;
    }
    
    window.location.href = '../checkout/checkout.htm';
}

loadCart();