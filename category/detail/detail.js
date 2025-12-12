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
let suggestBoxVisible = false;
let suggestBoxMinimized = false;
let autoShowTimeout = null;

function createSuggestHTML() {
    return `
        <!-- Suggest Box -->
        <div id="suggestBox" style="position: fixed; right: 0; bottom: 0; width: 100%; max-width: 360px; background: white; border-radius: 20px 20px 0 0; box-shadow: 0 -4px 32px rgba(0,0,0,0.25); z-index: 99999; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); max-height: 480px; overflow: hidden; margin: 0; transform: translateY(100%); opacity: 0; pointer-events: none;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 14px 16px; color: white; display: flex; align-items: center; justify-content: space-between; border-radius: 20px 20px 0 0; position: sticky; top: 0; z-index: 10;">
                <h3 style="font-size: 14px; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 16px;">🔥</span> <span>Mua kèm</span>
                </h3>
                <button onclick="toggleSuggestBox()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.3s; padding: 0;">−</button>
            </div>
            
            <!-- Products List -->
            <div style="padding: 10px; max-height: 400px; overflow-y: auto;">
                ${suggestProducts.map(product => `
                    <div style="display: flex; align-items: center; gap: 8px; padding: 8px 6px; border-bottom: 1px solid #f3f4f6; transition: background 0.3s;">
                        <a href="/category/detail/detail.htm?id=${product.id}" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                            <img src="${product.image}" alt="${product.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb; flex-shrink: 0;">
                            <div style="flex: 1; min-width: 0;">
                                <div style="font-weight: 600; font-size: 11px; color: #1f2937; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${product.title}</div>
                                <div style="color: #f97316; font-weight: 700; font-size: 12px;">${formatPrice(product.price_current)}</div>
                            </div>
                        </a>
                        <button onclick="addSuggestToCart(event, '${product.title}')" style="width: 30px; height: 30px; background: #f97316; color: white; border: none; border-radius: 50%; cursor: pointer; font-size: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 6px rgba(249, 115, 22, 0.3); transition: all 0.2s; padding: 0;">
                            +
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Floating Button (Khi Thu Gọn) -->
        <div id="suggestFloatingBtn" style="position: fixed; right: 16px; bottom: 50px; width: 52px; height: 52px; background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: white; border: none; border-radius: 50%; cursor: pointer; font-size: 24px; display: none; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4); transition: all 0.3s; z-index: 99998; padding: 0;" onclick="toggleSuggestBox()" title="Gợi ý mua kèm">
            🔥
        </div>

        <style>
            @media (max-width: 480px) {
                #suggestBox {
                    max-width: 100% !important;
                    max-height: 420px !important;
                    border-radius: 20px 20px 0 0 !important;
                }
                
                #suggestBox > div:first-child {
                    padding: 12px 14px !important;
                }
                
                #suggestFloatingBtn {
                    bottom: 50px !important;
                    right: 12px !important;
                    width: 48px !important;
                    height: 48px !important;
                    font-size: 20px !important;
                }
            }

            @media (max-width: 768px) {
                #suggestBox {
                    max-width: 85% !important;
                    right: 7.5% !important;
                }
            }
        </style>
    `;
}

function showSuggestBox() {
    const box = document.getElementById('suggestBox');
    const floatingBtn = document.getElementById('suggestFloatingBtn');
    
    if (!box) return;
    
    box.style.transform = 'translateY(0)';
    box.style.opacity = '1';
    box.style.pointerEvents = 'auto';
    
    if (floatingBtn) {
        floatingBtn.style.display = 'none';
    }
    
    suggestBoxVisible = true;
    suggestBoxMinimized = false;
}

function minimizeSuggestBox() {
    const box = document.getElementById('suggestBox');
    const floatingBtn = document.getElementById('suggestFloatingBtn');
    
    if (!box) return;
    
    // Thu gọn box
    box.style.transform = 'translateY(100%)';
    box.style.opacity = '0';
    box.style.pointerEvents = 'none';
    
    // Hiển thị nút floating
    if (floatingBtn) {
        floatingBtn.style.display = 'flex';
    }
    
    suggestBoxVisible = false;
    suggestBoxMinimized = true;
}

function toggleSuggestBox() {
    if (suggestBoxMinimized || !suggestBoxVisible) {
        showSuggestBox();
    } else {
        minimizeSuggestBox();
    }
}

function initSuggestBox() {
    console.log('🔍 Khởi tạo suggest box...');
    
    const suggestBox = document.getElementById('suggestBox');
    if (!suggestBox) {
        console.warn('❌ Suggest box không tìm thấy trong DOM!');
        return;
    }
    
    console.log('✅ Tìm thấy suggest box!');
    
    // ⭐ KHI VÀO TRANG: CHỈ HIỂN THỊ FLOATING BUTTON THÔI (KHÔNG HIỆN SUGGEST BOX)
    // Đặt trạng thái ban đầu
    minimizeSuggestBox();
    
    // Show when scroll down 60%
    let hasShown = false;
    window.addEventListener('scroll', () => {
        if (hasShown) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        
        console.log('📊 Scroll: ' + scrollPercent.toFixed(1) + '%');
        
        if (scrollPercent >= 60 && !suggestBoxVisible) {
            console.log('✅ Đã cuộn 60%, hiển thị suggest box...');
            showSuggestBox();
            hasShown = true;
        }
    });
}

function addSuggestToCart(event, productName) {
    event.stopPropagation();
    
    // Tìm sản phẩm trong suggestProducts
    const suggestProduct = suggestProducts.find(p => p.title === productName);
    if (!suggestProduct) {
        showToast('❌ Không tìm thấy sản phẩm!', 'error');
        return;
    }
    
    // Lấy giỏ hàng hiện tại
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItem = cart.find(item => item.id === suggestProduct.id);
    
    if (existingItem) {
        // Nếu có rồi thì tăng số lượng
        existingItem.quantity += 1;
    } else {
        // Nếu chưa có thì thêm mới
        cart.push({
            id: suggestProduct.id,
            title: suggestProduct.title,
            price: suggestProduct.price_current,
            quantity: 1,
            image: suggestProduct.image
        });
    }
    
    // Lưu vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // ⭐ CẬP NHẬT ICON GIỎ HÀNG NGAY LẬP TỨC
    window.updateCartCount();
    window.dispatchEvent(new Event('cartUpdated'));
    
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
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="font-weight: 600; color: #1f2937; font-size: 14px;">${review.name}</div>
                                ${review.verified ? '<span style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600;">✅ Đã mua</span>' : ''}
                            </div>
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
        
        <div class="detail-section-separator"></div>
        
        ${createRelatedProductsHTML(window.allProductData, product)}
        
        <div id="imageViewer" style="position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: none; align-items: center; justify-content: center; z-index: 10000;">
            <img id="viewerImage" src="" style="max-width: 90%; max-height: 90%; border-radius: 8px;">
            <button onclick="closeImageViewer()" style="position: absolute; top: 20px; right: 20px; background: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 20px;">×</button>
        </div>
    `;
}

