const productDetail = document.getElementById('productDetail');
        const breadcrumbProduct = document.getElementById('breadcrumbProduct');

        function formatPrice(price) {
            return price.toLocaleString('vi-VN') + 'đ';
        }

        function calculateDiscount(oldPrice, currentPrice) {
            return Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
        }

        function createDetailHTML(product) {
            const discount = calculateDiscount(product.price_old, product.price_current);
            const statusText = product.status === 'soldout' ? 'Hết hàng' : 'Còn hàng';
            const statusClass = product.status === 'soldout' ? '' : 'available';
            
            // Tạo ảnh placeholder với emoji
            const foodEmojis = ['🍗', '🍔', '🍕', '🌮', '🍜', '🥘', '🍱', '🍲'];
            const randomEmoji = foodEmojis[product.id % foodEmojis.length];
            
            // Mô tả chi tiết cho sản phẩm
            const description = `${product.title} là một trong những món ăn được yêu thích nhất tại cửa hàng chúng tôi. 
            Được chế biến từ nguyên liệu tươi ngon, đảm bảo vệ sinh an toàn thực phẩm. 
            Hương vị đậm đà, hấp dẫn, phù hợp với khẩu vị người Việt. 
            Đặc biệt hiện đang có chương trình khuyến mãi giảm giá ${discount}%, đừng bỏ lỡ cơ hội này!`;

            return `
                <div class="detail">
                    <div class="detail-image">
                        ${product.image ? 
                            `<img src="${product.image}" alt="${product.title}">` : 
                            `<div style="width: 100%; height: 500px; display: flex; align-items: center; justify-content: center; font-size: 120px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">${randomEmoji}</div>`
                        }
                    </div>
                    <div class="detail-info">
                        <h2>${product.title}</h2>
                        <span class="status-badge ${statusClass}">${statusText}</span>
                        
                        <p class="detail-description">${description}</p>
                        
                        <div class="detail-price">
                            <span class="price-label">Giá:</span>
                            <span class="price-current">${formatPrice(product.price_current)}</span>
                            <span class="price-old">${formatPrice(product.price_old)}</span>
                            ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
                        </div>

                        <div class="quantity-section">
                            <span class="quantity-label">Số lượng:</span>
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="decreaseQuantity()">-</button>
                                <input type="number" class="quantity-input" id="quantity" value="1" min="1" max="99">
                                <button class="quantity-btn" onclick="increaseQuantity()">+</button>
                            </div>
                        </div>

                        <div class="action-buttons">
                            <button class="btn btn-primary" onclick="addToCart()">
                                🛒 Thêm vào giỏ hàng
                            </button>
                            <button class="btn" onclick="buyNow()">
                                ⚡ Mua ngay
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        function increaseQuantity() {
            const input = document.getElementById('quantity');
            const current = parseInt(input.value);
            if (current < 99) {
                input.value = current + 1;
            }
        }

        function decreaseQuantity() {
            const input = document.getElementById('quantity');
            const current = parseInt(input.value);
            if (current > 1) {
                input.value = current - 1;
            }
        }

        function addToCart() {
            const quantity = parseInt(document.getElementById('quantity').value);
            const product = window.currentProduct;
            
            if (!product) return;
            
            // Lấy giỏ hàng từ localStorage
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            
            // Kiểm tra sản phẩm đã tồn tại trong giỏ chưa
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: product.id,
                    title: product.title,
                    price: product.price_current,
                    quantity: quantity,
                    image: product.image || ''
                });
            }
            
            // Lưu giỏ hàng
            localStorage.setItem('cart', JSON.stringify(cart));
            
            alert(`✅ Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
            
            // Chuyển đến trang giỏ hàng
            window.location.href = '/cart/cart.htm';
        }

        function buyNow() {
            const quantity = parseInt(document.getElementById('quantity').value);
            const product = window.currentProduct;
            
            if (!product) return;
            
            // Lấy giỏ hàng từ localStorage
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            
            // Xóa giỏ hàng cũ
            cart = [];
            
            // Thêm sản phẩm hiện tại
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price_current,
                quantity: quantity,
                image: product.image || ''
            });
            
            // Lưu giỏ hàng
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Chuyển đến trang thanh toán
            window.location.href = '/checkout/checkout.htm';
        }

        const getDetailProduct = async () => {
            try {
                // Lấy ID từ URL
                const params = new URLSearchParams(window.location.search);
                const productId = params.get('id');

                if (!productId) {
                    throw new Error('Không tìm thấy ID sản phẩm');
                }

                // Fetch dữ liệu từ file JSON
                const response = await fetch('/data/product.json');
                
                if (!response.ok) {
                    throw new Error('Không thể tải dữ liệu sản phẩm');
                }

                const data = await response.json();
                
                // Tìm sản phẩm trong cả 2 danh sách
                const allProducts = [...data.sale, ...data.newsale];
                const product = allProducts.find(p => p.id == productId);

                if (product) {
                    window.currentProduct = product;
                    productDetail.innerHTML = createDetailHTML(product);
                    breadcrumbProduct.textContent = product.title;
                    document.title = product.title + ' - Chi tiết sản phẩm';
                    
                    // Cập nhật page-title với tên sản phẩm
                    const pageTitleElement = document.getElementById('pageTitle');
                    if (pageTitleElement && product.title) {
                      pageTitleElement.textContent = product.title;
                    }
                } else {
                    productDetail.innerHTML = '<div class="error">Không tìm thấy sản phẩm này!</div>';
                }
            } catch (error) {
                console.error('Lỗi:', error.message);
                productDetail.innerHTML = `<div class="error">Lỗi: ${error.message}</div>`;
            }
        }

        // Gọi hàm khi trang load
        getDetailProduct();