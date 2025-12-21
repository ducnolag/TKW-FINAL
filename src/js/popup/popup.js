(function() {
    // 1. Cấu hình
    const imgUrl = "/../assets/popup.png"; 
    const targetLink = "/../page/promotion/promotion.html"; 
    const displayDuration = 5000; 

    // 2. Chèn CSS (Giữ nguyên)
    const css = `
        #js-popup-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        #js-popup-overlay.active {
            opacity: 1;
        }
        .js-popup-container {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            cursor: default;
        }
        .js-popup-container img {
            width: 100%;
            height: auto;
            border-radius: 8px;
            display: block;
        }
        .js-popup-close {
            position: absolute;
            top: -15px; right: -15px;
            width: 35px; height: 35px;
            color: #fff;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 50px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .js-popup-close:hover {
            transform: scale(1.1);
            color: #e76b3eff;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);

    // 3. Hàm hiển thị Popup
    function showImagePopup() {
        if (document.getElementById('js-popup-overlay')) return;

        const popupHTML = `
            <div id="js-popup-overlay">
                <div class="js-popup-container">
                    <div class="js-popup-close">&times;</div>
                    <a href="${targetLink}" target="_blank">
                        <img src="${imgUrl}" alt="Promotion">
                    </a>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', popupHTML);

        const overlay = document.getElementById('js-popup-overlay');
        const closeBtn = overlay.querySelector('.js-popup-close');

        requestAnimationFrame(() => {
            overlay.classList.add('active');
        });

        const closePopup = () => {
            overlay.classList.remove('active');
            setTimeout(() => {
                if(overlay) overlay.remove();
            }, 300);
        };

        closeBtn.onclick = closePopup;
        overlay.onclick = (e) => { if (e.target === overlay) closePopup(); };

        if (displayDuration > 0) {
            setTimeout(closePopup, displayDuration);
        }
    }

    // 4. Logic kiểm tra điều kiện (ĐÃ CẬP NHẬT)
    function checkAndRun() {
        // A. Kiểm tra có phải trang chủ không
        const path = window.location.pathname;
        const isHomePage = path === "/" || path.indexOf("index") !== -1 || path.length < 2;
        
        if (!isHomePage) return; // Không phải trang chủ thì dừng ngay

        // B. Ưu tiên: Nếu là RELOAD trang (F5) -> Luôn hiện
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries.length > 0 && navEntries[0].type === 'reload') {
            showImagePopup();
            return;
        }

        // C. Kiểm tra Nguồn truy cập (Referrer) để chặn truy cập nội bộ
        const referrer = document.referrer; // Lấy link trang trước đó
        const currentDomain = window.location.hostname; // Lấy tên miền hiện tại (ví dụ: mywebsite.com)

        // Nếu có referrer VÀ referrer chứa tên miền hiện tại 
        // => Tức là đang đi từ trang con ra trang chủ => KHÔNG HIỆN
        if (referrer && referrer.indexOf(currentDomain) !== -1) {
            return; 
        }

        // D. Các trường hợp còn lại: 
        // - Không có referrer (Gõ trực tiếp link, mở tab mới)
        // - Referrer từ domain khác (Google, Facebook...)
        // => HIỆN
        showImagePopup();
    }

    // 5. Kích hoạt
    if (document.readyState === 'complete') {
        checkAndRun();
    } else {
        window.addEventListener('load', checkAndRun);
    }
})();