// ========== SẢN PHẨM LIÊN QUAN - TOP 5 LƯỢT XEM ==========
function createRelatedProductsHTML(allData, currentProduct) {
    // Tìm danh mục sản phẩm hiện tại
    const isInSale = allData.sale.some(p => p.id === currentProduct.id);
    const categoryProducts = isInSale ? allData.sale : allData.newsale;
    
    // Lấy các sản phẩm khác từ cùng danh mục
    const relatedProducts = categoryProducts
        .filter(p => p.id !== currentProduct.id)
        .map(product => {
            const views = parseInt(localStorage.getItem(`product_views_${product.id}`) || '0');
            return { ...product, views };
        })
        .sort((a, b) => b.views - a.views) // Sắp xếp theo lượt xem giảm dần
        .slice(0, 5); // Lấy top 5

    if (relatedProducts.length === 0) return '';

    return `
        <section class="section-related-products">
            <div class="related-container">
                <div class="related-header-block">
                    <h2 class="related-title">
                        <span class="related-icon">🔗</span>
                        Sản Phẩm Liên Quan
                    </h2>
                    <p class="related-subtitle">Top 5 sản phẩm được xem nhiều nhất</p>
                </div>

                <div class="related-products-grid">
                    ${relatedProducts.map((product, index) => {
                        const discount = calculateDiscount(product.price_old, product.price_current);
                        const avgRating = (3.8 + Math.random()).toFixed(1);
                        const reviewCount = Math.floor(Math.random() * 80) + 5;
                        const foodEmojis = ['🍗', '🍔', '🍕', '🌮', '🍜', '🥘', '🍱', '🍲'];
                        const emoji = foodEmojis[product.id % foodEmojis.length];
                        
                        return `
                            <a href="/category/detail/detail.htm?id=${product.id}" class="related-product-card" style="text-decoration: none; color: inherit;">
                                <div class="related-card-badge">#${index + 1}</div>
                                
                                <div class="related-product-img-wrapper">
                                    <div class="related-product-img">
                                        ${product.image ? 
                                            `<img src="${product.image}" alt="${product.title}" loading="lazy">` : 
                                            `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 60px; background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);">${emoji}</div>`
                                        }
                                    </div>
                                    
                                    ${discount > 0 ? `
                                        <div class="related-discount-tag">-${discount}%</div>
                                    ` : ''}
                                    
                                    <div class="related-views-badge">
                                        <span style="font-size: 12px;">👁️</span>
                                        <span>${product.views.toLocaleString('vi-VN')}</span>
                                    </div>
                                </div>

                                <div class="related-product-content">
                                    <h3 class="related-product-name">${product.title}</h3>
                                    
                                    <div class="related-rating-block">
                                        <div class="related-stars">
                                            ${[...Array(5)].map((_, i) => `
                                                <span class="star ${i < Math.floor(avgRating) ? 'filled' : 'empty'}">★</span>
                                            `).join('')}
                                        </div>
                                        <span class="related-rating-value">${avgRating}</span>
                                        <span class="related-review-text">(${reviewCount})</span>
                                    </div>

                                    <div class="related-price-group">
                                        <span class="related-price-now">${formatPrice(product.price_current)}</span>
                                        ${product.price_old !== product.price_current ? `
                                            <span class="related-price-old">${formatPrice(product.price_old)}</span>
                                        ` : ''}
                                    </div>

                                    <button class="related-add-btn" onclick="event.preventDefault(); event.stopPropagation(); addRelatedToCart(${product.id}, '${product.title}', ${product.price_current});">
                                        🛒 Thêm giỏ
                                    </button>
                                </div>
                            </a>
                        `;
                    }).join('')}
                </div>
            </div>
        </section>
    `;
}

