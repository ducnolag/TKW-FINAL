const productDetail = document.getElementById('productDetail');
const breadcrumbProduct = document.getElementById('breadcrumbProduct');

// Dữ liệu mã khuyến mãi
const promoCodes = [
    {
        id: 1,
        title: 'Chào Bạn Mới',
        description: 'Giảm 10% tổng đơn hàng cho lần đăng nhập đầu tiên (tối đa 30k).',
        code: 'CHAOBANMOI',
        badge: 'GIẢM 10%',
        color: 'from-red-600 to-red-700',
        image: '🎁'
    },
    {
        id: 2,
        title: 'Tiếp Sức Mùa Thi',
        description: 'Miễn phí vận chuyển tới đâu 15k.\nHạn từ 21/11/2025 - 31/12/2025.',
        code: 'THITOTNHA',
        badge: 'FREESHIP 15K',
        color: 'from-red-700 to-red-800',
        image: '🎓'
    },
    {
        id: 3,
        title: 'Mua Càng Nhiều - Ưu Đãi Càng Hời',
        description: 'Mã tặng bạn hàng tuần.',
        codes: [
            { code: 'MUC10', discount: '-10K' },
            { code: 'MUC20', discount: '-20K' },
            { code: 'MUC30', discount: '-30K' }
        ],
        badge: 'COMBO 30K',
        color: 'from-orange-500 to-orange-600',
        image: '🎉'
    }
];

// Dữ liệu đánh giá mẫu
const reviews = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        rating: 5,
        date: '10/12/2024',
        comment: 'Sản phẩm rất tuyệt vời! Chất lượng tốt, giao hàng nhanh. Tôi rất hài lòng.',
        avatar: '👨'
    },
    {
        id: 2,
        name: 'Trần Thị B',
        rating: 4,
        date: '08/12/2024',
        comment: 'Món ăn ngon, đóng gói cẩn thận. Giá cả hợp lý.',
        avatar: '👩'
    },
    {
        id: 3,
        name: 'Lê Văn C',
        rating: 5,
        date: '05/12/2024',
        comment: 'Tuyệt vời! Sẽ tiếp tục ủng hộ quán.',
        avatar: '👨‍💼'
    }
];

function formatPrice(price) {
    return price.toLocaleString('vi-VN') + 'đ';
}

function calculateDiscount(oldPrice, currentPrice) {
    return Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
}

function createPromoCodeHTML() {
    return `
        <div class="promo-section" style="margin: 20px 0; padding: 15px; background: white; border: 2px solid #fed7aa; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 15px;">
                <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0;">
                    <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 12px; border-radius: 12px; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);">
                        <span style="font-size: 24px;">🎫</span>
                    </div>
                    <div style="min-width: 0; flex: 1;">
                        <h3 style="font-weight: 700; color: #1f2937; font-size: 16px; margin: 0 0 4px 0;">🎫 Kho Mã Giảm Giá</h3>
                        <p style="font-size: 13px; color: #6b7280; margin: 0;">${promoCodes.length} voucher</p>
                    </div>
                </div>
                <button onclick="openPromoPopup()" style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: white; padding: 10px 24px; border: none; border-radius: 10px; font-weight: 600; font-size: 14px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3); transition: all 0.3s;">
                    Xem ngay
                </button>
            </div>
        </div>
    `;
}

