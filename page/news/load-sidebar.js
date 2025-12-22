// Chạy khi DOM đã load xong
document.addEventListener("DOMContentLoaded", () => {

  // Lấy container sidebar trong HTML
  const sidebarEl = document.getElementById("sidebar-container");

  // Nếu trang hiện tại không có sidebar thì dừng luôn
  if (!sidebarEl) return;

  /* =================================================
     XÁC ĐỊNH ĐƯỜNG DẪN
     ================================================= */

  // Kiểm tra có đang ở trang chi tiết tin tức (subfolder) hay không
  const inSubfolder = location.pathname.includes("/new-detail/");
  // Nếu ở subfolder → cần quay lui 1 cấp để load file
  const base = inSubfolder ? "../" : "";

  /* =================================================
     LOAD SIDEBAR.HTML
     ================================================= */

  fetch(base + "sidebar.html")
    .then(r => {
      // Nếu không tải được file sidebar.html thì báo lỗi
      if (!r.ok) throw new Error("Không tải được sidebar.html");
      return r.text();
    })
    .then(html => {
      // Đổ HTML sidebar vào container
      sidebarEl.innerHTML = html;

      /* =================================================
         FIX LINK KHI ĐANG Ở TRANG DETAIL
         ================================================= */

      // Nếu đang ở trang chi tiết
      if (inSubfolder) {
        // Sửa lại các link trong sidebar để không bị sai đường dẫn
        sidebarEl
          .querySelectorAll(".recent-post-title a, .banner-wrapper a")
          .forEach(link => {
            const href = link.getAttribute("href");

            // Chỉ sửa link nội bộ (không phải link ngoài, không phải #)
            if (href && !href.startsWith("http") && !href.startsWith("#")) {
              // Bỏ "new-detail/" trong link
              link.setAttribute("href", href.replace("new-detail/", ""));
            }
          });
      }

      /* =================================================
         XỬ LÝ CLICK DANH MỤC TRONG SIDEBAR
         ================================================= */

      document
        .querySelectorAll(".category-menu a[data-category]")
        .forEach(a => {
          a.addEventListener("click", e => {
            e.preventDefault();

            // Lấy category từ data-category
            const cat = a.dataset.category || "all";

            // Nếu đang ở trang DANH SÁCH TIN TỨC
            if (typeof window.onCategoryPicked === "function") {
              // Gọi callback để filter bài viết (không reload trang)
              window.onCategoryPicked(cat);
            } 
            // Nếu đang ở trang CHI TIẾT TIN TỨC
            else {
              // Điều hướng về trang list theo category
              location.href =
                base + "news.html" +
                (cat === "all" ? "" : "?cat=" + encodeURIComponent(cat));
            }
          });
        });

      /* =================================================
         GỌI HOOK SAU KHI SIDEBAR ĐÃ LOAD XONG
         ================================================= */

      // Hook dành cho trang danh sách tin tức
      if (typeof window.onSidebarInjectedForList === "function") {
        window.onSidebarInjectedForList();
      }

      // Hook dành cho trang chi tiết tin tức dùng để active category theo bài đang xem
      if (typeof window.onSidebarInjectedForDetail === "function") {
        window.onSidebarInjectedForDetail();
      }
    })
    .catch(err => {
      // Nếu có lỗi khi load sidebar
      console.error(err);

      // Hiển thị thông báo lỗi thân thiện
      sidebarEl.innerHTML =
        `<div class="alert alert-warning">Không tải được sidebar.</div>`;
    });
});
