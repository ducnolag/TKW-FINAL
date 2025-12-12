// Kiểm tra đăng nhập
        function checkAuth() {
            const currentUser = sessionStorage.getItem("currentUser");
            
            if (!currentUser) {
                alert("Bạn cần đăng nhập để thanh toán!");
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
                total: calculateTotal(cartItems),
                payment: paymentMethod.dataset.method,
                note: formData.get('note'),
                orderDate: new Date().toISOString()
            };

            console.log("Order data:", orderData);

            // ✅ GHI NHẬN MUA HÀNG
            recordUserPurchases(cartItems);

            // Giả lập đặt hàng
            alert(`✅ Đặt hàng thành công!\n\nTổng tiền: ${formatMoney(orderData.total)}\nPhương thức: ${paymentMethod.textContent.trim()}\n\nCảm ơn bạn đã đặt hàng!`);
            
            // Xóa giỏ hàng và chuyển về trang chủ
            localStorage.removeItem('cart');
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
            const total = subtotal + shipping;

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
                                    <div class="item-name">${item.name}</div>
                                    <div class="item-quantity">Số lượng: ${item.quantity}</div>
                                </div>
                                <div class="item-price">${formatMoney(item.price * item.quantity)}</div>
                            </div>
                        `).join('')}

                        <div style="margin-top: 20px;">
                            <div class="summary-row">
                                <span>Tạm tính</span>
                                <strong>${formatMoney(subtotal)}</strong>
                            </div>
                            <div class="summary-row">
                                <span>Phí vận chuyển</span>
                                <strong>${formatMoney(shipping)}</strong>
                            </div>
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