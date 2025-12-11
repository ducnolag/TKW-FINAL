/* =========================================
   FILE: recommend.js
   MÔ TẢ: Hộp gợi ý mua kèm (Tách riêng nút cộng và link)
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {

    // 1. DANH SÁCH SẢN PHẨM GỢI Ý
    const suggestProducts = [
        {
            id: 1,
            name: "Khô Gà Lá Chanh",
            price: "45.000đ",
            image: "https://i.pinimg.com/564x/4e/8e/58/4e8e58daec63df4d5885293291244e8c.jpg",
            link: "product-detail.html"
        },
        {
            id: 2,
            name: "Trà Đào Cam Sả",
            price: "25.000đ",
            image: "https://i.pinimg.com/564x/d8/b1/78/d8b178c7344933a382283e33df49c4d8.jpg",
            link: "product-detail.html"
        },
        {
            id: 3,
            name: "Bánh Tráng Trộn",
            price: "20.000đ",
            image: "https://i.pinimg.com/564x/87/44/04/8744040a4545084931a296538bf34720.jpg",
            link: "product-detail.html"
        },
        {
            id: 4,
            name: "Bánh Tráng Trộn",
            price: "20.000đ",
            image: "https://i.pinimg.com/564x/87/44/04/8744040a4545084931a296538bf34720.jpg",
            link: "product-detail.html"
        },
        {
            id: 5,
            name: "Khô Gà Lá Chanh",
            price: "45.000đ",
            image: "https://i.pinimg.com/564x/4e/8e/58/4e8e58daec63df4d5885293291244e8c.jpg",
            link: "product-detail.html"
        },
        {
            id: 6,
            name: "Trà Đào Cam Sả",
            price: "25.000đ",
            image: "https://i.pinimg.com/564x/d8/b1/78/d8b178c7344933a382283e33df49c4d8.jpg",
            link: "product-detail.html"
        },
        {
            id: 7,
            name: "Bánh Tráng Trộn",
            price: "20.000đ",
            image: "https://i.pinimg.com/564x/87/44/04/8744040a4545084931a296538bf34720.jpg",
            link: "product-detail.html"
        },
        {
            id: 8,
            name: "Bánh Tráng Trộn",
            price: "20.000đ",
            image: "https://i.pinimg.com/564x/87/44/04/8744040a4545084931a296538bf34720.jpg",
            link: "product-detail.html"
        }
    ];

    // 2. TẠO HTML (CẤU TRÚC MỚI)
    // Lưu ý: .suggest-item giờ là div, bên trong có thẻ a (link) và thẻ div (nút cộng)
    const boxHTML = `
        <div id="suggest-box" class="suggest-box collapsed">
            <div class="suggest-header" onclick="toggleSuggestBox()">
                <div class="suggest-title">
                    <i class="fas fa-fire animate-fire"></i> &nbsp; Gợi ý mua kèm
                </div>
                <div class="suggest-toggle-icon">
                    <i class="fas fa-chevron-up"></i>
                </div>
            </div>

            <div class="suggest-body">
                ${suggestProducts.map(product => `
                    <div class="suggest-item">
                        
                        <a href="${product.link}" class="suggest-content-link">
                            <img src="${product.image}" alt="${product.name}">
                            <div class="suggest-info">
                                <div class="s-name">${product.name}</div>
                                <div class="s-price">${product.price}</div>
                            </div>
                        </a>

                        <div class="s-btn" onclick="addSuggestToCart(event, '${product.name}')">
                            <i class="fas fa-plus"></i>
                        </div>

                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', boxHTML);

    // 3. HÀM XỬ LÝ ĐÓNG/MỞ
    window.toggleSuggestBox = function() {
        const box = document.getElementById('suggest-box');
        const icon = box.querySelector('.suggest-toggle-icon i');
        box.classList.toggle('collapsed');
        icon.className = box.classList.contains('collapsed') ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
    }

    // 4. HÀM XỬ LÝ: THÊM VÀO GIỎ (Không chuyển trang)
    window.addSuggestToCart = function(event, productName) {
        // Ngăn chặn sự kiện nổi bọt (để chắc chắn không bị click nhầm vào thẻ cha)
        event.stopPropagation();
        
        // Hiệu ứng thông báo (Gọi hàm showToast nếu đã có, hoặc alert)
        if (typeof showToast === 'function') {
            showToast(`Đã thêm <b>${productName}</b> vào giỏ!`, 'success');
        } else {
            alert(`Đã thêm ${productName} vào giỏ hàng!`);
        }
    }

    // Tự động mở sau 3s
    setTimeout(() => {
        const box = document.getElementById('suggest-box');
        if(box) {
            box.classList.remove('collapsed');
            box.querySelector('.suggest-toggle-icon i').className = 'fas fa-chevron-down';
        }
    }, 300000);
});