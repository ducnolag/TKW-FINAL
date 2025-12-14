/* --- assets/js/review.js --- */

// 1. CẤU HÌNH & DỮ LIỆU KHỞI TẠO
const STORAGE_KEY = 'tiem_an_vat_reviews';

// Dữ liệu mẫu
const seedData = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        rating: 5,
        content: "Đồ ăn vặt ở đây siêu ngon, đóng gói kỹ, giao hàng nhanh. Sẽ ủng hộ dài dài!",
        date: "10:30 28/11/2025",
        verified: true,
        image: null,
        likes: 12,
        replies: [
            {
                name: "Tiệm Ăn Vặt",
                isAdmin: true,
                content: "Cảm ơn bạn đã ủng hộ Tiệm nhé! Mong bạn quay lại sớm ạ.",
                date: "10:45 28/11/2025"
            }
        ]
    },
    {
        id: 2,
        name: "Trần Thị B",
        rating: 4,
        content: "Ngon nhưng hơi cay so với mình. Lần sau sẽ note ít cay lại.",
        date: "14:15 29/11/2025",
        verified: true,
        image: null,
        likes: 5,
        replies: []
    },
    {
        id: 3,
        name: "Lê Văn C",
        rating: 5,
        content: "Giao hàng siêu tốc, 15 phút đã có. Đồ ăn nóng hổi.",
        date: "09:00 30/11/2025",
        verified: true,
        image: null,
        likes: 2,
        replies: []
    },
    {
        id: 4,
        name: "Phạm Văn D",
        rating: 2,
        content: "Giao sai món, hơi thất vọng.",
        date: "08:00 01/12/2025",
        verified: true,
        image: null,
        likes: 0,
        replies: []
    }
];

// --- CÁC BIẾN TRẠNG THÁI TOÀN CỤC ---
let reviews = [];
let currentRating = 5;
let currentImageBase64 = null;
let currentFilterType = 'all'; // Trạng thái lọc hiện tại
let currentSortType = 'newest'; // Trạng thái sắp xếp
let visibleCount = 2; // Mặc định chỉ hiện 2 bài đầu tiên
const LOAD_MORE_STEP = 10; 

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('review-list-view')) {
        loadReviews();
        setupEventListeners();
        renderAll(); 
    }
});

// 2. TẢI DỮ LIỆU
function loadReviews() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        reviews = JSON.parse(data);
        reviews.forEach(r => {
            if (!r.replies) r.replies = [];
        });
    } else {
        reviews = seedData;
        saveReviews();
    }
}

// 3. LƯU DỮ LIỆU
function saveReviews() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

// 4. LOGIC XỬ LÝ
function parseDateString(dateStr) {
    if(!dateStr) return 0;
    const parts = dateStr.split(' ');
    if(parts.length < 2) return 0;
    const timeParts = parts[0].split(':');
    const dateParts = parts[1].split('/');
    return new Date(dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1]).getTime();
}

function getProcessedReviews() {
    let result = [...reviews];

    // Lọc
    if (currentFilterType !== 'all') {
        if (currentFilterType === 'image') {
            result = result.filter(r => r.image);
        } else {
            const star = parseInt(currentFilterType);
            result = result.filter(r => r.rating === star);
        }
    }

    // Sắp xếp
    result.sort((a, b) => {
        if (currentSortType === 'likes') {
            return b.likes - a.likes;
        } else if (currentSortType === 'oldest') {
            return parseDateString(a.date) - parseDateString(b.date);
        } else {
            return parseDateString(b.date) - parseDateString(a.date);
        }
    });

    return result;
}

// 5. VẼ GIAO DIỆN
function renderAll() {
    renderDashboard();
    renderReviewList();
}

