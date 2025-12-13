// --- LOGIC GIỮ NGUYÊN ---
function checkAuth() {
    const currentUser = sessionStorage.getItem("currentUser");
    if (!currentUser) {
        alert("Bạn cần đăng nhập để xem trang này!");
        window.location.href = "../login/login.html";
        return null;
    }
    return JSON.parse(currentUser);
}

function getUserPurchases(username) {
    const purchasesSession = JSON.parse(sessionStorage.getItem('userPurchases') || '{}');
    const purchasesLocal = JSON.parse(localStorage.getItem('userPurchases') || '{}');
    const allPurchases = { ...purchasesLocal, ...purchasesSession };
    return allPurchases[username] || [];
}

function logout() {
    if (confirm("Bạn có chắc muốn đăng xuất?")) {
        sessionStorage.removeItem("currentUser");
        window.location.href = "../login/login.html";
    }
}

function editProfile() { alert("Chức năng đang phát triển!"); }
function changePassword() { alert("Chức năng đổi mật khẩu (giữ nguyên logic cũ nếu cần)"); }

// ... (Giữ nguyên các hàm logic checkAuth, logout, getUserPurchases ở phần đầu) ...

// RENDER GIAO DIỆN MỚI
function renderProfile(user) {
    // Tính toán dữ liệu
    const loginDate = new Date(user.loginTime || Date.now());
    const createdDate = user.createdAt ? new Date(user.createdAt) : new Date();
    const daysActive = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    
    const purchases = getUserPurchases(user.username);
    const totalOrders = purchases.length;
    const totalItems = purchases.reduce((sum, p) => sum + (p.quantity || 1), 0);

    // Badge loại tài khoản
    let badgeClass = 'email';
    let badgeIcon = 'fa-envelope';
    let badgeText = 'Email Account';
    
    if (user.loginMethod === 'google') {
        badgeClass = 'google'; badgeIcon = 'fa-google'; badgeText = 'Google Account';
    } else if (user.loginMethod === 'facebook') {
        badgeClass = 'facebook'; badgeIcon = 'fa-facebook'; badgeText = 'Facebook Account';
    }

    const html = `
    <div class="layout-wrapper">
        <aside class="sidebar">
            <div class="avatar-wrapper">
                <div class="user-avatar">
                    ${user.username.charAt(0).toUpperCase()}
                </div>
            </div>
            <h2 class="user-name">${user.username}</h2>
            <p class="user-email">${user.email}</p>
            
            <div class="badge-wrapper">
                <span class="badge ${badgeClass}">
                    <i class="fab ${badgeIcon}"></i> ${badgeText}
                </span>
            </div>

            <nav>
                <ul class="side-menu">
                    <li><button class="menu-item active"><i class="fas fa-home"></i> Tổng quan</button></li>
                    <li><button class="menu-item" onclick="viewOrders()"><i class="fas fa-shopping-bag"></i> Đơn hàng</button></li>
                    <li><button class="menu-item" onclick="editProfile()"><i class="fas fa-user-edit"></i> Sửa hồ sơ</button></li>
                    <li><button class="menu-item logout" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Đăng xuất</button></li>
                </ul>
            </nav>
        </aside>

        <main class="main-content">
            <div class="content-header">
                <div class="welcome-text">
                    <h2>Xin chào, ${user.username}!</h2>
                </div>
                <a href="/index.htm" class="home-btn"><i class="fas fa-arrow-left"></i> Trang chủ</a>
            </div>

            <div class="stats-grid">
                <div class="stat-card highlight">
                    <div class="stat-icon"><i class="fas fa-shopping-cart"></i></div>
                    <div class="stat-info">
                        <div class="stat-value">${totalOrders}</div>
                        <div class="stat-label">Đơn hàng</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-box"></i></div>
                    <div class="stat-info">
                        <div class="stat-value">${totalItems}</div>
                        <div class="stat-label">Sản phẩm</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-wallet"></i></div>
                    <div class="stat-info">
                        <div class="stat-value">0đ</div>
                        <div class="stat-label">Số dư ví</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-gem"></i></div>
                    <div class="stat-info">
                        <div class="stat-value">Vàng</div>
                        <div class="stat-label">Thành viên</div>
                    </div>
                </div>
            </div>

            <div class="section-card purchases-wrapper">
                <div class="section-header">
                    <h3 class="section-title"><i class="fas fa-receipt"></i> Lịch sử mua hàng</h3>
                    ${totalOrders > 0 ? `<span class="count-badge">${totalOrders} đơn</span>` : ''}
                </div>
                
                <div class="purchase-list-container">
                ${totalOrders > 0 ? `
                    <table class="purchase-table">
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Ngày mua</th>
                                <th class="text-center">Số lượng</th>
                                <th class="text-right">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${purchases.reverse().map(p => `
                                <tr>
                                    <td>
                                        <div class="product-cell">
                                            <div class="p-icon"><i class="fas fa-box"></i></div>
                                            <span>${p.productTitle || 'Sản phẩm không tên'}</span>
                                        </div>
                                    </td>
                                    <td class="text-muted">${p.purchaseDate}</td>
                                    <td class="text-center">x${p.quantity || 1}</td>
                                    <td class="text-right"><span class="status-badge success">Hoàn thành</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : `
                    <div class="empty-state">
                        <i class="fas fa-shopping-basket"></i>
                        <p>Chưa có đơn hàng nào được ghi nhận</p>
                        <a href="/index.htm" class="action-link">Mua sắm ngay</a>
                    </div>
                `}
                </div>
            </div>

            <div class="section-card collapsed-info">
                <div class="section-header">
                    <h3 class="section-title"><i class="fas fa-user-cog"></i> Thông tin tài khoản</h3>
                </div>
                <div class="info-row-compact">
                    <div class="info-col">
                        <label>Email:</label> <span>${user.email}</span>
                    </div>
                    <div class="info-col">
                        <label>Điện thoại:</label> <span>${user.phone || 'Chưa cập nhật'}</span>
                    </div>
                    <div class="info-col">
                        <label>Tham gia:</label> <span>${createdDate.toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div class="info-col">
                        <button class="btn-text" onclick="editProfile()">Chỉnh sửa</button>
                    </div>
                </div>
            </div>
        </main>
    </div>
    `;

    document.getElementById('app').innerHTML = html;
}

// Giữ nguyên phần window.onload
window.onload = function() {
    const user = checkAuth();
    if (user) {
        renderProfile(user);
    }
};