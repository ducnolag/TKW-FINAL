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

        // Hiệu ứng xuất hiện
        setTimeout(() => overlay.classList.add('active'), 10);

        const closePopup = () => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 400);
        };

        closeBtn.onclick = closePopup;
        overlay.onclick = (e) => { if (e.target === overlay) closePopup(); };

        if (displayDuration > 0) {
            setTimeout(closePopup, displayDuration);
        }
    }

    // 4. Logic kiểm tra điều kiện (Chỉ Home + Reload)
    function checkAndRun() {
        // A. Kiểm tra trang chủ (index hoặc root /)
        const path = window.location.pathname;
        // Logic: Chấp nhận đường dẫn là "/" HOẶC đường dẫn có chứa chữ "index" (ví dụ index.html, index.php)
        const isHomePage = path === "/" || path.indexOf("index") !== -1;
        
        if (!isHomePage) return;

        // B. Kiểm tra có phải là Reload trang (F5) không
        const navEntries = performance.getEntriesByType("navigation");
        let isReload = false;
        if (navEntries.length > 0 && navEntries[0].type === 'reload') {
            isReload = true;
        }
        
        // Chỉ chạy nếu là reload
        if (isReload) {
            showImagePopup();
        }
    }

    // 5. Kích hoạt
    if (document.readyState === 'complete') {
        checkAndRun();
    } else {
        window.addEventListener('load', checkAndRun);
    }
})();