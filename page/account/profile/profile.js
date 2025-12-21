// --- 1. KHỞI TẠO & DATA ---
let currentUser = null;
let currentTab = 'overview'; // Các trạng thái: 'overview', 'orders', 'edit'
let pendingConfirmAction = null; // Lưu hàm cần thực hiện sau khi xác nhận

// ===== MODAL FUNCTIONS =====
function showMessageModal(title, message) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('messageModal').classList.add('active');
}

function closeMessageModal() {
    document.getElementById('messageModal').classList.remove('active');
}

function showConfirmModal(title, message, onConfirm) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    pendingConfirmAction = onConfirm;
    document.getElementById('confirmModal').classList.add('active');
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('active');
    pendingConfirmAction = null;
}

function confirmAction() {
    if (pendingConfirmAction && typeof pendingConfirmAction === 'function') {
        pendingConfirmAction();
    }
    closeConfirmModal();
}

// Đóng modal khi bấm ra ngoài
document.addEventListener('DOMContentLoaded', function() {
    const messageModal = document.getElementById('messageModal');
    const confirmModal = document.getElementById('confirmModal');
    
    if (messageModal) {
        messageModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeMessageModal();
            }
        });
    }
    
    if (confirmModal) {
        confirmModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeConfirmModal();
            }
        });
    }
});

// Check đăng nhập
function checkAuth() {
    const userJson = sessionStorage.getItem("currentUser");
    if (!userJson) {
        showMessageModal("Thông báo", "Bạn cần đăng nhập để xem trang này!");
        setTimeout(() => {
            window.location.href = "/page/account/login/login.html";
        }, 1500);
        return null;
    }
    return JSON.parse(userJson);
}

// Lấy dữ liệu mua hàng
function getUserPurchases(username) {
    const purchasesSession = JSON.parse(sessionStorage.getItem('userPurchases') || '{}');
    const purchasesLocal = JSON.parse(localStorage.getItem('userPurchases') || '{}');
    const allPurchases = { ...purchasesLocal, ...purchasesSession };
    return allPurchases[username] || [];
}

// Lấy ghi nhận thanh toán
function getPaymentTransactions(username) {
    const transactions = JSON.parse(localStorage.getItem('userPaymentTransactions') || '{}');
    return transactions[username] || [];
}

// --- 2. CÁC CHỨC NĂNG CHÍNH ---

// Chuyển Tab
function switchTab(tabName) {
    currentTab = tabName;
    renderProfile(currentUser); // Vẽ lại giao diện
}

// Đăng xuất
function logout() {
    showConfirmModal("Xác nhận đăng xuất", "Bạn có chắc muốn đăng xuất?", function() {
        sessionStorage.removeItem("currentUser");
        window.location.href = "/index.htm";
    });
}

// Lưu hồ sơ (Logic cập nhật)
function saveProfile(event) {
    event.preventDefault(); // Chặn load lại trang
    
    // Lấy dữ liệu từ form
    const phone = document.getElementById('phoneInput').value;
    const fullname = document.getElementById('fullnameInput').value;
    const address = document.getElementById('addressInput').value;

    // Cập nhật object currentUser
    currentUser.phone = phone;
    currentUser.fullname = fullname;
    currentUser.address = address;

    // 1. Lưu vào Session (phiên hiện tại)
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));

    // 2. Lưu vào LocalStorage (giả lập database người dùng - nếu có danh sách users)
    // Đoạn này tùy thuộc vào cách bạn lưu danh sách user lúc đăng ký.
    // Nếu bạn chỉ dùng session đơn giản thì bước 1 là đủ.
    
    showMessageModal("Thành công", "Cập nhật hồ sơ thành công!");
    setTimeout(() => {
        switchTab('overview'); // Quay về trang chủ
    }, 1000);
}

// --- 3. RENDER GIAO DIỆN (VIEW) ---

