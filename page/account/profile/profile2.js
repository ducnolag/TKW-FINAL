/*******************************
 * 1) BIẾN TRẠNG THÁI CHUNG
 *******************************/

// Lưu thông tin user đang đăng nhập (lấy từ sessionStorage)
let currentUser = null;

// Tab đang mở: overview (tổng quan), orders (đơn hàng), edit (sửa)
let currentTab = "overview";

// Biến giữ “hành động chờ xác nhận” (ví dụ: logout)
// Khi bấm “Xác nhận” trong confirm modal thì sẽ chạy hàm này
let pendingConfirmAction = null;


/*******************************
 * 2) HÀM MODAL THÔNG BÁO
 *******************************/

// Hiện modal thông báo với tiêu đề + nội dung
function showMessageModal(title, message) {
  // Lấy element tiêu đề modal
  document.getElementById("messageTitle").innerText = title;

  // Lấy element nội dung modal
  document.getElementById("messageContent").innerText = message;

  // Thêm class "active" để CSS hiển thị modal
  document.getElementById("messageModal").classList.add("active");
}

// Đóng modal thông báo
function closeMessageModal() {
  // Bỏ class "active" để CSS ẩn modal
  document.getElementById("messageModal").classList.remove("active");
}


/*******************************
 * 3) HÀM MODAL XÁC NHẬN
 *******************************/

// Hiện modal xác nhận: kèm callback onConfirm
function showConfirmModal(title, message, onConfirm) {
  // Set tiêu đề
  document.getElementById("confirmTitle").innerText = title;

  // Set nội dung
  document.getElementById("confirmContent").innerText = message;

  // Lưu hàm sẽ chạy khi bấm "Xác nhận"
  pendingConfirmAction = onConfirm;

  // Hiện modal
  document.getElementById("confirmModal").classList.add("active");
}

// Đóng modal xác nhận
function closeConfirmModal() {
  // Ẩn modal
  document.getElementById("confirmModal").classList.remove("active");

  // Xóa hành động chờ xác nhận (an toàn)
  pendingConfirmAction = null;
}

// Khi người dùng bấm nút "Xác nhận" trong confirm modal
function confirmAction() {
  // Nếu có hành động đã được gắn trước đó
  if (typeof pendingConfirmAction === "function") {
    // Chạy hành động đó (ví dụ logout)
    pendingConfirmAction();
  }

  // Sau khi làm xong thì đóng modal
  closeConfirmModal();
}


/*******************************
 * 4) KIỂM TRA ĐĂNG NHẬP
 *******************************/

// Hàm này kiểm tra sessionStorage có "currentUser" không
function checkAuth() {
  // Lấy chuỗi JSON user từ sessionStorage
  const userJson = sessionStorage.getItem("currentUser");

  // Nếu không có -> tức là chưa đăng nhập
  if (!userJson) {
    // Báo cho user biết
    showMessageModal("Chưa đăng nhập", "Bạn cần đăng nhập để xem trang này.");

    // Chờ 1.5 giây rồi chuyển sang trang login
    setTimeout(() => {
      // Đổi URL sang trang đăng nhập
      window.location.href = "/page/login/login.htm";
    }, 1500);

    // Trả về null để báo thất bại
    return null;
  }

  // Nếu có userJson, parse ra object
  try {
    return JSON.parse(userJson);
  } catch (e) {
    // Nếu JSON lỗi -> coi như chưa đăng nhập, xóa cho sạch
    sessionStorage.removeItem("currentUser");
    showMessageModal("Lỗi", "Thông tin đăng nhập bị lỗi. Vui lòng đăng nhập lại.");
    setTimeout(() => (window.location.href = "/page/login/login.htm"), 1500);
    return null;
  }
}


/*******************************
 * 5) LẤY DỮ LIỆU MUA HÀNG (PURCHASES)
 *******************************/

