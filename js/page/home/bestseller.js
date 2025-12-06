import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.mjs';

// Khi include HTML xong
document.addEventListener('htmlIncluded', function () {

  // 1. Load sản phẩm từ file product.json
  fetch('/data/product.json')
    .then(res => res.json())
    .then(data => {
      const products = data.sale;

      // Chọn wrapper của slider
      const wrapper = document.querySelector('.swiper_product_sale .swiper-wrapper');
      if (!wrapper) return;

      // 2. Render sản phẩm vào slider
      wrapper.innerHTML = products.map(item => `
        <div class="swiper-slide">
          <div class="item_product_main">
            <img src="${item.image}" alt="${item.title}" class="product-image">

            <div class="product-info">
              <h3 class="product-title">${item.title}</h3>

              <div class="product-price">
                <span class="price-current">${item.price_current.toLocaleString()}₫</span>
                <span class="price-old">${item.price_old.toLocaleString()}₫</span>
              </div>

              <button class="product-button ${item.status === 'soldout' ? 'sold-out' : ''}">
                Tùy Chọn
              </button>
            </div>
          </div>
        </div>
      `).join('');
    })

    // 3. Sau khi render xong thì khởi tạo Swiper
    .then(() => {
      new Swiper('.swiper_product_sale', {
        slidesPerView: 4,
        spaceBetween: 24,
        speed: 600,
        loop: true,

        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },

        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },

        grabCursor: true,

        breakpoints: {
          320:  { slidesPerView: 1, spaceBetween: 16 },
          640:  { slidesPerView: 2, spaceBetween: 16 },
          992:  { slidesPerView: 3, spaceBetween: 20 },
          1200: { slidesPerView: 4, spaceBetween: 24 }
        }
      });
    });
});