function renderSidebar(user, activeTab) {
    let badgeClass = 'email';
    let badgeIcon = 'fa-envelope';
    let badgeText = 'Email Account';
    
    if (user.loginMethod === 'google') {
        badgeClass = 'google'; badgeIcon = 'fa-google'; badgeText = 'Google Account';
    } else if (user.loginMethod === 'facebook') {
        badgeClass = 'facebook'; badgeIcon = 'fa-facebook'; badgeText = 'Facebook Account';
    }

    return `
        <aside class="sidebar">
            <div class="avatar-wrapper">
                <div class="user-avatar">
                    ${user.username.charAt(0).toUpperCase()}
                </div>
            </div>
            <h2 class="user-name">${user.fullname || user.username}</h2>
            <p class="user-email">${user.email}</p>
            
            <div class="badge-wrapper">
                <span class="badge ${badgeClass}">
                    <i class="fab ${badgeIcon}"></i> ${badgeText}
                </span>
            </div>

            <nav>
                <ul class="side-menu">
                    <li>
                        <button class="menu-item ${activeTab === 'overview' ? 'active' : ''}" onclick="switchTab('overview')">
                            <i class="fas fa-home"></i> Tổng quan
                        </button>
                    </li>
                    <li>
                        <button class="menu-item ${activeTab === 'orders' ? 'active' : ''}" onclick="switchTab('orders')">
                            <i class="fas fa-shopping-bag"></i> Đơn hàng
                        </button>
                    </li>
                    <li>
                        <button class="menu-item ${activeTab === 'edit' ? 'active' : ''}" onclick="switchTab('edit')">
                            <i class="fas fa-user-edit"></i> Sửa hồ sơ
                        </button>
                    </li>
                    <li>
                        <button class="menu-item logout" onclick="logout()">
                            <i class="fas fa-sign-out-alt"></i> Đăng xuất
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    `;
}

// Hàm render nội dung chính dựa theo Tab
function renderMainContent(user, tab) {
    const purchases = getUserPurchases(user.username);
    const totalItems = purchases.length;
    // Đếm số lần thanh toán từ ghi nhận giao dịch
    const paymentTransactions = getPaymentTransactions(user.username);
    const totalOrders = paymentTransactions.length;
    const createdDate = user.createdAt ? new Date(user.createdAt) : new Date();

    // --- VIEW 1: OVERVIEW (TỔNG QUAN) ---
    if (tab === 'overview') {
        // Chỉ lấy 5 đơn gần nhất cho overview
        const recentOrders = purchases.reverse().slice(0, 5); 

        return `
            <div class="content-header">
                <div class="welcome-text">
                    <h2>Xin chào, ${user.fullname || user.username}! 👋</h2>
                    <p style="color:var(--text-muted); font-size: 0.9rem;">Chào mừng quay trở lại bảng điều khiển.</p>
                </div>
                <a href="/index.htm" class="home-btn"><i class="fas fa-arrow-left"></i> Trang chủ</a>
            </div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-shopping-cart"></i></div>
                    <div class="stat-info">
                        <div class="stat-value">${totalOrders}</div>
                        <div class="stat-label">Lần thanh toán</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-box-open"></i></div>
                    <div class="stat-info">
                        <div class="stat-value">${totalItems}</div>
                        <div class="stat-label">Sản phẩm đã mua</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-crown"></i></div> <div class="stat-info">
                        <div class="stat-value">Member</div>
                        <div class="stat-label">Hạng thành viên</div>
                    </div>
                </div>
            </div>
            <div class="section-card collapsed-info">
                <div class="section-header">
                     <h3 class="section-title"><i class="fas fa-user-circle"></i> Thông tin nhanh</h3>
                </div>
                <div class="info-row-compact">
                    <div class="info-col"><label>Họ tên:</label> <span>${user.fullname || 'Chưa cập nhật'}</span></div>
                    <div class="info-col"><label>SĐT:</label> <span>${user.phone || 'Chưa cập nhật'}</span></div>
                    <div class="info-col"><label>Địa chỉ:</label> <span>${user.address || 'Chưa cập nhật'}</span></div>
                    <div class="info-col"><button class="btn-text" onclick="switchTab('edit')">Chỉnh sửa ></button></div>
                </div>
            </div>

            <div class="section-card purchases-wrapper">
                <div class="section-header">
                    <h3 class="section-title"><i class="fas fa-receipt"></i> Mua gần đây</h3>
                    ${totalOrders > 5 ? `<button class="btn-text" onclick="switchTab('orders')">Xem tất cả</button>` : ''}
                </div>
                <div class="purchase-list-container">
                    ${totalOrders > 0 ? renderOrderTable(recentOrders) : renderEmptyState()}
                </div>
            </div>
        `;
    }

    // --- VIEW 2: ALL ORDERS (TẤT CẢ ĐƠN HÀNG) ---
    if (tab === 'orders') {
        return `
            <div class="content-header">
                <div class="welcome-text"><h2>Lịch sử đơn hàng</h2></div>
                <a href="/index.htm" class="home-btn"><i class="fas fa-arrow-left"></i> Trang chủ</a>
            </div>
            <div class="section-card purchases-wrapper" style="min-height: 500px;">
                <div class="section-header">
                    <h3 class="section-title">Tổng số: ${totalOrders} đơn hàng</h3>
                </div>
                <div class="purchase-list-container">
                    ${totalOrders > 0 ? renderOrderTable(purchases.reverse()) : renderEmptyState()}
                </div>
            </div>
        `;
    }

    // --- VIEW 3: EDIT PROFILE (SỬA HỒ SƠ) ---
    if (tab === 'edit') {
        return `
            <div class="content-header">
                <div class="welcome-text"><h2>Chỉnh sửa hồ sơ</h2></div>
                <a href="/index.htm" class="home-btn"><i class="fas fa-arrow-left"></i> Trang chủ</a>
            </div>
            <div class="edit-form-card">
                <form onsubmit="saveProfile(event)">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Tên đăng nhập (Không thể đổi)</label>
                            <input type="text" class="form-input" value="${user.username}" readonly>
                        </div>
                        <div class="form-group">
                            <label>Email (Không thể đổi)</label>
                            <input type="text" class="form-input" value="${user.email}" readonly>
                        </div>
                        <div class="form-group">
                            <label>Họ và tên</label>
                            <input type="text" id="fullnameInput" class="form-input" value="${user.fullname || ''}" placeholder="Nhập họ tên của bạn">
                        </div>
                        <div class="form-group">
                            <label>Số điện thoại</label>
                            <input type="text" id="phoneInput" class="form-input" value="${user.phone || ''}" placeholder="Nhập số điện thoại">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Địa chỉ giao hàng</label>
                        <input type="text" id="addressInput" class="form-input" value="${user.address || ''}" placeholder="Nhập địa chỉ nhận hàng mặc định">
                    </div>

                    <div class="btn-group">
                        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Lưu thay đổi</button>
                        <button type="button" class="btn btn-secondary" onclick="switchTab('overview')">Hủy bỏ</button>
                    </div>
                </form>
            </div>
        `;
    }
}

