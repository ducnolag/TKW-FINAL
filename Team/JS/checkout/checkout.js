/* --- JS/checkout.js --- */

// 1. Xử lý chọn phương thức thanh toán
function selectPayment(element, method) {
    // Xóa active cũ
    document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('active'));
    
    // Thêm active cho cái mới
    element.classList.add('active');
    
    // Check vào radio button bên trong
    element.querySelector('input').checked = true;

    // Hiện/Ẩn thông tin chuyển khoản
    const bankInfo = document.getElementById('bank-info');
    if (method === 'banking') {
        bankInfo.style.display = 'block';
    } else {
        bankInfo.style.display = 'none';
    }
}

// 2. Xử lý khi bấm Đặt Hàng
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('checkout-form');
    
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Chặn load lại trang

            // Lấy dữ liệu
            const name = document.querySelector('input[placeholder="Nhập họ tên người nhận"]').value;
            const phone = document.querySelector('input[placeholder="Nhập số điện thoại"]').value;
            const address = document.querySelector('input[placeholder="Số nhà, ngõ, đường, phường/xã..."]').value;
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

            // Validate đơn giản
            if(name.length < 2 || phone.length < 9 || address.length < 5) {
                alert("Vui lòng kiểm tra lại thông tin giao hàng!");
                return;
            }

            // Giả lập gửi đơn hàng
            const btn = document.querySelector('.btn-checkout');
            const originalText = btn.innerText;
            btn.innerText = "ĐANG XỬ LÝ...";
            btn.style.opacity = "0.7";
            btn.disabled = true;

            setTimeout(() => {
                let msg = `Cảm ơn ${name}! Đơn hàng của bạn đã được đặt thành công.\n`;
                msg += `Phương thức: ${paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}.`;
                
                alert(msg);
                
                // Quay về trang chủ (giả định index.html ở root)
                // Vì file này ở HTML/, nên về root phải lùi 1 cấp
                window.location.href = "../index.html"; 
            }, 2000);
        });
    }
});