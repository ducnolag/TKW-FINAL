// js/app.js
$(function () {
  // ===== Dữ liệu sản phẩm (có thể load từ products.json sau) =====
  const products = [
    {
      id: 1,
      name: "Burger Bò",
      price: 45000,
      img: "img/burger.jpg",
      desc: "Burger bò thơm ngon",
    },
    {
      id: 2,
      name: "Gà Rán (6 miếng)",
      price: 99000,
      img: "img/chicken.png",
      desc: "Gà rán giòn rụm",
    },
    {
      id: 3,
      name: "Khoai Tây Chiên",
      price: 29000,
      img: "img/fries.jpg",
      desc: "Khoai tây vàng giòn",
    },
    {
      id: 4,
      name: "Coca Cola (lon)",
      price: 15000,
      img: "img/coke.jpg",
      desc: "Nước ngọt giải khát",
    },
  ];

  // ===== Helper: giỏ hàng lưu vào localStorage =====
  const CART_KEY = "fastfood_cart_v1";

  function getCart() {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  }

  // ===== Update số lượng hiển thị ở navbar =====
  function updateCartCount() {
    const cart = getCart();
    let total = 0;
    Object.values(cart).forEach((q) => (total += q));
    $("#cart-count").text(total);
  }

  // ===== Render products on index =====
  function renderProducts() {
    const $list = $("#product-list");
    $list.empty();
    products.forEach((p) => {
      const card = `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
          <div class="card h-100">
            <img src="${p.img}" class="card-img-top" alt="${p.name}">
            <div class="card-body d-flex flex-column">
              <h5 class="product-name">${p.name}</h5>
              <p class="mb-1 text-muted">${p.desc}</p>
              <div class="mt-auto d-flex justify-content-between align-items-center">
                <div>
                  <div class="price">${formatVnd(p.price)}</div>
                </div>
                <div>
                  <button class="btn btn-sm btn-outline-primary me-2" onclick="location.href='product.html?id=${
                    p.id
                  }'">Chi tiết</button>
                  <button class="btn btn-sm btn-primary add-to-cart" data-id="${
                    p.id
                  }">Thêm</button>
                </div>
              </div>
            </div>
          </div>
        </div>`;
      $list.append(card);
    });
  }

  // ===== Format tiền =====
  function formatVnd(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  }

  // ===== Xử lý thêm vào giỏ =====
  $(document).on("click", ".add-to-cart", function () {
    const id = $(this).data("id").toString();
    const cart = getCart();
    cart[id] = (cart[id] || 0) + 1;
    saveCart(cart);

    // feedback nhỏ
    $(this)
      .text("Đã thêm")
      .delay(800)
      .queue(function (next) {
        $(this).text("Thêm");
        next();
      });
  });

  // Khởi tạo
  renderProducts();
  updateCartCount();

  // Expose helper để dùng trên các trang khác
  window.fastfood = {
    products,
    getCart,
    saveCart,
    formatVnd,
  };
});
