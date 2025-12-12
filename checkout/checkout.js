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

        let appliedPromoCode = '';

        // Kiểm tra đăng nhập
        function checkAuth() {
            const currentUser = sessionStorage.getItem("currentUser");
            
            if (!currentUser) {
                window.location.href = "/account/login/login.html#login";
                return null;
            }
            
            return JSON.parse(currentUser);
        }

        // Lấy giỏ hàng từ localStorage
        function getCartItems() {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            return cart.length > 0 ? cart : getDemoCart();
        }
        
        // Demo data nếu giỏ hàng trống
        function getDemoCart() {
            return [
                {
                    id: 1,
                    title: "Bánh mì thịt nướng",
                    price: 25000,
                    quantity: 2,
                    image: "🥖"
                },
                {
                    id: 2,
                    title: "Phở bò",
                    price: 45000,
                    quantity: 1,
                    image: "🍜"
                },
                {
                    id: 3,
                    title: "Cà phê sữa",
                    price: 20000,
                    quantity: 2,
                    image: "☕"
                }
            ];
        }

        // Tính tổng tiền
        function calculateTotal(items) {
            return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }

        // Format tiền
        function formatMoney(amount) {
            return amount.toLocaleString('vi-VN') + 'đ';
        }

        // Chọn phương thức thanh toán
        function selectPayment(method) {
            document.querySelectorAll('.payment-method').forEach(el => {
                el.classList.remove('active');
            });
            event.currentTarget.classList.add('active');
        }

        // 🎨 TOAST NOTIFICATION SYSTEM
function showNotification(message, type = 'info', duration = 3000) {
    // Tạo container nếu chưa tồn tại
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Map icon cho từng loại
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    // Tạo toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-text">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);

    // Auto remove sau duration
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('remove');
            setTimeout(() => toast.remove(), 300);
        }
    }, duration);
}

// ✅ Áp dụng mã giảm giá
function applyPromoCode() {
    const promoInput = document.getElementById('checkoutPromoInput');
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
        // Reload trang để cập nhật giá
        const user = checkAuth();
        if (user) renderCheckout(user);
    } else {
        showNotification('Mã giảm giá không hợp lệ', 'error');
        promoInput.value = '';
    }
}

