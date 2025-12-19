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
    // 4. Initialize play button animation
    initPlayButton();
    // 5. Initialize image hover effects
    initImageEffects();
    // 6. Initialize parallax scrolling
    initParallaxEffect();
});

/* ========================================
   Hiệu ứng nút play
   ======================================== */
function initPlayButton() {
    const playButton = document.querySelector('.play-button');
    
    if (playButton) {
        // Pulse animation
        setInterval(() => {
            playButton.style.animation = 'none';
            setTimeout(() => {
                playButton.style.animation = 'pulse 2s infinite';
            }, 10);
        }, 3000);
        
        playButton.addEventListener('click', function() {
            alert('Video sẽ được phát ở đây!');
        });
    }
}

/* Pulse animation keyframes */
const style = document.createElement('style');
style.innerHTML = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(247, 179, 43, 0.7);
        }
        50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 20px rgba(247, 179, 43, 0);
        }
    }
`;
document.head.appendChild(style);

/* ========================================
   Slider đánh giá
   ======================================== */
function initTestimonialSlider() {
    const testimonials = [
        {
            avatar: 'https://i.pravatar.cc/150?img=32',
            quote: 'Món ăn ở Tiệm thực sự tuyệt vời! Từ vị cay của mì cay đến sự cân bằng của mì trộn, tất cả đều hoàn hảo. Tôi đã trở thành khách hàng thường xuyên của Tiệm.',
            name: 'Nguyễn Minh Châu',
            role: 'Khách hàng thân thiết'
        },
        {
            avatar: 'https://i.pravatar.cc/150?img=33',
            quote: 'Chất lượng món ăn luôn đảm bảo, phục vụ nhiệt tình. Đặc biệt là món mì trộn độc quyền, thật sự không thể cưỡng lại được!',
            name: 'Trần Thị Bình',
            role: 'Food Blogger'
        },
        {
            avatar: 'https://i.pravatar.cc/150?img=34',
            quote: 'Tiệm đã làm tôi thay đổi quan niệm về đồ ăn vặt. Mọi thứ đều được chế biến cẩn thận và sạch sẽ. Tôi rất tin tưởng vào chất lượng của Tiệm.',
            name: 'Lê Minh Qaung',
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
  Hiệu ứng hover hình ảnh
   ======================================== */
function initImageEffects() {
    // Intro images hover
    const introImages = document.querySelectorAll('.intro-images img');
    introImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(2deg)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Product images hover
    const productImages = document.querySelectorAll('.product-image');
    productImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            const decoration = this.querySelector('.product-decoration');
            if (decoration) {
                decoration.style.opacity = '1';
                decoration.style.transform = 'rotate(360deg) scale(1.1)';
            }
        });
        
        img.addEventListener('mouseleave', function() {
            const decoration = this.querySelector('.product-decoration');
            if (decoration) {
                decoration.style.opacity = '0';
                decoration.style.transform = 'rotate(0deg) scale(1)';
            }
        });
    });
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


/* ========================================
   Tải ảnh 
   ======================================== */
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));


/* ========================================
   PERFORMANCE OPTIMIZATION - Tối ưu hiệu suất
   ======================================== */
// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttle to scroll events
const handleScroll = throttle(() => {
    // Scroll handling logic
}, 100);

window.addEventListener('scroll', handleScroll);

/* ========================================
   ACCESSIBILITY - Cải thiện accessibility
   ======================================== */
// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
});

// Add focus styles for keyboard navigation
const focusStyle = document.createElement('style');
focusStyle.innerHTML = `
    .keyboard-nav a:focus,
    .keyboard-nav button:focus {
        outline: 3px solid var(--primary-color);
        outline-offset: 3px;
    }
`;
document.head.appendChild(focusStyle);

/* ========================================
   BUTTON CLICK EFFECTS - Hiệu ứng click button
   ======================================== */
document.querySelectorAll('.btn-custom, .btn-custom-light').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            width: 100px;
            height: 100px;
            margin-top: -50px;
            margin-left: -50px;
            animation: ripple 0.6s;
            opacity: 0;
        `;
        
        const rect = this.getBoundingClientRect();
        ripple.style.left = e.clientX - rect.left + 'px';
        ripple.style.top = e.clientY - rect.top + 'px';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.innerHTML = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);