function renderDashboard() {
    const total = reviews.length;
    
    // --- Tính toán thống kê ---
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    let hasImgCount = 0;

    reviews.forEach(r => {
        if(counts[r.rating] !== undefined) counts[r.rating]++;
        sum += r.rating;
        if(r.image) hasImgCount++;
    });

    const avg = total > 0 ? (sum / total).toFixed(1) : "0.0";

    // Cập nhật số tổng và số trung bình
    const scoreNum = document.querySelector('.score-num');
    const scoreCount = document.querySelector('.score-count');
    if (scoreNum) scoreNum.innerText = avg;
    if (scoreCount) scoreCount.innerText = `(${total} đánh giá)`;

    
    // Cập nhật thanh bar phần trăm
    const barItems = document.querySelectorAll('.rating-bars .bar-item');
    if (barItems.length > 0) {
        for (let i = 5; i >= 1; i--) {
            const percent = total > 0 ? Math.round((counts[i] / total) * 100) : 0;
            const index = 5 - i;
            if (barItems[index]) {
                barItems[index].querySelector('.progress-fill').style.width = `${percent}%`;
                barItems[index].querySelector('.count-label').innerText = `${percent}%`;
            }
        }
    }

    // --- TẠO LẠI NÚT BỘ LỌC (QUAN TRỌNG) ---
    // Vì HTML thiếu nút 2 sao, 1 sao, ta dùng JS xóa đi và vẽ lại toàn bộ cho đủ bộ
    const filterGroup = document.querySelector('.filter-group');
    if (filterGroup) {
        filterGroup.innerHTML = ''; // Xóa sạch các nút cũ trong HTML

        // Định nghĩa danh sách nút cần hiển thị
        const filtersToRender = [
            { id: 'all', label: 'Tất cả', count: null },
            { id: '5', label: '5 Sao', count: counts[5] },
            { id: '4', label: '4 Sao', count: counts[4] },
            { id: '3', label: '3 Sao', count: counts[3] },
            { id: '2', label: '2 Sao', count: counts[2] }, // Thêm mới
            { id: '1', label: '1 Sao', count: counts[1] }, // Thêm mới
            { id: 'image', label: 'Có hình ảnh', count: hasImgCount }
        ];

        filtersToRender.forEach(f => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            
            // Nếu là nút đang chọn thì thêm class active
            if (currentFilterType === f.id) {
                btn.classList.add('active');
            }

            // Gán text
            if (f.id === 'all') {
                btn.innerText = f.label;
            } else {
                btn.innerText = `${f.label} (${f.count})`;
            }

            // Gắn sự kiện Click ngay tại đây
            btn.onclick = () => {
                currentFilterType = f.id;
                visibleCount = 2; // Reset về trang 1
                renderAll(); // Vẽ lại để cập nhật active và danh sách
            };

            filterGroup.appendChild(btn);
        });
    }
}

