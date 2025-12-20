let cart = [];
const SHIPPING_FEE = 20000;
let discountPercent = 0;
let appliedPromoCode = '';
let pendingConfirmAction = null; // Lưu hàm cần thực hiện sau khi xác nhận

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

// ===== MODAL FUNCTIONS =====
function showMessageModal(title, message) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('messageModal').classList.add('active');
}

function closeMessageModal() {
    document.getElementById('messageModal').classList.remove('active');
}

function showConfirmModal(title, message, onConfirm) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    pendingConfirmAction = onConfirm;
    document.getElementById('confirmModal').classList.add('active');
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('active');
    pendingConfirmAction = null;
}

function confirmAction() {
    if (pendingConfirmAction && typeof pendingConfirmAction === 'function') {
        pendingConfirmAction();
    }
    closeConfirmModal();
}

// Đóng modal khi bấm ra ngoài
document.addEventListener('DOMContentLoaded', function() {
    const messageModal = document.getElementById('messageModal');
    const confirmModal = document.getElementById('confirmModal');
    
    if (messageModal) {
        messageModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeMessageModal();
            }
        });
    }
    
    if (confirmModal) {
        confirmModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeConfirmModal();
            }
        });
    }
});

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
    
    // ✅ Kích hoạt sự kiện để Header (header.js) cập nhật số lượng ngay lập tức
    window.dispatchEvent(new Event('cartUpdated'));
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
                <button class="shop-now-btn" onclick="window.location.href='/page/category/product/product.htm'">
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
                        ${item.selectedOptions && item.selectedOptions.length > 0 ? `
                            <div style="font-size: 12px; color: #666; margin-top: 4px;">
                                ${item.selectedOptions.map(opt => `<div>${opt.name}: <strong>${opt.value}</strong></div>`).join('')}
                            </div>
                        ` : ''}
                        <div class="item-price">${formatPrice(item.price)}</div>
                    </div>
                    <button class="delete-btn" onclick="removeItem(${index})" title="Xóa sản phẩm">
                        <i class="fa fa-trash-alt"></i>
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
    showConfirmModal("Xác nhận xóa", "Bạn có chắc muốn xóa sản phẩm này?", function() {
        cart.splice(index, 1);
        saveCart();
        renderCart();
        updateSummary();
        showNotification('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
    });
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
            <div class="promo-tag">
                <div class="promo-tag-content">
                    <div class="promo-tag-badge">✓</div>
                    <div class="promo-tag-info">
                        <span class="promo-tag-label">Mã áp dụng</span>
                        <div>
                            <span class="promo-tag-code">${appliedPromoCode}</span>
                            <span class="promo-tag-desc"> • ${promo.desc}</span>
                        </div>
                    </div>
                </div>
                <button onclick="removePromoCode()" class="promo-remove-btn" title="Xóa mã giảm giá">
                    <i class="fa fa-times"></i>
                    <span>Xóa</span>
                </button>
            </div>
        `;
    } else {
        promoDisplay.innerHTML = '';
    }
}

// 🎨 TOAST NOTIFICATION SYSTEM
// 🎨 TOAST NOTIFICATION SYSTEM (Đã đồng bộ icon với detail)
function showNotification(message, type = 'info', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Thay đổi từ Emoji sang FontAwesome Icons
    const icons = {
        success: '<i class="fa-solid fa-circle-check"></i>',
        error: '<i class="fa-solid fa-circle-xmark"></i>',
        warning: '<i class="fa-solid fa-triangle-exclamation"></i>',
        info: '<i class="fa-solid fa-circle-info"></i>'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-text">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);

    // Hiệu ứng tự động đóng
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
        showMessageModal("Giỏ hàng trống", "Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán!");
        return;
    }
    
    window.location.href = '/page/checkout/checkout.htm';
}

loadCart();