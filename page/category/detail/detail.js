// ========== KHỞI TẠO BIẾN CHÍNH ==========
const productDetail = document.getElementById('productDetail');
const breadcrumbProduct = document.getElementById('breadcrumbProduct');
let currentProduct = null;
let selectedRating = 0;

// ========== STORAGE KEYS ==========
const STORAGE_KEY_REVIEWS = 'productReviews';
const STORAGE_KEY_PROMO = 'appliedPromoCode';

// ========== UTILITY FUNCTIONS ==========
function formatPrice(price) {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', '').trim() + ' ₫';
}

function calculateDiscount(oldPrice, newPrice) {
    if (!oldPrice || oldPrice <= 0) return 0;
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
}

// ========== REVIEW MANAGER (ĐƯA LÊN TRƯỚC ĐỂ TRÁNH LỖI INIT) ==========
const ReviewManager = {
    data: [],
    displayCount: 5,
    currentFilter: 'all',
    productId: null,

    // 1. Khởi tạo
    init(prodId) {
        this.productId = prodId;
        this.loadData();
        this.renderAll();
    },

    // 2. Load dữ liệu (Mẫu + LocalStorage)
    loadData() {
        const stored = JSON.parse(localStorage.getItem(`reviews_${this.productId}`) || '[]');
        
        // Dữ liệu mẫu (Seeding) nếu chưa có review nào cho sản phẩm này
        if (stored.length === 0) {
            const seedData = [
                {
                    id: 1, name: 'Vợ thầy Sinh', rating: 5, date: '2024-12-10', verified: true,
                    content: 'Sản phẩm rất tuyệt vời! Chất lượng tốt, giao hàng nhanh. Mì trộn rất đậm đà. Tôi luôn tin tưởng các rò của chồng tôi',
                    avatar: '/assets/reviewfake/vothaysinh.jpg', images: [], likes: 12,
                    reply: { content: 'Cảm ơn bạn đã ủng hộ Tiệm!', date: '2024-12-11' }
                },
                {
                    id: 2, name: 'Vũ Trọng Sinh', rating: 4, date: '2024-12-08', verified: true,
                    content: 'Hàng ngon và chất lượng, 10 điểm xứng đáng.',
                    avatar: '/assets/reviewfake/thaysinh.jpg', images: ['/assets/reviewfake/anh10diem.jpg'], likes: 5
                }
            ];
            this.data = seedData;
            this.saveData(); // Lưu seed data lần đầu
        } else {
            this.data = stored;
        }
    },

    saveData() {
        localStorage.setItem(`reviews_${this.productId}`, JSON.stringify(this.data));
    },

    // 3. Render Tổng hợp (Controller)
    renderAll() {
        // Chỉ render nếu các element tồn tại trong DOM
        if (!document.getElementById('avg-rating-score')) return;

        const stats = this.calculateStats();
        this.renderDashboard(stats);
        this.renderGallery();
        this.renderList();
        
        // Cập nhật text header
        const totalEl = document.getElementById('header-rating-count');
        const scoreEl = document.getElementById('header-rating-score');
        const headerStars = document.getElementById('header-stars');

        if(totalEl) totalEl.textContent = stats.total;
        if(scoreEl) scoreEl.textContent = stats.avg;
        if(headerStars) headerStars.innerHTML = this.getStarHTML(Math.round(stats.avg));
    },

    // 4. Tính toán thống kê
    calculateStats() {
        const total = this.data.length;
        if (total === 0) return { avg: 0, total: 0, counts: {1:0,2:0,3:0,4:0,5:0} };

        let sum = 0;
        const counts = {1:0, 2:0, 3:0, 4:0, 5:0};
        
        this.data.forEach(r => {
            sum += r.rating;
            counts[r.rating]++;
        });

        return {
            avg: (sum / total).toFixed(1),
            total: total,
            counts: counts
        };
    },

    // 5. Render Dashboard Progress Bars
    renderDashboard(stats) {
        const avgScore = document.getElementById('avg-rating-score');
        if(avgScore) avgScore.textContent = stats.avg;
        
        const totalCount = document.getElementById('total-reviews-count');
        if(totalCount) totalCount.textContent = stats.total;
        
        // Render Stars Big
        const starsContainer = document.getElementById('avg-rating-stars');
        if(starsContainer) starsContainer.innerHTML = this.getStarHTML(Math.round(stats.avg));

        // Render Bars
        const barsContainer = document.getElementById('rating-progress-bars');
        if(barsContainer) {
            barsContainer.innerHTML = [5, 4, 3, 2, 1].map(star => {
                const count = stats.counts[star];
                const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
                return `
                    <div class="progress-row">
                        <span style="width: 30px;">${star} <i class="fa-solid fa-star" style="font-size:10px"></i></span>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: ${percent}%"></div>
                        </div>
                        <span style="width: 30px; text-align: right;">${count}</span>
                    </div>
                `;
            }).join('');
        }
    },

    // 6. Render Gallery
    renderGallery() {
        const container = document.getElementById('review-gallery-container');
        const track = document.getElementById('review-gallery-track');
        
        if(!container || !track) return;

        // Lấy tất cả ảnh từ các review
        let allImages = [];
        this.data.forEach(r => {
            if (r.images && r.images.length > 0) {
                allImages = [...allImages, ...r.images];
            }
        });

        if (allImages.length > 0) {
            container.style.display = 'block';
            track.innerHTML = allImages.map(img => `
                <img src="${img}" class="g-img" onclick="openImageViewer('${img}')" alt="Review Image">
            `).join('');
        } else {
            container.style.display = 'none';
        }
    },

    // 7. Render List Review (Có lọc & phân trang)
    renderList() {
        const listContainer = document.getElementById('review-list-container');
        if(!listContainer) return;

        // Filter
        let filtered = this.data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Mới nhất trước
        
        if (this.currentFilter === 'image') {
            filtered = filtered.filter(r => r.images && r.images.length > 0);
        } else if (this.currentFilter !== 'all') {
            filtered = filtered.filter(r => r.rating == this.currentFilter);
        }

        // Cập nhật button "Load More"
        const loadMoreBtn = document.getElementById('review-pagination');
        if(loadMoreBtn) {
            if (filtered.length > this.displayCount) {
                loadMoreBtn.style.display = 'block';
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }

        // Slice display
        const displayData = filtered.slice(0, this.displayCount);

        if (displayData.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-reviews">
                    <i class="fa-regular fa-comment-dots"></i>
                    <p>Chưa có đánh giá nào theo tiêu chí này.</p>
                </div>`;
            return;
        }

        listContainer.innerHTML = displayData.map(r => this.createCardHTML(r)).join('');
        
        // Cập nhật active class cho filter buttons
        document.querySelectorAll('.r-filter-btn').forEach(btn => btn.classList.remove('active'));
        // Logic tìm button active
        const btns = document.querySelectorAll('.r-filter-btn');
        if(btns.length > 0) {
            if(this.currentFilter === 'all') btns[0].classList.add('active');
            if(this.currentFilter === 'image' && btns[1]) btns[1].classList.add('active');
            if(!isNaN(this.currentFilter)) {
            // Mapping star filter
            const starMap = {'5':2, '4':3, '3':4, '2':5, '1':6};
            if(btns[starMap[this.currentFilter]]) btns[starMap[this.currentFilter]].classList.add('active');
            }
        }
    },

    // Helper: Tạo HTML cho 1 card
    createCardHTML(review) {
        // Avatar logic: Nếu không có ảnh, tạo avatar chữ cái
        let avatarHTML = '';
        if (review.avatar) {
            avatarHTML = `<img src="${review.avatar}" class="rc-avatar" alt="${review.name}">`;
        } else {
            const firstLetter = review.name.charAt(0).toUpperCase();
            const colors = ['#f87171', '#fb923c', '#4ade80', '#60a5fa', '#a78bfa'];
            const color = colors[review.name.length % colors.length];
            avatarHTML = `<div class="rc-avatar" style="background:${color}; color:white;">${firstLetter}</div>`;
        }

        const imagesHTML = review.images && review.images.length > 0 
            ? `<div class="rc-images">${review.images.map(img => `<img src="${img}" class="rc-img-thumb" onclick="openImageViewer('${img}')">`).join('')}</div>`
            : '';

        const replyHTML = review.reply 
            ? `<div class="rc-reply">
                <div class="reply-header">
                    <span class="shop-badge">Shop phản hồi</span>
                    <span class="rc-date">${this.formatDate(review.reply.date)}</span>
                </div>
                <div class="rc-content">${review.reply.content}</div>
               </div>` 
            : '';

        return `
            <div class="review-card">
                <div class="rc-header">
                    <div class="rc-user">
                        ${avatarHTML}
                        <div class="rc-info">
                            <h4>${review.name}</h4>
                            ${review.verified ? '<div class="rc-verified"><i class="fa-solid fa-circle-check"></i> Đã mua hàng</div>' : ''}
                            <div class="rc-rating">${this.getStarHTML(review.rating)}</div>
                        </div>
                    </div>
                    <div class="rc-date">${this.formatDate(review.date)}</div>
                </div>
                <div class="rc-content">${review.content}</div>
                ${imagesHTML}
                <div class="rc-footer">
                    <button class="rc-action" onclick="ReviewManager.likeReview(${review.id}, this)">
                        <i class="fa-regular fa-thumbs-up"></i> Hữu ích <span>(${review.likes || 0})</span>
                    </button>
                    </div>
                ${replyHTML}
            </div>
        `;
    },

    // Actions
    likeReview(id, btn) {
        const review = this.data.find(r => r.id === id);
        if (review) {
            review.likes = (review.likes || 0) + 1;
            this.saveData();
            
            // UI Update ngay lập tức để mượt
            btn.classList.add('active');
            btn.querySelector('span').textContent = `(${review.likes})`;
            btn.querySelector('i').className = 'fa-solid fa-thumbs-up';
            btn.removeAttribute('onclick'); 
        }
    },

    addNewReview(reviewObj) {
        this.data.unshift(reviewObj);
        this.saveData();
        this.currentFilter = 'all'; 
        this.renderAll();
        showToast('✅ Đánh giá của bạn đã được đăng!', 'success');
    },

    // Utilities
    getStarHTML(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) stars += '<i class="fa-solid fa-star"></i>';
            else stars += '<i class="fa-regular fa-star" style="color:#ddd"></i>';
        }
        return stars;
    },

    formatDate(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays === 1) return 'Hôm qua';
        if (diffDays < 7) return `${diffDays} ngày trước`;
        return date.toLocaleDateString('vi-VN');
    }
};

// ========== HIỂN THỊ LƯỢT XEM & MUA ==========
function createStatsHTML(productId) {
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

function createSuggestHTML() {
    if (typeof suggestProducts === 'undefined') return ''; // Safety check

    return `
        <div id="suggestBox" style="position: fixed; right: 0; bottom: 0; width: 100%; max-width: 360px; background: white; border-radius: 20px 20px 0 0; box-shadow: 0 -4px 32px rgba(0,0,0,0.25); z-index: 99999; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); max-height: 480px; overflow: hidden; margin: 0; transform: translateY(100%); opacity: 0; pointer-events: none;">
            <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 14px 16px; color: white; display: flex; align-items: center; justify-content: space-between; border-radius: 20px 20px 0 0; position: sticky; top: 0; z-index: 10;">
                <h3 style="font-size: 14px; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 16px;">🔥</span> <span>Mua kèm</span>
                </h3>
                <button onclick="toggleSuggestBox()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.3s; padding: 0;">−</button>
            </div>
            <div style="padding: 10px; max-height: 400px; overflow-y: auto;">
                ${suggestProducts.map(product => `
                    <div style="display: flex; align-items: center; gap: 8px; padding: 8px 6px; border-bottom: 1px solid #f3f4f6; transition: background 0.3s;">
                        <a href="/page/category/detail/detail.htm?id=${product.id}" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                            <img src="${product.image}" alt="${product.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb; flex-shrink: 0;">
                            <div style="flex: 1; min-width: 0;">
                                <div style="font-weight: 600; font-size: 11px; color: #1f2937; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${product.title}</div>
                                <div style="color: #f97316; font-weight: 700; font-size: 12px;">${formatPrice(product.price_current)}</div>
                            </div>
                        </a>
                        <button onclick="addSuggestToCart(event, '${product.title}')" style="width: 30px; height: 30px; background: #f97316; color: white; border: none; border-radius: 50%; cursor: pointer; font-size: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 6px rgba(249, 115, 22, 0.3); transition: all 0.2s; padding: 0;">+</button>
                    </div>
                `).join('')}
            </div>
        </div>
        <div id="suggestFloatingBtn" style="position: fixed; right: 16px; bottom: 50px; width: 52px; height: 52px; background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: white; border: none; border-radius: 50%; cursor: pointer; font-size: 24px; display: none; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4); transition: all 0.3s; z-index: 99998; padding: 0;" onclick="toggleSuggestBox()" title="Gợi ý mua kèm">🔥</div>
        <style>
            @media (max-width: 480px) {
                #suggestBox { max-width: 100% !important; max-height: 420px !important; border-radius: 20px 20px 0 0 !important; }
                #suggestBox > div:first-child { padding: 12px 14px !important; }
                #suggestFloatingBtn { bottom: 50px !important; right: 12px !important; width: 48px !important; height: 48px !important; font-size: 20px !important; }
            }
            @media (max-width: 768px) { #suggestBox { max-width: 85% !important; right: 7.5% !important; } }
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
    if (floatingBtn) floatingBtn.style.display = 'none';
    suggestBoxVisible = true;
    suggestBoxMinimized = false;
}

function minimizeSuggestBox() {
    const box = document.getElementById('suggestBox');
    const floatingBtn = document.getElementById('suggestFloatingBtn');
    if (!box) return;
    box.style.transform = 'translateY(100%)';
    box.style.opacity = '0';
    box.style.pointerEvents = 'none';
    if (floatingBtn) floatingBtn.style.display = 'flex';
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
    if (!suggestBox) return;
    minimizeSuggestBox();
    let hasShown = false;
    window.addEventListener('scroll', () => {
        if (hasShown) return;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        if (scrollPercent >= 60 && !suggestBoxVisible) {
            showSuggestBox();
            hasShown = true;
        }
    });
}

function addSuggestToCart(event, productName) {
    event.stopPropagation();
    const suggestProduct = suggestProducts.find(p => p.title === productName);
    if (!suggestProduct) {
        showToast('Không tìm thấy sản phẩm!', 'error');
        return;
    }
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === suggestProduct.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: suggestProduct.id,
            title: suggestProduct.title,
            price: suggestProduct.price_current,
            quantity: 1,
            image: suggestProduct.image
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.updateCartCount();
    window.dispatchEvent(new Event('cartUpdated'));
    showToast(`Đã thêm ${productName} vào giỏ!`, 'success');
}


// ========== HÀM HIỂN THỊ CHI TIẾT ==========
function createDetailHTML(product) {
    const discount = calculateDiscount(product.price_old, product.price_current);
    const statusText = product.status === 'soldout' ? 'Hết hàng' : 'Còn hàng';
    const statusClass = product.status === 'soldout' ? '' : 'available';
    const foodEmojis = ['🍗', '🍔', '🍕', '🌮', '🍜', '🥘', '🍱', '🍲'];
    const randomEmoji = foodEmojis[product.id % foodEmojis.length];
    
    // Chỉ tạo phần suggestBox và popup ảnh, các phần khác đã có trong HTML tĩnh
    return `
        ${createSuggestHTML()}
        <div id="imageViewer" style="position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: none; align-items: center; justify-content: center; z-index: 10000;">
            <img id="viewerImage" src="" style="max-width: 90%; max-height: 90%; border-radius: 8px;">
            <button onclick="closeImageViewer()" style="position: absolute; top: 20px; right: 20px; background: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 20px;">×</button>
        </div>
    `;
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
        window.allProductData = data;
        const allProducts = [
          ...(data.micay || []),
          ...(data.mitron || []),
          ...(data.anvat || []),
          ...(data.ankem || []),
          ...(data.douong || [])
        ];
        const product = allProducts.find(p => p.id == productId);

        if (product) {
            window.currentProduct = product;
            
            // Khởi tạo Review Manager
            if (ReviewManager) {
                ReviewManager.init(product.id);
            }
            
            // Render HTML chính
            if (productDetail) {
                productDetail.innerHTML = createDetailHTML(product);
            }

            // ⭐ FIX LỖI Ở ĐÂY: Kiểm tra xem breadcrumbProduct có tồn tại không trước khi gán
            if (breadcrumbProduct) {
                breadcrumbProduct.textContent = product.title;
            } else {
                // Fallback: Nếu không tìm thấy ID, thử tìm theo class (dựa trên HTML cũ của bạn)
                const fallbackBreadcrumb = document.querySelector('.breadcrumb .current');
                if (fallbackBreadcrumb) fallbackBreadcrumb.textContent = product.title;
            }
            
            // Update UI Static
            updateDetailPageUI(product, parseInt(localStorage.getItem(`product_views_${productId}`) || '0'));

            setTimeout(() => {
                console.log('Khởi tạo suggest box...');
                initSuggestBox();
            }, 300);
        } else {
            if (productDetail) productDetail.innerHTML = '<div class="error">Không tìm thấy sản phẩm này!</div>';
        }
    } catch (error) {
        console.error('Lỗi:', error.message);
        if (productDetail) productDetail.innerHTML = `<div class="error">Lỗi: ${error.message}</div>`;
    }
};

// ========== HÀM LOAD SẢN PHẨM TỪ URL PARAMETER ==========
async function loadProductFromURL() {
    try {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');
        if (!productId) {
            console.warn('⚠️ Không tìm thấy ID sản phẩm trong URL');
            return;
        }
        const response = await fetch('/data/product.json');
        if (!response.ok) throw new Error('Không thể tải dữ liệu sản phẩm');
        const data = await response.json();
        const allProducts = [
          ...(data.micay || []),
          ...(data.mitron || []),
          ...(data.anvat || []),
          ...(data.ankem || []),
          ...(data.douong || [])
        ];
        const product = allProducts.find(p => p.id == productId);
        if (product) {
            currentProduct = product;
            let views = parseInt(localStorage.getItem(`product_views_${productId}`) || '0');
            views++;
            localStorage.setItem(`product_views_${productId}`, views);
            updateDetailPageUI(product, views);
            
            // Init reviews nếu getDetailProduct chưa chạy
            if(ReviewManager) ReviewManager.init(product.id);

            console.log('✅ Đã tải sản phẩm:', product.title);
        }
    } catch (error) {
        console.error('❌ Lỗi khi tải sản phẩm:', error);
    }
}

// ========== HÀM CẬP NHẬT UI VỚI DỮ LIỆU SẢN PHẨM ==========
function updateDetailPageUI(product, views) {
    document.title = product.title + ' - Tiệm Ăn Vặt';
    
    const mainImg = document.querySelector('.main-image-frame img');
    if (mainImg) {
        mainImg.src = product.image || 'https://via.placeholder.com/600x600/f5f5f5/999';
        mainImg.alt = product.title;
    }
    
// Cập nhật tên sản phẩm ở cột bên phải (H2)
    const pdNameElement = document.querySelector('.pd-name');
    if (pdNameElement) pdNameElement.textContent = product.title;
    
    // Cập nhật tiêu đề chính to đùng ở trên cùng (H1)
    const mainTitleElement = document.querySelector('.page-main-title') || document.getElementById('mainTitle');
    if (mainTitleElement) mainTitleElement.innerHTML = product.title.replace('\n', '<br>'); // Hỗ trợ xuống dòng nếu có
    
    const priceNewElement = document.querySelector('.price-new');
    if (priceNewElement) priceNewElement.textContent = formatPrice(product.price_current);
    
    const priceOldElement = document.querySelector('.price-old');
    if (priceOldElement) priceOldElement.textContent = formatPrice(product.price_old);
    
    // View Count
    const viewCountElement = document.getElementById('view-count');
    if (viewCountElement) viewCountElement.textContent = views.toLocaleString('vi-VN');
    
    // Buy Count
    const buyCount = parseInt(localStorage.getItem(`product_buys_${product.id}`) || '0');
    const buyCountElement = document.getElementById('buy-count');
    if (buyCountElement) buyCountElement.textContent = buyCount.toLocaleString('vi-VN');
    
    // ============ CẬP NHẬT THÊM TỪ JSON ============
    // Description
    const descText = document.querySelector('.desc-text');
    if (descText && product.description) {
        descText.innerHTML = `<i style="color: #666; font-size: 12px; margin-bottom: 5px; display:block;">* Hình ảnh mang tính chất minh họa.</i>
                             <p>${product.description}</p>`;
    }
    
    // Rating & Sold
    if (product.rating !== undefined) {
        const ratingScore = document.getElementById('header-rating-score');
        if (ratingScore) ratingScore.textContent = product.rating.toFixed(1);
        
        // Render stars
        const headerStars = document.getElementById('header-stars');
        if (headerStars) {
            const fullStars = Math.floor(product.rating);
            const hasHalfStar = product.rating % 1 !== 0;
            let starsHTML = '';
            
            for (let i = 0; i < fullStars; i++) {
                starsHTML += '<i class="fa-solid fa-star"></i>';
            }
            if (hasHalfStar) {
                starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
            }
            for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
                starsHTML += '<i class="fa-regular fa-star"></i>';
            }
            headerStars.innerHTML = starsHTML;
        }
    }
    
    if (product.sold !== undefined) {
        const soldInfo = document.querySelector('.sold-count') || 
                        document.querySelector('[data-sold]') ||
                        document.createElement('span');
        if (soldInfo) soldInfo.textContent = `Đã bán: ${product.sold.toLocaleString('vi-VN')}`;
    }
    
    // Quantity (Stock)
    if (product.quantity !== undefined) {
        const stockBadge = document.querySelector('.stock-badge');
        if (stockBadge) {
            if (product.quantity > 0) {
                stockBadge.textContent = `Còn ${product.quantity} sản phẩm`;
                stockBadge.classList.add('in-stock');
                stockBadge.classList.remove('out-of-stock');
            } else {
                stockBadge.textContent = 'Hết hàng';
                stockBadge.classList.remove('in-stock');
                stockBadge.classList.add('out-of-stock');
            }
        }
    }
    
    // Options (Độ cay, Thêm topping, etc)
    if (product.options && product.options.length > 0) {
        const optionsContainer = document.querySelector('.options-container');
        if (optionsContainer) {
            let optionsHTML = '';
            
            product.options.forEach((option, idx) => {
                optionsHTML += `
                    <div class="option-group">
                        <span class="option-title">${option.name}:</span>
                        <div class="tags-wrapper">
                `;
                
                if (option.choices && option.choices.length > 0) {
                    option.choices.forEach((choice, choiceIdx) => {
                        const isChecked = choiceIdx === 0 ? 'checked' : '';
                        optionsHTML += `
                            <label class="tag-item">
                                <input type="radio" name="option_${idx}" value="${choice}" ${isChecked}>
                                <span>${choice}</span>
                            </label>
                        `;
                    });
                }
                
                optionsHTML += `
                        </div>
                    </div>
                `;
            });
            
            optionsContainer.innerHTML = optionsHTML;
        }
    } else {
        // Ẩn options container nếu không có options
        const optionsContainer = document.querySelector('.options-container');
        if (optionsContainer) {
            optionsContainer.style.display = 'none';
        }
    }
    
    // Sticky Bar (Kiểm tra kỹ vì có thể element này chưa render)
    const stickyImg = document.getElementById('sticky-img');
    if (stickyImg) stickyImg.src = product.image || 'https://via.placeholder.com/60x60/f5f5f5/999';
    
    const stickyName = document.getElementById('sticky-name');
    if (stickyName) stickyName.textContent = product.title;
    
    const stickyPrice = document.getElementById('sticky-price');
    if (stickyPrice) stickyPrice.textContent = formatPrice(product.price_current);
    
    // Modal
    const mImg = document.getElementById('m-img');
    if (mImg) mImg.src = product.image || 'https://via.placeholder.com/400x400/f5f5f5/999';
    
    const mName = document.getElementById('m-name');
    if (mName) mName.textContent = product.title;
}

// ========== HÀM KIỂM TRA ĐĂNG NHẬP ==========
function checkUserLogin() {
    const userSession = sessionStorage.getItem('currentUser');
    const userLocal = localStorage.getItem('currentUser');
    if (!userSession && !userLocal) {
        showToast('Vui lòng đăng nhập để tiếp tục', 'error');
        setTimeout(() => {
            window.location.href = '/page/account/login/login.html';
        }, 1000);
        return false;
    }
    return true;
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => el.textContent = cartCount);
}

function getSelectedOptions() {
    const options = [];
    const optionInputs = document.querySelectorAll('.option-group input[type="radio"]:checked');
    optionInputs.forEach(input => {
        const optionName = input.name;
        const optionGroup = input.closest('.option-group');
        const optionTitle = optionGroup?.querySelector('.option-title')?.textContent?.replace(':', '').trim();
        if (optionTitle && input.value) {
            options.push({
                name: optionTitle,
                value: input.value
            });
        }
    });
    return options;
}

function addToCartAction() {
    const quantity = parseInt(document.querySelector('.qty-input')?.value || 1);
    if (!currentProduct) {
        showToast('Lỗi: Không tìm thấy sản phẩm', 'error');
        return;
    }
    
    const selectedOptions = getSelectedOptions();
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Tạo unique key kết hợp ID và options để phân biệt các sản phẩm khác nhau
    const optionKey = selectedOptions.length > 0 ? JSON.stringify(selectedOptions) : '';
    const cartItemKey = `${currentProduct.id}_${optionKey}`;
    
    const existingItem = cart.find(item => {
        const itemOptionKey = item.selectedOptions ? JSON.stringify(item.selectedOptions) : '';
        return item.id === currentProduct.id && itemOptionKey === optionKey;
    });
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: currentProduct.id,
            title: currentProduct.title,
            price: currentProduct.price_current,
            quantity: quantity,
            image: currentProduct.image,
            selectedOptions: selectedOptions.length > 0 ? selectedOptions : null
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    window.dispatchEvent(new Event('cartUpdated'));
    showToast(` Đã thêm ${quantity} sản phẩm vào giỏ hàng!`, 'success');
    const modal = document.getElementById('modal-cart-overlay');
    if (modal) modal.classList.remove('active');
}

function triggerMainBuy() {
    if (!checkUserLogin()) return;
    const quantity = parseInt(document.querySelector('.qty-input')?.value || 1);
    if (!currentProduct) {
        showToast('Lỗi: Không tìm thấy sản phẩm', 'error');
        return;
    }
    
    const selectedOptions = getSelectedOptions();
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const optionKey = selectedOptions.length > 0 ? JSON.stringify(selectedOptions) : '';
    const existingItem = cart.find(item => {
        const itemOptionKey = item.selectedOptions ? JSON.stringify(item.selectedOptions) : '';
        return item.id === currentProduct.id && itemOptionKey === optionKey;
    });
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: currentProduct.id,
            title: currentProduct.title,
            price: currentProduct.price_current,
            quantity: quantity,
            image: currentProduct.image,
            selectedOptions: selectedOptions.length > 0 ? selectedOptions : null
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Tăng buy count
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    if (productId) {
        let buys = parseInt(localStorage.getItem(`product_buys_${productId}`) || '0');
        buys++;
        localStorage.setItem(`product_buys_${productId}`, buys);
    }
    window.location.href = '/page/checkout/checkout.htm';
}

function cartAction() {
    addToCartAction();
    setTimeout(() => {
        window.location.href = '/page/cart/cart.htm';
    }, 300);
}

// ========== HÀM GỬI ĐÁNH GIÁ (CẬP NHẬT) ==========
function submitReviewForm() {
    // 1. Validate
    if (selectedRating === 0) {
        showToast('Vui lòng chọn số sao đánh giá!', 'error');
        return;
    }
    const content = document.getElementById('reviewComment').value.trim();
    if (!content) {
        showToast(' Vui lòng nhập nội dung đánh giá!', 'error');
        return;
    }

    // 2. Check product
    if (!window.currentProduct) {
        showToast('Không tìm thấy sản phẩm!', 'error');
        return;
    }

    const auth = checkUserAuth();
    const name = document.getElementById('reviewName').value.trim() || (auth.loggedIn ? auth.user.username : 'Ẩn danh');
    
    // 3. Tạo object review
    const newReview = {
        id: Date.now(),
        name: name,
        rating: selectedRating,
        date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
        content: content,
        avatar: null,
        images: currentImageBase64 ? [currentImageBase64] : [],
        likes: 0,
        verified: auth.loggedIn,
        reply: null
    };

    console.log('📝 Đánh giá mới:', newReview); // Debug log
    console.log('🆔 Product ID:', window.currentProduct.id); // Debug log

    // 4. Add via Manager (nó sẽ tự lưu vào localStorage)
    ReviewManager.addNewReview(newReview);
    
    // 5. Reset & Close
    selectedRating = 0;
    currentImageBase64 = null;
    closeReviewForm();

    // 6. Kiểm tra lưu thành công
    setTimeout(() => {
        const saved = JSON.parse(localStorage.getItem(`reviews_${window.currentProduct.id}`) || '[]');
        console.log('✅ Đánh giá đã lưu:', saved);
    }, 100);
}

// ========== HÀM TOGGLE LIKE ==========
function toggleLike(element) {
    const likeCount = element.querySelector('.like-count');
    if (likeCount) {
        const count = parseInt(likeCount.textContent);
        likeCount.textContent = count + 1;
        element.style.color = '#f97316';
        element.removeAttribute('onclick'); // Prevent multiple clicks
    }
}

function scrollToReviews(event) {
    if (event) event.preventDefault();
    const reviewSection = document.getElementById('review-section');
    if (reviewSection) {
        reviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function closeModal() {
    const modal = document.getElementById('modal-cart-overlay');
    if (modal) modal.classList.remove('active');
}

function closeImageViewer() {
    const lightbox = document.getElementById('img-lightbox');
    if (lightbox) lightbox.classList.remove('active');
    const viewer = document.getElementById('imageViewer');
    if (viewer) viewer.style.display = 'none';
}

// ⭐ THÊM HÀM OPENIMAGEVIEWER
function openImageViewer(imgSrc) {
    const viewer = document.getElementById('imageViewer');
    const viewerImage = document.getElementById('viewerImage');
    if (viewer && viewerImage) {
        viewerImage.src = imgSrc;
        viewer.style.display = 'flex';
    }
}

function openZoom(imgSrc) {
    const lightbox = document.getElementById('img-lightbox');
    const boxImg = document.getElementById('lightbox-src');
    if (lightbox && boxImg) {
        boxImg.src = imgSrc;
        lightbox.classList.add('active');
    }
}

function openPromoModal() {
    if (typeof window.openPromotionModal === 'function') {
        window.openPromotionModal();
    } else {
        showToast('Không tìm thấy mã khuyến mãi', 'error');
    }
}

function showToast(message, type = 'success') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 10px;';
        document.body.appendChild(toastContainer);
    }
    const toast = document.createElement('div');
    toast.style.cssText = `
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Gọi hàm load sản phẩm khi trang load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        loadProductFromURL();
        updateCartCount();
    });
} else {
    loadProductFromURL();
    updateCartCount();
}


// ========== CHECK AUTH HELPER ==========
function checkUserAuth() {
    const userSession = sessionStorage.getItem('currentUser');
    const userLocal = localStorage.getItem('currentUser');
    if (!userSession && !userLocal) return { loggedIn: false, user: null };
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
    const purchasesSession = JSON.parse(sessionStorage.getItem('userPurchases') || '{}');
    const purchasesLocal = JSON.parse(localStorage.getItem('userPurchases') || '{}');
    const allPurchases = { ...purchasesLocal, ...purchasesSession };
    const userPurchases = allPurchases[username] || [];
    return userPurchases.some(p => p.productId == productId || p.id == productId);
}

// ========== REVIEW FORM MODAL ==========
let currentImageBase64 = null; // Biến lưu ảnh upload

function openReviewForm() {
    const auth = checkUserAuth();
    if (!auth.loggedIn) {
        showLoginPrompt();
        return;
    }

    // ⭐ THÊM KIỂM TRA MÌNH MUA HÀNG
    if (!checkUserPurchased(window.currentProduct.id)) {
        const modal = document.createElement('div');
        modal.style.cssText = `position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 10002; display: flex; align-items: center; justify-content: center;`;
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 12px; text-align: center; max-width: 380px; width: 90%;">
                <i class="fa-solid fa-shopping-bag" style="font-size: 50px; color: #ff6b35; margin-bottom: 15px;"></i>
                <h3 style="margin: 0 0 10px; color: #333;">Chỉ khách hàng đã mua mới được đánh giá</h3>
                <p style="color: #666; margin-bottom: 20px; font-size: 14px;">Bạn cần mua sản phẩm này trước khi có thể viết đánh giá.</p>
                <div style="display: flex; gap: 10px;">
                    <button onclick="this.closest('div').parentElement.parentElement.remove()" style="flex: 1; padding: 12px; border: 1px solid #ddd; background: #fff; border-radius: 6px; cursor: pointer; font-weight: 500;">Đóng</button>
                    <button onclick="addToCartAction(); this.closest('div').parentElement.parentElement.remove();" style="flex: 1; padding: 12px; background: #ff6b35; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">Mua ngay</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return;
    }
    
    const oldModal = document.getElementById('reviewFormModal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'reviewFormModal';
    modal.className = 'review-modal-overlay';
    
    modal.innerHTML = `
        <div class="review-modal-box" onclick="event.stopPropagation()">
            <div class="rm-header">
                <h3>✏️ Viết đánh giá</h3>
                <button class="rm-close" onclick="closeReviewForm()">×</button>
            </div>
            
            <div class="rm-body">
                <div class="rm-user-info">
                    <div class="rm-user-avatar">👤</div>
                    <div>
                        <div style="font-size: 12px; color: #666;">Đánh giá bởi:</div>
                        <div style="font-weight: 700; color: #333;">${auth.user.username}</div>
                    </div>
                </div>

                <div class="rm-group" style="text-align: center;">
                    <label class="rm-label">Bạn cảm thấy sản phẩm thế nào?</label>
                    <div class="rm-stars" id="ratingStars">
                        <i class="fa-solid fa-star rm-star" data-value="1" onclick="selectRating(1)"></i>
                        <i class="fa-solid fa-star rm-star" data-value="2" onclick="selectRating(2)"></i>
                        <i class="fa-solid fa-star rm-star" data-value="3" onclick="selectRating(3)"></i>
                        <i class="fa-solid fa-star rm-star" data-value="4" onclick="selectRating(4)"></i>
                        <i class="fa-solid fa-star rm-star" data-value="5" onclick="selectRating(5)"></i>
                    </div>
                    <div id="ratingText" style="font-size: 14px; font-weight: 600; color: #ff6b35; height: 20px;"></div>
                </div>

                <div class="rm-group">
                    <label class="rm-label">Tên hiển thị</label>
                    <input type="text" id="reviewName" class="rm-input" value="${auth.user.username}">
                </div>

                <div class="rm-group">
                    <label class="rm-label">Chia sẻ cảm nhận của bạn</label>
                    <textarea id="reviewComment" class="rm-textarea" placeholder="Chất lượng sản phẩm, thái độ phục vụ, thời gian giao hàng..."></textarea>
                </div>

                <div class="rm-group">
                    <label class="rm-label">Thêm hình ảnh (Tùy chọn)</label>
                    <div class="rm-upload" id="uploadArea" onclick="document.getElementById('reviewImage').click();">
                        <i class="fa-solid fa-camera rm-upload-icon"></i>
                        <div style="font-size: 13px; color: #666;">Nhấn để chọn hoặc kéo thả ảnh vào đây</div>
                    </div>
                    <input type="file" id="reviewImage" accept="image/*" style="display: none;" onchange="handleImageUpload(event)">
                    
                    <div id="imagePreview" class="rm-preview-container" style="display:none">
                        <img id="previewImg" class="rm-preview-img" src="">
                        <button type="button" class="rm-remove-img" onclick="removeImage()">×</button>
                    </div>
                </div>
            </div>

            <div class="rm-footer">
                <button class="rm-btn rm-btn-cancel" onclick="closeReviewForm()">Hủy bỏ</button>
                <button class="rm-btn rm-btn-submit" onclick="submitReviewForm()">Gửi đánh giá</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });
    modal.onclick = (e) => {
        if (e.target === modal) closeReviewForm();
    };
    setupDragAndDrop();
}

