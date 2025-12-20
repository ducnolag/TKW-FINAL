(function() {
    // 1. Cấu hình
    const imgUrl = "/../assets/popup.png"; 
    const targetLink = "/../page/promotion/promotion.html"; 
    const displayDuration = 5000; // Đóng sau 5 giây (0 để tắt tự động đóng)

    // 2. Chèn CSS
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

        // Kích hoạt hiệu ứng xuất hiện (sau khi render vào DOM)
        setTimeout(() => overlay.classList.add('active'), 10);

        const closePopup = () => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 400); // Đợi hiệu ứng ẩn xong mới xóa DOM
        };

        closeBtn.onclick = closePopup;
        overlay.onclick = (e) => { if (e.target === overlay) closePopup(); };

        // Tự động đóng sau X giây
        if (displayDuration > 0) {
            setTimeout(closePopup, displayDuration);
        }
    }

    // 4. Kích hoạt khi trang đã sẵn sàng
    if (document.readyState === 'complete') {
        showImagePopup();
    } else {
        window.addEventListener('load', showImagePopup);
    }
})();