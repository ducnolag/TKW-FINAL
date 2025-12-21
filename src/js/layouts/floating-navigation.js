/* === FLOATING SIDEBAR - PRO VERSION WITH RANDOM FOOD PICKER === */

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

        /* === CONTAINER CHUNG === */
        .fsb-widget {
            position: fixed; z-index: 99999; top: 50%;
            transform: translateY(-50%) translateX(60px); 
            opacity: 0; visibility: hidden; display: flex;
            transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
            pointer-events: none; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .fsb-widget.is-visible { opacity: 1; visibility: visible; transform: translateY(-50%) translateX(0); pointer-events: auto; }

        .fsb-item {
            display: flex; justify-content: center; align-items: center;
            text-decoration: none; cursor: pointer; border: none; background: transparent;
            position: relative; transition: all 0.2s ease; color: var(--icon-c);
            padding: 0; margin: 0; box-sizing: border-box;
        }
        
        .fsb-badge {
            position: absolute; top: 4px; right: 4px; background: #ff0000; color: white;
            font-size: 10px; font-weight: bold; width: 16px; height: 16px; 
            border-radius: 50%; display: flex; justify-content: center; align-items: center; 
            border: 2px solid white; line-height: 1; z-index: 2;
        }

        /* === DESKTOP STYLE === */
        @media (min-width: 769px) {
            .fsb-widget {
                right: 0; width: 46px; background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(8px); border: 1px solid #eee; border-radius: 12px 0 0 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1); flex-direction: column; padding: 8px 0;
            }
            .fsb-toggle-btn { display: none; }
            .fsb-content { display: contents; }
            .fsb-item { width: 100%; height: 44px; font-size: 20px; margin-bottom: 5px; }
            .fsb-item:hover { background: #f8f9fa; }
            .fsb-item:hover::before {
                content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
                background: var(--icon-c); border-radius: 0 4px 4px 0;
            }
            .fsb-tooltip {
                position: absolute; right: 55px; background: #2d3436; color: white;
                padding: 5px 10px; border-radius: 6px; font-size: 12px; white-space: nowrap;
                opacity: 0; visibility: hidden; transform: translateX(10px); transition: 0.2s; pointer-events: none;
            }
            .fsb-item:hover .fsb-tooltip { opacity: 1; visibility: visible; transform: translateX(0); }
        }

        /* === MOBILE STYLE === */
        @media (max-width: 768px) {
            .fsb-widget { right: -70px; flex-direction: row; align-items: flex-start; }
            .fsb-widget.is-open { right: 0; } 
            .fsb-toggle-btn {
                width: 45px; height: 45px; background: var(--fsb-toggle);
                color: white; border: none; border-radius: 8px 0 0 8px; font-size: 18px;
            }
            .fsb-content {
                background: white; width: 70px; padding: 15px 0; display: flex;
                flex-direction: column; align-items: center; border-radius: 0 0 0 16px; min-height: 300px;
            }
            .fsb-item { width: 45px; height: 45px; background: #f1f2f6; border-radius: 10px; margin-bottom: 12px; font-size: 22px; }
        }

        /* === RANDOM PICKER MODAL STYLE === */
        .fsb-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 100000;
            display: flex; justify-content: center; align-items: center;
            opacity: 0; visibility: hidden; transition: 0.3s; backdrop-filter: blur(5px);
        }
        .fsb-overlay.show { opacity: 1; visibility: visible; }
        .fsb-box {
            background: white; width: 90%; max-width: 350px; padding: 25px;
            border-radius: 24px; text-align: center; transform: translateY(20px); transition: 0.3s;
        }
        .fsb-overlay.show .fsb-box { transform: translateY(0); }
        
        .fsb-food-display { min-height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .fsb-food-img { width: 180px; height: 180px; border-radius: 20px; object-fit: cover; margin-bottom: 15px; border: 5px solid #ff5722; transition: 0.1s; }
        .fsb-food-name { font-weight: bold; font-size: 1.3rem; color: #c8102e; margin-bottom: 5px; }
        .fsb-food-price { color: #ff5722; font-weight: bold; font-size: 1.1rem; }

        .fsb-btn-group { display: flex; gap: 10px; margin-top: 20px; }
        .fsb-btn { flex: 1; padding: 12px; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; transition: 0.2s; }
        .fsb-btn-spin { background: #c8102e; color: white; }
        .fsb-btn-add { background: #ff5722; color: white; display: none; }
        .fsb-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Animation cho xúc xắc */
        .fsb-dice-shake { animation: fsb-shake 0.5s infinite; }
        @keyframes fsb-shake {
            0% { transform: rotate(0); }
            25% { transform: rotate(15deg); }
            50% { transform: rotate(-15deg); }
            100% { transform: rotate(0); }
        }
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

                <a href="https://www.facebook.com/messages/t/888891197636534" target="_blank" class="fsb-item" style="--icon-c: var(--fsb-mess)">
                    <i class="fa-brands fa-facebook-messenger"></i>
                    <span class="fsb-tooltip">Chat Messenger</span>
                </a>
                <button class="fsb-item" style="--icon-c: var(--fsb-top); margin-top: auto" onclick="fsbScrollTop()">
                    <i class="fa-solid fa-arrow-up"></i>
                    <span class="fsb-tooltip">Lên đầu trang</span>
                </button>
            </div>
        </div>

        <div id="fsb-random-overlay" class="fsb-overlay" onclick="fsbCloseRandom(event)">
            <div class="fsb-box">
                <h3 style="margin-top:0; color:#ff5722"><i class="fa-solid fa-wand-magic-sparkles"></i> Món ngon định mệnh</h3>
                <div id="fsb-random-display" class="fsb-food-display">
                    <i class="fa-solid fa-dice-five fa-4x" style="color: #ddd"></i>
                    <p>Đang chờ bạn tung xúc xắc...</p>
                </div>
                <div class="fsb-btn-group">
                    <button id="fsb-spin-btn" class="fsb-btn fsb-btn-spin" onclick="fsbStartSpin()">Tung xúc xắc</button>
                    <button id="fsb-add-btn" class="fsb-btn fsb-btn-add">Thêm vào giỏ</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

function initSafeScroll() {
    updateFSBBadge();
    const widget = document.getElementById('fsb-widget');
    const checkScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
        if (scrollPercent >= 10) widget.classList.add('is-visible');
        else {
            widget.classList.remove('is-visible');
            widget.classList.remove('is-open');
        }
    };
    window.addEventListener('scroll', checkScroll);
    checkScroll();
}

/* === TOAST NOTIFICATION === */
window.initToastBox = function() {
    if (!document.getElementById('toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 100000; display: flex; flex-direction: column; gap: 10px;';
        document.body.appendChild(toastContainer);
        
        // Thêm style cho toast
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.innerHTML = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
};

window.showToastMessage = function(message, type = 'success') {
    initToastBox();
    let toastContainer = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    const borderColor = type === 'success' ? '#10b981' : '#ef4444';
    const iconColor = type === 'success' ? '#10b981' : '#ef4444';
    const icon = type === 'success' 
        ? '<i class="fa-solid fa-check-circle" style="color: ' + iconColor + '; font-size: 18px; min-width: 20px;"></i>' 
        : '<i class="fa-solid fa-exclamation-circle" style="color: ' + iconColor + '; font-size: 18px; min-width: 20px;"></i>';
    
    toast.innerHTML = `${icon}<div style="color: #333;">${message}</div>`;
    toast.style.cssText = `
        background: white;
        color: #333;
        padding: 12px 20px;
        border-radius: 8px;
        border-left: 4px solid ${borderColor};
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideIn 0.3s ease;
        font-size: 14px;
        font-weight: 500;
    `;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};


/* === LOGIC FUNCTIONS === */
window.toggleFSB = () => {
    const w = document.getElementById('fsb-widget');
    w.classList.toggle('is-open');
    document.querySelector('.fsb-toggle-btn i').className = w.classList.contains('is-open') ? 'fa-solid fa-angles-right' : 'fa-solid fa-angles-left';
}

window.fsbGoHome = () => window.location.href = '/index.htm';
window.fsbShowCart = () => typeof toggleQuickCart === 'function' ? toggleQuickCart() : window.location.href = '/page/cart/cart.htm';
window.fsbScrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

window.updateFSBBadge = (count) => {
    const badge = document.getElementById('fsb-badge');
    if (!badge) return;
    if (typeof count === 'undefined') {
        if (localStorage.getItem('cart')) try { count = JSON.parse(localStorage.getItem('cart')).reduce((t, i) => t + i.qty, 0); } catch(e){ count = 0; }
        else count = 0;
    }
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
}

/* === RANDOM PICKER LOGIC === */
window.fsbOpenRandom = () => {
    document.getElementById('fsb-random-overlay').classList.add('show');
    // Tự động xoay lần đầu nếu chưa có gì
    if(!window.lastRandomResult) fsbStartSpin();
};

window.fsbCloseRandom = (e) => {
    if(e.target === e.currentTarget) document.getElementById('fsb-random-overlay').classList.remove('show');
};

window.fsbStartSpin = async () => {
    const display = document.getElementById('fsb-random-display');
    const spinBtn = document.getElementById('fsb-spin-btn');
    const addBtn = document.getElementById('fsb-add-btn');
    
    spinBtn.disabled = true;
    spinBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang chọn...';
    addBtn.style.display = 'none';

    // 1. Lấy và làm phẳng dữ liệu từ localStorage (hoặc giả lập fetch từ product.json)
    // Giả sử bạn đã lưu product.json vào localStorage key 'all_products'
    let allItems = [];
    try {
        const rawData = JSON.parse(localStorage.getItem('products_data')); 
        // Logic MIS: Biến Object Categories thành Array phẳng
        if(rawData) allItems = Object.values(rawData).flat();
    } catch(e) { console.error("Lỗi đọc dữ liệu món ăn", e); }

    if (allItems.length === 0) {
        display.innerHTML = "Không tìm thấy dữ liệu món ăn. Vui lòng kiểm tra lại!";
        spinBtn.disabled = false;
        return;
    }

    // 2. Hiệu ứng Shuffle (Xáo trộn)
    let counter = 0;
    const maxSteps = 12;
    const shuffleInterval = setInterval(() => {
        const tempItem = allItems[Math.floor(Math.random() * allItems.length)];
        display.innerHTML = `
            <img src="${tempItem.image}" class="fsb-food-img fsb-dice-shake" onerror="this.src='https://placehold.co/200x200?text=Food'">
            <div class="fsb-food-name">${tempItem.title}</div>
            <div class="fsb-food-price">${tempItem.price_current.toLocaleString()}đ</div>
        `;
        counter++;
        if (counter >= maxSteps) {
            clearInterval(shuffleInterval);
            // Kết quả cuối cùng
            const finalItem = allItems[Math.floor(Math.random() * allItems.length)];
            window.lastRandomResult = finalItem;
            
            display.innerHTML = `
                <img src="${finalItem.image}" class="fsb-food-img" style="border-color: #27ae60; transform: scale(1.05)">
                <div class="fsb-food-name">✨ ${finalItem.title} ✨</div>
                <div class="fsb-food-price">${finalItem.price_current.toLocaleString()}đ</div>
            `;
            
            spinBtn.disabled = false;
            spinBtn.innerText = "Xoay lại";
            addBtn.style.display = 'block';
            addBtn.onclick = () => {
                // Thêm vào giỏ hàng
                let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                const existingItem = cart.find(item => item.id === finalItem.id);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: finalItem.id,
                        title: finalItem.title,
                        price: finalItem.price_current,
                        quantity: 1,
                        image: finalItem.image
                    });
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Cập nhật badge floating nav
                updateFSBBadge();
                
                // Dispatch event để header cập nhật
                window.dispatchEvent(new Event('cartUpdated'));
                
                // Hiển thị toast
                initToastBox();
                showToastMessage(`Đã thêm ${finalItem.title} vào giỏ!`, 'success');
                
                document.getElementById('fsb-random-overlay').classList.remove('show');
            };
        }
    }, 100);
};