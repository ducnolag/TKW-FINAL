/* --- widget-loader.js v4.0 --- */
/* Tính năng: Sidebar Phải + Giỏ hàng Phải + Menu Trái (Tự động thu gọn) */

window.addEventListener('load', () => {
    createSmartWidget();
    initSmartLogic();
    renderMockCart(); 
});

// DỮ LIỆU GIỎ HÀNG GIẢ LẬP
let cartData = [
    { id: 1, name: "Khô Gà Lá Chanh", price: 50000, qty: 2 },
    { id: 2, name: "Cơm Cháy Chà Bông", price: 35000, qty: 1 }
];

function createSmartWidget() {
    const style = document.createElement('style');
    style.innerHTML = `
        /* --- 1. CSS SIDEBAR PHẢI (Widget) --- */
        .smart-widget-container {
            position: fixed; top: 20%; right: -70px; z-index: 9990;
            transition: right 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            display: flex; align-items: flex-start;
        }
        .smart-widget-container.open { right: 0; }

        .widget-toggle-btn {
            width: 50px; height: 50px;
            background: linear-gradient(135deg, #ff6b35, #d82b2b); color: white;
            border-radius: 8px 0 0 8px; display: flex; justify-content: center; align-items: center;
            cursor: pointer; box-shadow: -4px 4px 15px rgba(0,0,0,0.2); font-size: 22px;
        }
        .widget-sidebar-content {
            background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px);
            width: 60px; padding: 15px 0; border-radius: 0 0 0 12px;
            box-shadow: -5px 5px 20px rgba(0,0,0,0.15); display: flex; flex-direction: column; gap: 15px; align-items: center;
        }
        .widget-item {
            width: 40px; height: 40px; border-radius: 10px; display: flex; justify-content: center; align-items: center;
            color: #555; text-decoration: none; position: relative; transition: all 0.2s; background: #f1f3f4; border: none; cursor: pointer;
        }
        .widget-item:hover {transform: scale(1.1) rotate(-10deg); box-shadow: 0 6px 20px rgba(216, 43, 43, 0.6); }
        .w-badge { position: absolute; top: -5px; right: -5px; background: #ff0000; color: #fff; font-size: 9px; font-weight: bold; padding: 2px 5px; border-radius: 10px; border: 2px solid #fff; }

        /* --- 2. CSS MENU TRÁI (QUICK MENU) - MỚI --- */
        .left-menu-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 10000;
            display: none; opacity: 0; transition: opacity 0.3s;
        }
        .left-menu-overlay.active { display: block; opacity: 1; }

        .left-menu-drawer {
            position: fixed; top: 0; left: -350px; /* Ẩn sang trái */
            width: 280px; height: 100%; background: #fff; z-index: 10001;
            box-shadow: 5px 0 30px rgba(0,0,0,0.2);
            transition: left 0.4s ease-in-out;
            display: flex; flex-direction: column;
        }
        .left-menu-drawer.open { left: 0; }

        .menu-header {
            background: #d82b2b; color: #fff; padding: 20px;
            display: flex; align-items: center; justify-content: space-between;
            font-size: 18px; font-weight: bold;
        }
        .menu-list { list-style: none; padding: 0; margin: 0; }
        .menu-list li { border-bottom: 1px solid #eee; }
        .menu-list a {
            display: flex; align-items: center; gap: 10px;
            padding: 15px 20px; color: #333; text-decoration: none; font-size: 15px;
            transition: 0.2s;
        }
        .menu-list a:hover { background: #f9f9f9; color: #d82b2b; padding-left: 25px; }
        .menu-list i { width: 25px; text-align: center; color: #888; }
        .menu-list a:hover i { color: #d82b2b; }

        /* --- 3. CSS GIỎ HÀNG & POPUP SHIP (GIỮ NGUYÊN) --- */
        .cart-drawer-overlay, .ship-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 10000; display: none; opacity: 0; transition: opacity 0.3s;
        }
        .cart-drawer-overlay.active, .ship-modal-overlay.active { display: block; opacity: 1; }
        
        .ship-modal-overlay { z-index: 11000; backdrop-filter: blur(3px); display: none; justify-content: center; align-items: center; }
        .ship-modal-overlay.active { display: flex; }

        .cart-drawer {
            position: fixed; top: 0; right: -400px; width: 360px; height: 100%; 
            background: #fff; z-index: 10001; box-shadow: -5px 0 30px rgba(0,0,0,0.2);
            transition: right 0.4s ease-in-out; display: flex; flex-direction: column;
        }
        .cart-drawer.open { right: 0; }
        
        /* CSS nội dung Cart & Ship rút gọn cho đỡ dài */
        .cart-header, .cart-footer { padding: 20px; background: #fff; }
        .cart-header { border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #f9f9f9; }
        .cart-body { flex-grow: 1; overflow-y: auto; padding: 20px; }
        .c-item { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px dashed #eee; padding-bottom: 15px; }
        .c-info { flex-grow: 1; }
        .c-name { font-weight: 600; display: block; margin-bottom: 4px; }
        .c-price { color: #d82b2b; font-weight: bold; }
        .btn-checkout { width: 100%; padding: 12px; background: #d82b2b; color: #fff; text-align: center; border-radius: 6px; font-weight: bold; text-decoration: none; display: block; }

        .ship-box { background: #fff; width: 340px; border-radius: 12px; overflow: hidden; box-shadow: 0 15px 50px rgba(0,0,0,0.3); }
        .ship-head { background: linear-gradient(135deg, #ff6b35, #d82b2b); color: #fff; padding: 15px; display: flex; justify-content: space-between; align-items: center; }
        .ship-body { padding: 20px; }
        .ship-input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 6px; outline:none; }
        .ship-input:focus { border-color: #d82b2b; }
        .ship-btn { width: 100%; padding: 12px; background: #333; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight:bold; }
        .ship-result { margin-top: 15px; font-size: 14px; display:none; padding:10px; background:#f9f9f9; border-radius:6px; line-height: 1.4; }
        
        @media (max-width: 480px) { .cart-drawer { width: 85%; } .left-menu-drawer { width: 80%; } }
    `;
    document.head.appendChild(style);

    const html = `
        <div id="smart-widget" class="smart-widget-container">
            <div class="widget-toggle-btn" onclick="toggleSmartWidget()"><i class="fa-solid fa-angles-left"></i></div>
            <div class="widget-sidebar-content">
                
                <button class="widget-item" onclick="toggleLeftMenu()" title="Menu Nhanh">
                    <i class="fa-solid fa-bars"></i>
                </button>
                
                <button class="widget-item" onclick="toggleQuickCart()" title="Xem giỏ hàng">
                    <i class="fa-solid fa-cart-shopping" style="background: linear-gradient(90deg, #ff6b35, #d82b2b); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"></i>
                    <span id="w-cart-count" class="w-badge">0</span>
                </button>

                <button class="widget-item" onclick="toggleShipModal()" title="Tra cứu Ship">
                    <i class="fa-solid fa-map-location-dot" style="color:#d82b2b"></i>
                </button>
                
                <a href="https://m.me/shopanvat" class="widget-item" title="Facebook"><i class="fa-brands fa-facebook-messenger" style="color:#0084ff"></i></a>
                <a href="tel:0912345678" class="widget-item" title="Gọi"><i class="fa-solid fa-phone" style="color:#2ecc71"></i></a>
                <button class="widget-item" onclick="window.scrollTo({top:0, behavior:'smooth'})" title="Lên đầu"><i class="fa-solid fa-arrow-up"></i></button>
            </div>
        </div>

        <div id="left-menu-overlay" class="left-menu-overlay" onclick="toggleLeftMenu()"></div>
        <div id="left-menu-drawer" class="left-menu-drawer">
            <div class="menu-header">
                <span><i class="fa-solid fa-utensils"></i> MENU</span>
                <span style="cursor:pointer" onclick="toggleLeftMenu()">&times;</span>
            </div>
            <ul class="menu-list">
                <li><a href="index.html"><i class="fa-solid fa-house"></i> Trang chủ</a></li>
                <li><a href="san-pham.html"><i class="fa-solid fa-burger"></i> Thực đơn</a></li>
                <li><a href="khuyen-mai.html"><i class="fa-solid fa-tags"></i> Khuyến mãi</a></li>
                <li><a href="tin-tuc.html"><i class="fa-solid fa-newspaper"></i> Tin tức / Review</a></li>
                <li><a href="lien-he.html"><i class="fa-solid fa-envelope"></i> Liên hệ</a></li>
            </ul>
        </div>

        <div id="quick-cart-overlay" class="cart-drawer-overlay" onclick="toggleQuickCart()"></div>
        <div id="quick-cart-drawer" class="cart-drawer">
            <div class="cart-header">
                <h3>Giỏ Hàng <span id="drawer-count" style="font-size:14px; color:#777">(0)</span></h3>
                <span style="font-size:24px; cursor:pointer" onclick="toggleQuickCart()">&times;</span>
            </div>
            <div id="cart-drawer-body" class="cart-body"></div>
            <div class="cart-footer">
                <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-weight:bold;">
                    <span>Tổng tiền:</span><span id="drawer-total" style="color:#d82b2b">0đ</span>
                </div>
                <a href="thanh-toan.html" class="btn-checkout">THANH TOÁN</a>
            </div>
        </div>

        <div id="ship-modal-overlay" class="ship-modal-overlay">
            <div class="ship-box">
                <div class="ship-head">
                    <h4 style="margin:0"><i class="fa-solid fa-truck-fast"></i> Phí Ship</h4>
                    <span style="cursor:pointer; font-size:24px;" onclick="toggleShipModal()">&times;</span>
                </div>
                <div class="ship-body">
                    <label style="font-size:13px; font-weight:bold; color:#555;">Nhập tên Phố/Phường:</label>
                    <input type="text" id="quick-ship-input" class="ship-input" placeholder="VD: Tôn Đức Thắng..." onkeyup="if(event.key==='Enter') checkShipLogic()">
                    <button class="ship-btn" onclick="checkShipLogic()">Kiểm Tra Ngay</button>
                    <div id="quick-ship-result" class="ship-result"></div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    // Click ngoài popup ship thì đóng
    document.getElementById('ship-modal-overlay').addEventListener('click', (e) => {
        if(e.target.id === 'ship-modal-overlay') toggleShipModal();
    });
}

function initSmartLogic() {
    setTimeout(() => { document.getElementById('smart-widget'); }, 1000);
}

// === LOGIC MỚI: BẬT MENU TRÁI ===
window.toggleLeftMenu = function() {
    const drawer = document.getElementById('left-menu-drawer');
    const overlay = document.getElementById('left-menu-overlay');
    const rightWidget = document.getElementById('smart-widget'); // Thanh hỗ trợ bên phải

    if (drawer.classList.contains('open')) {
        // Đóng menu trái
        drawer.classList.remove('open');
        overlay.classList.remove('active');
    } else {
        // Mở menu trái
        drawer.classList.add('open');
        overlay.classList.add('active');

        // *** TỰ ĐỘNG THU GỌN THANH BÊN PHẢI ***
        if (rightWidget.classList.contains('open')) {
            toggleSmartWidget(); // Gọi hàm đóng thanh phải
        }
    }
}

// === LOGIC CŨ ===
window.toggleSmartWidget = function() {
    const w = document.getElementById('smart-widget');
    w.classList.toggle('open');
    const i = document.querySelector('.widget-toggle-btn i');
    i.className = w.classList.contains('open') ? "fa-solid fa-angles-right" : "fa-solid fa-angles-left";
    
    // Nếu mở thanh phải thì đóng menu trái (cho gọn)
    if(w.classList.contains('open')) {
        document.getElementById('left-menu-drawer').classList.remove('open');
        document.getElementById('left-menu-overlay').classList.remove('active');
    }
}

window.toggleQuickCart = function() {
    const d = document.getElementById('quick-cart-drawer');
    const o = document.getElementById('quick-cart-overlay');
    document.getElementById('ship-modal-overlay').classList.remove('active'); // Đóng popup ship
    
    if(d.classList.contains('open')) {
        d.classList.remove('open'); o.classList.remove('active');
    } else {
        d.classList.add('open'); o.classList.add('active');
        renderMockCart();
    }
}

window.toggleShipModal = function() {
    const m = document.getElementById('ship-modal-overlay');
    document.getElementById('quick-cart-drawer').classList.remove('open');
    document.getElementById('quick-cart-overlay').classList.remove('active');
    
    m.classList.toggle('active');
    if(m.classList.contains('active')) {
        setTimeout(() => document.getElementById('quick-ship-input').focus(), 100);
    }
}

window.checkShipLogic = function() {
    const val = document.getElementById('quick-ship-input').value.toLowerCase();
    const res = document.getElementById('quick-ship-result');
    if(!val) { res.style.display = 'block'; res.innerHTML = 'Vui lòng nhập địa chỉ!'; return; }
    const cleanVal = val.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const keywords = ["dong da", "ba dinh", "hoan kiem", "hai ba trung", "van mieu", "quoc tu giam", "cat linh", "hang bot", "kham thien", "tho quan", "trung phung", "trung liet", "kim lien", "phuong mai", "o cho dua", "nam dong", "lang ha", "lang thuong", "giang vo", "thanh cong", "ngoc khanh", "ngoc ha", "dien bien", "quan thanh", "cua nam", "hang bong", "hang gai", "trang tien", "phan chu trinh", "le dai hanh", "bach dang", "bach khoa", "cau den", "dong mac", "nguyen luong bang", "ton duc thang", "de la thanh", "xa dan", "le duan", "giai phong", "nguyen khuyen", "ngo si lien", "tran quy cap", "linh quang", "van chuong", "thong phong", "trung tien", "hao nam", "kim ma", "nguyen thai hoc", "hoang cau", "thai ha", "chua boc", "tay son", "dang tien dong"];
    const isOk = keywords.some(k => cleanVal.includes(k));
    res.style.display = 'block';
    if(isOk) { res.innerHTML = '<strong style="color:#27ae60"><i class="fa-solid fa-circle-check"></i> Có ship!</strong><br>Phí: 15.000đ (30 phút).'; }
    else { res.innerHTML = '<strong style="color:#c0392b"><i class="fa-solid fa-circle-xmark"></i> Quá xa!</strong><br>Shop chỉ ship quanh Văn Miếu.'; }
}

function renderMockCart() {
    const body = document.getElementById('cart-drawer-body');
    const countEl = document.getElementById('w-cart-count');
    const drawerCount = document.getElementById('drawer-count');
    const totalEl = document.getElementById('drawer-total');

    const totalQty = cartData.reduce((a, b) => a + b.qty, 0);
    const totalPrice = cartData.reduce((a, b) => a + (b.price * b.qty), 0);
    
    countEl.innerText = totalQty;
    drawerCount.innerText = `(${totalQty} món)`;
    totalEl.innerText = totalPrice.toLocaleString('vi-VN') + 'đ';

    if(cartData.length === 0) {
        body.innerHTML = '<div style="text-align:center; margin-top:50px; color:#999"><i class="fa-solid fa-basket-shopping" style="font-size:40px; margin-bottom:10px;"></i><br>Chưa có món nào</div>';
        return;
    }
    
    let html = '';
    cartData.forEach((item, index) => {
        html += `
            <div class="c-item">
                <div style="width:60px; height:60px; background:#eee; display:flex; align-items:center; justify-content:center; border-radius:4px; font-size:10px;">Ảnh</div>
                <div class="c-info">
                    <span class="c-name">${item.name}</span>
                    <div class="c-price">${item.price.toLocaleString('vi-VN')}đ</div>
                    <div style="display:flex; justify-content:space-between; margin-top:5px;">
                        <span style="background:#f1f1f1; padding:2px 6px; border-radius:4px; font-size:12px">x${item.qty}</span>
                        <span style="color:#999; cursor:pointer; font-size:12px; text-decoration:underline" onclick="removeCartItem(${index})">Xóa</span>
                    </div>
                </div>
            </div>
        `;
    });
    body.innerHTML = html;
}

window.removeCartItem = function(i) {
    if(confirm('Xóa món này?')) { cartData.splice(i, 1); renderMockCart(); }
}