function createReviewsHTML() {
    // Lấy đánh giá từ localStorage
    const storedReviews = JSON.parse(localStorage.getItem('productReviews') || '[]');
    const allReviews = [...reviews, ...storedReviews];
    
    const avgRating = allReviews.length > 0 ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1) : '0.0';
    
    return `
        <div class="reviews-section" style="margin: 30px 0; padding: 25px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="margin-bottom: 25px;">
                <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 15px 0;">⭐ Đánh Giá Sản Phẩm</h3>
                <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #fef3c7; border-radius: 10px;">
                    <div style="text-align: center;">
                        <div style="font-size: 32px; font-weight: 700; color: #f59e0b;">${avgRating}</div>
                        <div style="font-size: 12px; color: #92400e;">⭐⭐⭐⭐⭐</div>
                        <div style="font-size: 11px; color: #78716c; margin-top: 4px;">${allReviews.length} đánh giá</div>
                    </div>
                    <div style="flex: 1;">
                        ${[5,4,3,2,1].map(star => {
                            const count = allReviews.filter(r => r.rating === star).length;
                            const percentage = allReviews.length > 0 ? (count / allReviews.length * 100).toFixed(0) : 0;
                            return `
                                <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
                                    <span style="font-size: 12px; color: #78716c; width: 50px;">${star} sao</span>
                                    <div style="flex: 1; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
                                        <div style="height: 100%; background: #fbbf24; width: ${percentage}%; transition: width 0.3s;"></div>
                                    </div>
                                    <span style="font-size: 12px; color: #78716c; width: 40px; text-align: right;">${count}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>

            <div class="reviews-list">
                ${allReviews.map(review => `
                    <div style="padding: 15px; border: 1px solid #e5e7eb; border-radius: 10px; margin-bottom: 12px;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                            <div style="font-size: 32px;">${review.avatar}</div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: #1f2937; font-size: 14px;">${review.name}</div>
                                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                                    <div style="color: #fbbf24; font-size: 14px;">${'⭐'.repeat(review.rating)}</div>
                                    <span style="font-size: 12px; color: #9ca3af;">${review.date}</span>
                                </div>
                            </div>
                        </div>
                        <p style="color: #4b5563; font-size: 13px; line-height: 1.6; margin: 0;">${review.comment}</p>
                    </div>
                `).join('')}
            </div>

            <div style="text-align: center; margin-top: 20px;">
                <button onclick="openReviewForm()" style="background: #f97316; color: white; padding: 10px 30px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.3s;">
                    ✏️ Viết đánh giá
                </button>
            </div>
        </div>
    `;
}

function createDetailHTML(product) {
    const discount = calculateDiscount(product.price_old, product.price_current);
    const statusText = product.status === 'soldout' ? 'Hết hàng' : 'Còn hàng';
    const statusClass = product.status === 'soldout' ? '' : 'available';
    
    const foodEmojis = ['🍗', '🍔', '🍕', '🌮', '🍜', '🥘', '🍱', '🍲'];
    const randomEmoji = foodEmojis[product.id % foodEmojis.length];
    
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

                ${createPromoCodeHTML()}

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

        ${createReviewsHTML()}
    `;
}

