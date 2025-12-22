/* ========================================
   SMOOTH SCROLLING
   ======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ========================================
   INTERSECTION OBSERVER -
   ======================================== */
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

/* ========================================
   Hiệu ứng khi tải trang
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Fade in body
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // 2. Thêm fade-in class cho các sections
    const sections = document.querySelectorAll('.welcome-intro-section, .video-cta-section, .product-section, .testimonial-section, .values-section, .team-section, .delivery-section');
    sections.forEach(section => {
        section.classList.add('fade-in-section');
        fadeObserver.observe(section);
    });
    // 3. Initialize testimonial slider
    initTestimonialSlider();
    // 6. Initialize parallax scrolling
    initParallaxEffect();
});

/* ========================================
   Slider đánh giá
   ======================================== */
function initTestimonialSlider() {
    const testimonials = [
        {
            avatar: 'https://i.pravatar.cc/150?img=32',
            quote: 'Món ăn ở Tiệm thực sự tuyệt vời! Từ vị cay của mì cay đến sự cân bằng của mì trộn, tất cả đều hoàn hảo. Tôi đã trở thành khách hàng thường xuyên của Tiệm.',
            name: 'Nguyễn Văn A',
            role: 'Khách hàng thân thiết'
        },
        {
            avatar: 'https://i.pravatar.cc/150?img=33',
            quote: 'Chất lượng món ăn luôn đảm bảo, phục vụ nhiệt tình. Đặc biệt là món mì trộn độc quyền, thật sự không thể cưỡng lại được!',
            name: 'Trần Thị B',
            role: 'Food Blogger'
        },
        {
            avatar: 'https://i.pravatar.cc/150?img=34',
            quote: 'Tiệm đã làm tôi thay đổi quan niệm về đồ ăn vặt. Mọi thứ đều được chế biến cẩn thận và sạch sẽ. Tôi rất tin tưởng vào chất lượng của Tiệm.',
            name: 'Lê Minh C',
            role: 'Khách hàng VIP'
        }
    ];
    
    let currentIndex = 0;
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    
    // Click handler cho dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentIndex = index;
            updateTestimonial();
        });
    });
    
    // Auto slide
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        updateTestimonial();
    }, 5000);
    
    function updateTestimonial() {
        const testimonial = testimonials[currentIndex];
        
        // Update content với fade effect
        const testimonialContent = document.querySelector('.testimonial-content');
        testimonialContent.style.opacity = '0';
        
        setTimeout(() => {
            document.querySelector('.testimonial-avatar img').src = testimonial.avatar;
            document.querySelector('.testimonial-quote').textContent = `"${testimonial.quote}"`;
            document.querySelector('.testimonial-name').textContent = testimonial.name;
            document.querySelector('.testimonial-role').textContent = testimonial.role;
            
            // Update active dot
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
            
            testimonialContent.style.opacity = '1';
        }, 300);
    }
}

/* ========================================
   PARALLAX EFFECT - Hiệu ứng cuộn parallax
   ======================================== */
function initParallaxEffect() {
    const parallaxSections = document.querySelectorAll('.video-cta-section, .testimonial-section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = 0.5;
                const yPos = -(scrolled - section.offsetTop) * speed;
                section.style.backgroundPositionY = `${yPos}px`;
            }
        });
    });
}

/* ========================================
   Hiệu ứng cho value cards
   ======================================== */
const valueCards = document.querySelectorAll('.value-card');

valueCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.value-icon');
        if (icon) {
            icon.style.transform = 'rotateY(360deg) scale(1.1)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.value-icon');
        if (icon) {
            icon.style.transform = 'rotateY(0deg) scale(1)';
        }
    });
});
images.forEach(img => imageObserver.observe(img));