// Hàm thêm sản phẩm liên quan vào giỏ
function addRelatedToCart(productId, productTitle, productPrice) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            title: productTitle,
            price: productPrice,
            quantity: 1,
            image: ''
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    window.updateCartCount();
    window.dispatchEvent(new Event('cartUpdated'));
    
    showToast(`✅ Đã thêm ${productTitle} vào giỏ!`, 'success');
}

// ========== LẤY DỮ LIỆU CHI TIẾT SẢN PHẨM ==========
const getDetailProduct = async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');

        if (!productId) throw new Error('Không tìm thấy ID sản phẩm');

        const response = await fetch('/data/product.json');
        if (!response.ok) throw new Error('Không thể tải dữ liệu sản phẩm');

        const data = await response.json();
        window.allProductData = data; // ⭐ THÊM DÒNG NÀY - LƯU DỮ LIỆU
        const allProducts = [...data.sale, ...data.newsale];
        const product = allProducts.find(p => p.id == productId);

        if (product) {
            window.currentProduct = product;
            loadReviews();
            productDetail.innerHTML = createDetailHTML(product);
            breadcrumbProduct.textContent = product.title;
            document.title = product.title + ' - Chi tiết sản phẩm';
            
            setTimeout(() => {
                console.log('Khởi tạo suggest box...');
                initSuggestBox();
            }, 300);
        } else {
            productDetail.innerHTML = '<div class="error">Không tìm thấy sản phẩm này!</div>';
        }
    } catch (error) {
        console.error('Lỗi:', error.message);
        productDetail.innerHTML = `<div class="error">Lỗi: ${error.message}</div>`;
    }
};

