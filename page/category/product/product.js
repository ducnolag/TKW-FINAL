let allData = null;
    let currentCategory = 'all';
    let currentView = 'grid';
    let currentSort = 'default';
    let searchQuery = '';
    let currentPage = 1; // ⭐ THÊM
    const productsPerPage = 12; // ⭐ THÊM - 12 sản phẩm/trang (4 dòng × 3 cột)

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
        <div class="product-item bs-card" onclick="window.location.href='/page/category/detail/detail.htm?id=${item.id}'" style="cursor: pointer;">
          <div class="bs-img-wrapper">
            ${item.image ? `<img src="${item.image}" alt="${item.title}">` : `<img src="https://via.placeholder.com/280x250/fff5e1/ff6b35?text=${encodeURIComponent(item.title)}" alt="${item.title}">`}
          </div>
          <div class="bs-content">
            <h3 class="bs-name">${item.title}</h3>
            <div class="bs-price-row">
              <span class="price-current">${formatPrice(item.price_current)}</span>
              <span class="price-old">${formatPrice(item.price_old)}</span>
            </div>
            <a href="/page/category/detail/detail.htm?id=${item.id}" class="btn-pill-outline">
              ${item.status === 'soldout' ? 'TÙY CHỌN' : 'MUA HÀNG'}
            </a>
          </div>
        </div>
      `;
    }

    // ⭐ CẬP NHẬT HÀM TẠO HTML PHÂN TRANG
    function createPaginationHTML(totalPages) {
      if (totalPages <= 1) return '';
      
      let html = '<div class="pagination">';
      
      // Nút Previous
      if (currentPage > 1) {
        html += `<button class="pagination-btn" onclick="goToPage(${currentPage - 1})">← Trang trước</button>`;
      } else {
        html += `<button class="pagination-btn" disabled>← Trang trước</button>`;
      }
      
      // Hiển thị các số trang
      html += '<div class="pagination-numbers">';
      
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);
      
      // Nút trang đầu tiên
      if (startPage > 1) {
        html += `<button class="pagination-number" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
          html += `<span class="pagination-ellipsis">...</span>`;
        }
      }
      
      // Các nút trang
      for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
          html += `<button class="pagination-number active">${i}</button>`;
        } else {
          html += `<button class="pagination-number" onclick="goToPage(${i})">${i}</button>`;
        }
      }
      
      // Nút trang cuối cùng
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          html += `<span class="pagination-ellipsis">...</span>`;
        }
        html += `<button class="pagination-number" onclick="goToPage(${totalPages})">${totalPages}</button>`;
      }
      
      html += '</div>';
      
      // Nút Next
      if (currentPage < totalPages) {
        html += `<button class="pagination-btn" onclick="goToPage(${currentPage + 1})">Trang sau →</button>`;
      } else {
        html += `<button class="pagination-btn" disabled>Trang sau →</button>`;
      }
      
      html += '</div>';
      return html;
    }

    // ⭐ THÊM HÀM CHUYỂN TRANG
    function goToPage(page) {
      currentPage = page;
      displayProducts(currentCategory);
      // Cuộn lên đầu container sản phẩm
      document.querySelector('.products-header').scrollIntoView({ behavior: 'smooth', block: 'start' });
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

      // ⭐ TÍNH TOÁN PHÂN TRANG
      const totalPages = Math.ceil(products.length / productsPerPage);
      
      // ⭐ RESET TRANG NẾU VƯỢT QUÁ PHẠM VI
      if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
      } else if (currentPage < 1) {
        currentPage = 1;
      }

      // ⭐ LẤY SẢN PHẨM CHO TRANG HIỆN TẠI
      const startIndex = (currentPage - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const pageProducts = products.slice(startIndex, endIndex);

      // Cập nhật tiêu đề
      pageTitle.textContent = titleText;
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

      // ⭐ HIỂN THỊ SẢN PHẨM VỚI PHÂN TRANG - BỌC TRONG .products
      if (products.length > 0) {
        let html = '<div class="products">';
        if (pageProducts.length > 0) {
          html += pageProducts.map(createProductHTML).join('');
        }
        html += '</div>';
        html += createPaginationHTML(totalPages);
        
        productsContainer.innerHTML = html;
        
        // ⭐ APPLY VIEW MODE HIỆN TẠI
        const productsDiv = productsContainer.querySelector('.products');
        if (productsDiv) {
          if (currentView === 'list') {
            productsDiv.classList.add('list-view');
          } else {
            productsDiv.classList.remove('list-view');
          }
        }
      } else {
        productsContainer.innerHTML = '<div style="padding: 40px; text-align: center; color: #999; grid-column: 1/-1;">Không có sản phẩm phù hợp</div>';
      }
    }

    // Chuyển đổi view
    gridView.addEventListener('click', () => {
      currentView = 'grid';
      const products = productsContainer.querySelector('.products');
      if (products) {
        products.classList.remove('list-view');
      }
      gridView.classList.add('active');
      listView.classList.remove('active');
      console.log('✅ Chuyển sang Grid view');
    });

    listView.addEventListener('click', () => {
      currentView = 'list';
      const products = productsContainer.querySelector('.products');
      if (products) {
        products.classList.add('list-view');
      }
      listView.classList.add('active');
      gridView.classList.remove('active');
      console.log('✅ Chuyển sang List view');
    });

    // Sắp xếp
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      currentPage = 1; // ⭐ RESET TRANG KHI ĐỔI SẮP XẾP
      displayProducts(currentCategory);
    });

    // Menu categories
    document.querySelectorAll('#menu li[data-category]').forEach(item => {
      item.addEventListener('click', () => {
        const category = item.getAttribute('data-category');
        currentCategory = category;
        searchQuery = '';
        currentPage = 1; // ⭐ RESET TRANG KHI ĐỔI DANH MỤC
        
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
        currentPage = 1; // ⭐ RESET TRANG KHI LOAD DỮ LIỆU
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
      
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
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
      
      localStorage.setItem('cart', JSON.stringify(cart));
      
      window.updateCartCount();
      window.dispatchEvent(new Event('cartUpdated'));
      closeModal();
    }

    function buyNowFromModal() {
      const quantity = parseInt(document.getElementById('modalQuantity').value);
      
      let cart = [];
      
      cart.push({
        id: currentModalProduct.id,
        title: currentModalProduct.title,
        price: currentModalProduct.price,
        quantity: quantity,
        image: ''
      });
      
      localStorage.setItem('cart', JSON.stringify(cart));
      
      window.updateCartCount();
      window.dispatchEvent(new Event('cartUpdated'));
      
      window.location.href = '/page/checkout/checkout.htm';
    }

    // Đóng modal khi bấm ra ngoài
    document.getElementById('quickActionModal').addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal();
      }
    });

    getData();