import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.mjs';

document.addEventListener('htmlIncluded', function () {
  var totalSlides = document.querySelectorAll('.home-hero-slider .swiper-slide').length;
  document.getElementById('total-slides').textContent = totalSlides;

  var heroSlider = new Swiper('.home-hero-slider', {
    loop: true,
    centeredSlides: true,
    slidesPerView: 1.3,
    spaceBetween: 30,
    grabCursor: true,
    speed: 700,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    parallax: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    on: {
      slideChangeTransitionStart: function() {
        document.querySelectorAll('.slide-text').forEach(el => el.classList.remove('fade-in'));
      },
      slideChangeTransitionEnd: function(swiper) {
        const activeText = document.querySelector('.swiper-slide-active .slide-text');
        if (activeText) activeText.classList.add('fade-in');
      },
      slideChange: function(swiper) {
        const current = swiper.realIndex + 1;
        document.getElementById('current-slide').textContent = current;
      },
      progress: function(swiper) {
        swiper.slides.forEach((slide) => {
          var slideBg = slide.querySelector('.slide-bg');
          var progress = slide.progress;
          slideBg.style.transform = `translate3d(${progress * 40}px,0,0) scale(1.05)`;
        });
      },
      setTransition: function(swiper, speed) {
        swiper.slides.forEach((slide) => {
          slide.querySelector('.slide-bg').style.transition = `${speed}ms`;
        });
      }
    },
    breakpoints: {
      // Mobile
      0: {
        slidesPerView: 1,
        centeredSlides: false,
        spaceBetween: 0
      },

      // Tablet
      768: {
        slidesPerView: 1.4,
        centeredSlides: true,
        spaceBetween: 30
      },

      // Desktop
      1024: {
        slidesPerView: 1.8,
        centeredSlides: true,
        spaceBetween: 50
      }
    }

  });
});