// Lấy danh sách “mua hàng” theo username
function getUserPurchases(username) {
  // Lấy dữ liệu purchases trong sessionStorage (nếu có)
  const purchasesSession = JSON.parse(sessionStorage.getItem("userPurchases") || "{}");

  // Lấy dữ liệu purchases trong localStorage (nếu có)
  const purchasesLocal = JSON.parse(localStorage.getItem("userPurchases") || "{}");

  // Gộp 2 nguồn dữ liệu lại (local + session)
  // Nếu trùng key, cái phía sau sẽ ghi đè cái trước (tùy thứ tự)
  const allPurchases = { ...purchasesLocal, ...purchasesSession };

  // Trả về mảng purchases của user, nếu chưa có thì []
  return allPurchases[username] || [];
}


/*******************************
 * 6) LẤY DỮ LIỆU GIAO DỊCH THANH TOÁN (TRANSACTIONS)
 *******************************/

// Lấy số lần thanh toán (để đếm “Đơn hàng đã đặt”)
function getPaymentTransactions(username) {
  // Lấy object giao dịch từ localStorage
  const transactions = JSON.parse(localStorage.getItem("userPaymentTransactions") || "{}");

  // Trả về list giao dịch của user (hoặc [])
  return transactions[username] || [];
}


/*******************************
 * 7) CHUYỂN TAB
 *******************************/

// Khi bấm menu, đổi tab và render lại trang
function switchTab(tabName) {
  // Cập nhật tab hiện tại
  currentTab = tabName;

  // Render lại UI theo tab mới
  renderProfile(currentUser);
}


/*******************************
 * 8) ĐĂNG XUẤT
 *******************************/

// Logout không làm ngay, mà hỏi xác nhận trước
function logout() {
  showConfirmModal(
    "Đăng xuất",
    "Bạn có chắc chắn muốn đăng xuất không?",
    () => {
      // Nếu user bấm Xác nhận -> chạy hàm này

      // Xóa user trong sessionStorage (tức là coi như đăng xuất)
      sessionStorage.removeItem("currentUser");

      // Chuyển về trang chủ
      window.location.href = "/index.htm";
    }
  );
}


/*******************************
 * 9) LƯU HỒ SƠ (EDIT PROFILE)
 *******************************/

// Khi submit form sửa hồ sơ
function saveProfile(event) {
  // Chặn submit mặc định (không reload trang)
  event.preventDefault();

  // Lấy dữ liệu từ input
  const phone = document.getElementById("phoneInput").value.trim();
  const fullname = document.getElementById("fullnameInput").value.trim();
  const address = document.getElementById("addressInput").value.trim();

  // Cập nhật vào object currentUser
  currentUser.phone = phone;
  currentUser.fullname = fullname;
  currentUser.address = address;

  // Lưu lại vào sessionStorage
  sessionStorage.setItem("currentUser", JSON.stringify(currentUser));

  // Thông báo thành công
  showMessageModal("Thành công", "Cập nhật hồ sơ thành công!");

  // Sau 1 giây thì quay về tab tổng quan
  setTimeout(() => {
    closeMessageModal();
    switchTab("overview");
  }, 1000);
}


/*******************************
 * 10) RENDER UI (VẼ GIAO DIỆN)
 *******************************/

// Render toàn bộ trang profile vào #app
function renderProfile(user) {
  // Tạo HTML layout 2 cột: sidebar + content
  const html = `
    <div class="layout-wrapper">
      ${renderSidebar(user, currentTab)}
      <main class="main-content">
        ${renderMainContent(user, currentTab)}
      </main>
    </div>
  `;

  // Đưa HTML này vào div#app (thay cho “Loading...”)
  document.getElementById("app").innerHTML = html;
}


/*******************************
 * 11) RENDER SIDEBAR (BÊN TRÁI)
 *******************************/

