// Hàm chuyển đổi giữa Xem danh sách và Viết đánh giá
    function toggleReviewForm(show) {
        var listView = document.getElementById("review-list-view");
        var formView = document.getElementById("review-form-view");

        if (show) {
            listView.style.display = "none";
            formView.style.display = "block";
        } else {
            listView.style.display = "block";
            formView.style.display = "none";
        }
    }

    // Xử lý click chọn sao
    const stars = document.querySelectorAll('.star-rating i');
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            // Reset hết
            stars.forEach(s => s.classList.remove('active'));
            // Active lại từ đầu đến vị trí click
            for (let i = 0; i <= index; i++) {
                stars[i].classList.add('active');
            }
        });
    });
// --- JS NÂNG CẤP REVIEW ---

    // 1. Xem trước ảnh khi upload
    const fileInput = document.getElementById('review-file-input');
    const previewContainer = document.getElementById('preview-container');

    if(fileInput) {
        fileInput.addEventListener('change', function(e) {
            previewContainer.innerHTML = ""; // Xóa ảnh cũ
            const files = e.target.files;
            
            if (files && files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'preview-img';
                    previewContainer.appendChild(img);
                }
                reader.readAsDataURL(files[0]);
            }
        });
    }

    // 2. Chức năng thả tim "Hữu ích"
    function toggleLike(element) {
        // Toggle class màu sắc
        element.classList.toggle('liked');
        
        // Tìm thẻ icon và thẻ số lượng
        const icon = element.querySelector('i');
        const countSpan = element.querySelector('.like-count');
        let count = parseInt(countSpan.innerText);

        if (element.classList.contains('liked')) {
            // Nếu vừa like: Đổi icon rỗng thành đặc, tăng số
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            countSpan.innerText = count + 1;
            showToast("Đã đánh giá hữu ích!", "success"); // Tận dụng Toast cũ
        } else {
            // Nếu bỏ like
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
            countSpan.innerText = count - 1;
        }
    }
    
    