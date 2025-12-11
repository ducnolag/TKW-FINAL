 // --- LOGIC MODAL & LIGHTBOX MỚI ---

    const modal = document.getElementById('detailModal');
    const lightbox = document.getElementById('lightbox');
    const modalImg = document.getElementById('modalImg');
    const lightboxImg = document.getElementById('lightboxImg');

    // Mở Modal Chi tiết
    function openModal(el) {
        // 1. Lấy dữ liệu chữ
        document.getElementById('modalTitle').textContent = el.getAttribute('data-title');
        document.getElementById('modalDetailContent').innerHTML = el.getAttribute('data-detail');
        document.getElementById('modalTermsContent').innerHTML = el.getAttribute('data-terms');
        
        // 2. Lấy nguồn ảnh từ thẻ card được click
        // (Tìm thẻ img bên trong element .common-card vừa click)
        const imgSrc = el.querySelector('img').src; 
        
        // 3. Gán ảnh vào Modal và Lightbox trước
        modalImg.src = imgSrc;
        lightboxImg.src = imgSrc;

        // 4. Hiển thị Modal
        modal.classList.add('show'); 
        document.body.classList.add('modal-open');
    }

    // Đóng Modal
    function closeModal() { 
        modal.classList.remove('show'); 
        document.body.classList.remove('modal-open'); 
    }

    // Mở Lightbox (Xem ảnh to)
    function openLightbox() {
        lightbox.classList.add('show');
    }

    // Đóng Lightbox
    function closeLightbox() {
        lightbox.classList.remove('show');
    }

    // Sự kiện click đóng Modal khi bấm ra ngoài
    modal.addEventListener('click', (e) => { 
        if(e.target === modal) closeModal(); 
    });

    // Gán sự kiện click cho tất cả các thẻ Card
    document.querySelectorAll('.common-card').forEach(card => {
        card.addEventListener('click', (e) => { 
            // Nếu không bấm vào nút (class no-modal) thì mở modal
            if (!e.target.closest('.no-modal')) {
                openModal(card); 
            }
        });
    });