function openPromoPopup() {
    const popup = document.createElement('div');
    popup.id = 'promoPopup';
    popup.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 16px; backdrop-filter: blur(4px);';
    
    popup.innerHTML = `
        <div style="background: white; border-radius: 20px; width: 100%; max-width: 900px; max-height: 85vh; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
            <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 50%, #ec4899 100%); padding: 20px; color: white; position: relative;">
                <button onclick="closePromoPopup()" style="position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; transition: background 0.3s;">
                    ×
                </button>
                <div style="display: flex; align-items: center; gap: 12px; padding-right: 40px;">
                    <span style="font-size: 32px;">🎫</span>
                    <div>
                        <h2 style="font-size: 24px; font-weight: 700; margin: 0;">🎫 Kho Mã Giảm Giá</h2>
                    </div>
                </div>
            </div>

            <div style="padding: 20px; overflow-y: auto; max-height: calc(85vh - 180px);">
                <div style="margin-bottom: 20px;">
                    <h3 style="font-size: 18px; font-weight: 700; color: #1f2937; display: flex; align-items: center; gap: 8px; margin: 0 0 8px 0;">
                        <span style="color: #f97316;">🎟️</span>
                        Mã Giảm Giá Dành Cho Bạn
                    </h3>
                    <p style="font-size: 13px; color: #6b7280; margin: 0;">
                        Chọn mã phù hợp để nhận ưu đãi tốt nhất
                    </p>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
                    ${promoCodes.map(promo => `
                        <div style="position: relative; background: white; border-radius: 12px; overflow: hidden; border: 2px solid #fed7aa; transition: all 0.3s; cursor: pointer; height: 340px; display: flex; flex-direction: column;">
                            <div style="position: absolute; top: 8px; right: 8px; z-index: 10;">
                                <span style="background: #dc2626; color: white; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);">
                                    ${promo.badge}
                                </span>
                            </div>

                            <div style="background: linear-gradient(135deg, ${promo.color === 'from-red-600 to-red-700' ? '#dc2626, #b91c1c' : promo.color === 'from-red-700 to-red-800' ? '#b91c1c, #991b1b' : '#f97316, #ea580c'}); padding: 16px; height: 128px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
                                <div style="position: absolute; inset: 0; opacity: 0.1;">
                                    <div style="position: absolute; top: 0; left: 0; width: 96px; height: 96px; background: white; border-radius: 50%; transform: translate(-48px, -48px);"></div>
                                    <div style="position: absolute; bottom: 0; right: 0; width: 128px; height: 128px; background: white; border-radius: 50%; transform: translate(64px, 64px);"></div>
                                </div>
                                <span style="font-size: 56px; position: relative; z-index: 10; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">${promo.image}</span>
                            </div>

                            <div style="position: absolute; top: 128px; left: 0; right: 0; height: 8px; display: flex; justify-content: space-between; padding: 0 2px;">
                                ${Array.from({ length: 18 }).map(() => `<div style="width: 8px; height: 8px; background: #fed7aa; border-radius: 50%; transform: translateY(-50%);"></div>`).join('')}
                            </div>

                            <div style="padding: 12px; background: white; flex: 1; display: flex; flex-direction: column;">
                                <h3 style="font-weight: 700; color: #1f2937; font-size: 14px; margin: 0 0 8px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                    ${promo.title}
                                </h3>
                                <p style="font-size: 12px; color: #6b7280; margin: 0 0 12px 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; min-height: 48px; max-height: 48px;">
                                    ${promo.description}
                                </p>
                                
                                <div style="margin-top: auto;">
                                    ${promo.codes ? `
                                        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
                                            ${promo.codes.map(item => `
                                                <div style="flex: 1; min-width: 80px; border: 1px solid #fed7aa; border-radius: 6px; padding: 6px; text-align: center;">
                                                    <div style="font-size: 10px; font-weight: 700; color: #f97316;">${item.code}</div>
                                                    <div style="font-size: 9px; color: #6b7280;">${item.discount}</div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    ` : `
                                        <div style="border: 2px dashed #fed7aa; border-radius: 8px; padding: 10px; margin-bottom: 8px; background: #fffbeb;">
                                            <div style="font-size: 12px; font-family: monospace; font-weight: 700; color: #1f2937; text-align: center;">
                                                ${promo.code}
                                            </div>
                                        </div>
                                    `}
                                    
                                    <button onclick="copyPromoCode('${promo.code}')" style="width: 100%; background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: white; padding: 8px; border: none; border-radius: 8px; font-weight: 600; font-size: 12px; cursor: pointer; box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3); transition: all 0.3s;">
                                        LẤY MÃ
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div style="border-top: 2px solid #e5e7eb; padding: 12px; background: linear-gradient(135deg, #fffbeb 0%, #fef2f2 100%);">
                <p style="font-size: 12px; color: #374151; text-align: center; font-weight: 500; margin: 0;">
                    💡 Voucher sẽ được áp dụng tự động khi thanh toán
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
}

function closePromoPopup() {
    const popup = document.getElementById('promoPopup');
    if (popup) {
        popup.remove();
    }
}

function copyPromoCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        alert(`✅ Đã sao chép mã: ${code}`);
        closePromoPopup();
    });
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
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
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
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    alert(`✅ Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    
    window.location.href = '/cart/cart.htm';
}

function buyNow() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const product = window.currentProduct;
    
    if (!product) return;
    
    let cart = [];
    
    cart.push({
        id: product.id,
        title: product.title,
        price: product.price_current,
        quantity: quantity,
        image: product.image || ''
    });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    window.location.href = '/checkout/checkout.htm';
}