function closeReviewForm() {
    const modal = document.getElementById('reviewFormModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// ⭐ FIX: ĐÂY LÀ HÀM SELECT RATING DUY NHẤT (ĐÃ XÓA CÁI TRÙNG)
function selectRating(star) {
    selectedRating = star; // Lưu vào biến global
    const stars = document.querySelectorAll('.rm-star');
    const texts = ["Rất tệ 😡", "Tệ 😞", "Bình thường 😐", "Hài lòng 🙂", "Tuyệt vời 😍"];
    
    stars.forEach(s => {
        const val = parseInt(s.dataset.value);
        if (val <= star) {
            s.classList.add('active');
            s.style.color = '#ffc107';
        } else {
            s.classList.remove('active');
            s.style.color = '#ccc';
        }
    });

    const textDiv = document.getElementById('ratingText');
    if (textDiv) textDiv.textContent = texts[star - 1]; // ✅ Kiểm tra null
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        currentImageBase64 = e.target.result;
        const previewImg = document.getElementById('previewImg');
        const previewContainer = document.getElementById('imagePreview');
        if(previewImg && previewContainer) {
            previewImg.src = currentImageBase64;
            previewContainer.style.display = 'block';
        }
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    currentImageBase64 = null;
    document.getElementById('reviewImage').value = "";
    document.getElementById('imagePreview').style.display = 'none';
}

function showLoginPrompt() {
    const modal = document.createElement('div');
    modal.style.cssText = `position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 10002; display: flex; align-items: center; justify-content: center;`;
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 12px; text-align: center; max-width: 350px; width: 90%;">
            <i class="fa-solid fa-lock" style="font-size: 40px; color: #ff6b35; margin-bottom: 15px;"></i>
            <h3 style="margin: 0 0 10px;">Yêu cầu đăng nhập</h3>
            <p style="color: #666; margin-bottom: 20px;">Vui lòng đăng nhập để viết đánh giá.</p>
            <div style="display: flex; gap: 10px;">
                <button onclick="this.closest('div').parentElement.parentElement.remove()" style="flex: 1; padding: 10px; border: 1px solid #ddd; background: #fff; border-radius: 6px; cursor: pointer;">Hủy</button>
                <button onclick="window.location.href='/page/account/login/login.html'" style="flex: 1; padding: 10px; background: #ff6b35; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">Đăng nhập</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    if(!uploadArea) return;
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ff6b35';
        uploadArea.style.backgroundColor = '#fff5e1';
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#e5e7eb';
        uploadArea.style.backgroundColor = '#fff';
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#e5e7eb';
        uploadArea.style.backgroundColor = '#fff';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            document.getElementById('reviewImage').files = files;
            handleImageUpload({ target: { files: files } });
        }
    });
}

