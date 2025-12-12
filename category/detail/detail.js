const productDetail = document.getElementById('productDetail');
const breadcrumbProduct = document.getElementById('breadcrumbProduct');

// ========== STORAGE KEYS ==========
const STORAGE_KEY_REVIEWS = 'productReviews';
const STORAGE_KEY_PROMO = 'appliedPromoCode';

// ========== DỮ LIỆU MÃ KHUYẾN MÃI ==========
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

// ========== DỮ LIỆU ĐÁNH GIÁ MẪU ==========
const reviewsSample = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        rating: 5,
        date: '10/12/2024',
        comment: 'Sản phẩm rất tuyệt vời! Chất lượng tốt, giao hàng nhanh. Tôi rất hài lòng.',
        avatar: '👨',
        image: null,
        likes: 12,
        replies: [
            {
                name: 'Admin',
                content: 'Cảm ơn bạn đã mua hàng và đánh giá!',
                date: '11/12/2024',
                isAdmin: true
            }
        ]
    },
    {
        id: 2,
        name: 'Trần Thị B',
        rating: 4,
        date: '08/12/2024',
        comment: 'Món ăn ngon, đóng gói cẩn thận. Giá cả hợp lý.',
        avatar: '👩',
        image: null,
        likes: 5,
        replies: []
    },
    {
        id: 3,
        name: 'Lê Văn C',
        rating: 5,
        date: '05/12/2024',
        comment: 'Tuyệt vời! Sẽ tiếp tục ủng hộ quán.',
        avatar: '👨‍💼',
        image: null,
        likes: 2,
        replies: []
    }
];

// ========== DỮ LIỆU SẢN PHẨM GỢI Ý ==========
const suggestProducts = [
    {
        id: 10,
        title: 'Khô Gà Lá Chanh',
        price_current: 45000,
        image: 'https://i.pinimg.com/564x/4e/8e/58/4e8e58daec63df4d5885293291244e8c.jpg'
    },
    {
        id: 11,
        title: 'Trà Đào Cam Sả',
        price_current: 25000,
        image: 'https://i.pinimg.com/564x/d8/b1/78/d8b178c7344933a382283e33df49c4d8.jpg'
    },
    {
        id: 12,
        title: 'Bánh Tráng Trộn',
        price_current: 20000,
        image: 'https://i.pinimg.com/564x/87/44/04/8744040a4545084931a296538bf34720.jpg'
    },
    {
        id: 13,
        title: 'Mực Nướng Sa Tế',
        price_current: 55000,
        image: 'https://i.pinimg.com/564x/87/44/04/8744040a4545084931a296538bf34720.jpg'
    }
];

// ========== BIẾN TRẠNG THÁI REVIEW ==========
let allReviews = [];
let selectedRating = 0;
let currentImageBase64 = null;
let currentFilterType = 'all';
let currentSortType = 'newest';
let visibleReviewCount = 5;
const LOAD_MORE_STEP = 5;

// ========== HÀM UTILITY ==========
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + 'đ';
}

function calculateDiscount(oldPrice, currentPrice) {
    return Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
}

// ========== HÀM QUẢN LÝ REVIEW ==========
function loadReviews() {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY_REVIEWS) || '[]');
    allReviews = [...reviewsSample, ...stored];
}

function saveReviews() {
    const userReviews = allReviews.filter(r => r.id > 1000); // Chỉ lưu review mới
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(userReviews));
}

function getReviewStats() {
    const total = allReviews.length;
    if (total === 0) return { avg: 0, total: 0, counts: {5:0,4:0,3:0,2:0,1:0} };
    
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    
    allReviews.forEach(r => {
        if (counts[r.rating] !== undefined) counts[r.rating]++;
        sum += r.rating;
    });
    
    return {
        avg: (sum / total).toFixed(1),
        total: total,
        counts: counts
    };
}

