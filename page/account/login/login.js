/* =================================================
   CHUYỂN QUA LẠI GIỮA FORM ĐĂNG NHẬP / ĐĂNG KÝ
   ================================================= */
// Chuyển đổi giao diện giữa form Login và Signup
function toggleForms() {
    document.querySelector('.container').classList.toggle('log-in');
    clearMessages();
}
// Hiển thị form ĐĂNG NHẬP
function showLogin() {
    // Gỡ class log-in → hiện form login
    document.querySelector('.container').classList.remove('log-in');
    document.querySelectorAll('.mobile-toggle .btn')
        .forEach(btn => btn.classList.remove('active'));
    // Đánh dấu nút vừa bấm là active
    event.target.classList.add('active');
    // Xóa thông báo lỗi/thành công
    clearMessages();
}

// Hiển thị form ĐĂNG KÝ
function showSignup() {
    document.querySelector('.container').classList.add('log-in');
    document.querySelectorAll('.mobile-toggle .btn')
        .forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    clearMessages();
}
/* =================================================
   XÓA THÔNG BÁO
   ================================================= */

// Xóa nội dung và reset trạng thái thông báo
function clearMessages() {
    document.getElementById('loginMessage').textContent = '';
    document.getElementById('reMessage').textContent = '';

    // Reset class về mặc định
    document.getElementById('loginMessage').className = 'message';
    document.getElementById('reMessage').className = 'message';
}

/* =================================================
   HIỆN / ẨN MẬT KHẨU
   ================================================= */
// Bật / tắt hiển thị mật khẩu khi bấm icon con mắt
function togglePasswordVisibility(inputId, icon) {
    const input = document.getElementById(inputId);
    // Nếu đang ẩn mật khẩu → hiện mật khẩu
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
    // Ngược lại → ẩn mật khẩu
    else {
        input.type = 'password';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    }
}
/* =================================================
   ĐĂNG KÝ TÀI KHOẢN
   ================================================= */

// Xử lý form đăng ký
function register(event) {
    event.preventDefault(); // Chặn reload trang khi submit

    // Lấy dữ liệu người dùng nhập
    const username = document.getElementById("reUsername").value.trim();
    const email    = document.getElementById("reEmail").value.trim();
    const phone    = document.getElementById("rePhone").value.trim();
    const password = document.getElementById("rePassword").value.trim();
    const messageEl = document.getElementById("reMessage");

    // Các biểu thức kiểm tra dữ liệu
    const lowercaseLetter = /[a-z]/g;
    const uppercaseLetter = /[A-Z]/g;
    const number = /[0-9]/g;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10,11}$/;

    // Kiểm tra nhập đủ thông tin
    if (!username || !email || !phone || !password) {
        showMessage(messageEl, "Vui lòng điền đầy đủ thông tin.", "error");
        return;
    }
    // Kiểm tra độ dài username
    if (username.length < 3 || username.length > 20) {
        showMessage(messageEl, "Tên đăng nhập phải có từ 3-20 ký tự.", "error");
        return;
    }
    // Username chỉ cho phép chữ, số và _
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showMessage(messageEl, "Tên đăng nhập chỉ chứa chữ cái, số và gạch dưới.", "error");
        return;
    }
    // Kiểm tra email
    if (!emailPattern.test(email)) {
        showMessage(messageEl, "Email không hợp lệ.", "error");
        return;
    }
    // Kiểm tra số điện thoại
    if (!phonePattern.test(phone)) {
        showMessage(messageEl, "Số điện thoại phải có 10-11 chữ số.", "error");
        return;
    }
    // Kiểm tra mật khẩu
    if (password.length < 8) {
        showMessage(messageEl, "Mật khẩu phải có ít nhất 8 ký tự.", "error");
        return;
    }
    if (!password.match(lowercaseLetter)) {
        showMessage(messageEl, "Mật khẩu phải có ít nhất 1 chữ thường.", "error");
        return;
    }
    if (!password.match(uppercaseLetter)) {
        showMessage(messageEl, "Mật khẩu phải có ít nhất 1 chữ hoa.", "error");
        return;
    }
    if (!password.match(number)) {
        showMessage(messageEl, "Mật khẩu phải có ít nhất 1 chữ số.", "error");
        return;
    }
    // Tạo object user mới
    const user = {
        username,
        email,
        phone,
        password, // demo nên chưa mã hóa
        createdAt: new Date().toISOString()
    };
    // Lấy danh sách user từ sessionStorage
    let users = {};
    const usersData = sessionStorage.getItem("users");
    if (usersData) {
        users = JSON.parse(usersData);
    }
    // Kiểm tra trùng username
    if (users[username]) {
        showMessage(messageEl, "Tên đăng nhập đã tồn tại.", "error");
        return;
    }
    // Kiểm tra trùng email
    const emailExists = Object.values(users).some(u => u.email === email);
    if (emailExists) {
        showMessage(messageEl, "Email đã được sử dụng.", "error");
        return;
    }
    // Lưu user mới
    users[username] = user;
    sessionStorage.setItem("users", JSON.stringify(users));
    // Thông báo thành công
    showMessage(messageEl, "Đăng ký thành công! Bạn có thể đăng nhập ngay.", "success");
    // Sau 1.5s chuyển về form login
    setTimeout(() => {
        document.querySelector('.form-item.sign-up').reset();
        if (window.innerWidth <= 768) {
            showLogin();
        } else {
            toggleForms();
        }
    }, 1500);
}
/* =================================================
   ĐĂNG NHẬP
   ================================================= */

