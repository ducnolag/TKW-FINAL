/* === FLOATING SIDEBAR - SAFE MODE (NO CONFLICT) === */

window.addEventListener('load', () => {
    // Load FontAwesome
    if (!document.querySelector('link[href*="fontawesome"]')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(fa);
    }
    
    createSafeNav();
    initSafeScroll();
});

function createSafeNav() {
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            /* MÀU SẮC */
            --fsb-home: #2980b9; --fsb-cart: #e67e22; --fsb-map: #c0392b; 
            --fsb-mess: #0984e3; --fsb-top: #7f8c8d;
            --fsb-toggle: linear-gradient(135deg, #ff6b35, #e03e28);
        }

        /* === 1. CONTAINER CHUNG (Mặc định ẩn để chờ scroll) === */
        .fsb-widget {
            position: fixed;
            z-index: 99999; /* Z-index cao nhất để đè lên mọi thứ */
            top: 50%;
            /* Ẩn sang phải và mờ đi */
            transform: translateY(-50%) translateX(60px); 
            opacity: 0;
            visibility: hidden;
            display: flex;
            transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
            pointer-events: none;
            font-family: sans-serif; /* Reset font để không lỗi */
            line-height: normal;
        }

        /* Class hiện widget khi cuộn 50% */
        .fsb-widget.is-visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(-50%) translateX(0);
            pointer-events: auto;
        }

        /* === 2. ITEM STYLE (Tên class riêng biệt) === */
        .fsb-item {
            display: flex; justify-content: center; align-items: center;
            text-decoration: none; cursor: pointer; border: none; background: transparent;
            position: relative; transition: all 0.2s ease; 
            color: var(--icon-c);
            padding: 0; margin: 0; /* Reset margin/padding */
            box-sizing: border-box;
        }
        
        .fsb-badge {
            position: absolute; top: 4px; right: 4px; 
            background: #ff0000; color: white;
            font-size: 10px; font-weight: bold; width: 16px; height: 16px; 
            border-radius: 50%; display: flex; justify-content: center; align-items: center; 
            border: 2px solid white; line-height: 1; z-index: 2;
        }

        /* === 3. DESKTOP STYLE === */
        @media (min-width: 769px) {
            .fsb-widget {
                right: 0; width: 46px;
                background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px);
                border: 1px solid #eee; border-right: none; border-radius: 12px 0 0 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1); flex-direction: column; padding: 8px 0;
            }
            .fsb-toggle-btn { display: none; }
            .fsb-content { display: contents; } /* Container ảo */
            
            .fsb-item { width: 100%; height: 44px; font-size: 20px; margin-bottom: 2px; }
            .fsb-item:hover { background: #f8f9fa; }
            .fsb-item:hover::before {
                content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
                background: var(--icon-c); border-radius: 0 4px 4px 0;
            }
            
            .fsb-tooltip {
                position: absolute; right: 55px; background: #2d3436; color: white;
                padding: 5px 10px; border-radius: 6px; font-size: 12px; white-space: nowrap;
                opacity: 0; visibility: hidden; transform: translateX(10px); transition: 0.2s; pointer-events: none;
                line-height: 1.2;
            }
            .fsb-item:hover .fsb-tooltip { opacity: 1; visibility: visible; transform: translateX(0); }
        }

        /* === 4. MOBILE STYLE === */
        @media (max-width: 768px) {
            .fsb-widget {
                right: -70px; flex-direction: row; align-items: flex-start;
                filter: drop-shadow(-2px 5px 10px rgba(0,0,0,0.15));
            }
            
            .fsb-widget.is-open { right: 0; } 

            .fsb-toggle-btn {
                width: 45px; height: 45px; background: var(--fsb-toggle);
                color: white; border: none; border-radius: 8px 0 0 8px;
                cursor: pointer; display: flex; justify-content: center; align-items: center;
                font-size: 18px; margin: 0; padding: 0;
            }
            
            .fsb-content {
                background: white; width: 70px; padding: 15px 0;
                display: flex; flex-direction: column; align-items: center;
                border-radius: 0 0 0 16px; min-height: 250px;
                box-sizing: border-box;
            }
            
            .fsb-item {
                width: 45px; height: 45px; background: #f1f2f6;
                border-radius: 10px; margin-bottom: 12px; font-size: 22px;
            }
            .fsb-item:active { transform: scale(0.95); }
            .fsb-tooltip { display: none; }
            .fsb-badge { top: -4px; right: -4px; width: 18px; height: 18px; }
        }

        /* === MODAL STYLE === */
        .fsb-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100000;
            display: flex; justify-content: center; align-items: center;
            opacity: 0; visibility: hidden; transition: 0.3s; backdrop-filter: blur(3px);
        }
        .fsb-overlay.show { opacity: 1; visibility: visible; }
        .fsb-box {
            background: white; width: 90%; max-width: 340px; padding: 25px;
            border-radius: 20px; text-align: center; transform: scale(0.9); transition: 0.3s;
            font-family: sans-serif;
        }
        .fsb-overlay.show .fsb-box { transform: scale(1); }
        .fsb-inp { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px; margin: 15px 0; outline: none; box-sizing: border-box; }
        .fsb-btn { width: 100%; padding: 12px; background: #e67e22; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; }
    `;
    document.head.appendChild(style);

    const html = `
        <div id="fsb-widget" class="fsb-widget">
            <button class="fsb-toggle-btn" onclick="toggleFSB()">
                <i class="fa-solid fa-angles-left"></i>
            </button>
            <div class="fsb-content">
                <button class="fsb-item" style="--icon-c: var(--fsb-home)" onclick="fsbGoHome()">
                    <i class="fa-solid fa-house"></i>
                    <span class="fsb-tooltip">Trang chủ</span>
                </button>
                <button class="fsb-item" style="--icon-c: var(--fsb-cart)" onclick="fsbShowCart()">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span id="fsb-badge" class="fsb-badge" style="display:none">0</span>
                    <span class="fsb-tooltip">Giỏ hàng</span>
                </button>
                <button class="fsb-item" style="--icon-c: var(--fsb-map)" onclick="fsbGetLoc()">
                    <i class="fa-solid fa-map-location-dot"></i>
                    <span class="fsb-tooltip">Tính phí Ship</span>
                </button>
                <a href="https://m.me/shopanvat" target="_blank" class="fsb-item" style="--icon-c: var(--fsb-mess)">
                    <i class="fa-brands fa-facebook-messenger"></i>
                    <span class="fsb-tooltip">Chat Messenger</span>
                </a>
                <button class="fsb-item" style="--icon-c: var(--fsb-top); margin-top: auto" onclick="fsbScrollTop()">
                    <i class="fa-solid fa-arrow-up"></i>
                    <span class="fsb-tooltip">Lên đầu trang</span>
                </button>
            </div>
        </div>

        <div id="fsb-overlay" class="fsb-overlay" onclick="closeFSBLoc(event)">
            <div class="fsb-box" onclick="event.stopPropagation()">
                <i class="fa-solid fa-truck-fast" style="font-size:40px; color:#e67e22; margin-bottom:10px"></i>
                <h3 style="margin:5px 0; color:#333">Phí vận chuyển</h3>
                <input type="text" id="fsb-inp" class="fsb-inp" placeholder="Nhập địa chỉ..." autocomplete="off">
                <button class="fsb-btn" onclick="fsbCalc()">Kiểm tra</button>
                <div id="fsb-res" style="margin-top:15px; font-size:14px"></div>
                <button onclick="closeFSBLoc()" style="background:none; border:none; color:#999; margin-top:10px; cursor:pointer">Đóng</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

function initSafeScroll() {
    updateFSBBadge();
    
    // Logic Cuộn 50%
    const widget = document.getElementById('fsb-widget');
    const checkScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
        
        if (scrollPercent >= 50) {
            widget.classList.add('is-visible');
        } else {
            widget.classList.remove('is-visible');
            widget.classList.remove('is-open'); // Đóng menu mobile khi ẩn
            const icon = document.querySelector('.fsb-toggle-btn i');
            if(icon) icon.className = 'fa-solid fa-angles-left';
        }
    };
    window.addEventListener('scroll', checkScroll);
    checkScroll();
}

