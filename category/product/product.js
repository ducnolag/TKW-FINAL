let allData = null;
    let currentCategory = 'all';
    let currentView = 'grid';
    let currentSort = 'default';
    let searchQuery = '';

    // Lấy category hoặc search query từ URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromURL = urlParams.get('category');
    const searchFromURL = urlParams.get('query');
    
    if (categoryFromURL) {
      currentCategory = categoryFromURL;
    }
    if (searchFromURL) {
      searchQuery = decodeURIComponent(searchFromURL);
    }

    const productsContainer = document.getElementById('productsContainer');
    const pageTitle = document.getElementById('pageTitle');
    const breadcrumbCategory = document.getElementById('breadcrumbCategory');
    const categoryTitle = document.getElementById('categoryTitle');
    const gridView = document.getElementById('gridView');
    const listView = document.getElementById('listView');
    const sortSelect = document.getElementById('sortSelect');

    function formatPrice(price) {
      return price.toLocaleString('vi-VN') + 'đ';
    }

    function createProductHTML(item) {
      const statusButton = item.status === 'soldout' 
        ? `<button class="btn" onclick="event.stopPropagation(); openModal(${item.id}, '${item.title}', ${item.price_current});">TÙY CHỌN</button>`
        : `<button class="btn btn-primary" onclick="event.stopPropagation(); openModal(${item.id}, '${item.title}', ${item.price_current});">MUA HÀNG</button>`;
      
      return `
        <div class="product-item" onclick="window.location.href='/category/detail/detail.htm?id=${item.id}'" style="cursor: pointer;">
          <div class="product-image">
            ${item.image ? `<img src="${item.image}" alt="${item.title}">` : `<img src="https://via.placeholder.com/280x250/f5f5f5/999?text=${encodeURIComponent(item.title)}" alt="${item.title}">`}
          </div>
          <div class="product-info">
            <h3 class="product-title">${item.title}</h3>
            <div class="price-section">
              <span class="price-current">${formatPrice(item.price_current)}</span>
              <span class="price-old">${formatPrice(item.price_old)}</span>
            </div>
            <div class="product-actions">
              ${statusButton}
            </div>
          </div>
        </div>
      `;
    }

    function sortProducts(products) {
      const sorted = [...products];
      
      switch(currentSort) {
        case 'priceAsc':
          return sorted.sort((a, b) => a.price_current - b.price_current);
        case 'priceDesc':
          return sorted.sort((a, b) => b.price_current - a.price_current);
        case 'nameAsc':
          return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'nameDesc':
          return sorted.sort((a, b) => b.title.localeCompare(a.title));
        default:
          return sorted;
      }
    }

    function displayProducts(category) {
      if (!allData) return;

      let products = [];
      let titleText = '';

      // Nếu có tìm kiếm, hiển thị kết quả tìm kiếm
      if (searchQuery) {
        const allProducts = [...allData.sale, ...allData.newsale];
        products = allProducts.filter(product => 
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        titleText = `Kết quả tìm kiếm: "${searchQuery}"`;
      } else {
        // Hiển thị theo danh mục
        if (category === 'all') {
          products = [...allData.sale, ...allData.newsale];
          titleText = 'Tất cả sản phẩm';
        } else if (category === 'sale') {
          products = allData.sale;
          titleText = 'Sản phẩm khuyến mãi';
        } else if (category === 'newsale') {
          products = allData.newsale;
          titleText = 'Sản phẩm mới';
        }
      }

      // Sắp xếp sản phẩm
      products = sortProducts(products);

      // Cập nhật tiêu đề
      pageTitle.textContent = titleText;
      breadcrumbCategory.textContent = titleText;
      categoryTitle.textContent = titleText;

      // Cập nhật sidebar - đánh dấu danh mục hiện tại (chỉ nếu không phải tìm kiếm)
      if (!searchQuery) {
        const menuItems = document.querySelectorAll('#menu li[data-category]');
        menuItems.forEach(item => {
          if (item.getAttribute('data-category') === category) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }

      // Hiển thị sản phẩm
      if (products.length > 0) {
        productsContainer.innerHTML = products.map(createProductHTML).join('');
      } else {
        productsContainer.innerHTML = '<div style="padding: 40px; text-align: center; color: #999;">Không có sản phẩm phù hợp</div>';
      }
    }

    // Chuyển đổi view
    gridView.addEventListener('click', () => {
      currentView = 'grid';
      productsContainer.classList.remove('list-view');
      gridView.classList.add('active');
      listView.classList.remove('active');
    });

    listView.addEventListener('click', () => {
      currentView = 'list';
      productsContainer.classList.add('list-view');
      listView.classList.add('active');
      gridView.classList.remove('active');
    });

    // Sắp xếp
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      displayProducts(currentCategory);
    });

    // Menu categories
    document.querySelectorAll('#menu li[data-category]').forEach(item => {
      item.addEventListener('click', () => {
        const category = item.getAttribute('data-category');
        currentCategory = category;
        searchQuery = ''; // ✅ THÊM DÒNG NÀY - Reset tìm kiếm
        
        // Update active state
        document.querySelectorAll('#menu li').forEach(li => li.classList.remove('active'));
        item.classList.add('active');
        
        displayProducts(category);
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
          closeSidebarMenu();
        }
      });
    });

    const getData = async () => {
      try {
        console.log('Đang tải dữ liệu sản phẩm...');
        const response = await fetch('/data/product.json');
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allData = await response.json();
        console.log('Dữ liệu đã tải:', allData);
        displayProducts(currentCategory);
      } catch (error) {
        console.error('Lỗi khi tải file:', error);
        productsContainer.innerHTML = `<div style="padding: 40px; text-align: center; color: #e74c3c;">❌ Lỗi: ${error.message}<br/>Kiểm tra console để xem chi tiết</div>`;
      }
    }

    // Mobile menu
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function openSidebar() {
      sidebar.classList.add('active');
      sidebarOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebarMenu() {
      sidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', openSidebar);
    sidebarOverlay.addEventListener('click', closeSidebarMenu);

    // Modal Functions
    let currentModalProduct = {
      id: null,
      title: null,
      price: null,
      image: null
    };

    function openModal(productId, productTitle, productPrice) {
      currentModalProduct = {
        id: productId,
        title: productTitle,
        price: productPrice
      };

      document.getElementById('modalProductName').textContent = productTitle;
      document.getElementById('modalProductPrice').textContent = formatPrice(productPrice);
      document.getElementById('modalQuantity').value = 1;
      document.getElementById('quickActionModal').classList.add('active');
    }

    function closeModal() {
      document.getElementById('quickActionModal').classList.remove('active');
      currentModalProduct = { id: null, title: null, price: null, image: null };
    }

    function increaseQuantityModal() {
      const input = document.getElementById('modalQuantity');
      const current = parseInt(input.value);
      if (current < 99) {
        input.value = current + 1;
      }
    }

    function decreaseQuantityModal() {
      const input = document.getElementById('modalQuantity');
      const current = parseInt(input.value);
      if (current > 1) {
        input.value = current - 1;
      }
    }

    function addToCartFromModal() {
      const quantity = parseInt(document.getElementById('modalQuantity').value);
      
      // Lấy giỏ hàng từ localStorage
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Kiểm tra sản phẩm đã tồn tại trong giỏ chưa
      const existingItem = cart.find(item => item.id === currentModalProduct.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          id: currentModalProduct.id,
          title: currentModalProduct.title,
          price: currentModalProduct.price,
          quantity: quantity,
          image: ''
        });
      }
      
      // Lưu giỏ hàng
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // ✅ Cập nhật số lượng giỏ hàng trên header
      window.updateCartCount();
      
      // ⭐ THÊM DÒNG NÀY
      window.dispatchEvent(new Event('cartUpdated'));
      
      alert(`✅ Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
      closeModal();
    }

    function buyNowFromModal() {
      const quantity = parseInt(document.getElementById('modalQuantity').value);
      
      // Lấy giỏ hàng từ localStorage
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Xóa giỏ hàng cũ
      cart = [];
      
      // Thêm sản phẩm hiện tại
      cart.push({
        id: currentModalProduct.id,
        title: currentModalProduct.title,
        price: currentModalProduct.price,
        quantity: quantity,
        image: ''
      });
      
      // Lưu giỏ hàng
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // ✅ Cập nhật số lượng giỏ hàng trên header
      window.updateCartCount();
      
      // ⭐ THÊM DÒNG NÀY
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Chuyển đến trang thanh toán
      window.location.href = '/checkout/checkout.htm';
    }

    // Đóng modal khi bấm ra ngoài
    document.getElementById('quickActionModal').addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal();
      }
    });

    getData();