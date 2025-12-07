    let cart = [];
    const SHIPPING_FEE = 30000;
    let discountPercent = 0;

    function formatPrice(price) {
      return price.toLocaleString('vi-VN') + 'đ';
    }

    function loadCart() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        cart = JSON.parse(savedCart);
      }
      renderCart();
      updateSummary();
    }

    function saveCart() {
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    function renderCart() {
      const cartItems = document.getElementById('cartItems');
      const itemCount = document.getElementById('itemCount');
      
      itemCount.textContent = cart.length;

      if (cart.length === 0) {
        cartItems.innerHTML = `
          <div class="empty-cart">
            <div class="empty-cart-icon">🛒</div>
            <h3>Giỏ hàng trống</h3>
            <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <button class="shop-now-btn" onclick="window.location.href='../category/product/product.htm'">
              Mua sắm ngay
            </button>
          </div>
        `;
        document.getElementById('checkoutBtn').disabled = true;
        return;
      }

      document.getElementById('checkoutBtn').disabled = false;

      cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
          <div class="item-image">
            <img src="${item.image || 'https://via.placeholder.com/120'}" alt="${item.title}">
          </div>
          <div class="item-details">
            <div class="item-header">
              <div>
                <div class="item-name">${item.title}</div>
                <div class="item-price">${formatPrice(item.price)}</div>
              </div>
              <button class="delete-btn" onclick="removeItem(${index})" title="Xóa sản phẩm">
                🗑️
              </button>
            </div>
            <div class="item-footer">
              <div class="quantity-control">
                <button class="qty-btn" onclick="decreaseQty(${index})" ${item.quantity <= 1 ? 'disabled' : ''}>
                  −
                </button>
                <div class="qty-display">${item.quantity}</div>
                <button class="qty-btn" onclick="increaseQty(${index})">
                  +
                </button>
              </div>
              <div class="item-total">
                Thành tiền: <span>${formatPrice(item.price * item.quantity)}</span>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    function increaseQty(index) {
      cart[index].quantity++;
      saveCart();
      renderCart();
      updateSummary();
    }

    function decreaseQty(index) {
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
        saveCart();
        renderCart();
        updateSummary();
      }
    }

    function removeItem(index) {
      if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        cart.splice(index, 1);
        saveCart();
        renderCart();
        updateSummary();
      }
    }

    function updateSummary() {
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = cart.length > 0 ? SHIPPING_FEE : 0;
      const discount = subtotal * (discountPercent / 100);
      const total = subtotal + shipping - discount;

      document.getElementById('subtotal').textContent = formatPrice(subtotal);
      document.getElementById('shipping').textContent = formatPrice(shipping);
      document.getElementById('discount').textContent = '-' + formatPrice(discount);
      document.getElementById('total').textContent = formatPrice(total);
    }

    function applyPromo() {
      const promoInput = document.getElementById('promoInput');
      const code = promoInput.value.trim().toUpperCase();

      const promoCodes = {
        'GIAM10': 10,
        'GIAM20': 20,
        'SALE30': 30
      };

      if (promoCodes[code]) {
        discountPercent = promoCodes[code];
        alert(`✅ Áp dụng mã thành công! Giảm ${discountPercent}%`);
        updateSummary();
      } else if (code) {
        alert('❌ Mã giảm giá không hợp lệ');
      }
    }

    function checkout() {
      if (cart.length === 0) {
        alert('Giỏ hàng trống!');
        return;
      }
      
      // Chuyển đến trang thanh toán
      window.location.href = '../checkout/checkout.htm';
    }

    // Load cart on page load
    loadCart();