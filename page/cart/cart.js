let cart = [];
const SHIPPING_FEE = 20000;
let discountPercent = 0;
let appliedPromoCode = '';
let pendingConfirmAction = null; // Lưu hàm cần thực hiện sau khi xác nhận

// Danh sách mã giảm giá hợp lệ
const validPromoCodes = {
    'CHAOBANMOI': { type: 'percent', value: 10, desc: 'Giảm 10% (Lần đầu mua)', minOrder: 0, firstTimeOnly: true },
    'MUC10': { type: 'fixed', value: 10000, desc: 'Giảm 10k', minOrder: 99000 },
    'MUC20': { type: 'fixed', value: 20000, desc: 'Giảm 20k', minOrder: 169000 },
    'MUC30': { type: 'fixed', value: 30000, desc: 'Giảm 30k', minOrder: 249000 },
    'THITOTNHA': { type: 'shipping', value: 15000, desc: 'Giảm 15k phí vận chuyển' }
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
    
    // Cập nhật số lượng loại sản phẩm trong giỏ
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
                        
                        ${item.selectedOptions && Array.isArray(item.selectedOptions) && item.selectedOptions.length > 0 ? `
                            <div class="item-options-display" style="font-size: 12px; color: #666; margin-top: 4px; background: #f9f9f9; padding: 4px 8px; border-radius: 4px;">
                                ${item.selectedOptions.map(opt => `
                                    <div style="margin-bottom: 2px;">
                                        <i class="fa-solid fa-caret-right" style="color: #ff6b35; font-size: 10px;"></i> 
                                        ${opt.name}: <strong>${opt.value}</strong>
                                    </div>
                                `).join('')}
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
    let autoDiscount = 0;
    let promoInfo = ''; // Lưu thông tin các chương trình tự động
    
    // ===== TỰ ĐỘNG GIẢM GIÁ NƯỚC LỌC =====
    // Giảm 50% nước lọc khi mua "Mỳ Trộn Không Khô" hoặc "Mỳ Cay Không Cay"
    const hasMiTronKhongKho = cart.some(item => 
        item.title && (item.title.includes('Mì trộn') || item.title.includes('Mỳ Trộn'))
    );
    const hasMiCayKhongCay = cart.some(item => 
        item.title && (item.title.includes('Mì cay') || item.title.includes('Mỳ Cay'))
    );
    const waterItem = cart.find(item => item.id === 125);
    
    if ((hasMiTronKhongKho || hasMiCayKhongCay) && waterItem) {
        autoDiscount += (waterItem.price * 0.5);
        promoInfo += 'Mỳ Trộn Không Khô - Mỳ Cay Không Cay\n';
    }
    
    // ===== CHƯƠNG TRÌNH THEO GIỜ =====
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes; // Tính thành phút
    
    // Chương trình "xế chiều nạp mood": 13:30 - 17:30, giảm 5% đồ uống
    const xeChieuStart = 13 * 60 + 30;  // 13:30
    const xeChieuEnd = 17 * 60 + 30;    // 17:30
    let xeChieuDiscount = 0;
    
    if (currentTime >= xeChieuStart && currentTime <= xeChieuEnd) {
        const drinkItems = cart.filter(item => item.id >= 120 && item.id <= 139);
        if (drinkItems.length > 0) {
            drinkItems.forEach(item => {
                xeChieuDiscount += (item.price * item.quantity * 0.05);
            });
            promoInfo += '🌆 Xế chiều nạp mood (đồ uống -5%)\n';
        }
    }
    autoDiscount += xeChieuDiscount;
    
    // Chương trình "cú đêm Việt mộ": 22:30 - 02:30, giảm 5% ăn vặt
    const cuDemStart = 22 * 60 + 30;   // 22:30
    const cuDemEnd = 2 * 60 + 30;      // 02:30 (ngày hôm sau)
    let cuDemDiscount = 0;
    
    // Kiểm tra có phải trong khung giờ cú đêm
    const isCuDem = currentTime >= cuDemStart || currentTime <= cuDemEnd;
    
    if (isCuDem) {
        const snackItems = cart.filter(item => item.id >= 42 && item.id <= 61);
        if (snackItems.length > 0) {
            snackItems.forEach(item => {
                cuDemDiscount += (item.price * item.quantity * 0.05);
            });
            promoInfo += '🌙 Cú đêm Việt mộ (ăn vặt -5%)\n';
        }
    }
    autoDiscount += cuDemDiscount;
    
    // ===== KIỂM TRA ĐIỀU KIỆN MÃ GIẢM GIÁ =====
    const promo = validPromoCodes[appliedPromoCode];
    if (promo) {
        let canApply = true;
        
        if (promo.minOrder && subtotal < promo.minOrder) {
            canApply = false;
            appliedPromoCode = '';
            showNotification(`Mã yêu cầu đơn tối thiểu ${formatPrice(promo.minOrder)}`, 'warning');
        }
        
        if (promo.firstTimeOnly && canApply) {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || '{}');
            const userPurchases = JSON.parse(localStorage.getItem('userPurchases') || '{}');
            
            if (currentUser.username && userPurchases[currentUser.username] && userPurchases[currentUser.username].length > 0) {
                canApply = false;
                appliedPromoCode = '';
                showNotification('Mã CHAOBANMOI chỉ áp dụng cho lần đầu mua', 'warning');
            }
        }
        
        if (canApply) {
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
    }
    
    const total = subtotal + shipping - discount - autoDiscount;

    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('shipping').textContent = formatPrice(shipping);
    
    let finalDiscountText = '';
    const totalDiscount = discount + autoDiscount;
    if (totalDiscount > 0) {
        finalDiscountText = `-${formatPrice(totalDiscount)}`;
    } else {
        finalDiscountText = '-0đ';
    }
    
    document.getElementById('discount').textContent = finalDiscountText;
    document.getElementById('total').textContent = formatPrice(total);
    
    // Hiển thị thông tin chương trình tự động
    updatePromoDisplay(promoInfo);
}

function updatePromoDisplay(promoInfo = '') {
    const promoDisplay = document.getElementById('promoDisplay');
    if (!promoDisplay) return;
    
    let html = '';
    
    // Hiển thị các chương trình tự động
    if (promoInfo) {
        html += `
            <div class="promo-tag auto-promo" style="background: #fef3c7; border: 1px solid #fcd34d;">
                <div class="promo-tag-content">
                    <div class="promo-tag-badge" style="background: #f59e0b; color: white;">✨</div>
                    <div class="promo-tag-info">
                        <span class="promo-tag-label" style="color: #d97706; font-weight: 600;">Chương trình khuyến mãi</span>
                        <div style="white-space: pre-line; font-size: 12px; color: #92400e;">
                            ${promoInfo.trim()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Hiển thị mã giảm giá người dùng áp dụng
    if (appliedPromoCode && validPromoCodes[appliedPromoCode]) {
        const promo = validPromoCodes[appliedPromoCode];
        html += `
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
    }
    
    promoDisplay.innerHTML = html;
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
    // Tự động chuyển thành chữ hoa
    promoInput.value = promoInput.value.toUpperCase();
    const code = promoInput.value.trim();

    if (!code) {
        showNotification('Vui lòng nhập mã giảm giá!', 'warning');
        return;
    }

    const promo = validPromoCodes[code];
    if (!promo) {
        showNotification('Mã giảm giá không hợp lệ', 'error');
        promoInput.value = '';
        return;
    }
    
    // ===== KIỂM TRA ĐIỀU KIỆN =====
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Kiểm tra đơn hàng tối thiểu
    if (promo.minOrder && subtotal < promo.minOrder) {
        showNotification(`Mã "${code}" yêu cầu đơn tối thiểu ${formatPrice(promo.minOrder)}. Đơn hiện tại: ${formatPrice(subtotal)}`, 'warning');
        promoInput.value = '';
        return;
    }
    
    // Kiểm tra lần đầu mua
    if (promo.firstTimeOnly) {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || '{}');
        const userPurchases = JSON.parse(localStorage.getItem('userPurchases') || '{}');
        
        if (currentUser.username && userPurchases[currentUser.username] && userPurchases[currentUser.username].length > 0) {
            showNotification('Mã CHAOBANMOI chỉ áp dụng cho lần đầu mua', 'warning');
            promoInput.value = '';
            return;
        }
    }
    
    // Mã hợp lệ - áp dụng
    appliedPromoCode = code;
    localStorage.setItem('appliedPromoCode', code);
    showNotification(`Áp dụng mã thành công! ${promo.desc}`, 'success');
    promoInput.value = '';
    updateSummary();
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

// Lắng nghe sự kiện cập nhật giỏ từ các trang khác (VD: random picker, detail page, etc)
window.addEventListener('cartUpdated', function() {
    loadCart();
});