// Helper: Vẽ bảng đơn hàng (để dùng chung cho overview và orders tab)
function renderOrderTable(ordersList) {
    return `
    <table class="purchase-table">
        <thead>
            <tr>
                <th>Sản phẩm</th>
                <th>Ngày mua</th>
                <th class="text-center">SL</th>
                <th class="text-right">Trạng thái</th>
            </tr>
        </thead>
        <tbody>
            ${ordersList.map(p => `
                <tr>
                    <td>
                        <div class="product-cell">
                            <div class="p-icon"><i class="fas fa-box"></i></div>
                            <span>${p.productTitle || 'Sản phẩm'}</span>
                        </div>
                    </td>
                    <td style="color:var(--text-muted)">${p.purchaseDate}</td>
                    <td class="text-center">x${p.quantity || 1}</td>
                    <td class="text-right"><span class="status-badge success">Thành công</span></td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
}

// Helper: Vẽ trạng thái trống
function renderEmptyState() {
    return `
    <div class="empty-state">
        <i class="fas fa-shopping-basket"></i>
        <p>Chưa có đơn hàng nào.</p>
        <a href="/page/category/product/product.htm" class="action-link">Mua sắm ngay</a>
    </div>`;
}

// Main Render Function
function renderProfile(user) {
    const html = `
    <div class="layout-wrapper">
        ${renderSidebar(user, currentTab)}
        <main class="main-content">
            ${renderMainContent(user, currentTab)}
        </main>
    </div>
    `;
    document.getElementById('app').innerHTML = html;
}

// INIT
window.onload = function() {
    currentUser = checkAuth();
    if (currentUser) {
        // Giả lập loading 0.5s cho chuyên nghiệp
        setTimeout(() => {
            renderProfile(currentUser);
        }, 500);
    }
};