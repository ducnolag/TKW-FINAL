// chatbot.js

let botDB = [];

// 1. Tải dữ liệu JSON
async function loadBotData() {
    try {
        const r = await fetch('/data/product.json'); // Thêm dấu / ở đầu để đảm bảo đường dẫn tuyệt đối
        const d = await r.json();
        // Gộp dữ liệu từ các danh mục
        botDB = [...(d.micay || []), ...(d.mitron || []), ...(d.anvat || [])];
    } catch(e) {
        console.error("Lỗi tải dữ liệu bot:", e);
    }
}
loadBotData();

// 2. Gắn các hàm vào window để HTML gọi được (Xử lý lỗi scope của module)
window.toggleProBot = function() {
    const w = document.getElementById('pro-bot-window');
    if (w) {
        w.style.display = (w.style.display === 'flex') ? 'none' : 'flex';
    }
};


// Hàm thêm tin nhắn vào khung chat
window.pushProMsg = function(html, type) {
    const b = document.getElementById('pro-bot-body');
    if (!b) return;
    const d = document.createElement('div');
    d.className = `msg-wrap msg-${type}`;
    d.innerHTML = html;// nội dung tin nhắn
    b.appendChild(d);// thêm tin nhắn vào cuối mảng
    b.scrollTop = b.scrollHeight;// tự động cuộn xuống cuối
};

// Hàm xử lý gửi tin nhắn
window.proSend = function() {
    const i = document.getElementById('pro-bot-input');
    if(!i || !i.value.trim()) return;
    const v = i.value;
    window.pushProMsg(v, 'right');//Hiển thị tin nhắn bên phải 
    i.value = '';// Xóa nội dung ô nhập
    proBotLogic(v.toLowerCase());// Xử lý logic bot
};

// Hàm xử lý chọn nút
window.proSelect = function(t) {
    if(t === 'menu') { 
        window.pushProMsg("Xem thực đơn", 'right'); // Gọi hàm hiển thị tin nhắn và truyền nội dung để hiển thị bên phải 
        proBotLogic('menu'); 
    }
    else if(t === 'promo' || t === 'ưu đãi') { 
        window.pushProMsg("Ưu đãi hôm nay", 'right'); 
        proBotLogic('ưu đãi'); 
    }
    else if(t === 'call') { 
        window.pushProMsg("Liên hệ hotline", 'right');
        proBotLogic('call'); 
    }
};

// 3. Logic xử lý tin nhắn người dùng nhập
function proBotLogic(v) {
    setTimeout(() => {
        // Cập nhật logic từ khóa linh hoạt theo yêu cầu của bạn
        const isMenu = v.includes('menu') || v.includes('món') || v.includes('bán') || v.includes('phổ biến') || v.includes('bestseller') || v.includes('bán chạy');
        const isPromo = v.includes('ưu đãi') || v.includes('khuyến mãi') || v.includes('mã') || v.includes('giảm giá') || v.includes('sale') || v.includes('giảm');
        const isCall = v.includes('call') || v.includes('hotline') || v.includes('sđt');

        if(isMenu) {
            window.pushProMsg("Dạ, đây là những món bán chạy nhất của Tiệm ạ:", 'left');
            botDB.slice(0, 3).forEach(p => { // Lấy 3 món đầu tiên làm ví dụ
                // Sửa lỗi đường dẫn ảnh /.. thành /assets
                const imagePath = p.image.startsWith('/..') ? p.image.substring(3) : p.image;// Loại bỏ /.. ở đầu đường dẫn
                const card = `
                    <div class="bot-prod-item">
                        <img src="${imagePath}" onerror="this.src='https://placehold.co/100x100?text=Food'"> 
                        <div class="bot-prod-info">
                            <b>${p.title}</b>
                            <span>${p.price_current.toLocaleString('vi-VN')}đ</span>
                            <a href="/page/category/detail/detail.htm?id=${p.id}" class="bot-prod-btn">Chi tiết ngay →</a>
                        </div>
                    </div>
                `;
                window.pushProMsg(card, 'left');
            });
        } else if(isPromo) {
            window.pushProMsg("🔥 Tiệm đang có các ưu đãi cực hời cho bạn:<br>1. Nhập mã <b>CHAOBANMOI</b> để giảm 10% cho tổng đơn hàng đăng nhặp lần đầu tiên.<br>2. Nhập mã <b>THITOTNHA</b> để nhận ngay ưu đãi miên phí vận chuyển tối đa 15k", 'left');
        } else if(isCall) {
            window.pushProMsg("Dạ, Hotline của Tiệm là <b>0343130254</b>. Tụi mình luôn sẵn sàng nghe máy ạ! 🎧", 'left');
        } else {
            window.pushProMsg("Dạ, yêu cầu của bạn đang được chuyển đến nhân viên tư vấn. Vui lòng đợi trong giây lát ạ! 🎧", 'left');
        }
    }, 600);
}