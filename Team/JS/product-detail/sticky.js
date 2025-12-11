/* --- LOGIC CHO STICKY BAR --- */
document.addEventListener('DOMContentLoaded', () => {
    const stickyBar = document.getElementById('sticky-bar');
    const mainBtn = document.querySelector('.btn-buy-now'); // Nút MUA HÀNG gốc
    
    // 1. Tự động lấy thông tin từ sản phẩm chính
    // Tìm thẻ ảnh, tên, giá dựa trên class trong code cũ của bạn
    const mainImg = document.querySelector('.main-image-frame img'); 
    const mainName = document.querySelector('.pd-name');
    const mainPrice = document.querySelector('.price-new'); // Giá mới

    // Gán vào thanh Sticky
    if(mainImg) document.getElementById('sticky-img').src = mainImg.src;
    if(mainName) document.getElementById('sticky-name').innerText = mainName.innerText;
    if(mainPrice) document.getElementById('sticky-price').innerText = mainPrice.innerText;

    // 2. Xử lý sự kiện cuộn chuột (Scroll)
    window.addEventListener('scroll', () => {
        if (!mainBtn) return;

        // Lấy vị trí của nút mua hàng chính
        const btnPosition = mainBtn.getBoundingClientRect().bottom;
        
        // Logic: Nếu nút chính bị cuộn khuất lên trên (top < 0) thì hiện Sticky Bar
        if (btnPosition < 0) { 
            stickyBar.classList.add('active');
        } else {
            stickyBar.classList.remove('active');
        }
    });
});

// 3. Hàm kích hoạt nút mua chính (Proxy Click)
// Khi bấm nút ở thanh dính, nó sẽ giả vờ bấm vào nút gốc để chạy logic thêm giỏ hàng
function triggerMainBuy() {
    const mainBtn = document.querySelector('.btn-buy-now');
    if(mainBtn) {
        // Tạo hiệu ứng bấm nhẹ
        mainBtn.click(); 
        
        // Tùy chọn: Cuộn ngược lên để khách thấy Modal hiện ra (nếu Modal hiện ở giữa trang)
        // mainBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}