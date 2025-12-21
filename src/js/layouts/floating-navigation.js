/* === FLOATING SIDEBAR - FIXED VERSION === */

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
            --fsb-home: #2980b9; --fsb-cart: #e67e22; --fsb-map: #c0392b; 
            --fsb-mess: #0984e3; --fsb-top: #7f8c8d; --fsb-dice: #9b59b6;
            --fsb-toggle: linear-gradient(135deg, #ff6b35, #e03e28);
        }

        .fsb-widget {
            position: fixed; z-index: 999999; top: 50%;
            transform: translateY(-50%);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-family: 'Segoe UI', Arial, sans-serif;
            display: flex; align-items: flex-start;
        }

        /* Ẩn mặc định khi chưa cuộn */
        .fsb-widget:not(.is-visible) {
            opacity: 0; visibility: hidden; pointer-events: none;
            right: -100px;
        }

        .fsb-item {
            display: flex; justify-content: center; align-items: center;
            text-decoration: none; cursor: pointer; border: none; background: transparent;
            position: relative; transition: all 0.2s ease; color: var(--icon-c);
        }

        .fsb-badge {
            position: absolute; top: 2px; right: 2px; background: #ff0000; color: white;
            font-size: 10px; font-weight: bold; width: 18px; height: 18px; 
            border-radius: 50%; display: flex; justify-content: center; align-items: center; 
            border: 2px solid white; line-height: 1; z-index: 5;
        }

        /* === DESKTOP STYLE === */
        @media (min-width: 941px) {
            .fsb-widget { right: 0; flex-direction: column; background: white; border-radius: 12px 0 0 12px; box-shadow: -2px 0 15px rgba(0,0,0,0.1); padding: 10px 0; }
            .fsb-toggle-btn { display: none; }
            .fsb-item { width: 48px; height: 48px; font-size: 20px; }
            .fsb-item:hover { background: #f8f9fa; transform: scale(1.1); }
            .fsb-tooltip {
                position: absolute; right: 55px; background: #2d3436; color: white;
                padding: 6px 12px; border-radius: 6px; font-size: 12px; white-space: nowrap;
                opacity: 0; visibility: hidden; transition: 0.3s; pointer-events: none;
            }
            .fsb-item:hover .fsb-tooltip { opacity: 1; visibility: visible; transform: translateX(-5px); }
        }

        /* === MOBILE STYLE (Fix lỗi chồng chữ trong ảnh) === */
        @media (max-width: 941px) {
            .fsb-widget { right: -65px; } /* Giấu menu đi một phần */
            .fsb-widget.is-open { right: 0; } 
            
            .fsb-toggle-btn {
                width: 40px; height: 50px; background: var(--fsb-toggle);
                color: white; border: none; border-radius: 15px 0 0 15px; 
                font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center;
            }
            
            .fsb-content {
                background: white; width: 65px; display: flex; flex-direction: column; 
                align-items: center; border-radius: 0 0 0 15px; padding: 10px 0;
                box-shadow: -5px 0 15px rgba(0,0,0,0.1);
            }
            
            .fsb-item { width: 45px; height: 45px; background: #f8f9fa; border-radius: 10px; margin-bottom: 10px; font-size: 20px; }
            
            /* QUAN TRỌNG: Ẩn tooltip chữ trên mobile để không bị lỗi như trong ảnh */
            .fsb-tooltip { display: none !important; }
        }

        /* === RANDOM PICKER MODAL === */
        .fsb-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 1000000; display: flex; justify-content: center; align-items: center; opacity: 0; visibility: hidden; transition: 0.3s; backdrop-filter: blur(5px); }
        .fsb-overlay.show { opacity: 1; visibility: visible; }
        .fsb-box { background: white; width: 85%; max-width: 340px; padding: 25px; border-radius: 25px; text-align: center; }
        .fsb-food-img { width: 160px; height: 160px; border-radius: 20px; object-fit: cover; border: 4px solid #ff5722; margin-bottom: 15px; }
        .fsb-btn-spin { background: #c8102e; color: white; padding: 12px 20px; border-radius: 10px; border: none; font-weight: bold; cursor: pointer; width: 100%; }
        .fsb-btn-add { background: #27ae60; color: white; margin-top: 10px; padding: 12px 20px; border-radius: 10px; border: none; font-weight: bold; cursor: pointer; width: 100%; display: none; }
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
                <button class="fsb-item" style="--icon-c: var(--fsb-dice)" onclick="fsbOpenRandom()">
                    <i class="fa-solid fa-dice"></i>
                    <span class="fsb-tooltip">Hôm nay ăn gì?</span>
                </button>
                <a href="https://m.me/YOUR_PAGE_ID" target="_blank" class="fsb-item" style="--icon-c: var(--fsb-mess)">
                    <i class="fa-brands fa-facebook-messenger"></i>
                    <span class="fsb-tooltip">Chat Messenger</span>
                </a>
                <button class="fsb-item" style="--icon-c: var(--fsb-top)" onclick="fsbScrollTop()">
                    <i class="fa-solid fa-arrow-up"></i>
                    <span class="fsb-tooltip">Lên đầu</span>
                </button>
            </div>
        </div>

        <div id="fsb-random-overlay" class="fsb-overlay" onclick="fsbCloseRandom(event)">
            <div class="fsb-box">
                <h3 style="color:#ff5722; margin-top:0">Món ngon ngẫu nhiên</h3>
                <div id="fsb-random-display">
                    <i class="fa-solid fa-dice fa-4x" style="color:#eee; margin: 20px 0"></i>
                    <p>Đang chờ bạn...</p>
                </div>
                <button id="fsb-spin-btn" class="fsb-btn-spin" onclick="fsbStartSpin()">Tung xúc xắc</button>
                <button id="fsb-add-btn" class="fsb-btn-add">Thêm vào giỏ hàng</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

function initSafeScroll() {
    const widget = document.getElementById('fsb-widget');
    const updateBadge = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = cart.reduce((t, i) => t + (i.quantity || i.qty || 0), 0);
        const badge = document.getElementById('fsb-badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    };

    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) widget.classList.add('is-visible');
        else {
            widget.classList.remove('is-visible');
            widget.classList.remove('is-open');
        }
    });
    
    updateBadge();
    window.addEventListener('storage', updateBadge);
    window.addEventListener('cartUpdated', updateBadge);
}

window.toggleFSB = () => {
    const w = document.getElementById('fsb-widget');
    const icon = document.querySelector('.fsb-toggle-btn i');
    w.classList.toggle('is-open');
    icon.className = w.classList.contains('is-open') ? 'fa-solid fa-angles-right' : 'fa-solid fa-angles-left';
};

window.fsbGoHome = () => window.location.href = '/index.htm';
window.fsbShowCart = () => window.location.href = '/page/cart/cart.htm';
window.fsbScrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

window.fsbOpenRandom = () => document.getElementById('fsb-random-overlay').classList.add('show');
window.fsbCloseRandom = (e) => { if(e.target === e.currentTarget) document.getElementById('fsb-random-overlay').classList.remove('show'); };

window.fsbStartSpin = async () => {
    const display = document.getElementById('fsb-random-display');
    const spinBtn = document.getElementById('fsb-spin-btn');
    const addBtn = document.getElementById('fsb-add-btn');
    
    let allItems = [];
    try {
        const rawData = JSON.parse(localStorage.getItem('products_data'));
        if(rawData) allItems = Object.values(rawData).flat();
    } catch(e) { console.error(e); }

    if (allItems.length === 0) {
        display.innerHTML = "Chưa có dữ liệu món ăn!";
        return;
    }

    spinBtn.disabled = true;
    let count = 0;
    const timer = setInterval(() => {
        const item = allItems[Math.floor(Math.random() * allItems.length)];
        display.innerHTML = `
            <img src="${item.image}" class="fsb-food-img">
            <div style="font-weight:bold">${item.title}</div>
            <div style="color:#ff5722">${item.price_current.toLocaleString()}đ</div>
        `;
        if (count++ > 15) {
            clearInterval(timer);
            spinBtn.disabled = false;
            spinBtn.innerText = "Xoay lại";
            addBtn.style.display = 'block';
            addBtn.onclick = () => {
                // Logic thêm vào giỏ hàng của bạn ở đây
                alert("Đã thêm " + item.title + " vào giỏ!");
                document.getElementById('fsb-random-overlay').classList.remove('show');
            };
        }
    }, 100);
};