// ✅ Xóa mã giảm giá
function removePromoCode() {
    appliedPromoCode = '';
    localStorage.removeItem('appliedPromoCode');
    showNotification('Đã xóa mã giảm giá', 'info');
    const user = checkAuth();
    if (user) renderCheckout(user);
}

        // Xử lý đặt hàng
        function placeOrder(event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);
            
            // Validate
            if (!form.checkValidity()) {
                alert("Vui lòng điền đầy đủ thông tin!");
                return;
            }

            // Kiểm tra phương thức thanh toán
            const paymentMethod = document.querySelector('.payment-method.active');
            if (!paymentMethod) {
                alert("Vui lòng chọn phương thức thanh toán!");
                return;
            }

            // Lấy thông tin
            const cartItems = getCartItems();
            const subtotal = calculateTotal(cartItems);
            const shipping = 20000;
            
            // Tính discount
            let discount = 0;
            const promo = validPromoCodes[appliedPromoCode];
            if (promo) {
                if (promo.type === 'percent') {
                    discount = subtotal * (promo.value / 100);
                } else if (promo.type === 'fixed') {
                    discount = promo.value;
                } else if (promo.type === 'shipping') {
                    discount = Math.min(promo.value, shipping);
                }
            }
            
            const total = subtotal + shipping - discount;

            const orderData = {
                customer: {
                    name: formData.get('fullname'),
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    address: formData.get('address'),
                    city: formData.get('city'),
                    district: formData.get('district')
                },
                items: cartItems,
                subtotal: subtotal,
                shipping: shipping,
                discount: discount,
                promoCode: appliedPromoCode,
                total: total,
                payment: paymentMethod.dataset.method,
                note: formData.get('note'),
                orderDate: new Date().toISOString()
            };

            console.log("Order data:", orderData);

            // ✅ GHI NHẬN MUA HÀNG
            recordUserPurchases(cartItems);

            // Giả lập đặt hàng
            alert(`✅ Đặt hàng thành công!\n\nTổng tiền: ${formatMoney(total)}\nPhương thức: ${paymentMethod.textContent.trim()}\n\nCảm ơn bạn đã đặt hàng!`);
            
            // Xóa giỏ hàng, mã giảm giá và chuyển về trang chủ
            localStorage.removeItem('cart');
            localStorage.removeItem('appliedPromoCode');
            setTimeout(() => {
                window.location.href = "/index.htm";
            }, 2000);
        }

        // ✅ HÀM GHI NHẬN MUA HÀNG
        function recordUserPurchases(cartItems) {
            // Lấy user từ sessionStorage (từ login)
            const userSession = sessionStorage.getItem('currentUser');
            const userLocal = localStorage.getItem('currentUser');
            
            let user = userSession || userLocal;
            if (!user) {
                console.log('Không tìm thấy user để ghi nhận mua hàng');
                return;
            }

            try {
                user = JSON.parse(user);
                const username = user.username;

                // Lấy purchases cũ
                const purchasesSession = JSON.parse(sessionStorage.getItem('userPurchases') || '{}');
                const purchasesLocal = JSON.parse(localStorage.getItem('userPurchases') || '{}');
                
                // Kết hợp cả 2
                const allPurchases = { ...purchasesLocal, ...purchasesSession };
                if (!allPurchases[username]) {
                    allPurchases[username] = [];
                }

                // Thêm các sản phẩm vào danh sách mua
                cartItems.forEach(item => {
                    // Kiểm tra không thêm trùng
                    if (!allPurchases[username].some(p => p.productId == item.id)) {
                        allPurchases[username].push({
                            productId: item.id,
                            productTitle: item.title,
                            purchaseDate: new Date().toLocaleDateString('vi-VN'),
                            quantity: item.quantity
                        });
                    }
                });

                // Lưu vào cả sessionStorage và localStorage
                sessionStorage.setItem('userPurchases', JSON.stringify(allPurchases));
                localStorage.setItem('userPurchases', JSON.stringify(allPurchases));

                console.log('✅ Ghi nhận mua hàng thành công:', allPurchases[username]);
            } catch (e) {
                console.error('Lỗi ghi nhận mua hàng:', e);
            }
        }

        // Render trang
        function renderCheckout(user) {
            const cartItems = getCartItems();
            const subtotal = calculateTotal(cartItems);
            const shipping = 20000;
            
            // Load mã giảm giá nếu có
            const savedPromo = localStorage.getItem('appliedPromoCode') || '';
            appliedPromoCode = savedPromo;
            
            // Tính discount
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
                    discountText = `Miễn phí ship ${formatMoney(promo.value)}`;
                }
            }
            
            const total = subtotal + shipping - discount;

            const html = `
                <div class="header">
                    <h1>
                        <i class="fas fa-shopping-bag"></i>
                        Thanh toán
                    </h1>
                    <div class="header-actions">
                        <a href="/category/product/product.htm" class="btn btn-secondary">
                            <i class="fas fa-arrow-left"></i>
                            Tiếp tục mua
                        </a>
                        <a href="/account/profile/profile.html" class="btn btn-secondary">
                            <i class="fas fa-user"></i>
                            ${user.username}
                        </a>
                    </div>
                </div>

                <div class="checkout-grid">
                    <div class="checkout-form">
                        <form onsubmit="placeOrder(event)">
                            <div class="section-title">
                                <i class="fas fa-user-circle"></i>
                                Thông tin người nhận
                            </div>

                            <div class="form-group">
                                <label>Họ và tên *</label>
                                <input type="text" name="fullname" value="${user.username}" required>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label>Số điện thoại *</label>
                                    <input type="tel" name="phone" value="${user.phone || ''}" required pattern="[0-9]{10,11}">
                                </div>
                                <div class="form-group">
                                    <label>Email *</label>
                                    <input type="email" name="email" value="${user.email}" required>
                                </div>
                            </div>

                            <div class="section-title" style="margin-top: 30px;">
                                <i class="fas fa-map-marker-alt"></i>
                                Địa chỉ giao hàng
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label>Tỉnh/Thành phố *</label>
                                    <select name="city" required>
                                        <option value="">Chọn tỉnh/thành</option>
                                        <option value="hanoi">Hà Nội</option>
                                        <option value="hcm">Hồ Chí Minh</option>
                                        <option value="danang">Đà Nẵng</option>
                                        <option value="cantho">Cần Thơ</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Quận/Huyện *</label>
                                    <select name="district" required>
                                        <option value="">Chọn quận/huyện</option>
                                        <option value="district1">Quận 1</option>
                                        <option value="district2">Quận 2</option>
                                        <option value="district3">Quận 3</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Địa chỉ cụ thể *</label>
                                <input type="text" name="address" placeholder="Số nhà, tên đường..." required>
                            </div>

                            <div class="form-group">
                                <label>Ghi chú đơn hàng</label>
                                <textarea name="note" rows="3" placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."></textarea>
                            </div>

                            <div class="section-title" style="margin-top: 30px;">
                                <i class="fas fa-credit-card"></i>
                                Phương thức thanh toán
                            </div>

                            <div class="payment-methods">
                                <div class="payment-method active" onclick="selectPayment('cod')" data-method="cod">
                                    <i class="fas fa-money-bill-wave"></i>
                                    <span>Tiền mặt</span>
                                </div>
                                <div class="payment-method" onclick="selectPayment('momo')" data-method="momo">
                                    <i class="fas fa-mobile-alt"></i>
                                    <span>Ví MoMo</span>
                                </div>
                                <div class="payment-method" onclick="selectPayment('banking')" data-method="banking">
                                    <i class="fas fa-university"></i>
                                    <span>Chuyển khoản</span>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 30px; justify-content: center; padding: 15px;">
                                <i class="fas fa-check-circle"></i>
                                Đặt hàng
                            </button>
                        </form>
                    </div>

                    <div class="order-summary">
                        <div class="section-title">
                            <i class="fas fa-receipt"></i>
                            Đơn hàng của bạn
                        </div>

                        ${cartItems.map(item => `
                            <div class="cart-item">
                                <div class="item-image">${item.image}</div>
                                <div class="item-details">
                                    <div class="item-name">${item.title}</div>
                                    <div class="item-quantity">Số lượng: ${item.quantity}</div>
                                </div>
                                <div class="item-price">${formatMoney(item.price * item.quantity)}</div>
                            </div>
                        `).join('')}

                        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; font-weight: 600; color: #1f2937; margin-bottom: 8px; font-size: 14px;">
                                    🎫 Mã giảm giá
                                </label>
                                <div style="display: flex; gap: 8px;">
                                    <input type="text" id="checkoutPromoInput" placeholder="Nhập mã giảm giá..." style="flex: 1; padding: 10px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px; box-sizing: border-box;" />
                                    <button type="button" onclick="applyPromoCode()" style="background: #f97316; color: white; padding: 10px 16px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; white-space: nowrap;">
                                        Áp dụng
                                    </button>
                                </div>
                            </div>

                            ${appliedPromoCode && validPromoCodes[appliedPromoCode] ? `
                                <div style="background: #dcfce7; border: 1px solid #86efac; padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                                    <div style="color: #166534; font-weight: 600; font-size: 13px;">
                                        ✅ Mã: <strong>${appliedPromoCode}</strong> - ${validPromoCodes[appliedPromoCode].desc}
                                    </div>
                                    <button type="button" onclick="removePromoCode()" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">
                                        ✕ Xóa
                                    </button>
                                </div>
                            ` : ''}
                        </div>

                        <div style="margin-top: 20px;">
                            <div class="summary-row">
                                <span>Tạm tính</span>
                                <strong>${formatMoney(subtotal)}</strong>
                            </div>
                            <div class="summary-row">
                                <span>Phí vận chuyển</span>
                                <strong>${formatMoney(shipping)}</strong>
                            </div>
                            ${discount > 0 ? `
                            <div class="summary-row" style="color: #10b981;">
                                <span>Giảm giá ${discountText}</span>
                                <strong>-${formatMoney(discount)}</strong>
                            </div>
                            ` : ''}
                            <div class="summary-row total">
                                <span>Tổng cộng</span>
                                <span>${formatMoney(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('app').innerHTML = html;
        }

        // Khởi tạo
        window.onload = function() {
            const user = checkAuth();
            if (user) {
                renderCheckout(user);
            }
        };