// Xử lý form đăng nhập
function login(event) {
    event.preventDefault(); // Chặn reload

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const messageEl = document.getElementById("loginMessage");
    // Kiểm tra nhập đủ
    if (!username || !password) {
        showMessage(messageEl, "Vui lòng nhập tên đăng nhập và mật khẩu.", "error");
        return;
    }
    // Lấy danh sách user đã đăng ký
    const usersData = sessionStorage.getItem("users");
    if (!usersData) {
        showMessage(messageEl, "Tên đăng nhập hoặc mật khẩu không đúng.", "error");
        return;
    }
    const users = JSON.parse(usersData);
    const user = users[username];

    // Kiểm tra tồn tại user
    if (!user || user.password !== password) {
        showMessage(messageEl, "Tên đăng nhập hoặc mật khẩu không đúng.", "error");
        return;
    }

    // Đăng nhập thành công
    showMessage(messageEl, "Đăng nhập thành công! Đang chuyển hướng...", "success");

    // Lưu thông tin user đang đăng nhập
    sessionStorage.setItem("currentUser", JSON.stringify({
        username: user.username,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
        loginTime: new Date().toISOString()
    }));

    // Chuyển sang trang hồ sơ
    setTimeout(() => {
        window.location.href = "/page/account/profile/profile.html";
    }, 1000);
}

/* =================================================
   HIỂN THỊ THÔNG BÁO
   ================================================= */

// Hiển thị thông báo lỗi hoặc thành công
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = 'message ' + type;
}

/* =================================================
   ĐĂNG NHẬP / ĐĂNG KÝ BẰNG GOOGLE & FACEBOOK (GIẢ LẬP)
   ================================================= */

// Đăng nhập Google (mock)
function loginWithGoogle() {
    const mockGoogleUser = {
        username: "google_user_" + Math.floor(Math.random() * 1000),
        email: "user@gmail.com",
        loginMethod: "google",
        loginTime: new Date().toISOString(),
        createdAt: new Date().toISOString()
    };

    sessionStorage.setItem("currentUser", JSON.stringify(mockGoogleUser));
    window.location.href = "/page/account/profile/profile.html";
}

// Đăng nhập Facebook (mock)
function loginWithFacebook() {
    const mockFacebookUser = {
        username: "fb_user_" + Math.floor(Math.random() * 1000),
        email: "user@facebook.com",
        loginMethod: "facebook",
        loginTime: new Date().toISOString(),
        createdAt: new Date().toISOString()
    };

    sessionStorage.setItem("currentUser", JSON.stringify(mockFacebookUser));
    window.location.href = "/page/account/profile/profile.html";
}

// Đăng ký Google/Facebook → dùng chung logic đăng nhập
function signupWithGoogle() {
    loginWithGoogle();
}

function signupWithFacebook() {
    loginWithFacebook();
}

/* =================================================
   XỬ LÝ HASH URL (#login / #signup)
   ================================================= */

// Tự mở đúng form dựa trên URL hash
function checkURLHash() {
    const hash = window.location.hash;

    if (hash === '#signup' || hash === '#register') {
        document.querySelector('.container').classList.add('log-in');

        if (window.innerWidth <= 768) {
            document.querySelectorAll('.mobile-toggle .btn')
                .forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.mobile-toggle .btn')[1].classList.add('active');
        }
    } 
    else if (hash === '#login') {
        document.querySelector('.container').classList.remove('log-in');

        if (window.innerWidth <= 768) {
            document.querySelectorAll('.mobile-toggle .btn')
                .forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.mobile-toggle .btn')[0].classList.add('active');
        }
    }
}

/* =================================================
   KIỂM TRA KHI TẢI TRANG
   ================================================= */

window.onload = function() {
    // Kiểm tra URL hash
    checkURLHash();

    // Nếu đã đăng nhập thì chuyển thẳng sang profile
    const currentUser = sessionStorage.getItem("currentUser");
    if (currentUser) {
        window.location.href = "/page/account/profile/profile.html";
    }
};

// Khi thay đổi hash URL → cập nhật form tương ứng
window.addEventListener('hashchange', checkURLHash);
