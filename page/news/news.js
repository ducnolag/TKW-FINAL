let currentCategory = "all";

function normalizeText(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function isAllCategory(v) {
  const x = normalizeText(v);
  return !x || x === "all" || x === "tat ca" || x === "tất cả" || x === "tat-ca";
}

function getFilteredPosts() {
  const data = window.newsData || [];
  return data.filter(p => (isAllCategory(currentCategory) ? true : p.category === currentCategory));
}

function renderPosts(list) {
  const el = document.getElementById("news-list");
  if (!el) return;

  if (!list.length) {
    el.innerHTML = `<div class="alert alert-warning">Không tìm thấy bài viết phù hợp.</div>`;
    return;
  }

  el.innerHTML = list.map(p => `
    
    <div class="news-card mb-4">
      <div class="news-thumbnail">
        <img src="${p.image}" alt="${p.title}">
      </div>

      <div class="news-content">
        <div class="news-meta">
          <span class="meta-item">
            <i class="fas fa-tag"></i>
            <span class="post-category" data-category="${p.category}">${p.category}</span>
          </span>
          <span class="meta-item">
            <i class="fas fa-calendar-alt"></i> ${p.date}
          </span>
        </div>

        <h3 class="news-title">
  <a href="./new-detail/news-detail.html?id=${p.id}">${p.title}</a>
</h3>

        <p class="news-excerpt">${p.excerpt}</p>

        <a class="btn-read-more" href="./new-detail/news-detail.html?id=${p.id}">
          Đọc tiếp <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `).join("");
}

function setActiveSidebarCategory(cat) {
  document.querySelectorAll(".category-menu li").forEach(li => li.classList.remove("active"));
  const links = document.querySelectorAll(".category-menu a[data-category]");
  const catNorm = normalizeText(cat);

  for (const a of links) {
    if (normalizeText(a.dataset.category) === catNorm) {
      a.closest("li")?.classList.add("active");
      return;
    }
  }

  document.querySelector('.category-menu a[data-category="all"]')?.closest("li")?.classList.add("active");
}

function applyAndRender() {
  renderPosts(getFilteredPosts());
  setActiveSidebarCategory(currentCategory);
}

/* để load-sidebar.js gọi chung */
window.onCategoryPicked = function (cat) {
  currentCategory = cat || "all";
  applyAndRender();
};
window.onSidebarInjectedForList = function () {
  setActiveSidebarCategory(currentCategory);
};

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const cat = params.get("cat");
  if (cat) currentCategory = cat;

  applyAndRender();
});
