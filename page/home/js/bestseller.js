import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.mjs';

// Khi include HTML xong
document.addEventListener('htmlIncluded', function () {

  // 1. Load sản phẩm từ file product.json
  fetch('/data/product.json')
    .then(res => res.json())
    .then(data => {
      // Lấy tất cả sản phẩm từ các category
      const products = [
        ...(data.micay || []),
        ...(data.mitron || []),
        ...(data.anvat || []),
        ...(data.ankem || []),
        ...(data.douong || [])
      ].slice(0, 8); // Lấy 8 sản phẩm đầu tiên làm bestseller

      // Chọn wrapper của slider
      const wrapper = document.querySelector('.swiper_product_sale .swiper-wrapper');
      if (!wrapper) return;

      // 2. Render sản phẩm vào slider (giống .bs-card structure)
      wrapper.innerHTML = products.map(item => `
        <div class="swiper-slide bs-card">
          <div class="bs-img-wrapper">
            <a href="/page/category/detail/detail.htm?id=${item.id}" style="text-decoration: none; color: inherit; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
              <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: contain;">
            </a>
          </div>
          <div class="bs-content">
            <h3 class="bs-name">${item.title}</h3>
            <div class="bs-price-row">
              <span class="price-current">${item.price_current.toLocaleString()}₫</span>
              <span class="price-old">${item.price_old.toLocaleString()}₫</span>
            </div>
            <a href="/page/category/detail/detail.htm?id=${item.id}" class="btn-pill-outline">
              ${item.status === 'soldout' ? 'XEM CHI TIẾT' : 'MUA HÀNG'}
            </a>
          </div>
        </div>
      `).join('');

      // 3. Sau khi render xong thì khởi tạo Swiper
      setTimeout(() => {
        new Swiper('.swiper_product_sale', {
          slidesPerView: 4,
          spaceBetween: 20,
          speed: 600,
          loop: true,
          navigation: {
            nextEl: '.bs-button-next',
            prevEl: '.bs-button-prev',
          },
          grabCursor: true,
          breakpoints: {
            320:  { slidesPerView: 1, spaceBetween: 10 },
            640:  { slidesPerView: 2, spaceBetween: 15 },
            992:  { slidesPerView: 3, spaceBetween: 15 },
            1200: { slidesPerView: 4, spaceBetween: 20 }
          }
        });
      }, 100);
    });
});