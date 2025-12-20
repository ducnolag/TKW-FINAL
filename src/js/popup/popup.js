(function() {
    // 1. Kiểm tra xem đây có phải là hành động RELOAD không
    // Chế độ này chỉ cho phép popup hiện khi người dùng nhấn F5 hoặc Refresh
    const perfEntries = performance.getEntriesByType("navigation");
    const isReload = perfEntries.length > 0 && perfEntries[0].type === "reload";

    if (!isReload) {
        return; // Nếu không phải reload (ví dụ: chuyển trang, click link) thì thoát luôn
    }

    // 2. Cấu hình đường dẫn (giữ nguyên của bạn)
    const imgUrl = "/../assets/popup.png"; 
    const targetLink = "/../page/promotion/promotion.html"; 

    // 3. Chèn CSS
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
            top: -15px;
            right: -15px;
            width: 35px;
            height: 35px;
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

    // 4. Hàm hiển thị Popup
    function showImagePopup() {
        const popupHTML = `
            <div id="js-popup-overlay">
                <div class="js-popup-container">
                    <div class="js-popup-close">&times;</div>
                    <a href="${targetLink}" target="_blank">
                        <img src="${imgUrl}" alt="Popup Ads">
                    </a>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', popupHTML);

        const overlay = document.getElementById('js-popup-overlay');
        const closeBtn = overlay.querySelector('.js-popup-close');

        const closePopup = () => overlay.remove();
        closeBtn.onclick = closePopup;
        overlay.onclick = (e) => {
            if (e.target === overlay) closePopup();
        };
    }

    // 5. Kích hoạt
    if (document.readyState === 'complete') {
        showImagePopup();
    } else {
        window.addEventListener('load', showImagePopup);
    }
})();