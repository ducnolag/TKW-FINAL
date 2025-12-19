document.addEventListener("DOMContentLoaded", () => {
  const sidebarEl = document.getElementById("sidebar-container");
  if (!sidebarEl) return;

  const inSubfolder = location.pathname.includes("/new-detail/");
  const base = inSubfolder ? "../" : "";

  fetch(base + "sidebar.html")
    .then(r => {
      if (!r.ok) throw new Error("Không tải được sidebar.html");
      return r.text();
    })
    .then(html => {
      sidebarEl.innerHTML = html;

if (inSubfolder) {
  sidebarEl.querySelectorAll(".recent-post-title a, .banner-wrapper a").forEach(link => {
    const href = link.getAttribute("href");
    if (href && !href.startsWith("http") && !href.startsWith("#")) {
      link.setAttribute("href", href.replace("new-detail/", ""));
    }
  });
}

      // click danh mục
      document.querySelectorAll(".category-menu a[data-category]").forEach(a => {
        a.addEventListener("click", e => {
          e.preventDefault();
          const cat = a.dataset.category || "all";

          // nếu đang ở trang list
          if (typeof window.onCategoryPicked === "function") {
            window.onCategoryPicked(cat);
          } 
          // nếu đang ở trang detail
          else {
            location.href =
              base + "news.html" +
              (cat === "all" ? "" : "?cat=" + encodeURIComponent(cat));
          }
        });
      });

      // GỌI ĐÚNG 1 HOOK THEO TRANG
      if (typeof window.onSidebarInjectedForList === "function") {
        window.onSidebarInjectedForList();
      }

      if (typeof window.onSidebarInjectedForDetail === "function") {
        window.onSidebarInjectedForDetail();
      }
    })
    .catch(err => {
      console.error(err);
      sidebarEl.innerHTML =
        `<div class="alert alert-warning">Không tải được sidebar.</div>`;
    });
});