getDetailProduct();

// ========== HÀM BỔ SUNG - KIỂM TRA ĐĂNG NHẬP & MUA HÀNG ==========
function checkUserAuth() {
    const userSession = sessionStorage.getItem('currentUser');
    const userLocal = localStorage.getItem('currentUser');
    
    if (!userSession && !userLocal) {
        return { loggedIn: false, user: null };
    }
    
    try {
        const user = userSession ? JSON.parse(userSession) : JSON.parse(userLocal);
        return { loggedIn: true, user };
    } catch (e) {
        return { loggedIn: false, user: null };
    }
}

function checkUserPurchased(productId) {
    const auth = checkUserAuth();
    if (!auth.loggedIn) return false;

    const username = auth.user.username;
    
    // Kiểm tra sessionStorage
    const purchasesSession = JSON.parse(sessionStorage.getItem('userPurchases') || '{}');
    const purchasesLocal = JSON.parse(localStorage.getItem('userPurchases') || '{}');
    
    // Kết hợp cả 2
    const allPurchases = { ...purchasesLocal, ...purchasesSession };
    const userPurchases = allPurchases[username] || [];
    
    // ✅ SỬA: Kiểm tra 'productId' thay vì 'id'
    return userPurchases.some(p => p.productId == productId || p.id == productId);
}

