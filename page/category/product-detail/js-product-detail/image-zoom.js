 /* --- image-zoom.js --- */
/* Chức năng phóng to ảnh sản phẩm khi click */

document.addEventListener('DOMContentLoaded', () => {
    initZoomFeature();
});

function initZoomFeature() {
    // 1. Tìm ảnh chính sản phẩm (Dựa trên class trong file HTML của bạn)
    // Lưu ý: Đảm bảo class '.main-image-frame img' là đúng với code của bạn
    const mainImg = document.querySelector('.main-image-frame img'); 
    
    if (mainImg) {
        // Gán sự kiện click
        mainImg.addEventListener('click', function() {
            openZoom(this.src);
        });
    }
}

// Hàm mở Zoom
function openZoom(imgSrc) {
    const lightbox = document.getElementById('img-lightbox');
    const boxImg = document.getElementById('lightbox-src');
    
    if (lightbox && boxImg) {
        boxImg.src = imgSrc; // Gán ảnh vừa bấm vào lightbox
        lightbox.classList.add('active'); // Hiện lên
    }
}

// Hàm đóng Zoom (Được gọi khi click vào vùng đen trong HTML)
function closeZoom() {
    const lightbox = document.getElementById('img-lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        
        // Xóa src sau khi đóng để lần sau mở hiệu ứng đẹp hơn (tùy chọn)
        setTimeout(() => {
            document.getElementById('lightbox-src').src = "";
        }, 300); 
    }
}