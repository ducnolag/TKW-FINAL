// --- CONFIG DATA ---
const validPromoCodes = {
    'CHAOBANMOI': { type: 'percent', value: 10, desc: 'Giảm 10%' },
    'FREESHIP': { type: 'shipping', value: 15000, desc: 'Freeship 15k' },
    'GIAM50K': { type: 'fixed', value: 50000, desc: 'Giảm 50k' }
};

let appliedPromoCode = '';
let pendingConfirmAction = null; // Lưu hàm cần thực hiện sau khi xác nhận

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

// --- AUTH & INIT ---
function checkAuth() {
    const currentUser = sessionStorage.getItem("currentUser");
    if (!currentUser) {
        window.location.href = "/page/account/login/login.html#login";
        return null;
    }
    return JSON.parse(currentUser);
}

function getCartItems() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

// --- UTILS ---
function formatMoney(amount) {
    return amount.toLocaleString('vi-VN') + 'đ';
}

function calculateTotal(items) {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// --- ACTIONS ---
function removeItem(productId) {
    showConfirmModal("Xác nhận xóa", "Bạn chắc chắn muốn xóa món này?", function() {
        let cart = getCartItems();
        cart = cart.filter(item => item.id != productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        showToast('Đã xóa món ăn', 'success');
        renderCheckout(checkAuth());
    });
}

function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showSuccessModal(totalStr, method) {
    const modal = document.getElementById('successModal');
    const content = modal.querySelector('.modal-body-text');
    content.innerHTML = `Tổng thanh toán: <b>${totalStr}</b><br>Hình thức: ${method}`;
    modal.classList.add('show');
}

window.selectPaymentNew = function(element, method) {
  
    const parent = element.parentElement;
    parent.querySelectorAll('.payment-option').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    document.getElementById('selectedPaymentMethod').value = method;
}

function applyPromoCode() {
    const input = document.getElementById('checkoutPromoInput');
    const code = input.value.trim().toUpperCase();
    
    if (!code) { showToast('Vui lòng nhập mã!', 'error'); return; }

    if (validPromoCodes[code]) {
        localStorage.setItem('appliedPromoCode', code);
        showToast('Đã áp dụng mã giảm giá!', 'success');
        renderCheckout(checkAuth());
    } else {
        showToast('Mã giảm giá không tồn tại', 'error');
        input.value = '';
    }
}

function removePromoCode() {
    localStorage.removeItem('appliedPromoCode');
    renderCheckout(checkAuth());
}

function placeOrder(event) {
    event.preventDefault();
    const form = event.target;
    
    // Validate form
    if (!form.checkValidity()) {
        showToast('Vui lòng điền đủ thông tin nhận hàng', 'error');
        const invalidInput = form.querySelector(':invalid');
        if(invalidInput) invalidInput.focus();
        return;
    }
    
    // Validate phone number
    const phoneInput = form.querySelector('input[name="phone"]');
    const phoneValue = phoneInput.value.trim();
    
    // Kiểm tra số điện thoại hợp lệ (10-11 chữ số, bắt đầu từ 0)
    const phoneRegex = /^0\d{9,10}$/;
    if (!phoneRegex.test(phoneValue)) {
        showMessageModal("Lỗi", "Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số, bắt đầu bằng 0)!");
        phoneInput.focus();
        return;
    }
    
    const cartItems = getCartItems();
    if (cartItems.length === 0) {
        showToast('Giỏ hàng trống!', 'error');
        return;
    }

    const paymentMethodEl = document.querySelector('.payment-option.active h4');
    const paymentMethodText = paymentMethodEl ? paymentMethodEl.innerText : 'Thanh toán';
    
    // Record History
    recordUserPurchases(cartItems);

    // Clear Data
    localStorage.removeItem('cart');
    localStorage.removeItem('appliedPromoCode');

    // Get display total
    const totalEl = document.querySelector('.summary-line.total span:last-child');
    const totalStr = totalEl ? totalEl.innerText : '0đ';

    showSuccessModal(totalStr, paymentMethodText);
}

function recordUserPurchases(cartItems) {
    try {
        const user = JSON.parse(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser'));
        if (!user) return;
        const purchases = JSON.parse(localStorage.getItem('userPurchases') || '{}');
        if (!purchases[user.username]) purchases[user.username] = [];
        
        cartItems.forEach(item => {
             if (!purchases[user.username].some(p => p.productId == item.id)) {
                purchases[user.username].push({
                    productId: item.id,
                    productTitle: item.title,
                    purchaseDate: new Date().toLocaleDateString('vi-VN'),
                    quantity: item.quantity
                });
             }
        });
        localStorage.setItem('userPurchases', JSON.stringify(purchases));
    } catch (e) {}
}

// --- MAIN RENDER ---
function renderCheckout(user) {
    const cartItems = getCartItems();
    
    // Empty State
    if (cartItems.length === 0) {
        document.getElementById('app').innerHTML = `
            <div style="height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px;">
                <i class="fas fa-shopping-basket" style="font-size:60px; color:#e5e7eb;"></i>
                <h2 style="color:#374151;">Giỏ hàng của bạn đang trống</h2>
                <a href="/index.htm" style="padding:12px 24px; background:#1a1a1a; color:white; text-decoration:none; border-radius:8px; font-weight:600;">Quay lại mua sắm</a>
            </div>
        `;
        return;
    }

    // Calculations
    const subtotal = calculateTotal(cartItems);
    const shipping = 20000;
    
    const savedPromo = localStorage.getItem('appliedPromoCode') || '';
    appliedPromoCode = savedPromo;
    
    let discount = 0;
    let discountText = '';
    const promo = validPromoCodes[appliedPromoCode];
    if (promo) {
        if (promo.type === 'percent') {
            discount = subtotal * (promo.value / 100);
            discountText = `-${promo.value}%`;
        } else if (promo.type === 'fixed') {
            discount = promo.value;
            discountText = `-${formatMoney(promo.value)}`;
        } else if (promo.type === 'shipping') {
            discount = Math.min(promo.value, shipping);
            discountText = 'FreeShip';
        }
    }
    
    const total = subtotal + shipping - discount;

// ... (Các phần trên giữ nguyên)

    const html = `
        <div class="header-modern">
            <div class="header-inner">
                <a href="/index.htm" class="brand">
                    <img src="/assets/logo.svg" alt="Logo" style="height: 40px;">
                </a>
                <a href="/index.htm" class="back-link">
                    <i class="fas fa-arrow-left"></i> 
                    <span>Tiếp tục mua hàng</span>
                </a>
            </div>
        </div>
        <div id="toast-container"></div>

        <form onsubmit="placeOrder(event)" class="checkout-container">
            <div class="grid-wrapper">
                <div class="card-modern">
                    <div class="card-header"><i class="fas fa-map-marker-alt"></i> Thông tin giao hàng</div>
                    <div class="card-body">
                        <div class="form-group">
                            <label>Người nhận</label>
                            <input type="text" name="fullname" value="${user.username}" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Số điện thoại</label>
                                <input type="tel" name="phone" value="${user.phone || ''}" required placeholder="09xxxxxxxx">
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" name="email" value="${user.email}" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Thành phố</label>
                                <input type="text" value="Hà Nội" readonly class="input-readonly">
                                <input type="hidden" name="city" value="Hà Nội">
                            </div>
                            <div class="form-group">
                                <label>Quận (Nội thành)</label>
                                <select name="district" required>
                                    <option value="">-- Chọn Quận --</option>
                                    <option value="Ba Đình">Ba Đình</option>
                                    <option value="Hoàn Kiếm">Hoàn Kiếm</option>
                                    <option value="Hai Bà Trưng">Hai Bà Trưng</option>
                                    <option value="Đống Đa">Đống Đa</option>
                                    <option value="Cầu Giấy">Cầu Giấy</option>
                                    <option value="Tây Hồ">Tây Hồ</option>
                                    <option value="Thanh Xuân">Thanh Xuân</option>
                                </select>
                                <div class="helper-text">Chú ý: Tiệm chỉ giao trong bán kính 5km</div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Địa chỉ chi tiết</label>
                            <input type="text" name="address" placeholder="Số nhà, ngõ, tên tòa nhà..." required>
                        </div>
                        <div class="form-group" style="margin-bottom:0">
                            <label>Ghi chú cho tài xế</label>
                            <textarea name="note" rows="3" placeholder="Ví dụ: Gọi trước khi giao, để ở sảnh..."></textarea>
                        </div>
                    </div>
                </div>

                <div class="card-modern">
                    <div class="card-header"><i class="fas fa-wallet"></i> Thanh toán</div>
                    <div class="card-body">
                        <div style="margin-bottom:24px;">
                            <label style="margin-bottom:12px;">Đơn vị vận chuyển</label>
                            <div class="payment-option active" style="cursor:default; background:#f9fafb; border-color:#e5e7eb; box-shadow:none;">
                                <div class="custom-radio" style="background:#4b5563; border-color:#4b5563;"></div>
                                <div class="option-info">
                                    <h4>Giao Hàng Hỏa Tốc</h4>
                                    <p>Đồng giá nội thành: ${formatMoney(shipping)}</p>
                                </div>
                            </div>
                        </div>

                        <label style="margin-bottom:12px;">Phương thức thanh toán</label>
                        <input type="hidden" id="selectedPaymentMethod" name="paymentMethod" value="cod">
                        
                        <div class="payment-option active" onclick="selectPaymentNew(this, 'cod')">
                            <div class="custom-radio"></div>
                            <div class="option-info">
                                <h4>Thanh toán tiền mặt (COD)</h4>
                                <p>Thanh toán khi nhận hàng</p>
                            </div>
                        </div>
                        <div class="payment-option" onclick="selectPaymentNew(this, 'banking')">
                            <div class="custom-radio"></div>
                            <div class="option-info">
                                <h4>Chuyển khoản Ngân hàng</h4>
                                <p>Quét mã VietQR (24/7)</p>
                            </div>
                            <div class="payment-details">
                                <div class="payment-info-text">
                                    Ngân hàng: <b>TECHCOMBANK</b><br>
                                    STK: <b>3023022006</b><br>
                                    Chủ TK: <b>NGUYEN MANH DUC</b>
                                </div>
                                <img src="/assets/techcombank.jpg" alt="QR Banking" class="qr-code-img">
                                <p class="payment-info-text"><i>Vui lòng nhập nội dung: [Tên KH] + [SĐT] đã đặt hàng</i></p>
                            </div>
                        </div>

                        <div class="payment-option" onclick="selectPaymentNew(this, 'momo')">
                            <div class="custom-radio"></div>
                            <div class="option-info">
                                <h4>Ví MoMo</h4>
                                <p>Thanh toán qua ứng dụng MoMo</p>
                            </div>
                            <div class="payment-details">
                                <img src="/assets/momo.jpg" alt="QR MoMo" class="qr-code-img">
                                <p class="payment-info-text"><i>Vui lòng nhập nội dung: [Tên KH] + [SĐT] đã đặt hàng</i></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card-modern sticky-column">
                    <div class="card-header"><i class="fas fa-shopping-bag"></i> Đơn hàng (${cartItems.length})</div>
                    <div class="card-body">
                        <div class="cart-list" style="max-height: 350px; overflow-y: auto; margin-bottom: 10px;">
                            ${cartItems.map(item => `
                                <div class="cart-item">
                                    <div class="item-thumb"><img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;"></div>
                                    <div class="item-details">
                                        <div class="item-name">${item.title}</div>
                                        ${item.selectedOptions && item.selectedOptions.length > 0 ? `
                                            <div class="item-options" style="font-size: 12px; color: #666; margin-top: 4px;">
                                                ${item.selectedOptions.map(opt => `<div>${opt.name}: ${opt.value}</div>`).join('')}
                                            </div>
                                        ` : ''}
                                        <div class="item-meta">SL: ${item.quantity}</div>
                                    </div>
                                    <div class="item-actions">
                                        <div class="item-price">${formatMoney(item.price * item.quantity)}</div>
                                        <button type="button" class="btn-delete" onclick="removeItem(${item.id})">
                                            <i class="fas fa-trash"></i> Xóa
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <div class="promo-section">
                            <div class="promo-group">
                                <input type="text" id="checkoutPromoInput" placeholder="Mã giảm giá">
                                <button type="button" onclick="applyPromoCode()">Áp dụng</button>
                            </div>
                            
                            ${appliedPromoCode ? `
                                <div class="applied-badge">
                                    <span><i class="fas fa-ticket-alt"></i> ${appliedPromoCode}</span>
                                    <i class="fas fa-times" style="cursor:pointer" onclick="removePromoCode()"></i>
                                </div>
                            ` : ''}
                        </div>

                        <div class="summary-line">
                            <span>Tạm tính</span>
                            <span>${formatMoney(subtotal)}</span>
                        </div>
                        <div class="summary-line">
                            <span>Phí vận chuyển</span>
                            <span>${formatMoney(shipping)}</span>
                        </div>
                        ${discount > 0 ? `
                        <div class="summary-line" style="color:#059669; font-weight:500;">
                            <span>Giảm giá</span>
                            <span>${discountText} -${formatMoney(discount)}</span>
                        </div>` : ''}
                        
                        <div class="summary-line total">
                            <span>Tổng cộng</span>
                            <span>${formatMoney(total)}</span>
                        </div>

                        <button type="submit" class="btn-place-order">Đặt Hàng Ngay</button>
                    </div>
                </div>
            
            </div>
        </form>
        <div class="modal-overlay" id="successModal">
            <div class="modal-content">
                <div style="width:70px; height:70px; background:#d1fae5; border-radius:50%; margin:0 auto 20px; display:flex; align-items:center; justify-content:center;">
                    <i class="fas fa-check" style="font-size:35px; color:#059669;"></i>
                </div>
                <h2 style="font-size:24px; color:#1f2937; margin-bottom:10px;">Đặt hàng thành công!</h2>
                <p class="modal-body-text" style="color:#6b7280; margin-bottom:30px;"></p>
                <a href="/index.htm" style="display:block; width:100%; padding:14px; background:#1f2937; color:white; text-decoration:none; border-radius:12px; font-weight:600;">Về trang chủ</a>
            </div>
        </div>
    `;

// ...
    document.getElementById('app').innerHTML = html;
}

// --- INIT ---
window.onload = function() {
    const user = checkAuth();
    if (user) renderCheckout(user);
};