function renderSidebar(user, activeTab) {
  // Lấy chữ cái đầu avatar (ví dụ username "minh" -> "M")
  const initial = (user.username || "U").charAt(0).toUpperCase();

  // Tên hiển thị: nếu có fullname thì dùng fullname, không có thì dùng username
  const displayName = user.fullname || user.username || "User";

  // Hiển thị “cách đăng nhập”
  const loginMethod = user.loginMethod || "email";

  // Tạo badge mô tả cách đăng nhập
  let methodLabel = "Email";
  if (loginMethod === "google") methodLabel = "Google";
  if (loginMethod === "facebook") methodLabel = "Facebook";

  // Trả về HTML sidebar
  return `
    <aside class="sidebar">
      <div class="profile-card">
        <div class="avatar-circle">${initial}</div>
        <h2 class="profile-name">${displayName}</h2>
        <p class="profile-email">${user.email || ""}</p>
        <span class="badge">${methodLabel}</span>
      </div>

      <nav class="menu">
        <button class="menu-btn ${activeTab === "overview" ? "active" : ""}" onclick="switchTab('overview')">
          Tổng quan
        </button>

        <button class="menu-btn ${activeTab === "orders" ? "active" : ""}" onclick="switchTab('orders')">
          Đơn hàng
        </button>

        <button class="menu-btn ${activeTab === "edit" ? "active" : ""}" onclick="switchTab('edit')">
          Sửa hồ sơ
        </button>

        <button class="menu-btn logout-btn" onclick="logout()">
          Đăng xuất
        </button>
      </nav>
    </aside>
  `;
}


/*******************************
 * 12) RENDER NỘI DUNG BÊN PHẢI THEO TAB
 *******************************/

