document.addEventListener("htmlIncluded", function () {
  // ============================================================
  // 1. QUẢN LÝ TRẠNG THÁI ĐĂNG NHẬP (AUTH STATE)
  // ============================================================
  function checkAuthState() {
    const currentUser = sessionStorage.getItem("currentUser");
    const loggedInSection = document.getElementById("loggedInSection");
    const authDropdown = document.getElementById("authDropdown");
    const usernameDisplay = document.getElementById("usernameDisplay"); // Nếu có hiển thị tên

    // console.log("Checking auth state:", currentUser ? "Logged in" : "Logged out");

    if (currentUser) {
      // Đã đăng nhập
      const user = JSON.parse(currentUser);
      if (loggedInSection) loggedInSection.classList.add("show");
      if (authDropdown) authDropdown.classList.remove("show");
      if (usernameDisplay) usernameDisplay.textContent = user.username;
    } else {
      // Chưa đăng nhập
      if (loggedInSection) loggedInSection.classList.remove("show");
      if (authDropdown) authDropdown.classList.add("show");
    }
  }

  // Chạy kiểm tra ngay khi load
  checkAuthState();

  // Lắng nghe thay đổi storage (khi đăng nhập/đăng xuất ở tab khác)
  window.addEventListener("storage", function(e) {
    if (e.key === "currentUser") {
      checkAuthState();
    }
  });

  // ============================================================
  // 2. XỬ LÝ ĐĂNG XUẤT (NEW: SỬ DỤNG MODAL POPUP)
  // ============================================================
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutModal = document.getElementById("headerLogoutModal");
  const closeLogoutModal = document.getElementById("closeLogoutModal");
  const cancelLogoutBtn = document.getElementById("cancelLogoutBtn");
  const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");

  // Hàm mở Modal
  function openLogoutPopup() {
    if (logoutModal) {
      logoutModal.classList.add("active");
    }
  }

  // Hàm đóng Modal
  function closeLogoutPopup() {
    if (logoutModal) {
      logoutModal.classList.remove("active");
    }
  }

  // Hàm thực hiện đăng xuất thật sự
  function performLogout() {
    // 1. Xóa session
    sessionStorage.removeItem("currentUser");
    
    // 2. Cập nhật giao diện header
    checkAuthState();
    
    // 3. Đóng modal
    closeLogoutPopup();
    
    // 4. Chuyển về trang chủ (hoặc reload trang)
    window.location.href = "/index.htm";
  }

  // Gán sự kiện click cho nút "Đăng xuất" trên menu
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function(e) {
      e.preventDefault(); // Chặn hành động mặc định
      openLogoutPopup();
    });
  }

  // Gán sự kiện cho các nút bên trong Modal
  if (closeLogoutModal) closeLogoutModal.addEventListener("click", closeLogoutPopup);
  if (cancelLogoutBtn) cancelLogoutBtn.addEventListener("click", closeLogoutPopup);
  
  if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener("click", performLogout);
  }

  // Click ra ngoài vùng trắng (overlay) thì đóng modal
  if (logoutModal) {
    logoutModal.addEventListener("click", function(e) {
      if (e.target === logoutModal) {
        closeLogoutPopup();
      }
    });
  }

  // ============================================================
  // 3. HIỆU ỨNG CUỘN TRANG (SCROLL EFFECT)
  // ============================================================
  window.addEventListener("scroll", function () {
    const header = document.querySelector(".header-main");
    if (header && window.scrollY > 50) {
      header.classList.add("scrolled");
    } else if (header) {
      header.classList.remove("scrolled");
    }
  });

  // ============================================================
  // 4. MOBILE MENU
  // ============================================================
  const mobileToggle = document.getElementById("mobileToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileClose = document.getElementById("mobileClose");
  const mobileOverlay = document.getElementById("mobileOverlay");

  function openMobileMenu() {
    if (mobileMenu) mobileMenu.classList.add("active");
    if (mobileOverlay) mobileOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Khóa cuộn trang chính
  }

  function closeMobileMenu() {
    if (mobileMenu) mobileMenu.classList.remove("active");
    if (mobileOverlay) mobileOverlay.classList.remove("active");
    document.body.style.overflow = ""; // Mở lại cuộn
  }

  if (mobileToggle) mobileToggle.addEventListener("click", openMobileMenu);
  if (mobileClose) mobileClose.addEventListener("click", closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener("click", closeMobileMenu);

  // Đóng menu khi nhấn ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeMobileMenu();
      closeLogoutPopup(); // Tiện thể đóng luôn popup logout nếu đang mở
    }
  });

  // ============================================================
  // 5. MEGA MENU (TẢI TỪ JSON)
  // ============================================================
  async function loadMegaMenu() {
    try {
      const response = await fetch('/data/product.json');
      const data = await response.json();
      const megaCategory = document.getElementById('megaCategory');
      
      if (!megaCategory) return;
      
      megaCategory.innerHTML = '';
      
      const categories = {
        'micay': 'Mì Cay',
        'mitron': 'Mì Trộn',
        'anvat': 'Ăn Vặt',
        'ankem': 'Ăn Kèm',
        'douong': 'Đồ Uống',
        'combo': 'Combo'
      };
      
      for (const [key, label] of Object.entries(categories)) {
        if (data[key]) {
          // Tạo link cho danh mục
          const categoryLink = document.createElement('a');
          categoryLink.href = `/page/category/product/product.htm?category=${key}`;
          categoryLink.className = 'mega-category-link';
          categoryLink.textContent = label;
          
          megaCategory.appendChild(categoryLink);
        }
      }
    } catch (error) {
      console.error('Lỗi khi tải megamenu:', error);
    }
  }
  
  loadMegaMenu();

  // ============================================================
  // 6. GIỎ HÀNG (CART COUNT)
  // ============================================================
  window.updateCartCount = function() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
      cartCountElement.textContent = totalItems;
    }
  };

  // Cập nhật ngay khi load
  window.updateCartCount();

  // Lắng nghe thay đổi từ tab khác
  window.addEventListener('storage', function(e) {
    if (e.key === 'cart') {
      window.updateCartCount();
    }
  });

  // Lắng nghe Custom Event từ cùng tab (khi bấm Add to cart)
  window.addEventListener('cartUpdated', function() {
    window.updateCartCount();
  });

  // ============================================================
  // 7. HIGHLIGHT ACTIVE MENU
  // ============================================================
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.nav-item');
  
  // Không highlight menu nếu đang ở trang cart
  if (!currentPath.includes('/page/cart/')) {
    navItems.forEach(item => {
      const link = item.querySelector('.nav-link');
      if (link) {
        const href = link.getAttribute('href');
        
        // Kiểm tra các trường hợp khác nhau
        let isActive = false;
        
        // Trang chủ
        if ((currentPath === '/' || currentPath === '/index.htm') && href === '/index.htm') {
          isActive = true;
        }
        // Trang sản phẩm (bao gồm cả detail pages)
        else if ((currentPath.includes('/page/category/') || currentPath.includes('/page/checkout/')) && href === '/page/category/product/product.htm') {
          isActive = true;
        }
        // Trang khuyến mãi
        else if (currentPath.includes('/page/promotion/') && href === '/page/promotion/promotion.html') {
          isActive = true;
        }
        // Trang giới thiệu
        else if (currentPath.includes('/page/about/') && href === '/page/about/about.html') {
          isActive = true;
        }
        // Trang tin tức
        else if (currentPath.includes('/page/news/') && href === '/page/news/news.html') {
          isActive = true;
        }
        // Trang phương thức mua hàng
        else if (currentPath.includes('/page/ptmh/') && href === '/page/ptmh/phuongthucmuahang.html') {
          isActive = true;
        }
        // Trang liên hệ
        else if (currentPath.includes('/page/lienhe/') && href === '/page/lienhe/lienhe.html') {
          isActive = true;
        }
        
        if (isActive) {
          navItems.forEach(el => el.classList.remove('active'));
          item.classList.add('active');
        }
      }
    });
  } else {
    // Xóa active từ tất cả menu khi ở trang cart
    navItems.forEach(el => el.classList.remove('active'));
  }
});

// ============================================================
// 8. TÌM KIẾM (GLOBAL FUNCTION)
// ============================================================
// Hàm này cần nằm ngoài để onsubmit trong HTML gọi được
function handleSearch(event) {
  event.preventDefault(); // Chặn reload form mặc định
  const query = event.target.querySelector('input[name="query"]').value.trim();
  if (query) {
    window.location.href = '/page/category/product/product.htm?query=' + encodeURIComponent(query);
  }
  return false;
}