// ========== HÀM REVIEW FORM - CÓ KIỂM TRA ==========
function openReviewForm() {
    const auth = checkUserAuth();
    
    // ⭐ KIỂM TRA ĐĂNG NHẬP
    if (!auth.loggedIn) {
        const modal = document.createElement('div');
        modal.id = 'loginPromptModal';
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: fadeIn 0.3s ease;
            padding: 16px;
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 16px; padding: 30px; max-width: 400px; width: 100%; text-align: center; animation: slideUp 0.3s ease; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div style="font-size: 60px; margin-bottom: 16px;">🔐</div>
                <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #1f2937; font-weight: 700;">Vui lòng đăng nhập</h2>
                <p style="margin: 0 0 24px 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                    Bạn cần đăng nhập để viết đánh giá sản phẩm
                </p>
                
                <div style="display: flex; gap: 10px; flex-direction: column;">
                    <button onclick="window.location.href='/account/login/login.html'" style="padding: 12px 24px; background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.3s; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);">
                        ✅ Đi tới Đăng nhập
                    </button>
                    <button onclick="document.getElementById('loginPromptModal').remove()" style="padding: 12px 24px; background: #e5e7eb; color: #1f2937; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.3s;">
                        ✕ Hủy
                    </button>
                </div>
            </div>
            
            <style>
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                
                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                @media (max-width: 480px) {
                    div[style*="max-width: 400px"] {
                        padding: 24px 20px !important;
                    }
                }
            </style>
        `;
        
        document.body.appendChild(modal);
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
        return;
    }
    
    // ⭐ KIỂM TRA ĐÃ MUA SẢN PHẨM
    if (!checkUserPurchased(window.currentProduct.id)) {
        showToast('❌ Bạn phải mua sản phẩm này trước khi có thể đánh giá!', 'error');
        return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'reviewFormModal';
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: flex-end;
        z-index: 10001;
        animation: fadeIn 0.3s ease;
        padding: 0;
    `;
    
    modal.innerHTML = `
        <div style="background: white; width: 100%; max-height: 90vh; border-radius: 20px 20px 0 0; padding: 20px; overflow-y: auto; box-shadow: 0 -4px 32px rgba(0,0,0,0.15);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; position: sticky; top: 0; background: white; z-index: 1;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 700;">✏️ Viết đánh giá</h3>
                <button onclick="document.getElementById('reviewFormModal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; padding: 0;">×</button>
            </div>
            
            <!-- Thông tin người dùng -->
            <div style="background: #f3f4f6; padding: 12px; border-radius: 8px; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 20px;">✅</span>
                <div style="min-width: 0;">
                    <div style="font-size: 12px; color: #6b7280;">Đăng nhập với tư cách:</div>
                    <div style="font-weight: 600; color: #1f2937; word-break: break-all;">${auth.user.username}</div>
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Tên của bạn</label>
                <input type="text" id="reviewName" placeholder="Nhập tên..." value="${auth.user.username}" style="width: 100%; padding: 10px; border: 1px solid #e5e7eb; border-radius: 8px; box-sizing: border-box; font-size: 14px;">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Đánh giá</label>
                <div id="ratingStars" style="display: flex; gap: 8px; font-size: 28px;">
                    ${[1,2,3,4,5].map(star => `
                        <span class="rating-star" data-rating="${star}" style="cursor: pointer; opacity: 0.4; transition: all 0.2s; user-select: none;" onclick="selectRating(${star})">⭐</span>
                    `).join('')}
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Bình luận</label>
                <textarea id="reviewComment" placeholder="Chia sẻ trải nghiệm của bạn..." style="width: 100%; padding: 10px; border: 1px solid #e5e7eb; border-radius: 8px; box-sizing: border-box; font-size: 14px; min-height: 100px; resize: vertical;"></textarea>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">📸 Tải ảnh lên (Tùy chọn)</label>
                <div style="border: 2px dashed #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.3s; background: white;" id="uploadArea" onclick="document.getElementById('reviewImage').click();">
                    <div style="font-size: 32px; margin-bottom: 8px;">📷</div>
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">Nhấn để chọn ảnh hoặc kéo thả</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #9ca3af;">PNG, JPG, GIF (Tối đa 2MB)</p>
                </div>
                <input type="file" id="reviewImage" accept="image/*" style="display: none;" onchange="handleImageUpload(event)">
                <div id="imagePreview" style="margin-top: 12px; display: none;">
                    <img id="previewImg" src="" style="max-width: 100%; max-height: 200px; border-radius: 8px; object-fit: cover;">
                    <button type="button" onclick="removeImage()" style="display: block; width: 100%; margin-top: 8px; padding: 8px; background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px;">Xóa ảnh</button>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <button onclick="submitReviewForm()" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.3s; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);">Gửi đánh giá</button>
                <button onclick="document.getElementById('reviewFormModal').remove()" style="flex: 1; padding: 12px; background: #e5e7eb; color: #1f2937; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.3s;">Hủy</button>
            </div>
        </div>
        
        <style>
            @keyframes slideUp {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            
            @media (max-width: 480px) {
                #reviewFormModal > div {
                    border-radius: 16px 16px 0 0 !important;
                    max-height: 95vh !important;
                    padding: 16px !important;
                }
                
                #reviewFormModal h3 {
                    font-size: 16px !important;
                }
                
                #reviewFormModal label {
                    font-size: 13px !important;
                }
                
                #reviewFormModal input,
                #reviewFormModal textarea,
                #reviewFormModal button {
                    font-size: 13px !important;
                }
                
                #ratingStars {
                    font-size: 24px !important;
                }
            }
            
            @media (max-width: 768px) {
                #reviewFormModal > div {
                    max-width: 100% !important;
                }
            }
        </style>
    `;
    
    document.body.appendChild(modal);
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };

    // Xử lý kéo thả ảnh
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#f97316';
        uploadArea.style.background = '#fef3c7';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#e5e7eb';
        uploadArea.style.background = 'white';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#e5e7eb';
        uploadArea.style.background = 'white';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            document.getElementById('reviewImage').files = files;
            handleImageUpload({ target: { files: files } });
        }
    });
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;

    // Kiểm tra kích thước file (2MB)
    if (file.size > 2 * 1024 * 1024) {
        showToast('❌ Ảnh quá lớn! Tối đa 2MB', 'error');
        document.getElementById('reviewImage').value = '';
        return;
    }

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
        showToast('❌ Vui lòng chọn file ảnh!', 'error');
        document.getElementById('reviewImage').value = '';
        return;
    }

    // Đọc file thành Base64
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImageBase64 = e.target.result;
        
        // Hiển thị preview
        const preview = document.getElementById('imagePreview');
        const img = document.getElementById('previewImg');
        img.src = currentImageBase64;
        preview.style.display = 'block';
        
        showToast('✅ Ảnh đã được chọn!', 'success');
    };
    
    reader.onerror = () => {
        showToast('❌ Lỗi khi đọc file!', 'error');
    };

    reader.readAsDataURL(file);
}

