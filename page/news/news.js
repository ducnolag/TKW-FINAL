
// Danh mục hiện tại (mặc định là "all")
let currentCategory = "all";

/* Chuẩn hoá chuỗi:
   - chuyển về chữ thường
   - bỏ dấu tiếng Việt
   - trim khoảng trắng
   → dùng để so sánh category an toàn
*/
function normalizeText(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/* Kiểm tra category có phải "Tất cả" hay không */
function isAllCategory(v) {
  const x = normalizeText(v);
  return !x || x === "all" || x === "tat ca" || x === "tất cả" || x === "tat-ca";
}

/* Lọc danh sách bài viết theo category hiện tại */
function getFilteredPosts() {
  const data = window.newsData || [];

  // Nếu category là "all" → lấy toàn bộ bài
  // Ngược lại → chỉ lấy bài có category trùng
  return data.filter(p =>
    isAllCategory(currentCategory) ? true : p.category === currentCategory
  );
}

/* Render danh sách bài viết ra HTML */
function renderPosts(list) {
  const el = document.getElementById("news-list");
  if (!el) return;

  // Nếu không có bài viết phù hợp
  if (!list.length) {
    el.innerHTML = `<div class="alert alert-warning">Không tìm thấy bài viết phù hợp.</div>`;
    return;
  }

  // Render từng bài viết thành card
  el.innerHTML = list.map(p => `
    <div class="news-card mb-4">
      <div class="news-thumbnail">
        <img src="${p.image}" alt="${p.title}">
      </div>

      <div class="news-content">
        <div class="news-meta">
          <span class="meta-item">
            <i class="fas fa-tag"></i>
            <span class="post-category" data-category="${p.category}">
              ${p.category}
            </span>
          </span>
          <span class="meta-item">
            <i class="fas fa-calendar-alt"></i> ${p.date}
          </span>
        </div>

        <h3 class="news-title">
          <a href="./new-detail/news-detail.html?id=${p.id}">
            ${p.title}
          </a>
        </h3>

        <p class="news-excerpt">${p.excerpt}</p>

        <a class="btn-read-more" href="./new-detail/news-detail.html?id=${p.id}">
          Đọc tiếp <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `).join("");
}

/* Active danh mục tương ứng trong sidebar */
function setActiveSidebarCategory(cat) {
  // Xoá active cũ
  document.querySelectorAll(".category-menu li")
    .forEach(li => li.classList.remove("active"));

  const links = document.querySelectorAll(".category-menu a[data-category]");
  const catNorm = normalizeText(cat);

  // Tìm category trùng để active
  for (const a of links) {
    if (normalizeText(a.dataset.category) === catNorm) {
      a.closest("li")?.classList.add("active");
      return;
    }
  }

  // Không tìm thấy → active "Tất cả"
  document
    .querySelector('.category-menu a[data-category="all"]')
    ?.closest("li")
    ?.classList.add("active");
}

/* Áp dụng filter + render lại UI */
function applyAndRender() {
  renderPosts(getFilteredPosts());
  setActiveSidebarCategory(currentCategory);
}

/* =================================================
   CÁC HÀM ĐỂ load-sidebar.js GỌI
   ================================================= */

/* Khi click danh mục trong sidebar */
window.onCategoryPicked = function (cat) {
  currentCategory = cat || "all";
  applyAndRender();
};

/* Sau khi sidebar được inject xong */
window.onSidebarInjectedForList = function () {
  setActiveSidebarCategory(currentCategory);
};

/* =================================================
   KHỞI TẠO TRANG
   ================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // Lấy category từ URL (?cat=...)
  const params = new URLSearchParams(location.search);
  const cat = params.get("cat");
  if (cat) currentCategory = cat;

  // Render lần đầu
  applyAndRender();
});
