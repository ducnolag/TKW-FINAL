var swiperBestSeller = new Swiper(".swiper-best-seller", {
    slidesPerView: 4,      
    spaceBetween: 20,      // Giảm khoảng cách từ 30 xuống 20 cho gọn
    loop: true,            
    grabCursor: true,      
    autoplay: {            
        delay: 4000,
        disableOnInteraction: false,
    },
    navigation: {          
        nextEl: ".bs-button-next",
        prevEl: ".bs-button-prev",
    },
    breakpoints: {
        0: {
            slidesPerView: 2, // Mobile hiện 2 cái rõ ràng
            spaceBetween: 10,
        },
        740: {
            slidesPerView: 3, 
            spaceBetween: 15,
        },
        1024: {
            slidesPerView: 4, // PC hiện 4
            spaceBetween: 20,
        },
        1200: {
            slidesPerView: 5, // Màn hình to hẳn thì hiện 5 cho nó nhỏ lại bớt
            spaceBetween: 20,
        }
    },
});