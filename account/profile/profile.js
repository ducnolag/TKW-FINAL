       // Kiểm tra đăng nhập
        function checkAuth() {
            const currentUser = sessionStorage.getItem("currentUser");
            
            if (!currentUser) {
                alert("Bạn cần đăng nhập để xem trang này!");
                window.location.href = "../login/login.html";
                return null;
            }
            
            return JSON.parse(currentUser);
        }

        // Đăng xuất
        function logout() {
            if (confirm("Bạn có chắc muốn đăng xuất?")) {
                sessionStorage.removeItem("currentUser");
                alert("Đăng xuất thành công!");
                window.location.href = "../login/login.html";
            }
        }

        // Chỉnh sửa profile
        function editProfile() {
            alert("Chức năng chỉnh sửa hồ sơ đang được phát triển!");
        }

        // Đổi mật khẩu
        function changePassword() {
            const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
            const users = JSON.parse(sessionStorage.getItem("users") || "{}");
            
            const newPassword = prompt("Nhập mật khẩu mới (ít nhất 8 ký tự, có chữ hoa, chữ thường và số):");
            
            if (!newPassword) return;
            
            // Validate password
            const lowercaseLetter = /[a-z]/g;
            const uppercaseLetter = /[A-Z]/g;
            const number = /[0-9]/g;
            
            if (newPassword.length < 8 || !newPassword.match(lowercaseLetter) || 
                !newPassword.match(uppercaseLetter) || !newPassword.match(number)) {
                alert("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số!");
                return;
            }
            
            // Cập nhật mật khẩu
            if (users[currentUser.username]) {
                users[currentUser.username].password = newPassword;
                sessionStorage.setItem("users", JSON.stringify(users));
                alert("Đổi mật khẩu thành công!");
            }
        }

        // Xem lịch sử đơn hàng
        function viewOrders() {
            alert("Chức năng xem lịch sử đơn hàng đang được phát triển!");
        }

        // Render profile page
        function renderProfile(user) {
            const loginDate = new Date(user.loginTime);
            const createdDate = user.createdAt ? new Date(user.createdAt) : new Date();
            const daysActive = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
            
            // Xác định phương thức đăng nhập
            const loginMethod = user.loginMethod || 'email';
            let methodBadge = '';
            if (loginMethod === 'google') {
                methodBadge = '<span class="badge info"><i class="fab fa-google"></i> Google Account</span>';
            } else if (loginMethod === 'facebook') {
                methodBadge = '<span class="badge info"><i class="fab fa-facebook"></i> Facebook Account</span>';
            } else {
                methodBadge = '<span class="badge success"><i class="fas fa-envelope"></i> Email Account</span>';
            }
            
            const html = `
                <div class="header">
                    <h1>
                        <i class="fas fa-user-circle"></i> 
                        <span>Trang cá nhân</span>
                    </h1>
                    <div class="header-actions">
                        <a href="/index.htm" class="home-btn">
                            <i class="fas fa-home"></i>
                            <span>Trang chủ</span>
                        </a>
                        <button class="logout-btn" onclick="logout()">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </div>

                <div class="profile-card">
                    <div class="profile-header">
                        <div class="profile-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <h2 class="profile-name">${user.username}</h2>
                        <p class="profile-email">${user.email}</p>
                        ${methodBadge}
                    </div>

                    <div class="profile-body">
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-label">Tên đăng nhập</div>
                                <div class="info-value">
                                    <i class="fas fa-user"></i>
                                    ${user.username}
                                </div>
                            </div>

                            <div class="info-item">
                                <div class="info-label">Email</div>
                                <div class="info-value">
                                    <i class="fas fa-envelope"></i>
                                    ${user.email}
                                </div>
                            </div>

                            ${user.phone ? `
                            <div class="info-item">
                                <div class="info-label">Số điện thoại</div>
                                <div class="info-value">
                                    <i class="fas fa-phone"></i>
                                    ${user.phone}
                                </div>
                            </div>
                            ` : ''}

                            <div class="info-item">
                                <div class="info-label">Lần đăng nhập cuối</div>
                                <div class="info-value">
                                    <i class="fas fa-clock"></i>
                                    ${loginDate.toLocaleString('vi-VN')}
                                </div>
                            </div>
                        </div>

                        <div class="action-buttons">
                            <button class="action-btn primary" onclick="editProfile()">
                                <i class="fas fa-edit"></i>
                                Chỉnh sửa hồ sơ
                            </button>
                            <button class="action-btn" onclick="changePassword()">
                                <i class="fas fa-key"></i>
                                Đổi mật khẩu
                            </button>
                            <button class="action-btn" onclick="viewOrders()">
                                <i class="fas fa-shopping-bag"></i>
                                Đơn hàng của tôi
                            </button>
                        </div>
                    </div>
                </div>

                <div class="stats-container">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-calendar-check"></i>
                        </div>
                        <div class="stat-value">${daysActive}</div>
                        <div class="stat-label">Ngày hoạt động</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <div class="stat-value">0</div>
                        <div class="stat-label">Đơn hàng</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-heart"></i>
                        </div>
                        <div class="stat-value">0</div>
                        <div class="stat-label">Yêu thích</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="stat-value">5.0</div>
                        <div class="stat-label">Điểm thành viên</div>
                    </div>
                </div>
            `;
            
            document.getElementById('app').innerHTML = html;
        }

        // Khởi tạo khi load page
        window.onload = function() {
            const user = checkAuth();
            if (user) {
                renderProfile(user);
            }
        };