// ========== GLOBAL FUNCTIONS CHO HTML ==========
window.filterReviews = (type) => {
    ReviewManager.currentFilter = type;
    ReviewManager.displayCount = 5;
    ReviewManager.renderList();
};

window.loadMoreReviews = () => {
    ReviewManager.displayCount += 5;
    ReviewManager.renderList();
};

window.openImageViewer = openImageViewer;

// ========== HÀM LOAD SẢN PHẨM CÙNG DANH MỤC ==========
async function loadRelatedProducts() {
    try {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');
        
        if (!productId) return;
        
        const response = await fetch('/data/product.json');
        const data = await response.json();
        const allProducts = [
          ...(data.micay || []),
          ...(data.mitron || []),
          ...(data.anvat || []),
          ...(data.ankem || []),
          ...(data.douong || [])
        ];
        
        // Tìm sản phẩm hiện tại để lấy danh mục
        const currentProd = allProducts.find(p => p.id == productId);
        if (!currentProd) return;
        
        // Trích xuất danh mục từ path hình ảnh (VD: /assets/product/mitron/20.png -> mitron)
        const imagePath = currentProd.image || '';
        const categoryMatch = imagePath.match(/\/assets\/product\/(\w+)\//);
        const category = categoryMatch ? categoryMatch[1] : null;
        
        if (!category) return;
        
        // Lấy danh mục gốc từ JSON
        const categoryProducts = data[category] || [];
        
        // Lọc sản phẩm cùng danh mục, loại trừ sản phẩm hiện tại, lấy tối đa 5 sản phẩm
        const relatedProducts = categoryProducts
            .filter(p => p.id != productId)
            .slice(0, 5);
        
        // Render HTML vào best-seller-section
        const swiperWrapper = document.querySelector('.swiper-best-seller .swiper-wrapper');
        if (!swiperWrapper || relatedProducts.length === 0) return;
        
        swiperWrapper.innerHTML = relatedProducts.map(product => `
            <div class="swiper-slide bs-card" data-product-id="${product.id}">
                <div class="bs-img-wrapper">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="bs-content">
                    <h3 class="bs-name">${product.title}</h3>
                    <div class="bs-price-row">
                        <span class="price-current">${formatPrice(product.price_current)}</span>
                        <span class="price-old">${formatPrice(product.price_old)}</span>
                    </div>
                    <a href="/page/category/detail/detail.htm?id=${product.id}" class="btn-pill-outline" onclick="event.stopPropagation();">Xem Chi Tiết</a>
                </div>
            </div>
        `).join('');
        
        // Thêm event listener cho cards để navigate khi click
        document.querySelectorAll('.swiper-best-seller .bs-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function(e) {
                // Nếu click vào nút "MUA HÀNG" thì đã xử lý rồi (stopPropagation)
                if (e.target.closest('.btn-pill-outline')) return;
                
                const productId = this.getAttribute('data-product-id');
                if (productId) {
                    window.location.href = `/page/category/detail/detail.htm?id=${productId}`;
                }
            });
        });
        
        // Khởi tạo lại Swiper sau khi cập nhật HTML
        if (typeof Swiper !== 'undefined' && window.swiperBestSeller) {
            window.swiperBestSeller.destroy();
            window.swiperBestSeller = new Swiper(".swiper-best-seller", {
                slidesPerView: 4,
                spaceBetween: 20,
                loop: true,
                navigation: { nextEl: ".bs-button-next", prevEl: ".bs-button-prev" },
                breakpoints: {
                    320: { slidesPerView: 2, spaceBetween: 10 },
                    768: { slidesPerView: 3, spaceBetween: 15 },
                    1024: { slidesPerView: 4, spaceBetween: 20 },
                },
            });
        }
        
        console.log(`✅ Đã load ${relatedProducts.length} sản phẩm danh mục ${category}`);
    } catch (error) {
        console.error('❌ Lỗi khi load sản phẩm liên quan:', error);
    }
}

// ========== CHẠY KHỞI TẠO CUỐI CÙNG ==========
// Gọi getDetailProduct sau cùng để đảm bảo mọi function/object đã được định nghĩa
getDetailProduct();
loadRelatedProducts();