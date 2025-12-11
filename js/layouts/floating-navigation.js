/* === FLOATING NAVIGATION - RESPONSIVE === */
/* Hiện khi scroll xuống 20% | Desktop: Hiện luôn | Mobile: Toggle */

window.addEventListener('load', () => {
    createFloatingNavigation();
    initNavigationLogic();
    initScrollTrigger();
});

function createFloatingNavigation() {
    // Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        /* === DESKTOP: Hiện luôn, không toggle === */
        @media (min-width: 769px) {
            .float-nav-container {
                position: fixed;
                top: 55%;
                right: 15px;
                z-index: 9990;
                display: flex;
                flex-direction: column;
                gap: 12px;
                transform: translateY(-50%);
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.4s ease, visibility 0.4s ease;
            }
            
            .float-nav-container.show {
                opacity: 1;
                visibility: visible;
            }
            
            .float-nav-toggle { display: none; }
            
            .float-nav-item {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
                text-decoration: none;
                position: relative;
                transition: all 0.3s ease;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
                cursor: pointer;
                border: none;
                font-size: 13px;
            }
            
            .float-nav-item:hover {
                transform: scale(1.15);
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            }
            
            .float-nav-item::before {
                content: attr(data-tooltip);
                position: absolute;
                right: 45px;
                background: rgba(0, 0, 0, 0.85);
                color: #fff;
                padding: 5px 9px;
                border-radius: 4px;
                font-size: 11px;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s;
            }
            
            .float-nav-item:hover::before { opacity: 1; }
            
            .float-badge {
                position: absolute;
                top: -2px;
                right: -2px;
                background: #ff0000;
                color: #fff;
                font-size: 8px;
                font-weight: bold;
                padding: 1px 3px;
                border-radius: 6px;
                border: 1.5px solid #fff;
                min-width: 13px;
                text-align: center;
            }
            
            .fn-home { background: linear-gradient(135deg, #ff6b35, #d82b2b); }
            .fn-cart { background: linear-gradient(135deg, #ff6b35, #ff8c42); }
            .fn-facebook { background: linear-gradient(135deg, #0088ff, #00c6ff); }
            .fn-location { background: linear-gradient(135deg, #ff6b35, #ffa500); }
            .fn-top { background: linear-gradient(135deg, #ff6b35, #d82b2b); }
        }

        /* === MOBILE: Có toggle button, vị trí giữa trang === */
        @media (max-width: 768px) {
            .float-nav-container {
                position: fixed;
                top: 55%;
                right: -55px;
                z-index: 9990;
                transition: right 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity 0.4s ease;
                display: flex;
                align-items: flex-start;
                transform: translateY(-50%);
                opacity: 0;
                visibility: hidden;
            }
            
            .float-nav-container.show {
                opacity: 1;
                visibility: visible;
            }
            
            .float-nav-container.open { right: 0; }
            
            .float-nav-toggle {
                width: 30px;
                height: 30px;
                background: linear-gradient(135deg, #ff6b35, #d82b2b);
                color: white;
                border-radius: 6px 0 0 6px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.15);
                font-size: 12px;
                border: none;
                flex-shrink: 0;
            }
            
            .float-nav-content {
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(10px);
                width: 45px;
                padding: 8px 0;
                border-radius: 0 0 0 8px;
                box-shadow: -3px 3px 10px rgba(0, 0, 0, 0.12);
                display: flex;
                flex-direction: column;
                gap: 15px;
                align-items: center;
            }
            
            .float-nav-item {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
                text-decoration: none;
                position: relative;
                transition: all 0.2s;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                cursor: pointer;
                border: none;
                font-size: 12px;
            }
            
            .float-nav-item:active { 
                transform: scale(0.9); 
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
            }
            
            .float-badge {
                position: absolute;
                top: -2px;
                right: -2px;
                background: #ff0000;
                color: #fff;
                font-size: 7px;
                font-weight: bold;
                padding: 1px 3px;
                border-radius: 5px;
                border: 1.5px solid #fff;
                min-width: 12px;
                text-align: center;
            }
            
            .fn-home { background: linear-gradient(135deg, #ff6b35, #d82b2b); }
            .fn-cart { background: linear-gradient(135deg, #ff6b35, #ff8c42); }
            .fn-facebook { background: linear-gradient(135deg, #0088ff, #00c6ff); }
            .fn-location { background: linear-gradient(135deg, #ff6b35, #ffa500); }
            .fn-top { background: linear-gradient(135deg, #ff6b35, #d82b2b); }
        }
        
        /* === MOBILE NHỎ (< 480px): Điều chỉnh thêm === */
        @media (max-width: 480px) {
            .float-nav-container {
                top: 58%;
            }
            
            .float-nav-toggle {
                width: 28px;
                height: 28px;
                font-size: 11px;
            }
            
            .float-nav-content {
                width: 42px;
                padding: 7px 0;
                gap: 12px;
            }
            
            .float-nav-item {
                width: 28px;
                height: 28px;
                font-size: 11px;
            }
        }
        
        /* === MODAL POPUP LOCATION === */
        .location-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(5px);
            z-index: 99999;
            display: none;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease;
        }
        
        .location-modal-overlay.show {
            display: flex;
        }
        
        .location-modal {
            background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
            border-radius: 20px;
            padding: 30px;
            max-width: 450px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            position: relative;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { 
                transform: translateY(50px);
                opacity: 0;
            }
            to { 
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .location-modal-header {
            text-align: center;
            margin-bottom: 25px;
        }
        
        .location-modal-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #ff6b35, #ffa500);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 15px;
            font-size: 28px;
            color: white;
            box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
        }
        
        .location-modal-title {
            font-size: 22px;
            font-weight: 700;
            color: #2c3e50;
            margin: 0 0 8px 0;
        }
        
        .location-modal-subtitle {
            font-size: 14px;
            color: #7f8c8d;
            margin: 0;
        }
        
        .location-modal-body {
            margin-bottom: 25px;
        }
        
        .location-input-group {
            position: relative;
            margin-bottom: 15px;
        }
        
        .location-input-group label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: #555;
            margin-bottom: 8px;
        }
        
        .location-input-group input {
            width: 100%;
            padding: 14px 18px;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            font-size: 15px;
            transition: all 0.3s ease;
            box-sizing: border-box;
        }
        
        .location-input-group input:focus {
            outline: none;
            border-color: #ff6b35;
            box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.1);
        }
        
        .location-info-box {
            background: linear-gradient(135deg, #fff5f0 0%, #ffe8dc 100%);
            border: 1px solid #ffd4b8;
            border-radius: 12px;
            padding: 15px;
            margin-top: 15px;
        }
        
        .location-info-item {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
            font-size: 13px;
            color: #555;
        }
        
        .location-info-item:last-child {
            margin-bottom: 0;
        }
        
        .location-info-item i {
            color: #ff6b35;
            width: 18px;
            text-align: center;
        }
        
        .location-modal-actions {
            display: flex;
            gap: 12px;
        }
        
        .location-btn {
            flex: 1;
            padding: 14px 20px;
            border: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .location-btn-primary {
            background: linear-gradient(135deg, #ff6b35, #ffa500);
            color: white;
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        }
        
        .location-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
        }
        
        .location-btn-primary:active {
            transform: translateY(0);
        }
        
        .location-btn-secondary {
            background: #f1f3f5;
            color: #555;
        }
        
        .location-btn-secondary:hover {
            background: #e9ecef;
        }
        
        .location-modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #f1f3f5;
            border: none;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.3s ease;
        }
        
        .location-modal-close:hover {
            background: #e9ecef;
            transform: rotate(90deg);
        }
        
        .location-loading {
            text-align: center;
            padding: 20px;
        }
        
        .location-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #ff6b35;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 15px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .location-result {
            background: white;
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
            border: 2px solid #e0e0e0;
        }
        
        .location-result-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .location-result-item:last-child {
            border-bottom: none;
        }
        
        .location-result-label {
            font-size: 13px;
            color: #7f8c8d;
        }
        
        .location-result-value {
            font-size: 15px;
            font-weight: 600;
            color: #2c3e50;
        }
        
        .location-result-value.highlight {
            color: #ff6b35;
            font-size: 18px;
        }
        
        .location-error {
            background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
            border: 2px solid #ffcccc;
            border-radius: 12px;
            padding: 15px;
            margin-top: 15px;
            text-align: center;
        }
        
        .location-error-icon {
            font-size: 36px;
            color: #e74c3c;
            margin-bottom: 10px;
        }
        
        .location-error-text {
            font-size: 15px;
            color: #c0392b;
            font-weight: 600;
            margin: 0 0 5px 0;
        }
        
        .location-error-subtext {
            font-size: 13px;
            color: #7f8c8d;
            margin: 0;
        }
        
        @media (max-width: 480px) {
            .location-modal {
                padding: 25px 20px;
            }
            
            .location-modal-title {
                font-size: 20px;
            }
            
            .location-btn {
                padding: 12px 16px;
                font-size: 14px;
            }
        }
    `;
    document.head.appendChild(style);

    // Inject HTML
    const html = `
        <div id="float-nav-widget" class="float-nav-container">
            <button class="float-nav-toggle" onclick="toggleFloatNav()">
                <i class="fa-solid fa-angles-left"></i>
            </button>
            
            <div class="float-nav-content">
                <button class="float-nav-item fn-home" data-tooltip="Trang chủ" onclick="floatNavGoHome()">
                    <i class="fa-solid fa-house"></i>
                </button>
                
                <button class="float-nav-item fn-cart" data-tooltip="Giỏ hàng" onclick="floatNavShowCart()">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span id="float-cart-badge" class="float-badge">0</span>
                </button>
                
                <a href="https://m.me/shopanvat" target="_blank" class="float-nav-item fn-facebook" data-tooltip="Facebook Messenger">
                    <i class="fa-brands fa-facebook-messenger"></i>
                </a>
                
                <button class="float-nav-item fn-location" data-tooltip="Vị trí của tôi" onclick="floatNavGetLocation()">
                    <i class="fa-solid fa-map-location-dot"></i>
                </button>
                
                <button class="float-nav-item fn-top" data-tooltip="Lên đầu trang" onclick="floatNavScrollTop()">
                    <i class="fa-solid fa-arrow-up"></i>
                </button>
            </div>
        </div>
        
        <!-- Location Modal -->
        <div id="location-modal-overlay" class="location-modal-overlay" onclick="closeLocationModal(event)">
            <div class="location-modal" onclick="event.stopPropagation()">
                <button class="location-modal-close" onclick="closeLocationModal()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                
                <div class="location-modal-header">
                    <div class="location-modal-icon">
                        <i class="fa-solid fa-location-dot"></i>
                    </div>
                    <h3 class="location-modal-title">Tính phí vận chuyển</h3>
                    <p class="location-modal-subtitle">Nhập địa chỉ của bạn để kiểm tra</p>
                </div>
                
                <div id="location-modal-content" class="location-modal-body">
                    <div class="location-input-group">
                        <label for="user-address-input">Địa chỉ giao hàng</label>
                        <input 
                            type="text" 
                            id="user-address-input" 
                            placeholder="Ví dụ: 123 Đường ABC, Quận XYZ, Hà Nội"
                            autocomplete="off"
                        >
                    </div>
                    
                    <div class="location-info-box">
                        <div class="location-info-item">
                            <i class="fa-solid fa-store"></i>
                            <span><strong>Địa chỉ shop:</strong> 68 Trung Tiến, Khâm Thiên, Hà Nội</span>
                        </div>
                        <div class="location-info-item">
                            <i class="fa-solid fa-circle-info"></i>
                            <span>Chỉ giao hàng trong bán kính <strong>5km</strong></span>
                        </div>
                    </div>
                    
                    <div id="location-result-container"></div>
                </div>
                
                <div class="location-modal-actions">
                    <button class="location-btn location-btn-secondary" onclick="closeLocationModal()">
                        Đóng
                    </button>
                    <button class="location-btn location-btn-primary" onclick="calculateShipping()">
                        <i class="fa-solid fa-calculator"></i> Tính phí ship
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

function initNavigationLogic() {
    // Update cart badge from localStorage or your cart system
    updateCartBadge();
    
    // Auto-close mobile menu khi resize về desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            document.getElementById('float-nav-widget').classList.remove('open');
        }
    });
}

// === SCROLL TRIGGER: Hiện khi scroll xuống 20% ===
function initScrollTrigger() {
    const widget = document.getElementById('float-nav-widget');
    let scrollThreshold = 0;
    
    // Tính toán ngưỡng 20% của trang
    function calculateThreshold() {
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        const windowHeight = window.innerHeight;
        scrollThreshold = (documentHeight - windowHeight) * 0.2; // 20% của trang
    }
    
    calculateThreshold();
    
    // Lắng nghe sự kiện scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrolled > scrollThreshold) {
            widget.classList.add('show');
        } else {
            widget.classList.remove('show');
        }
    });
    
    // Tính lại khi resize
    window.addEventListener('resize', calculateThreshold);
}

// === CÁC HÀM CHỨC NĂNG ===

// Toggle widget (mobile only)
window.toggleFloatNav = function() {
    const widget = document.getElementById('float-nav-widget');
    const icon = document.querySelector('.float-nav-toggle i');
    
    widget.classList.toggle('open');
    
    if (widget.classList.contains('open')) {
        icon.className = 'fa-solid fa-angles-right';
    } else {
        icon.className = 'fa-solid fa-angles-left';
    }
}

// Về trang chủ
window.floatNavGoHome = function() {
    window.location.href = '/index.htm'; // Thay đổi URL theo dự án của bạn
}

// Hiển thị giỏ hàng
window.floatNavShowCart = function() {
    // Có thể gọi hàm toggleQuickCart() từ widget-loader.js
    if (typeof toggleQuickCart === 'function') {
        toggleQuickCart();
    } else {
        // Hoặc chuyển đến trang giỏ hàng
        window.location.href = '/cart/cart.htm'; // Thay đổi URL theo dự án của bạn
    }
}

// Lấy địa chỉ và tính phí ship
window.floatNavGetLocation = function() {
    const modal = document.getElementById('location-modal-overlay');
    modal.classList.add('show');
    
    // Reset input và result
    document.getElementById('user-address-input').value = '';
    document.getElementById('location-result-container').innerHTML = '';
    
    // Focus vào input
    setTimeout(() => {
        document.getElementById('user-address-input').focus();
    }, 300);
    
    // Cho phép nhấn Enter để tính
    document.getElementById('user-address-input').onkeypress = function(e) {
        if (e.key === 'Enter') {
            calculateShipping();
        }
    };
}

// Đóng modal
window.closeLocationModal = function(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('location-modal-overlay');
    modal.classList.remove('show');
}

// Tính phí ship
window.calculateShipping = function() {
    const userAddress = document.getElementById('user-address-input').value.trim();
    const resultContainer = document.getElementById('location-result-container');
    
    if (!userAddress) {
        resultContainer.innerHTML = `
            <div class="location-error">
                <div class="location-error-icon">⚠️</div>
                <p class="location-error-text">Vui lòng nhập địa chỉ!</p>
            </div>
        `;
        return;
    }
    
    // Hiển thị loading
    resultContainer.innerHTML = `
        <div class="location-loading">
            <div class="location-spinner"></div>
            <p style="color: #7f8c8d; font-size: 14px;">Đang tính toán khoảng cách...</p>
        </div>
    `;
    
    // Địa chỉ shop cố định: 68 Trung Tiến, Khâm Thiên, Hà Nội
    const SHOP_ADDRESS = "68 Trung Tiến, Khâm Thiên, Hà Nội, Việt Nam";
    const SHOP_LAT = 21.0164; // Tọa độ gần đúng của Trung Tiến, Khâm Thiên
    const SHOP_LNG = 105.8266;
    
    // Sử dụng Google Maps Geocoding API
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(userAddress)}&key=YOUR_GOOGLE_MAPS_API_KEY`;
    
    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === "OK" && data.results.length > 0) {
                const userLat = data.results[0].geometry.location.lat;
                const userLng = data.results[0].geometry.location.lng;
                
                // Tính khoảng cách (km)
                const distance = calculateDistance(SHOP_LAT, SHOP_LNG, userLat, userLng);
                
                // Kiểm tra khoảng cách > 5km
                if (distance > 5) {
                    resultContainer.innerHTML = `
                        <div class="location-error">
                            <div class="location-error-icon">😔</div>
                            <p class="location-error-text">Quá xa! Không thể giao hàng</p>
                            <p class="location-error-subtext">Khoảng cách: ${distance.toFixed(2)} km (Chỉ giao trong bán kính 5km)</p>
                        </div>
                    `;
                    return;
                }
                
                // Tính phí ship dựa trên khoảng cách
                const shippingFee = calculateShippingFee(distance);
                
                // Hiển thị kết quả
                resultContainer.innerHTML = `
                    <div class="location-result">
                        <div class="location-result-item">
                            <span class="location-result-label">📍 Khoảng cách</span>
                            <span class="location-result-value">${distance.toFixed(2)} km</span>
                        </div>
                        <div class="location-result-item">
                            <span class="location-result-label">💰 Phí vận chuyển</span>
                            <span class="location-result-value highlight">${shippingFee.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                        <div class="location-result-item">
                            <span class="location-result-label">⏱️ Thời gian giao</span>
                            <span class="location-result-value">30-45 phút</span>
                        </div>
                    </div>
                `;
            } else {
                resultContainer.innerHTML = `
                    <div class="location-error">
                        <div class="location-error-icon">🔍</div>
                        <p class="location-error-text">Không tìm thấy địa chỉ</p>
                        <p class="location-error-subtext">Vui lòng nhập địa chỉ chính xác hơn</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error("Lỗi:", error);
            resultContainer.innerHTML = `
                <div class="location-error">
                    <div class="location-error-icon">❌</div>
                    <p class="location-error-text">Có lỗi xảy ra</p>
                    <p class="location-error-subtext">Vui lòng thử lại sau</p>
                </div>
            `;
        });
}

// Hàm tính khoảng cách giữa 2 điểm (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Bán kính Trái Đất (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Hàm tính phí ship theo khoảng cách
function calculateShippingFee(distance) {
    // Tùy chỉnh theo giá của bạn
    if (distance <= 3) return 15000; // 0-3km: 15k
    if (distance <= 5) return 20000; // 3-5km: 20k
    if (distance <= 10) return 30000; // 5-10km: 30k (không còn sử dụng vì giới hạn 5km)
    if (distance <= 15) return 40000; // 10-15km: 40k (không còn sử dụng vì giới hạn 5km)
    return 50000 + Math.floor((distance - 15) / 5) * 10000; // >15km (không còn sử dụng vì giới hạn 5km)
}

// Cuộn lên đầu trang
window.floatNavScrollTop = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Update cart badge
window.updateCartBadge = function(count) {
    const badge = document.getElementById('float-cart-badge');
    if (!badge) return;
    
    // Nếu không truyền count, lấy từ localStorage hoặc cartData
    if (typeof count === 'undefined') {
        // Kiểm tra nếu có cartData từ widget-loader.js
        if (typeof cartData !== 'undefined') {
            count = cartData.reduce((total, item) => total + item.qty, 0);
        } else if (localStorage.getItem('cart')) {
            const cart = JSON.parse(localStorage.getItem('cart'));
            count = cart.reduce((total, item) => total + item.qty, 0);
        } else {
            count = 0;
        }
    }
    
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
}