function renderReviewList() {
    const container = document.querySelector('.user-review-list');
    if (!container) return;

    container.innerHTML = '';
    const processedList = getProcessedReviews();

    if(!document.getElementById('sort-control-container')) {
        const sortHtml = `
            <div id="sort-control-container" style="display: flex; justify-content: flex-end; margin-bottom: 15px; align-items: center;">
                <label style="margin-right: 10px; font-weight: bold; color: #555;">Sắp xếp:</label>
                <select id="sort-select" onchange="changeSort(this.value)" style="padding: 5px; border-radius: 4px; border: 1px solid #ddd;">
                    <option value="newest" ${currentSortType === 'newest' ? 'selected' : ''}>Mới nhất</option>
                    <option value="oldest" ${currentSortType === 'oldest' ? 'selected' : ''}>Cũ nhất</option>
                    <option value="likes" ${currentSortType === 'likes' ? 'selected' : ''}>Hữu ích nhất</option>
                </select>
            </div>
        `;
        container.insertAdjacentHTML('beforebegin', sortHtml);
    }

    if (processedList.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:30px; color:#999;">Chưa có đánh giá nào phù hợp.</p>';
        updateLoadMoreButton(false);
        return;
    }

    const displayList = processedList.slice(0, visibleCount);

    displayList.forEach(review => {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            starsHtml += i <= review.rating ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
        }

        let imgHtml = '';
        if (review.image) {
            imgHtml = `
                <div class="review-img-wrapper" style="margin-bottom: 10px; margin-top: 5px;">
                    <img src="${review.image}" 
                        alt="Ảnh review" 
                        style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; cursor: zoom-in; border: 1px solid #eee;"
                        onclick="openImageViewer('${review.image}')">
                </div>
            `;
        }

        let repliesHtml = '';
        if (review.replies && review.replies.length > 0) {
            repliesHtml = `<div class="reply-list">`;
            review.replies.forEach(rep => {
                const badge = rep.isAdmin ? `<span class="reply-badge">QTV</span>` : '';
                repliesHtml += `
                    <div class="reply-item">
                        <div>${badge} <span class="reply-name">${rep.name}</span></div>
                        <div class="reply-content">${rep.content}</div>
                        <span class="reply-time">${rep.date}</span>
                    </div>
                `;
            });
            repliesHtml += `</div>`;
        }

        const itemHtml = `
            <div class="review-item" id="review-${review.id}">
                <div class="ri-user-info">
                    <span class="ri-name">${review.name}</span>
                    <span class="ri-stars">${starsHtml}</span>
                </div>
                ${review.verified ? '<div class="ri-verified"><i class="fa-solid fa-circle-check"></i> Đã mua hàng tại Tiệm</div>' : ''}
                <div class="ri-content">${review.content}</div>
                ${imgHtml}
                
                <div class="ri-actions">
                    <span class="action-link" onclick="toggleReplyInput(${review.id})">
                        <i class="fa-regular fa-comment-dots"></i> Trả lời
                    </span> • 
                    <span class="action-link" onclick="handleLike(${review.id})">
                        <i class="fa-regular fa-thumbs-up"></i> Hữu ích (<span class="like-count">${review.likes}</span>)
                    </span> • 
                    <span class="ri-time">${review.date}</span>
                </div>

                ${repliesHtml}

                <div id="reply-box-${review.id}" class="reply-input-box">
                    <input type="text" id="reply-name-${review.id}" placeholder="Tên của bạn...">
                    <input type="text" id="reply-content-${review.id}" placeholder="Nhập câu trả lời...">
                    <div style="text-align: right; margin-top:5px;">
                        <button class="btn-submit-reply" onclick="submitReply(${review.id})">Gửi</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += itemHtml;
    });

    updateLoadMoreButton(processedList.length > visibleCount);
}

function updateLoadMoreButton(show) {
    let btnContainer = document.getElementById('btn-load-more-reviews');
    const container = document.querySelector('.user-review-list');
    
    if (show) {
        if (!btnContainer) {
            btnContainer = document.createElement('div');
            btnContainer.id = 'btn-load-more-reviews';
            btnContainer.className = 'load-more-container';
            btnContainer.style.textAlign = 'center';
            btnContainer.style.marginTop = '20px';
            
            const actualButton = document.createElement('button');
            actualButton.innerHTML = 'Xem thêm đánh giá <i class="fa-solid fa-chevron-down"></i>';
            actualButton.style.padding = "10px 20px";
            actualButton.style.cursor = "pointer";
            actualButton.style.border = "1px solid #ddd";
            actualButton.style.background = "#fff";
            actualButton.style.transition = "0.3s";

            actualButton.onmouseover = function() {
                this.style.background = "linear-gradient(90deg, #ff6b35, #d82b2b)";
                this.style.color = "#fff";
                this.style.border = "1px solid #ff6b35";
            };
            actualButton.onmouseout = function() {
                this.style.background = "#fff";
                this.style.color = "#000";
                this.style.border = "1px solid #ddd";
            };
            actualButton.onclick = loadMoreReviews;
            btnContainer.appendChild(actualButton);
            
            container.parentNode.insertBefore(btnContainer, container.nextSibling);
        }
        btnContainer.style.display = 'block';
    } else {
        if (btnContainer) btnContainer.style.display = 'none';
    }
}

// 6. CÀI ĐẶT SỰ KIỆN
function setupEventListeners() {
    const stars = document.querySelectorAll('.star-rating i');
    stars.forEach(star => {
        star.addEventListener('click', function () {
            currentRating = parseInt(this.getAttribute('data-value'));
            stars.forEach(s => {
                const val = parseInt(s.getAttribute('data-value'));
                if (val <= currentRating) s.classList.add('active');
                else s.classList.remove('active');
            });
        });
    });

    const fileInput = document.getElementById('review-file-input');
    if (fileInput) {
        fileInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (evt) {
                    currentImageBase64 = evt.target.result;
                    document.getElementById('preview-container').innerHTML = `<img src="${evt.target.result}" class="preview-img">`;
                }
                reader.readAsDataURL(file);
            }
        });
    }

    const form = document.querySelector('.review-input-group');
    if (form) {
        form.onsubmit = function (e) {
            e.preventDefault();
            submitNewReview();
        }
    }
    
    // Đã loại bỏ phần xử lý click filter ở đây vì đã chuyển vào renderDashboard
}

function loadMoreReviews() {
    visibleCount += LOAD_MORE_STEP;
    renderReviewList();
}

window.changeSort = function(type) {
    currentSortType = type;
    visibleCount = 2; 
    renderReviewList();
}

// 7. CÁC HÀM XỬ LÝ ACTION
function submitNewReview() {
    const nameInput = document.querySelector('.review-input-group input[type="text"]');
    const contentInput = document.querySelector('.textarea-wrapper textarea');

    if (!nameInput.value.trim() || !contentInput.value.trim()) {
        alert("Vui lòng nhập tên và nội dung đánh giá!");
        return;
    }

    const newReview = {
        id: Date.now(),
        name: nameInput.value,
        rating: currentRating,
        content: contentInput.value,
        date: new Date().toLocaleString('vi-VN', {hour: '2-digit', minute:'2-digit', day:'2-digit', month:'2-digit', year:'numeric'}).replace(/,/g, ''),
        verified: true,
        image: currentImageBase64,
        likes: 0,
        replies: []
    };

    reviews.unshift(newReview);
    saveReviews();

    nameInput.value = '';
    contentInput.value = '';
    document.getElementById('preview-container').innerHTML = '';
    currentImageBase64 = null;
    currentSortType = 'newest';

    toggleReviewForm(false);
    renderAll();
    if (typeof showToast === 'function') showToast("Đánh giá thành công!", "success");
}

function handleLike(id) {
    const review = reviews.find(r => r.id === id);
    if (review) {
        review.likes++;
        saveReviews();
        renderReviewList();
    }
}

function toggleReviewForm(show) {
    const listView = document.getElementById("review-list-view");
    const formView = document.getElementById("review-form-view");
    if (show) {
        listView.style.display = "none";
        formView.style.display = "block";
    } else {
        listView.style.display = "block";
        formView.style.display = "none";
    }
}

function toggleReplyInput(reviewId) {
    const box = document.getElementById(`reply-box-${reviewId}`);
    if (box) {
        const isHidden = box.style.display === 'none' || box.style.display === '';
        document.querySelectorAll('.reply-input-box').forEach(b => b.style.display = 'none');
        if (isHidden) box.style.display = 'block';
    }
}

function submitReply(reviewId) {
    const nameVal = document.getElementById(`reply-name-${reviewId}`).value.trim();
    const contentVal = document.getElementById(`reply-content-${reviewId}`).value.trim();

    if (!nameVal || !contentVal) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    if (reviewIndex !== -1) {
        reviews[reviewIndex].replies.push({
            name: nameVal,
            content: contentVal,
            date: new Date().toLocaleString('vi-VN', {hour: '2-digit', minute:'2-digit', day:'2-digit', month:'2-digit', year:'numeric'}).replace(/,/g, ''),
            isAdmin: false
        });

        saveReviews();
        renderReviewList();
        if (typeof showToast === 'function') showToast("Đã gửi câu trả lời!", "success");
    }
}

function openImageViewer(src) {
    const modal = document.getElementById('modal-image-overlay');
    const img = document.getElementById('full-image-view');
    if (modal && img) {
        img.src = src;
        modal.classList.add('active');
    }
}
window.openImageViewer = openImageViewer;

function closeImageViewer() {
    const modal = document.getElementById('modal-image-overlay');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            const img = document.getElementById('full-image-view');
            if (img) img.src = "";
        }, 300);
    }
}
window.closeImageViewer = closeImageViewer;
/* ---------------------------------------------- */
/* ---------------------------------------------- */
/* ---------------------------------------------- */
/* ---------------------------------------------- */
/* ---------------------------------------------- */
/* ---------------------------------------------- */
/* ---------------------------------------------- */
/* ---------------------------------------------- */
/* ---------------------------------------------- */
/* ---------------------------------------------- */
/* ---------------------------------------------- */

// Hàm cập nhật số sao trên header
function updateHeaderRating() {
    const starContainer = document.getElementById('header-stars');
    const scoreSpan = document.getElementById('header-rating-score');
    const countSpan = document.getElementById('header-rating-count');

    if (!starContainer || !scoreSpan || !countSpan) return;

    // Tính toán từ mảng reviews (biến reviews đã có sẵn trong file js này)
    const totalReviews = reviews.length;
    let averageRating = 5.0;

    if (totalReviews > 0) {
        const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        averageRating = (sum / totalReviews).toFixed(1); // Lấy 1 số thập phân
    } else {
        averageRating = 0; // Nếu chưa có đánh giá nào
    }

    // Cập nhật số liệu text
    scoreSpan.innerText = averageRating;
    countSpan.innerText = totalReviews;

    // Vẽ lại sao (Full star, Half star, Empty star)
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(averageRating)) {
            starsHTML += '<i class="fa-solid fa-star"></i>'; // Sao đầy
        } else if (i === Math.ceil(averageRating) && averageRating % 1 !== 0) {
            starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>'; // Sao nửa
        } else {
            starsHTML += '<i class="fa-regular fa-star"></i>'; // Sao rỗng
        }
    }
    starContainer.innerHTML = starsHTML;
}

// Hàm cuộn mượt xuống phần đánh giá
function scrollToReviews(e) {
    e.preventDefault();
    const reviewSection = document.getElementById('review-section'); // Đảm bảo ID này tồn tại
    if (reviewSection) {
        reviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// GỌI HÀM NÀY: Bạn hãy tìm chỗ nào đang gọi renderReviewList() thì gọi thêm hàm này ngay sau đó.
// Ví dụ: thêm dòng dưới cùng của file hoặc trong hàm init()
document.addEventListener('DOMContentLoaded', () => {
    // Đợi một chút để dữ liệu load xong nếu cần
    setTimeout(updateHeaderRating, 100); 
});

// Thêm vào trong hàm saveReviews() để khi viết đánh giá mới thì header cũng cập nhật luôn
const originalSaveReviews = window.saveReviews || saveReviews; 
// (Lưu ý: Nếu bạn biết chỗ hàm saveReviews, hãy chèn trực tiếp updateHeaderRating() vào cuối hàm đó thay vì dùng cách override này)