function removeImage() {
    currentImageBase64 = null;
    document.getElementById('reviewImage').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    showToast('✅ Đã xóa ảnh!', 'success');
}

function submitReviewForm() {
    const auth = checkUserAuth();
    const name = document.getElementById('reviewName').value.trim();
    const comment = document.getElementById('reviewComment').value.trim();
    
    if (!name) {
        showToast('❌ Vui lòng nhập tên!', 'error');
        return;
    }
    if (!comment) {
        showToast('❌ Vui lòng viết bình luận!', 'error');
        return;
    }
    if (selectedRating === 0) {
        showToast('❌ Vui lòng chọn đánh giá!', 'error');
        return;
    }
    
    const newReview = {
        id: Date.now(),
        name,
        rating: selectedRating,
        date: new Date().toLocaleDateString('vi-VN'),
        comment,
        avatar: '👤',
        image: currentImageBase64,
        likes: 0,
        replies: [],
        // ⭐ THÊM THÔNG TIN NGƯỜI DÙNG
        username: auth.user.username,
        userId: auth.user.username,
        verified: true // ✅ Đánh dấu là người đã mua
    };
    
    allReviews.push(newReview);
    saveReviews();
    
    document.getElementById('reviewFormModal').remove();
    
    const reviewsSection = document.querySelector('.reviews-section');
    if (reviewsSection) {
        reviewsSection.innerHTML = createReviewsHTML();
    }
    
    selectedRating = 0;
    currentImageBase64 = null;
    showToast('✅ Cảm ơn bạn đã đánh giá!', 'success');
}

// ========== HÀM QUẢN LÝ SỐ LƯỢNG ==========
function increaseQuantity() {
    const input = document.getElementById('quantity');
    if (input.value < 99) {
        input.value = parseInt(input.value) + 1;
    }
}

function decreaseQuantity() {
    const input = document.getElementById('quantity');
    if (input.value > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// ========== THÊM VÀO GIỎ HÀNG ==========
function addToCart() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const product = window.currentProduct;
    
    if (!product) {
        showToast('❌ Không tìm thấy sản phẩm!', 'error');
        return;
    }
    
    // Lấy giỏ hàng hiện tại
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        // Nếu có rồi thì tăng số lượng
        existingItem.quantity += quantity;
    } else {
        // Nếu chưa có thì thêm mới
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price_current,
            quantity: quantity,
            image: product.image || ''
        });
    }
    
    // Lưu vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // ⭐ CẬP NHẬT ICON GIỎ HÀNG NGAY LẬP TỨC
    window.updateCartCount();
    window.dispatchEvent(new Event('cartUpdated'));
    
    showToast(`✅ Đã thêm ${quantity} ${product.title} vào giỏ!`, 'success');
}

// ========== MUA NGAY ==========
function buyNow() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const product = window.currentProduct;
    
    if (!product) {
        showToast('❌ Không tìm thấy sản phẩm!', 'error');
        return;
    }
    
    // Thêm vào giỏ hàng trước
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
    
    // Cập nhật giỏ hàng
    window.updateCartCount();
    
    // Chuyển hướng đến trang thanh toán
    setTimeout(() => {
        window.location.href = '/checkout/checkout.htm';
    }, 300);
}

