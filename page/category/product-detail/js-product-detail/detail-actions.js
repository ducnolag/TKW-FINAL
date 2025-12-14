/* =========================================
   FILE: product-logic.js
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {

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
    // (Phần mới thêm theo yêu cầu của bạn)
    
    const viewDisplay = document.getElementById('view-count');
    const buyDisplay = document.getElementById('buy-count');

    // 2.1. Tự động tăng LƯỢT XEM khi vào trang
    function handleViewCount() {
        // Lấy số cũ từ bộ nhớ, 
        let views = localStorage.getItem('product_views_SP01') || 0;
        views = parseInt(views) + 1; // Tăng thêm 1
        
        // Lưu lại vào bộ nhớ
        localStorage.setItem('product_views_SP01', views);
        
        // Hiển thị ra màn hình
        if(viewDisplay) viewDisplay.innerText = views.toLocaleString('vi-VN');
    }
    
    // 2.2. Hiển thị LƯỢT MUA (Lấy từ bộ nhớ ra hiển thị trước)
    function initBuyCount() {
        // Giả sử mặc định đã có 68 lượt mua
        let buys = localStorage.getItem('product_buys_SP01') || 0;
        if(buyDisplay) buyDisplay.innerText = parseInt(buys).toLocaleString('vi-VN');
    }

    // Chạy ngay khi tải trang
    handleViewCount();
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
            let buys = localStorage.getItem('product_buys_SP01') || 68;
            buys = parseInt(buys) + 1;
            localStorage.setItem('product_buys_SP01', buys);
            
            // Cập nhật ngay lên màn hình (để người dùng thấy nhảy số)
            if(buyDisplay) buyDisplay.innerText = buys;

            // 2. Chuyển trang hoặc thông báo
            // window.location.href = 'checkout.html'; // Bỏ comment dòng này nếu muốn chuyển trang thật
            showToast('Đang chuyển đến trang thanh toán...', 'success');
            
            console.log("Đã ghi nhận 1 lượt mua mới!");
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
});
