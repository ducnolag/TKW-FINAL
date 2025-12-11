// --- JS XỬ LÝ POPUP MUA HÀNG ---
    
    // 1. Lấy nút Mua ngay và gán sự kiện click
    const btnBuyNow = document.querySelector('.btn-buy-now');
    if(btnBuyNow) {
        btnBuyNow.addEventListener('click', function(e) {
            e.preventDefault(); // Ngăn load lại trang
            openCartModal();
        });
    }

    // 2. Hàm mở Modal và lấy dữ liệu
    function openCartModal() {
        // Lấy thông tin từ giao diện
        const imgSrc = document.querySelector('.main-image-frame img').src;
        const prodName = document.querySelector('.pd-name').innerText;
        const priceText = document.querySelector('.price-new').innerText; // Ví dụ: 35.000đ
        const qty = parseInt(document.querySelector('.qty-input').value);
        
        // Lấy các thuộc tính (Size, Đường, Đá...) từ các thẻ select
        let attributesHtml = '';
        const selects = document.querySelectorAll('.custom-select');
        selects.forEach(sel => {
            const label = sel.parentElement.querySelector('.option-title').innerText;
            const value = sel.options[sel.selectedIndex].text;
            attributesHtml += `<span>${label}: <b>${value}</b></span>`;
        });

        // Tính tổng tiền (Xử lý chuỗi tiền tệ: bỏ chữ 'đ', bỏ dấu chấm)
        const priceValue = parseInt(priceText.replace(/\./g, '').replace('đ', '')); 
        const total = priceValue * qty;
        const totalFormatted = total.toLocaleString('vi-VN') + 'đ';

        // Điền dữ liệu vào Modal HTML
        document.getElementById('m-img').src = imgSrc;
        document.getElementById('m-name').innerText = prodName;
        document.getElementById('m-attrs').innerHTML = attributesHtml; // Điền size, đường...
        document.getElementById('m-qty').innerText = qty;
        document.getElementById('m-total').innerText = totalFormatted;

        // Hiển thị Modal
        document.getElementById('modal-cart-overlay').classList.add('active');
    }

    // 3. Hàm đóng Modal
    function closeModal() {
        document.getElementById('modal-cart-overlay').classList.remove('active');
    }

    // Đóng khi click ra vùng mờ bên ngoài
    document.getElementById('modal-cart-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // --- JS NÂNG CẤP: TOAST & LOADING ---

    // 1. Hàm tạo thông báo Toast xịn xò
    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        
        // Icon và màu sắc dựa trên loại thông báo
        let iconClass = 'fa-circle-check';
        let color = '#2ecc71'; // Màu xanh lá mặc định
        
        if(type === 'error') { iconClass = 'fa-circle-exclamation'; color = '#e74c3c'; }
        
        toast.className = 'toast-msg';
        toast.style.borderLeftColor = color;
        toast.innerHTML = `
            <i class="fa-solid ${iconClass} toast-icon" style="color: ${color}"></i>
            <div class="toast-body">${message}</div>
            <i class="fa-solid fa-xmark toast-close" onclick="this.parentElement.remove()"></i>
        `;

        container.appendChild(toast);

        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 500); // Xoá khỏi DOM sau khi ẩn
        }, 3000);
    }

    // 2. Nâng cấp: Thêm vào giỏ hàng với thông báo Toast
    function addToCartAction() {
        // Đóng modal trước
        closeModal(); 
        
        // Hiện thông báo đẹp thay vì alert
        showToast("Đã thêm sản phẩm vào giỏ hàng thành công!");
        
        // Cập nhật số lượng trên icon giỏ hàng (giả lập)
        // Ví dụ: updateCartCount(1);
    }

    // 3. Nâng cấp: Thanh toán với hiệu ứng Loading
    function cartAction() {
        const btnCheckout = document.querySelector('.btn-modal-primary');
        
        // Thêm class tạo hiệu ứng quay vòng
        btnCheckout.classList.add('btn-loading');
        // Giữ lại text cũ nhưng ẩn đi bằng CSS, chỉ hiện vòng quay
        
        // Giả lập độ trễ xử lý (2 giây)
        setTimeout(() => {
            // Chuyển trang
            window.location.href = "cart.html";
            
            // (Tuỳ chọn) Nếu muốn reset nút sau khi xong (trường hợp AJAX)
            // btnCheckout.classList.remove('btn-loading');
        }, 2000);
    }
    