function renderMainContent(user, tab) {
  // TAB 1: TỔNG QUAN
  if (tab === "overview") {
    // Lấy danh sách purchases (các sản phẩm đã mua)
    const purchases = getUserPurchases(user.username);

    // Đếm tổng số sản phẩm mua (đếm theo số dòng purchases)
    const totalItems = purchases.length;

    // Lấy số giao dịch thanh toán (đếm “đơn hàng đã đặt”)
    const paymentTransactions = getPaymentTransactions(user.username);
    const totalOrders = paymentTransactions.length;

    // Lấy 5 đơn gần nhất: copy mảng -> đảo ngược -> lấy 5 phần tử đầu
    const recentOrders = purchases.slice().reverse().slice(0, 5);

    return `
      <section>
        <h1 class="page-title">Tổng quan</h1>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Đơn hàng đã đặt</div>
            <div class="stat-value">${totalOrders}</div>
          </div>

          <div class="stat-card">
            <div class="stat-label">Sản phẩm đã mua</div>
            <div class="stat-value">${totalItems}</div>
          </div>

          <div class="stat-card">
            <div class="stat-label">Thành viên</div>
            <div class="stat-value">Premium</div>
          </div>
        </div>

        <div class="content-grid">
          <div class="info-card">
            <h3>Thông tin nhanh</h3>
            <div class="info-row"><span>Họ tên:</span><b>${user.fullname || "(chưa có)"}</b></div>
            <div class="info-row"><span>Email:</span><b>${user.email || ""}</b></div>
            <div class="info-row"><span>SĐT:</span><b>${user.phone || "(chưa có)"}</b></div>
            <div class="info-row"><span>Địa chỉ:</span><b>${user.address || "(chưa có)"}</b></div>
          </div>

          <div class="recent-card">
            <h3>Mua gần đây</h3>
            ${
              recentOrders.length > 0
                ? renderOrderTable(recentOrders)
                : `
                  <div class="empty-state">
                    <div class="empty-icon">🛒</div>
                    <p>Bạn chưa mua sản phẩm nào.</p>
                    <a class="primary-link" href="/page/category/product/product.htm">Đi mua sắm</a>
                  </div>
                `
            }
          </div>
        </div>
      </section>
    `;
  }

  // TAB 2: ĐƠN HÀNG
  if (tab === "orders") {
    // lấy toàn bộ purchases
    const purchases = getUserPurchases(user.username);

    return `
      <section>
        <h1 class="page-title">Đơn hàng</h1>

        <div class="table-card">
          ${
            purchases.length > 0
              ? renderOrderTable(purchases.slice().reverse())
              : `
                <div class="empty-state">
                  <div class="empty-icon">📦</div>
                  <p>Bạn chưa có đơn hàng nào.</p>
                  <a class="primary-link" href="/page/category/product/product.htm">Xem sản phẩm</a>
                </div>
              `
          }
        </div>
      </section>
    `;
  }

  // TAB 3: SỬA HỒ SƠ
  if (tab === "edit") {
    return `
      <section>
        <h1 class="page-title">Sửa hồ sơ</h1>

        <div class="edit-form-card">
          <!-- onsubmit gọi saveProfile(event) -->
          <form onsubmit="saveProfile(event)">
            <div class="form-grid">
              <div class="form-group">
                <label>Tên đăng nhập</label>
                <input class="form-input" value="${user.username || ""}" readonly />
                <!-- readonly: chỉ xem, không sửa -->
              </div>

              <div class="form-group">
                <label>Email</label>
                <input class="form-input" value="${user.email || ""}" readonly />
              </div>

              <div class="form-group">
                <label>Họ tên</label>
                <input id="fullnameInput" class="form-input" value="${user.fullname || ""}" />
              </div>

              <div class="form-group">
                <label>Số điện thoại</label>
                <input id="phoneInput" class="form-input" value="${user.phone || ""}" />
              </div>

              <div class="form-group full">
                <label>Địa chỉ</label>
                <input id="addressInput" class="form-input" value="${user.address || ""}" />
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="primary-btn">Lưu thay đổi</button>
              <button type="button" class="secondary-btn" onclick="switchTab('overview')">Hủy</button>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  // Nếu tab không hợp lệ
  return `<p>Tab không tồn tại.</p>`;
}


/*******************************
 * 13) RENDER BẢNG ĐƠN HÀNG
 *******************************/

function renderOrderTable(ordersList) {
  // Nếu list rỗng thì return rỗng (an toàn)
  if (!ordersList || ordersList.length === 0) return "";

  // Tạo HTML table
  return `
    <div class="purchase-list-container">
      <table class="purchase-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Ngày mua</th>
            <th>Số lượng</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          ${ordersList
            .map((p) => {
              // p là 1 đơn (object)
              // Kỳ vọng p có productTitle, purchaseDate, quantity
              const title = p.productTitle || "(Không có tên)";
              const date = p.purchaseDate || "(Không rõ ngày)";
              const qty = p.quantity || 1;

              return `
                <tr>
                  <td>${title}</td>
                  <td>${date}</td>
                  <td>${qty}</td>
                  <td><span class="status success">Thành công</span></td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}


/*******************************
 * 14) BẮT SỰ KIỆN KHI TRANG LOAD XONG
 *******************************/

// Khi HTML load xong
document.addEventListener("DOMContentLoaded", () => {
  // Bấm ra ngoài vùng modal-content thì đóng modal (click overlay)
  const msgModal = document.getElementById("messageModal");
  const confirmModal = document.getElementById("confirmModal");

  msgModal.addEventListener("click", (e) => {
    // Nếu click đúng vào overlay (modal-profile), không phải nội dung bên trong
    if (e.target === msgModal) closeMessageModal();
  });

  confirmModal.addEventListener("click", (e) => {
    if (e.target === confirmModal) closeConfirmModal();
  });
});


// Khi mọi tài nguyên load xong (ảnh, css, ...)
window.onload = () => {
  // Kiểm tra đăng nhập
  currentUser = checkAuth();

  // Nếu checkAuth trả về null -> đã redirect rồi, không làm nữa
  if (!currentUser) return;

  // Delay 0.5s cho “mượt”, rồi render trang
  setTimeout(() => {
    renderProfile(currentUser);
  }, 500);
};
