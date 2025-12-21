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

    // --- 7. TIỆN ÍCH KHÁC (Toast) ---
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
