/* =========================================
   FILE: detail-actions.js
   Xử lý các hành động trên trang chi tiết sản phẩm
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {

    // --- 0. LẤY PRODUCT ID TỪ URL ---
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id') || 'SP01'; // Mặc định 'SP01' nếu không có

    // --- 1. KHỞI TẠO BIẾN CƠ BẢN ---
    const basePriceElement = document.querySelector('.main-price');
    let basePrice = 55000; 
    if (basePriceElement) {
        const priceText = basePriceElement.innerText.replace(/\D/g, ''); 
        if (priceText) basePrice = parseInt(priceText);
    }

    let currentQuantity = 1;
    let currentSizePrice = 0;
    let currentToppingPrice = 0;

    // --- 2. XỬ LÝ THỐNG KÊ (LƯỢT XEM & LƯỢT MUA) --- 
    const viewDisplay = document.getElementById('view-count');
    const buyDisplay = document.getElementById('buy-count');

    // 2.1. Hàm tăng LƯỢT XEM khi tải trang
    function incrementViewCount() {
        let views = localStorage.getItem(`product_views_${productId}`) || '0';
        views = parseInt(views) + 1;
        localStorage.setItem(`product_views_${productId}`, views);
        if(viewDisplay) viewDisplay.innerText = views.toLocaleString('vi-VN');
        console.log("✅ Đã tăng lượt xem cho sản phẩm:", productId, "- Tổng lượt xem:", views);
    }

    // 2.2. Hiển thị LƯỢT MUA
    function initBuyCount() {
        let buys = localStorage.getItem(`product_buys_${productId}`) || 0;
        if(buyDisplay) buyDisplay.innerText = parseInt(buys).toLocaleString('vi-VN');
    }

    // Chạy ngay khi tải trang
    incrementViewCount();
    initBuyCount();


    // --- 3. CHỨC NĂNG NGƯỜI XEM (Ảnh, Tab) ---
    const mainImg = document.getElementById('main-img');
    const thumbnails = document.querySelectorAll('.thumb-img');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            document.querySelector('.thumb-img.active')?.classList.remove('active');
            this.classList.add('active');
            if (mainImg) {
                mainImg.style.opacity = '0.5';
                setTimeout(() => {
                    mainImg.src = this.src;
                    mainImg.style.opacity = '1';
                }, 150);
            }
        });
    });

    // --- 4. CHỨC NĂNG CHỌN SIZE & TOPPING ---
    const sizeBtns = document.querySelectorAll('.group-size .option-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.group-size .option-btn.active')?.classList.remove('active');
            this.classList.add('active');
            currentSizePrice = parseInt(this.getAttribute('data-price')) || 0;
            updateTotalPrice();
        });
    });

    const toppingInputs = document.querySelectorAll('.topping-option input[type="checkbox"]');
    toppingInputs.forEach(input => {
        input.addEventListener('change', function() {
            currentToppingPrice = 0;
            document.querySelectorAll('.topping-option input:checked').forEach(box => {
                currentToppingPrice += (parseInt(box.getAttribute('data-price')) || 5000);
            });
            updateTotalPrice();
        });
    });

    // --- 5. TĂNG GIẢM SỐ LƯỢNG ---
    const qtyInput = document.getElementById('quantity');
    const btnMinus = document.querySelector('.qty-btn.minus');
    const btnPlus = document.querySelector('.qty-btn.plus');

    if (btnMinus && btnPlus && qtyInput) {
        btnMinus.addEventListener('click', () => {
            if (currentQuantity > 1) {
                currentQuantity--;
                qtyInput.value = currentQuantity;
                updateTotalPrice();
            }
        });

        btnPlus.addEventListener('click', () => {
            currentQuantity++;
            qtyInput.value = currentQuantity;
            updateTotalPrice();
        });
    }

    function updateTotalPrice() {
        const total = (basePrice + currentSizePrice + currentToppingPrice) * currentQuantity;
        if (basePriceElement) basePriceElement.innerText = total.toLocaleString('vi-VN') + 'đ';
    }

    // --- 6. HÀNH ĐỘNG MUA HÀNG (Tăng lượt mua tại đây) ---

    // Nút Thêm Giỏ Hàng
    const btnAddToCart = document.querySelector('.btn-addToCart');
    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', () => {
            showToast('Đã thêm vào giỏ hàng thành công!', 'success');
        });
    }

    // Nút MUA NGAY (Thanh toán)
    const btnBuyNow = document.querySelector('.btn-buyNow');
    if (btnBuyNow) {
        btnBuyNow.addEventListener('click', () => {
            // 1. Tăng lượt mua
            let buys = localStorage.getItem(`product_buys_${productId}`) || 0;
            buys = parseInt(buys) + 1;
            localStorage.setItem(`product_buys_${productId}`, buys);
            
            // Cập nhật ngay lên màn hình (để người dùng thấy nhảy số)
            if(buyDisplay) buyDisplay.innerText = buys.toLocaleString('vi-VN');

            // 2. Chuyển trang hoặc thông báo
            // window.location.href = 'checkout.html'; // Bỏ comment dòng này nếu muốn chuyển trang thật
            showToast('Đang chuyển đến trang thanh toán...', 'success');
            
            console.log("✅ Đã ghi nhận 1 lượt mua mới cho sản phẩm:", productId);
        });
    }

    // --- 7. TIỆN ÍCH KHÁC (Toast, Review) ---
    window.showToast = function(message, type = 'success') {
        let toastBox = document.getElementById('toast-box');
        if (!toastBox) {
            toastBox = document.createElement('div');
            toastBox.id = 'toast-box';
            document.body.appendChild(toastBox);
        }
        
        const toast = document.createElement('div');
        toast.classList.add('toast');
        let icon = type === 'success' ? '<i class="fas fa-check-circle icon"></i>' : '<i class="fas fa-exclamation-circle icon"></i>';
        toast.innerHTML = `${icon}<div class="toast-msg">${message}</div>`;
        toastBox.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => { toast.remove(); }, 3500);
    }

    // ========== HÀM HIỂN THỊ LƯỢT XEM & MUA ==========
    function createStatsHTML(productId) {
        // Tăng lượt xem khi vào trang
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
                        <div style="font-weight: 700; color: #1f2937;" id="view-count-display">${views.toLocaleString('vi-VN')}</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 18px;">🛍️</span>
                    <div>
                        <div style="font-size: 12px; color: #6b7280;">Lượt mua</div>
                        <div style="font-weight: 700; color: #1f2937;" id="buy-count-display">${buys.toLocaleString('vi-VN')}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // ========== HÀM CẬP NHẬT LƯỢT HÀNG (MUA NGAY) ==========
    function incrementBuyCount(productId) {
        let buys = parseInt(localStorage.getItem(`product_buys_${productId}`) || '0');
        buys++;
        localStorage.setItem(`product_buys_${productId}`, buys);
        
        // Cập nhật UI nếu tồn tại
        const buyElement = document.getElementById('buy-count-display') || document.getElementById('buy-count');
        if (buyElement) {
            buyElement.textContent = buys.toLocaleString('vi-VN');
        }
    }

    // ========== HÀM CẬP NHẬT LƯỢT XEM ==========
    function incrementViewCount(productId) {
        let views = parseInt(localStorage.getItem(`product_views_${productId}`) || '0');
        views++;
        localStorage.setItem(`product_views_${productId}`, views);
        
        // Cập nhật UI nếu tồn tại
        const viewElement = document.getElementById('view-count-display') || document.getElementById('view-count');
        if (viewElement) {
            viewElement.textContent = views.toLocaleString('vi-VN');
        }
    }
});