// ========== TOAST NOTIFICATION ==========
function showToast(message, type = 'info') {
    // Kiểm tra xem có toast container chưa
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(toastContainer);
    }
    
    const toast = document.createElement('div');
    toast.style.cssText = `
        padding: 12px 16px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Thiết lập màu dựa vào type
    if (type === 'success') {
        toast.style.background = '#dcfce7';
        toast.style.color = '#166534';
        toast.style.borderLeft = '4px solid rgba(255,255,255,0.3)';
    } else if (type === 'error') {
        toast.style.background = '#fee2e2';
        toast.style.color = '#991b1b';
        toast.style.borderLeft = '4px solid rgba(255,255,255,0.3)';
    } else {
        toast.style.background = '#dbeafe';
        toast.style.color = '#0c4a6e';
        toast.style.borderLeft = '4px solid rgba(255,255,255,0.3)';
    }
    
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    // Tự động xóa sau 3 giây
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Thêm CSS animation
if (!document.getElementById('toastStyles')) {
    const style = document.createElement('style');
    style.id = 'toastStyles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ========== HÀM QUẢN LÝ ĐÁNH GIÁ - CHỌN SAO ==========
function selectRating(star) {
    selectedRating = star;
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach(s => {
        const rating = parseInt(s.dataset.rating);
        if (rating <= star) {
            s.style.opacity = '1';
        } else {
            s.style.opacity = '0.4';
        }
    });
}

// ========== HÀM QUẢN LÝ REVIEW - TRẢ LỜI ==========
function toggleReplyInput(reviewId) {
    const replyBox = document.getElementById(`reply-box-${reviewId}`);
    if (replyBox) {
        replyBox.style.display = replyBox.style.display === 'none' ? 'block' : 'none';
    }
}

function submitReply(reviewId) {
    const nameInput = document.getElementById(`reply-name-${reviewId}`);
    const contentInput = document.getElementById(`reply-content-${reviewId}`);
    
    const name = nameInput.value.trim();
    const content = contentInput.value.trim();
    
    if (!name) {
        showToast('❌ Vui lòng nhập tên!', 'error');
        return;
    }
    if (!content) {
        showToast('❌ Vui lòng viết nội dung trả lời!', 'error');
        return;
    }
    
    const review = allReviews.find(r => r.id === reviewId);
    if (review) {
        if (!review.replies) review.replies = [];
        
        review.replies.push({
            name: name,
            content: content,
            date: new Date().toLocaleDateString('vi-VN'),
            isAdmin: false
        });
        
        saveReviews();
        
        const reviewsSection = document.querySelector('.reviews-section');
        if (reviewsSection) {
            reviewsSection.innerHTML = createReviewsHTML();
        }
        
        showToast('✅ Đã gửi trả lời!', 'success');
    }
}

function likeReview(reviewId) {
    const review = allReviews.find(r => r.id === reviewId);
    if (review) {
        review.likes = (review.likes || 0) + 1;
        saveReviews();
        
        const reviewsSection = document.querySelector('.reviews-section');
        if (reviewsSection) {
            reviewsSection.innerHTML = createReviewsHTML();
        }
        
        showToast('👍 Cảm ơn bạn đã đánh giá hữu ích!', 'success');
    }
}

// ========== HÀM LỌC & SẮP XẾP ĐÁNH GIÁ ==========
function setFilter(filter) {
    currentFilterType = filter;
    visibleReviewCount = 5; // Reset về đầu khi lọc
    
    const reviewsSection = document.querySelector('.reviews-section');
    if (reviewsSection) {
        reviewsSection.innerHTML = createReviewsHTML();
    }
}

function setSort(sort) {
    currentSortType = sort;
    visibleReviewCount = 5; // Reset về đầu khi sắp xếp
    
    const reviewsSection = document.querySelector('.reviews-section');
    if (reviewsSection) {
        reviewsSection.innerHTML = createReviewsHTML();
    }
}

function loadMoreReviews() {
    visibleReviewCount += LOAD_MORE_STEP;
    
    const reviewsSection = document.querySelector('.reviews-section');
    if (reviewsSection) {
        reviewsSection.innerHTML = createReviewsHTML();
    }
}

// ========== HÀM QUẢN LÝ ẢNH ==========
function openImageViewer(imageSrc) {
    const viewer = document.getElementById('imageViewer');
    const img = document.getElementById('viewerImage');
    if (viewer && img) {
        img.src = imageSrc;
        viewer.style.display = 'flex';
    }
}

function closeImageViewer() {
    const viewer = document.getElementById('imageViewer');
    if (viewer) {
        viewer.style.display = 'none';
    }
}

// ========== HÀM HIỂN THỊ MÃ GIẢM GIÁ ==========
function openPromoPopup() {
    const modal = document.createElement('div');
    modal.id = 'promoModal';
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: flex-end;
        z-index: 10001;
        animation: fadeIn 0.3s ease;
        padding: 0;
    `;
    
    modal.innerHTML = `
        <div style="background: white; width: 100%; max-height: 90vh; border-radius: 20px 20px 0 0; padding: 20px; overflow-y: auto; box-shadow: 0 -4px 32px rgba(0,0,0,0.15);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; position: sticky; top: 0; background: white; z-index: 1;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 700;">🎫 Kho Mã Giảm Giá</h3>
                <button onclick="document.getElementById('promoModal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; padding: 0;">×</button>
            </div>
            
            ${promoCodes.map(promo => `
                <div style="background: linear-gradient(135deg, ${promo.color}); color: white; padding: 16px; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid rgba(255,255,255,0.3);">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                        <div style="font-size: 32px;">${promo.image}</div>
                        <div style="flex: 1;">
                            <h4 style="margin: 0; font-weight: 700; font-size: 16px;">${promo.title}</h4>
                            <span style="background: rgba(255,255,255,0.3); padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; display: inline-block;">${promo.badge}</span>
                        </div>
                    </div>
                    
                    <p style="margin: 10px 0; font-size: 13px; line-height: 1.5;">${promo.description}</p>
                    
                    ${promo.code ? `
                        <div style="background: rgba(0,0,0,0.15); padding: 12px; border-radius: 8px; margin-top: 10px;">
                            <div style="font-size: 11px; color: rgba(255,255,255,0.8); margin-bottom: 6px;">Mã giảm giá:</div>
                            <div style="display: flex; gap: 8px; align-items: center;">
                                <input type="text" value="${promo.code}" readonly style="flex: 1; padding: 8px; background: white; color: #1f2937; border: none; border-radius: 6px; font-weight: 700; font-family: monospace;">
                                <button onclick="copyPromoCode('${promo.code}')" style="padding: 8px 12px; background: white; color: #1f2937; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; white-space: nowrap;">📋 Copy</button>
                            </div>
                        </div>
                    ` : ''}
                    
                    ${promo.codes ? `
                        <div style="background: rgba(0,0,0,0.15); padding: 12px; border-radius: 8px; margin-top: 10px;">
                            <div style="font-size: 11px; color: rgba(255,255,255,0.8); margin-bottom: 8px;">Mã giảm giá:</div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                ${promo.codes.map(c => `
                                    <div style="display: flex; gap: 8px; align-items: center;">
                                        <input type="text" value="${c.code}" readonly style="flex: 1; padding: 8px; background: white; color: #1f2937; border: none; border-radius: 6px; font-weight: 700; font-family: monospace;">
                                        <span style="background: white; color: #10b981; padding: 6px 10px; border-radius: 6px; font-weight: 600; font-size: 11px;">${c.discount}</span>
                                        <button onclick="copyPromoCode('${c.code}')" style="padding: 8px 12px; background: white; color: #1f2937; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; white-space: nowrap;">📋</button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
            
            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <button onclick="document.getElementById('promoModal').remove()" style="padding: 12px 30px; background: #f3f4f6; color: #1f2937; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Đóng</button>
            </div>
        </div>
        
        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @media (max-width: 480px) {
                #promoModal > div {
                    padding: 16px !important;
                }
                
                #promoModal h3 {
                    font-size: 16px !important;
                }
                
                #promoModal h4 {
                    font-size: 14px !important;
                }
            }
        </style>
    `;
    
    document.body.appendChild(modal);
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

function copyPromoCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showToast(`✅ Đã copy mã: ${code}`, 'success');
    }).catch(() => {
        showToast('❌ Lỗi copy mã!', 'error');
    });
}