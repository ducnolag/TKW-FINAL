document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('successMsg');

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // chặn reload

    // Nếu form hợp lệ (HTML required)
    if (form.checkValidity()) {
      successMsg.style.display = 'block';
      form.reset();
    }
  });
});