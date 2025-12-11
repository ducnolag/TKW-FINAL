/* --- promotion-loader.js --- */
/* Layout: Nav Trái - Address Giữa - Close Phải */
/* Tốc độ: Hiển thị ngay lập tức, không hiệu ứng mờ */

document.addEventListener('DOMContentLoaded', () => {
    injectPromoStyles();
    createModalStructure();
});

function injectPromoStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        /* --- 1. LỚP NỀN MỜ --- */
        .modal-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: none; /* Ẩn mặc định */
            justify-content: center;
            align-items: center;
            z-index: 9999;
            backdrop-filter: blur(2px);
        }
        
        .modal-overlay.active {
            display: flex;
            /* Animation hiện cửa sổ nhẹ nhàng */
            animation: popUp 0.2s ease-out forwards;
        }

        @keyframes popUp {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }

        /* --- 2. KHUNG CỬA SỔ --- */
        .browser-window {
            width: 90%;
            max-width: 1000px;
            height: 85vh;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid #cfd1d4;
        }

        /* --- 3. HEADER (THANH CÔNG CỤ) --- */
        .browser-header {
            background: #f1f3f4;
            padding: 8px 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid #dadce0;
        }

        /* Nút điều hướng */
        .nav-btn {
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #5f6368;
            transition: background 0.2s;
            width: 32px; height: 32px;
        }
        .nav-btn:hover { background-color: #dee1e6; color: #202124; }
        .nav-btn svg { width: 18px; height: 18px; fill: currentColor; }

        /* Nút ĐÓNG (Bên phải) */
        .nav-btn.close-btn {
            margin-left: auto; /* Đẩy sang phải */
        }
        .nav-btn.close-btn:hover {
            background-color: #e81123; /* Đỏ khi hover */
            color: #fff;
        }

        /* Thanh địa chỉ (Ở giữa) */
        .browser-address-bar {
            background: #fff;
            padding: 0 15px;
            border-radius: 16px;
            font-size: 13px;
            color: #202124;
            flex-grow: 1; 
            border: 1px solid #f1f3f4;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 32px;
        }
        .browser-address-bar:hover {
            background: #f1f3f4;
            border-color: #dadce0;
        }

        /* --- 4. IFRAME (HIỆN LUÔN) --- */
        .browser-content-frame {
            flex-grow: 1;
            width: 100%;
            height: 100%;
            border: none;
            background: #fff;
            display: block; /* Hiện luôn, không ẩn */
        }
    `;
    document.head.appendChild(style);
}

function createModalStructure() {
    const promoUrl = 'Sẵn sàng ăn uống thật no nê chưa nào mấy ní ơiiii'; 

    const modalHTML = `
        <div id="promo-modal-overlay" class="modal-overlay">
            <div class="browser-window">
                <div class="browser-header">
                    
                    <div style="display: flex; gap: 4px;">
                        <button class="nav-btn" onclick="promoGoBack()" title="Quay lại">
                            <svg viewBox="0 0 24 24"><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>
                        </button>
                        <button class="nav-btn" onclick="promoReload()" title="Tải lại">
                            <svg viewBox="0 0 24 24"><path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" /></svg>
                        </button>
                    </div>

                    <div class="browser-address-bar">
                        <span style="opacity: 0.5; margin-right: 6px;">🔒</span> ${promoUrl}
                    </div>

                    <button class="nav-btn close-btn" onclick="closePromoModal()" title="Đóng cửa sổ">
                        <svg viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>
                    </button>

                </div>
                
                <iframe id="promo-iframe" class="browser-content-frame" loading="lazy"></iframe>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Đóng khi click ra ngoài vùng trắng
    document.getElementById('promo-modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'promo-modal-overlay') closePromoModal();
    });
}

/* --- LOGIC XỬ LÝ --- */
function openPromoModal() {
    const modal = document.getElementById('promo-modal-overlay');
    const iframe = document.getElementById('promo-iframe');
    const targetUrl = '../HtmL/promotion.html'; 

    if (modal && iframe) {
        // Chỉ load nếu iframe đang trống (lần đầu mở)
        // hoặc bạn muốn reload mỗi lần mở thì bỏ điều kiện if này đi
        if (!iframe.src || iframe.src === 'about:blank') {
            iframe.src = targetUrl;
        } else {
            // Nếu muốn mỗi lần mở là load mới lại hoàn toàn thì dùng dòng dưới:
             iframe.src = targetUrl;
        }

        modal.classList.add('active');
    }
}

function closePromoModal() {
    const modal = document.getElementById('promo-modal-overlay');
    if (modal) modal.classList.remove('active');
}

function promoGoBack() {
    const iframe = document.getElementById('promo-iframe');
    if (iframe && iframe.contentWindow) iframe.contentWindow.history.back();
}

function promoReload() {
    const iframe = document.getElementById('promo-iframe');
    if (iframe) {
        // Reload đơn giản, giữ nguyên src
        iframe.contentWindow.location.reload();
    }
}