// Hàm ghi nhận mua hàng (gọi từ trang thanh toán sau khi mua thành công)
function recordPurchase(productId, productTitle) {
    const user = localStorage.getItem('currentUser');
    if (!user) return;
    
    const purchases = JSON.parse(localStorage.getItem('userPurchases') || '{}');
    if (!purchases[user]) {
        purchases[user] = [];
    }
    
    // Kiểm tra không thêm trùng
    if (!purchases[user].some(p => p.productId == productId)) {
        purchases[user].push({
            productId: productId,
            productTitle: productTitle,
            purchaseDate: new Date().toLocaleDateString('vi-VN')
        });
    }
    
    localStorage.setItem('userPurchases', JSON.stringify(purchases));
}

const getDetailProduct = async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');

        if (!productId) {
            throw new Error('Không tìm thấy ID sản phẩm');
        }

        const response = await fetch('/data/product.json');
        
        if (!response.ok) {
            throw new Error('Không thể tải dữ liệu sản phẩm');
        }

        const data = await response.json();
        
        const allProducts = [...data.sale, ...data.newsale];
        const product = allProducts.find(p => p.id == productId);

        if (product) {
            window.currentProduct = product;
            productDetail.innerHTML = createDetailHTML(product);
            breadcrumbProduct.textContent = product.title;
            document.title = product.title + ' - Chi tiết sản phẩm';
            
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

// Biến global để lưu rating được chọn
let selectedRating = 0;

function openReviewForm() {
    // Kiểm tra đăng nhập
    if (!isUserLoggedIn()) {
        alert('❌ Vui lòng đăng nhập để viết đánh giá!');
        window.location.href = '/account/login/login.html';
        return;
    }

    // Kiểm tra đã mua hàng
    if (!hasUserPurchasedProduct(window.currentProduct.id)) {
        alert('❌ Chỉ những khách hàng đã mua sản phẩm này mới có thể đánh giá!');
        return;
    }

    selectedRating = 0; // Reset rating
    
    const modal = document.createElement('div');
    modal.id = 'reviewModal';
    modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 16px; backdrop-filter: blur(4px);';
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 16px; width: 100%; max-width: 600px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden;">
            <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 24px; color: white; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 28px;">⭐</span>
                    <h2 style="font-size: 22px; font-weight: 700; margin: 0;">Viết Đánh Giá</h2>
                </div>
                <button onclick="closeReviewModal()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; transition: background 0.3s;">
                    ×
                </button>
            </div>

            <div style="padding: 24px;">
                <form id="reviewForm" onsubmit="submitReview(event)">
                    <!-- Tên người dùng -->
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-weight: 600; color: #1f2937; margin-bottom: 8px; font-size: 14px;">👤 Tên của bạn</label>
                        <input type="text" id="reviewName" required placeholder="Nhập tên của bạn" style="width: 100%; padding: 10px 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; box-sizing: border-box; transition: border-color 0.3s; cursor: text;" onfocus="this.style.borderColor='#f97316'" onblur="this.style.borderColor='#e5e7eb'">
                    </div>

                    <!-- Rating -->
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-weight: 600; color: #1f2937; margin-bottom: 8px; font-size: 14px;">⭐ Đánh giá <span id="ratingError" style="color: #dc2626; font-size: 12px; display: none;">(Vui lòng chọn số sao)</span></label>
                        <div style="display: flex; gap: 8px;" id="ratingStars">
                            ${[1,2,3,4,5].map(star => `
                                <span data-rating="${star}" style="font-size: 40px; cursor: pointer; transition: transform 0.2s; color: #d1d5db; user-select: none;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
                                    ☆
                                </span>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Comment -->
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-weight: 600; color: #1f2937; margin-bottom: 8px; font-size: 14px;">💬 Bình luận</label>
                        <textarea id="reviewComment" required placeholder="Chia sẻ trải nghiệm của bạn..." style="width: 100%; padding: 10px 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; box-sizing: border-box; min-height: 100px; font-family: inherit; transition: border-color 0.3s; resize: vertical; cursor: text;" onfocus="this.style.borderColor='#f97316'" onblur="this.style.borderColor='#e5e7eb'"></textarea>
                    </div>

                    <div style="display: flex; gap: 12px; margin-top: 20px;">
                        <button type="button" onclick="closeReviewModal()" style="flex: 1; padding: 10px; border: 2px solid #e5e7eb; background: white; color: #6b7280; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.3s;">
                            ✕ Hủy
                        </button>
                        <button type="submit" style="flex: 1; padding: 10px; background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.3s; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);">
                            ✓ Gửi Đánh Giá
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);

    // Xử lý click vào sao
    const stars = document.querySelectorAll('#ratingStars span');
    stars.forEach((star) => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            selectedRating = rating;
            
            // Ẩn thông báo lỗi
            document.getElementById('ratingError').style.display = 'none';
            
            // Update hiển thị sao
            stars.forEach((s, i) => {
                if (i < rating) {
                    s.textContent = '★';
                    s.style.color = '#fbbf24';
                } else {
                    s.textContent = '☆';
                    s.style.color = '#d1d5db';
                }
            });
        });
    });
}

function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.remove();
    }
    selectedRating = 0;
}

function submitReview(event) {
    event.preventDefault();

    // Kiểm tra rating
    if (selectedRating === 0) {
        document.getElementById('ratingError').style.display = 'inline';
        alert('⚠️ Vui lòng chọn số sao đánh giá!');
        return false;
    }

    const name = document.getElementById('reviewName').value;
    const comment = document.getElementById('reviewComment').value;

    // Tạo đánh giá mới
    const newReview = {
        id: Date.now(),
        name: name,
        rating: selectedRating,
        date: new Date().toLocaleDateString('vi-VN'),
        comment: comment,
        avatar: ['👨', '👩', '👨‍💼', '👩‍🔬', '🧑', '👨‍🎓'][Math.floor(Math.random() * 6)]
    };

    // Lấy đánh giá cũ từ localStorage
    let storedReviews = JSON.parse(localStorage.getItem('productReviews') || '[]');
    
    // Thêm đánh giá mới vào đầu
    storedReviews.unshift(newReview);

    // Lưu vào localStorage
    localStorage.setItem('productReviews', JSON.stringify(storedReviews));

    alert('✅ Cảm ơn bạn đã đánh giá! Đánh giá của bạn sẽ được hiển thị ngay.');

    // Đóng modal
    closeReviewModal();

    // Reload lại phần detail để hiển thị review mới
    if (window.currentProduct) {
        productDetail.innerHTML = createDetailHTML(window.currentProduct);
    }
    
    return false;
}

// Kiểm tra user đã đăng nhập
function isUserLoggedIn() {
    // Kiểm tra cả sessionStorage và localStorage
    const userSession = sessionStorage.getItem('currentUser');
    const userLocal = localStorage.getItem('currentUser');
    
    const isLogin = (userSession !== null && userSession !== '') || (userLocal !== null && userLocal !== '');
    
    console.log('User từ sessionStorage:', userSession);
    console.log('User từ localStorage:', userLocal);
    console.log('Đã đăng nhập:', isLogin);
    
    return isLogin;
}

// Kiểm tra user đã mua sản phẩm
function hasUserPurchasedProduct(productId) {
    const userSession = sessionStorage.getItem('currentUser');
    const userLocal = localStorage.getItem('currentUser');
    
    // Ưu tiên sessionStorage (đăng nhập hiện tại)
    let user = userSession || userLocal;
    
    if (!user) return false;
    
    try {
        user = JSON.parse(user);
        const username = user.username;
        
        // Lấy purchases từ cả sessionStorage và localStorage
        const purchasesSession = JSON.parse(sessionStorage.getItem('userPurchases') || '{}');
        const purchasesLocal = JSON.parse(localStorage.getItem('userPurchases') || '{}');
        
        // Kết hợp cả 2
        const allPurchases = { ...purchasesLocal, ...purchasesSession };
        const userPurchases = allPurchases[username] || [];
        
        return userPurchases.some(p => p.productId == productId);
    } catch (e) {
        console.log('Lỗi parse user:', e);
        return false;
    }
}