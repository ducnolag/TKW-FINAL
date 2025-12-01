import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.mjs';

   document.addEventListener('htmlIncluded', function() {
      var swiper = new Swiper('.swiper_product_sale', {
        slidesPerView: 4,
        spaceBetween: 24,
        speed: 600,
        loop: true, // Bật loop để tự động quay lại đầu
        
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