function getFilteredReviews() {
    let result = [...allReviews];
    
    // Lọc
    if (currentFilterType !== 'all') {
        const star = parseInt(currentFilterType);
        result = result.filter(r => r.rating === star);
    }
    
    // Sắp xếp
    if (currentSortType === 'likes') {
        result.sort((a, b) => b.likes - a.likes);
    } else if (currentSortType === 'oldest') {
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    return result;
}

// ========== HIỂN THỊ LƯỢT XEM & MUA ==========
function createStatsHTML(productId) {
    // Tăng lượt xem
    let views = parseInt(localStorage.getItem(`product_views_${productId}`) || '0');
    views++;
    localStorage.setItem(`product_views_${productId}`, views);
    
    const buys = parseInt(localStorage.getItem(`product_buys_${productId}`) || '0');
    
    return `
        <div style="display: flex; gap: 20px; padding: 15px; background: #f3f4f6; border-radius: 10px; margin: 15px 0;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 18px;">👁️</span>
                <div>
                    <div style="font-size: 12px; color: #6b7280;">Lượt xem</div>
                    <div style="font-weight: 700; color: #1f2937;">${views.toLocaleString('vi-VN')}</div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 18px;">🛍️</span>
                <div>
                    <div style="font-size: 12px; color: #6b7280;">Lượt mua</div>
                    <div style="font-weight: 700; color: #1f2937;">${buys.toLocaleString('vi-VN')}</div>
                </div>
            </div>
        </div>
    `;
}

// ========== HIỂN THỊ GỢI Ý ==========
function createSuggestHTML() {
    return `
        <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="font-size: 18px; font-weight: 700; color: #1f2937; margin: 0 0 15px 0; display: flex; align-items: center; gap: 8px;">
                <span style="color: #f97316;">🔥</span> Gợi ý mua kèm
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px;">
                ${suggestProducts.map(product => `
                    <div style="border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; transition: all 0.3s; cursor: pointer;">
                        <a href="/category/detail/detail.htm?id=${product.id}" style="text-decoration: none; color: inherit; display: block;">
                            <img src="${product.image}" alt="${product.title}" style="width: 100%; height: 120px; object-fit: cover;">
                            <div style="padding: 10px;">
                                <div style="font-weight: 600; font-size: 12px; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${product.title}</div>
                                <div style="color: #f97316; font-weight: 700; font-size: 13px; margin-top: 4px;">${formatPrice(product.price_current)}</div>
                            </div>
                        </a>
                        <button onclick="addSuggestToCart(event, '${product.title}')" style="width: calc(100% - 4px); margin: 0 2px 2px 2px; padding: 6px; background: #f97316; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">
                            + Thêm
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function addSuggestToCart(event, productName) {
    event.stopPropagation();
    showToast(`✅ Đã thêm ${productName} vào giỏ!`, 'success');
}

// ========== HIỂN THỊ ĐÁNH GIÁ ==========
function createReviewStatsHTML() {
    const stats = getReviewStats();
    const total = stats.total;
    const avg = stats.avg;
    
    return `
        <div style="margin-bottom: 25px;">
            <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 15px 0;">⭐ Đánh Giá Sản Phẩm</h3>
            <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #fef3c7; border-radius: 10px;">
                <div style="text-align: center;">
                    <div style="font-size: 32px; font-weight: 700; color: #f59e0b;">${avg}</div>
                    <div style="font-size: 12px; color: #92400e;">⭐⭐⭐⭐⭐</div>
                    <div style="font-size: 11px; color: #78716c; margin-top: 4px;">${total} đánh giá</div>
                </div>
                <div style="flex: 1;">
                    ${[5,4,3,2,1].map(star => {
                        const count = stats.counts[star];
                        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                        return `
                            <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
                                <span style="font-size: 12px; color: #78716c; width: 50px;">${star} sao</span>
                                <div style="flex: 1; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
                                    <div style="height: 100%; background: #fbbf24; width: ${percentage}%;"></div>
                                </div>
                                <span style="font-size: 12px; color: #78716c; width: 40px; text-align: right;">${count}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
        
        <div style="margin-bottom: 20px; display: flex; gap: 10px; align-items: center;">
            <label style="font-weight: 600; color: #1f2937;">Lọc:</label>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;" id="filterButtons">
                <button onclick="setFilter('all')" class="filter-btn ${currentFilterType === 'all' ? 'active' : ''}" style="padding: 6px 12px; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer; font-weight: 600; background: ${currentFilterType === 'all' ? '#f97316' : 'white'}; color: ${currentFilterType === 'all' ? 'white' : '#1f2937'};">
                    Tất cả (${total})
                </button>
                ${[5,4,3,2,1].map(star => `
                    <button onclick="setFilter('${star}')" class="filter-btn ${currentFilterType === String(star) ? 'active' : ''}" style="padding: 6px 12px; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer; font-weight: 600; background: ${currentFilterType === String(star) ? '#f97316' : 'white'}; color: ${currentFilterType === String(star) ? 'white' : '#1f2937'};">
                        ${star}★ (${stats.counts[star]})
                    </button>
                `).join('')}
            </div>
        </div>
        
        <div style="margin-bottom: 20px; display: flex; gap: 10px; align-items: center;">
            <label style="font-weight: 600; color: #1f2937;">Sắp xếp:</label>
            <select id="sortSelect" onchange="setSort(this.value)" style="padding: 6px 12px; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer; font-weight: 600;">
                <option value="newest" ${currentSortType === 'newest' ? 'selected' : ''}>Mới nhất</option>
                <option value="oldest" ${currentSortType === 'oldest' ? 'selected' : ''}>Cũ nhất</option>
                <option value="likes" ${currentSortType === 'likes' ? 'selected' : ''}>Hữu ích nhất</option>
            </select>
        </div>
    `;
}

function createReviewListHTML() {
    const filtered = getFilteredReviews();
    const displayed = filtered.slice(0, visibleReviewCount);
    
    return `
        <div class="reviews-list">
            ${displayed.map(review => `
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
                    
                    <p style="color: #4b5563; font-size: 13px; line-height: 1.6; margin: 0 0 8px 0;">${review.comment}</p>
                    
                    ${review.image ? `
                        <img src="${review.image}" alt="Review" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px; cursor: pointer;" onclick="openImageViewer('${review.image}')">
                    ` : ''}
                    
                    <div style="display: flex; gap: 12px; font-size: 12px;">
                        <button onclick="toggleReplyInput(${review.id})" style="background: none; border: none; color: #f97316; cursor: pointer; font-weight: 600;">💬 Trả lời</button>
                        <button onclick="likeReview(${review.id})" style="background: none; border: none; color: #f97316; cursor: pointer; font-weight: 600;">👍 Hữu ích (${review.likes})</button>
                    </div>
                    
                    ${review.replies && review.replies.length > 0 ? `
                        <div style="margin-top: 12px; padding-left: 20px; border-left: 2px solid #e5e7eb;">
                            ${review.replies.map(reply => `
                                <div style="padding: 8px 0; font-size: 12px;">
                                    <div style="font-weight: 600; color: #1f2937;">
                                        ${reply.name} 
                                        ${reply.isAdmin ? '<span style="background: #f97316; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin-left: 4px;">QTV</span>' : ''}
                                    </div>
                                    <div style="color: #6b7280; margin-top: 4px;">${reply.content}</div>
                                    <div style="color: #9ca3af; font-size: 10px; margin-top: 2px;">${reply.date}</div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <div id="reply-box-${review.id}" style="display: none; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
                        <input type="text" id="reply-name-${review.id}" placeholder="Tên của bạn..." style="width: 100%; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 8px; font-size: 12px; box-sizing: border-box;">
                        <textarea id="reply-content-${review.id}" placeholder="Viết trả lời..." style="width: 100%; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 8px; font-size: 12px; box-sizing: border-box; min-height: 60px; resize: vertical;"></textarea>
                        <div style="display: flex; gap: 8px;">
                            <button onclick="submitReply(${review.id})" style="flex: 1; padding: 8px; background: #f97316; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px;">Gửi</button>
                            <button onclick="toggleReplyInput(${review.id})" style="flex: 1; padding: 8px; background: #e5e7eb; color: #1f2937; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px;">Hủy</button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        ${filtered.length > visibleReviewCount ? `
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="loadMoreReviews()" style="padding: 10px 30px; background: white; border: 2px solid #e5e7eb; border-radius: 8px; color: #1f2937; font-weight: 600; cursor: pointer;">
                    Xem thêm đánh giá ↓
                </button>
            </div>
        ` : ''}
    `;
}

function createReviewsHTML() {
    return `
        <div class="reviews-section" style="margin: 30px 0; padding: 25px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            ${createReviewStatsHTML()}
            ${createReviewListHTML()}
            
            <div style="text-align: center; margin-top: 25px;">
                <button onclick="openReviewForm()" style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: white; padding: 12px 30px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3); transition: all 0.3s;">
                    ✏️ Viết đánh giá
                </button>
            </div>
        </div>
    `;
}

// ========== HÀM MÃ GIẢM GIÁ ==========
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

// ========== HÀM HIỂN THỊ CHI TIẾT ==========
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
                
                ${createStatsHTML(product.id)}
                
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

        ${createSuggestHTML()}
        ${createReviewsHTML()}
        
        <div id="imageViewer" style="position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: none; align-items: center; justify-content: center; z-index: 10000;">
            <img id="viewerImage" src="" style="max-width: 90%; max-height: 90%; border-radius: 8px;">
            <button onclick="closeImageViewer()" style="position: absolute; top: 20px; right: 20px; background: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 20px;">×</button>
        </div>
    `;
}

// ========== HÀM XỬ LÝ ==========
function setFilter(type) {
    currentFilterType = type;
    visibleReviewCount = 5;
    renderReviews();
}

function setSort(type) {
    currentSortType = type;
    visibleReviewCount = 5;
    renderReviews();
}

function loadMoreReviews() {
    visibleReviewCount += LOAD_MORE_STEP;
    renderReviews();
}

function toggleReplyInput(reviewId) {
    const box = document.getElementById(`reply-box-${reviewId}`);
    if (box) {
        box.style.display = box.style.display === 'none' ? 'block' : 'none';
    }
}

function submitReply(reviewId) {
    const nameVal = document.getElementById(`reply-name-${reviewId}`).value.trim();
    const contentVal = document.getElementById(`reply-content-${reviewId}`).value.trim();
    
    if (!nameVal || !contentVal) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }
    
    const review = allReviews.find(r => r.id === reviewId);
    if (review) {
        if (!review.replies) review.replies = [];
        review.replies.push({
            name: nameVal,
            content: contentVal,
            date: new Date().toLocaleDateString('vi-VN'),
            isAdmin: false
        });
        saveReviews();
        renderReviews();
        showToast('✅ Đã gửi trả lời!', 'success');
    }
}

function likeReview(reviewId) {
    const review = allReviews.find(r => r.id === reviewId);
    if (review) {
        review.likes = (review.likes || 0) + 1;
        saveReviews();
        renderReviews();
    }
}

function openImageViewer(src) {
    const viewer = document.getElementById('imageViewer');
    const img = document.getElementById('viewerImage');
    if (viewer && img) {
        img.src = src;
        viewer.style.display = 'flex';
    }
}

function closeImageViewer() {
    const viewer = document.getElementById('imageViewer');
    if (viewer) {
        viewer.style.display = 'none';
    }
}

function increaseQuantity() {
    const input = document.getElementById('quantity');
    if (input.value < 99) input.value = parseInt(input.value) + 1;
}

function decreaseQuantity() {
    const input = document.getElementById('quantity');
    if (input.value > 1) input.value = parseInt(input.value) - 1;
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
    
    // ⭐ THÊM 2 DÒNG NÀY
    window.updateCartCount();
    window.dispatchEvent(new Event('cartUpdated'));
    
    showToast(`✅ Đã thêm ${quantity} sản phẩm vào giỏ hàng!`, 'success');
}

function buyNow() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const product = window.currentProduct;
    
    if (!product) return;
    
    let cart = [{
        id: product.id,
        title: product.title,
        price: product.price_current,
        quantity: quantity,
        image: product.image || ''
    }];
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // ⭐ THÊM 2 DÒNG NÀY
    window.updateCartCount();
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Tăng lượt mua
    let buys = parseInt(localStorage.getItem(`product_buys_${product.id}`) || '0');
    buys++;
    localStorage.setItem(`product_buys_${product.id}`, buys);
    
    // Ghi nhận mua hàng
    recordPurchase(product.id, product.title);
    
    window.location.href = '/checkout/checkout.htm';
}

function recordPurchase(productId, productTitle) {
    const user = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (!user) return;
    
    try {
        const userObj = JSON.parse(user);
        const purchases = JSON.parse(localStorage.getItem('userPurchases') || '{}');
        if (!purchases[userObj.username]) purchases[userObj.username] = [];
        
        if (!purchases[userObj.username].some(p => p.productId == productId)) {
            purchases[userObj.username].push({
                productId: productId,
                productTitle: productTitle,
                purchaseDate: new Date().toLocaleDateString('vi-VN'),
                quantity: 1
            });
        }
        localStorage.setItem('userPurchases', JSON.stringify(purchases));
    } catch (e) {}
}

function openReviewForm() {
    if (!isUserLoggedIn()) {
        const currentUrl = window.location.href;
        sessionStorage.setItem('redirectAfterLogin', currentUrl);
        localStorage.setItem('redirectAfterLogin', currentUrl);
        alert('❌ Vui lòng đăng nhập để viết đánh giá!');
        window.location.href = '/account/login/login.html#login';
        return;
    }

    if (!hasUserPurchasedProduct(window.currentProduct.id)) {
        alert('❌ Chỉ những khách hàng đã mua sản phẩm này mới có thể đánh giá!');
        return;
    }

    selectedRating = 0;
    currentImageBase64 = null;
    
    const modal = document.createElement('div');
    modal.id = 'reviewModal';
    modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 16px; backdrop-filter: blur(4px);';
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 16px; width: 100%; max-width: 600px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; max-height: 90vh; overflow-y: auto;">
            <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 24px; color: white; position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 28px;">⭐</span>
                    <h2 style="font-size: 22px; font-weight: 700; margin: 0;">Viết Đánh Giá</h2>
                </div>
                <button onclick="closeReviewModal()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 20px;">×</button>
            </div>

            <div style="padding: 24px;">
                <form id="reviewForm" onsubmit="submitReview(event)">
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-weight: 600; color: #1f2937; margin-bottom: 8px;">👤 Tên của bạn</label>
                        <input type="text" id="reviewName" required placeholder="Nhập tên của bạn" style="width: 100%; padding: 10px 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; box-sizing: border-box; cursor: text;" onfocus="this.style.borderColor='#f97316'" onblur="this.style.borderColor='#e5e7eb'">
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-weight: 600; color: #1f2937; margin-bottom: 8px;">⭐ Đánh giá <span id="ratingError" style="color: #dc2626; font-size: 12px; display: none;">(Vui lòng chọn sao)</span></label>
                        <div style="display: flex; gap: 8px;" id="ratingStars">
                            ${[1,2,3,4,5].map(star => `<span data-rating="${star}" style="font-size: 40px; cursor: pointer; color: #d1d5db; user-select: none;">☆</span>`).join('')}
                        </div>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-weight: 600; color: #1f2937; margin-bottom: 8px;">🖼️ Hình ảnh (tùy chọn)</label>
                        <input type="file" id="reviewImage" accept="image/*" style="width: 100%; padding: 8px; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer;">
                        <div id="previewContainer" style="margin-top: 10px;"></div>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-weight: 600; color: #1f2937; margin-bottom: 8px;">💬 Bình luận</label>
                        <textarea id="reviewComment" required placeholder="Chia sẻ trải nghiệm của bạn..." style="width: 100%; padding: 10px 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; box-sizing: border-box; min-height: 100px; font-family: inherit; cursor: text;" onfocus="this.style.borderColor='#f97316'" onblur="this.style.borderColor='#e5e7eb'"></textarea>
                    </div>

                    <div style="display: flex; gap: 12px; margin-top: 20px;">
                        <button type="button" onclick="closeReviewModal()" style="flex: 1; padding: 10px; border: 2px solid #e5e7eb; background: white; color: #6b7280; border-radius: 8px; font-weight: 600; cursor: pointer;">✕ Hủy</button>
                        <button type="submit" style="flex: 1; padding: 10px; background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);">✓ Gửi</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);

    // Xử lý ảnh
    document.getElementById('reviewImage').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                currentImageBase64 = evt.target.result;
                document.getElementById('previewContainer').innerHTML = `<img src="${evt.target.result}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Xử lý rating
    const stars = document.querySelectorAll('#ratingStars span');
    stars.forEach((star) => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            document.getElementById('ratingError').style.display = 'none';
            stars.forEach((s, i) => {
                if (i < selectedRating) {
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
    if (modal) modal.remove();
    selectedRating = 0;
    currentImageBase64 = null;
}

function submitReview(event) {
    event.preventDefault();

    if (selectedRating === 0) {
        document.getElementById('ratingError').style.display = 'inline';
        alert('⚠️ Vui lòng chọn số sao!');
        return false;
    }

    const name = document.getElementById('reviewName').value;
    const comment = document.getElementById('reviewComment').value;

    const newReview = {
        id: Date.now(),
        name: name,
        rating: selectedRating,
        date: new Date().toLocaleDateString('vi-VN'),
        comment: comment,
        avatar: ['👨', '👩', '👨‍💼', '👩‍🔬'][Math.floor(Math.random() * 4)],
        image: currentImageBase64,
        likes: 0,
        replies: []
    };

    allReviews.unshift(newReview);
    saveReviews();

    alert('✅ Cảm ơn bạn đã đánh giá!');
    closeReviewModal();
    renderReviews();
    
    return false;
}

function renderReviews() {
    const reviewsContainer = productDetail.querySelector('.reviews-section');
    if (reviewsContainer) {
        reviewsContainer.innerHTML = createReviewsHTML();
    }
}

function isUserLoggedIn() {
    const userSession = sessionStorage.getItem('currentUser');
    const userLocal = localStorage.getItem('currentUser');
    return (userSession && userSession !== '') || (userLocal && userLocal !== '');
}

function hasUserPurchasedProduct(productId) {
    const userSession = sessionStorage.getItem('currentUser');
    const userLocal = localStorage.getItem('currentUser');
    let user = userSession || userLocal;
    
    if (!user) return false;
    
    try {
        user = JSON.parse(user);
        const purchasesSession = JSON.parse(sessionStorage.getItem('userPurchases') || '{}');
        const purchasesLocal = JSON.parse(localStorage.getItem('userPurchases') || '{}');
        const allPurchases = { ...purchasesLocal, ...purchasesSession };
        const userPurchases = allPurchases[user.username] || [];
        
        return userPurchases.some(p => p.productId == productId);
    } catch (e) {
        return false;
    }
}

function openPromoPopup() {
    const popup = document.createElement('div');
    popup.id = 'promoPopup';
    popup.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 16px;';
    
    popup.innerHTML = `
        <div style="background: white; border-radius: 20px; width: 100%; max-width: 900px; max-height: 85vh; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
            <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 20px; color: white; position: relative;">
                <button onclick="closePromoPopup()" style="position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 20px;">×</button>
                <h2 style="font-size: 24px; font-weight: 700; margin: 0;">🎫 Kho Mã Giảm Giá</h2>
            </div>

            <div style="padding: 20px; overflow-y: auto; max-height: calc(85vh - 100px);">
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
                    ${promoCodes.map(promo => `
                        <div style="background: white; border-radius: 12px; border: 2px solid #fed7aa; overflow: hidden;">
                            <div style="background: linear-gradient(135deg, #f97316, #dc2626); padding: 20px; color: white; text-align: center;">
                                <span style="font-size: 48px;">${promo.image}</span>
                                <h3 style="margin: 10px 0 0 0; font-weight: 700;">${promo.title}</h3>
                                <p style="margin: 5px 0; font-size: 12px; opacity: 0.9;">${promo.description}</p>
                            </div>
                            <div style="padding: 15px;">
                                ${promo.codes ? `
                                    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px;">
                                        ${promo.codes.map(item => `
                                            <div style="flex: 1; border: 1px solid #fed7aa; border-radius: 6px; padding: 6px; text-align: center;">
                                                <div style="font-size: 10px; font-weight: 700; color: #f97316;">${item.code}</div>
                                                <div style="font-size: 9px; color: #6b7280;">${item.discount}</div>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : `
                                    <div style="border: 2px dashed #fed7aa; border-radius: 8px; padding: 10px; margin-bottom: 10px; background: #fffbeb; text-align: center;">
                                        <div style="font-family: monospace; font-weight: 700; color: #1f2937;">${promo.code}</div>
                                    </div>
                                `}
                                <button onclick="copyPromoCode('${promo.codes ? promo.codes[0].code : promo.code}')" style="width: 100%; background: #f97316; color: white; padding: 8px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 12px;">LẤY MÃ</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
}

function closePromoPopup() {
    const popup = document.getElementById('promoPopup');
    if (popup) popup.remove();
}

function copyPromoCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        localStorage.setItem(STORAGE_KEY_PROMO, code);
        alert(`✅ Đã sao chép mã: ${code}\nMã này sẽ tự động áp dụng trong giỏ hàng!`);
        closePromoPopup();
    });
}

function showToast(message, type = 'success') {
    let toastBox = document.getElementById('toast-box');
    if (!toastBox) {
        toastBox = document.createElement('div');
        toastBox.id = 'toast-box';
        toastBox.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000;';
        document.body.appendChild(toastBox);
    }
    
    const toast = document.createElement('div');
    toast.style.cssText = 'background: #10b981; color: white; padding: 16px 24px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s ease;';
    toast.textContent = message;
    toastBox.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// ========== KHỞI TẠO ==========
const getDetailProduct = async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');

        if (!productId) throw new Error('Không tìm thấy ID sản phẩm');

        const response = await fetch('/data/product.json');
        if (!response.ok) throw new Error('Không thể tải dữ liệu sản phẩm');

        const data = await response.json();
        const allProducts = [...data.sale, ...data.newsale];
        const product = allProducts.find(p => p.id == productId);

        if (product) {
            window.currentProduct = product;
            loadReviews();
            productDetail.innerHTML = createDetailHTML(product);
            breadcrumbProduct.textContent = product.title;
            document.title = product.title + ' - Chi tiết sản phẩm';
        } else {
            productDetail.innerHTML = '<div class="error">Không tìm thấy sản phẩm này!</div>';
        }
    } catch (error) {
        console.error('Lỗi:', error.message);
        productDetail.innerHTML = `<div class="error">Lỗi: ${error.message}</div>`;
    }
};

getDetailProduct();