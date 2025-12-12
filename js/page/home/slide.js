import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.mjs';

document.addEventListener('htmlIncluded', function () {
  const heroSlider = new Swiper('.home-hero-slider', {
    loop: true,
    centeredSlides: true,
    slidesPerView: 1.5,  /* Giữ nguyên hoặc thay đổi breakpoint */
    spaceBetween: 30,
    speed: 700,
    grabCursor: true,

    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },

    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },

    breakpoints: {
      0: {
        slidesPerView: 1,
        centeredSlides: false,
        spaceBetween: 10
      },
      640: {
        slidesPerView: 1.2,
        centeredSlides: true,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 1.4,
        spaceBetween: 30
      },
      1024: {
        slidesPerView: 1.5,  /* Giảm từ 1.8 → 1.5 */
        spaceBetween: 40
      },
      1280: {
        slidesPerView: 1.5,  /* Giảm từ 2 → 1.5 */
        spaceBetween: 50
      }
    },

    on: {
      progress: function (swiper) {
        swiper.slides.forEach(slide => {
          const bg = slide.querySelector('.slide-bg');
          if (bg) bg.style.transform = `translateX(${slide.progress * 40}px) scale(1.05)`;
        });
      }
    }
  });

});