/* --- fake-notification.js --- */
/* Hiển thị thông báo người mua hàng giả lập để tạo hiệu ứng đám đông */

window.addEventListener('load', () => {
    initFakeNotification();
});

// DỮ LIỆU GIẢ LẬP (Tên khách + Sản phẩm + Địa chỉ)
const fakeData = [
    { name: "Lan Anh", loc: "Hà Nội", product: "Khô Gà Lá Chanh", img: "https://files.freepik.com/site/404.html" },
    { name: "Minh Tuấn", loc: "Đống Đa", product: "Cơm Cháy Siêu Ruốc", img: "https://files.freepik.com/site/404.html" },
    { name: "Chị Hạnh", loc: "Ba Đình", product: "Mực Rim Me", img: "https://files.freepik.com/site/404.html" },
    { name: "Ngọc Mai", loc: "Cầu Giấy", product: "Set Ăn Vặt Văn Phòng", img: "https://files.freepik.com/site/404.html" },
    { name: "Đức Thắng", loc: "Hoàn Kiếm", product: "Heo Khô Cháy Tỏi", img: "https://files.freepik.com/site/404.html" }
];

function initFakeNotification() {
    // 1. CSS (Dạng 1 dòng gọn gàng)
    const style = document.createElement('style');
    style.innerHTML = `
        .fake-notify-box { position: fixed; bottom: 20px; left: 20px; z-index: 9900; background: #fff; border-radius: 30px; padding: 10px 20px 10px 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 12px; transform: translateY(150%); opacity: 0; transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55); border: 1px solid #f1f1f1; max-width: 320px; pointer-events: none; }
        .fake-notify-box.show { transform: translateY(0); opacity: 1; pointer-events: auto; }
        .fake-img { width: 45px; height: 45px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .fake-content { display: flex; flex-direction: column; font-size: 13px; line-height: 1.4; }
        .fake-name { font-weight: bold; color: #333; }
        .fake-text { color: #555; font-size: 12px; }
        .fake-text span { color: #d82b2b; font-weight: 600; }
        .fake-time { font-size: 11px; color: #999; margin-top: 2px; }
        
        /* Ẩn trên mobile nếu màn hình quá nhỏ */
        @media (max-width: 480px) { .fake-notify-box { bottom: 70px; left: 10px; max-width: 280px; } }
    `;
    document.head.appendChild(style);

    // 2. HTML
    const html = `
        <div id="fake-notification" class="fake-notify-box">
            <img id="fake-img" src="" class="fake-img" alt="Product">
            <div class="fake-content">
                <div class="fake-name" id="fake-user">Loading...</div>
                <div class="fake-text">Vừa đặt <span id="fake-prod">...</span></div>
                <div class="fake-time" id="fake-ago">1 phút trước</div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    // 3. LOGIC CHẠY LOOP
    startNotificationLoop();
}

function startNotificationLoop() {
    const box = document.getElementById('fake-notification');
    const uName = document.getElementById('fake-user');
    const uProd = document.getElementById('fake-prod');
    const uImg = document.getElementById('fake-img');
    const uTime = document.getElementById('fake-ago');

    // Hàm hiển thị ngẫu nhiên
    const showRandom = () => {
        // Lấy ngẫu nhiên 1 khách
        const randomItem = fakeData[Math.floor(Math.random() * fakeData.length)];
        const randomTime = Math.floor(Math.random() * 59) + 1; // 1-60 phút

        // Gán dữ liệu
        uName.innerText = `${randomItem.name} (${randomItem.loc})`;
        uProd.innerText = randomItem.product;
        uImg.src = randomItem.img; // Bạn nhớ thay link ảnh thật vào biến fakeData ở trên
        uTime.innerText = `${randomTime} phút trước`;

        // Hiện lên
        box.classList.add('show');

        // Sau 4 giây thì ẩn đi
        setTimeout(() => {
            box.classList.remove('show');
        }, 4000);
    };

    // Lần đầu tiên hiện sau 5 giây
    setTimeout(() => {
        showRandom();
        
        // Sau đó cứ mỗi 15 giây hiện 1 lần
        setInterval(showRandom, 1500);
    }, 5000);
}