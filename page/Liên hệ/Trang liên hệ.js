/* Khởi tạo EmailJS */
  emailjs.init('YOUR_PUBLIC_KEY');

  /* Xử lý submit form */
  document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    /* Gửi form qua EmailJS */
    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
      .then(() => {
        /* Hiện thông báo thành công */
        const msg = document.getElementById('successMsg');
        msg.style.display = 'block';
        msg.style.opacity = '1';

        /* Reset form */
        this.reset();
      });
  });