/* === LOGIC FUNCTION (Đã đổi tên hàm để tránh trùng lặp) === */
window.toggleFSB = () => {
    const w = document.getElementById('fsb-widget');
    w.classList.toggle('is-open');
    document.querySelector('.fsb-toggle-btn i').className = w.classList.contains('is-open') ? 'fa-solid fa-angles-right' : 'fa-solid fa-angles-left';
}
window.fsbGoHome = () => window.location.href = '/index.htm';
window.fsbShowCart = () => typeof toggleQuickCart === 'function' ? toggleQuickCart() : window.location.href = '/cart/cart.htm';
window.fsbScrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

window.updateFSBBadge = (count) => {
    const badge = document.getElementById('fsb-badge');
    if (!badge) return;
    if (typeof count === 'undefined') {
        if (typeof cartData !== 'undefined') count = cartData.reduce((t, i) => t + i.qty, 0);
        else if (localStorage.getItem('cart')) try { count = JSON.parse(localStorage.getItem('cart')).reduce((t, i) => t + i.qty, 0); } catch(e){ count = 0; }
        else count = 0;
    }
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
}

window.fsbGetLoc = () => {
    document.getElementById('fsb-widget').classList.remove('is-open');
    document.querySelector('.fsb-toggle-btn i').className = 'fa-solid fa-angles-left';
    document.getElementById('fsb-overlay').classList.add('show');
    setTimeout(() => document.getElementById('fsb-inp').focus(), 100);
}
window.closeFSBLoc = (e) => { if(!e || e.target === e.currentTarget) document.getElementById('fsb-overlay').classList.remove('show'); }

window.fsbCalc = () => {
    const addr = document.getElementById('fsb-inp').value.trim();
    const res = document.getElementById('fsb-res');
    if(!addr) { res.innerHTML = '<span style="color:red">Vui lòng nhập địa chỉ</span>'; return; }
    res.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    
    // API Của bạn
    const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; 
    const SHOP = { lat: 21.0164, lng: 105.8266 };
    
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addr)}&key=${API_KEY}`)
        .then(r => r.json()).then(d => {
            if(d.status === 'OK' && d.results[0]) {
                const loc = d.results[0].geometry.location;
                const R = 6371; const dLat = (loc.lat-SHOP.lat)*Math.PI/180; const dLon = (loc.lng-SHOP.lng)*Math.PI/180;
                const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(SHOP.lat*Math.PI/180)*Math.cos(loc.lat*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
                const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                if(dist > 5) res.innerHTML = `<span style="color:red; font-weight:bold">Quá xa (${dist.toFixed(1)}km). Chỉ ship < 5km</span>`;
                else res.innerHTML = `<span style="color:green; font-weight:bold">${dist.toFixed(1)}km - Ship: ${dist<=3?15:20}.000đ</span>`;
            } else res.innerHTML = 'Không tìm thấy địa chỉ';
        }).catch(() => res.innerHTML = 'Lỗi kết nối');
}