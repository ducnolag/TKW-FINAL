(function () {
  /* =========================================================
     FILE: news-detail.js
     MỤC ĐÍCH:
     - Lấy id bài viết từ URL (?id=...)
     - Tìm bài trong window.newsData (news-data.js)
     - Đổ dữ liệu vào HTML (post-title, post-date, post-author, post-category, post-image, post-content)
     - Highlight danh mục ở sidebar (category-menu)
     - Xử lý bình luận (lưu / đọc localStorage theo comments_<id>)
     ========================================================= */

  /* Escape ký tự đặc biệt để tránh XSS (không cho chèn HTML trực tiếp) */
  function esc(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  /* Chuẩn hoá text: lowercase + bỏ dấu tiếng Việt + trim (phục vụ so khớp category) */
  function normalizeText(s) {
    return (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  /* (Hiện chưa dùng) Kiểm tra giá trị category có phải "tất cả" hay không */
  function isAllCategory(v) {
    const x = normalizeText(v);
    return !x || x === "all" || x === "tat ca" || x === "tất cả" || x === "tat-ca";
  }

  /* Lấy id bài viết từ URL dạng: .../news-detail.html?id=3 */
  function getIdFromUrl() {
    const raw = new URLSearchParams(location.search).get("id");
    const id = Number(raw);
    return Number.isFinite(id) ? id : NaN; // nếu không phải số hợp lệ → NaN
  }

  /* Lấy data bài viết (yêu cầu news-data.js gán window.newsData = [...] ) */
  function getData() {
    return Array.isArray(window.newsData) ? window.newsData : [];
  }

  /* Render mảng content block thành HTML:
     - lead => <p class="lead">
     - p    => <p>
     - ul   => <ul><li>...</li></ul>
     - quote=> blockquote custom
  */
  function renderContent(blocks) {
    return (blocks || [])
      .map((b) => {
        if (!b || !b.type) return "";

        if (b.type === "lead") return `<p class="lead">${esc(b.text)}</p>`;
        if (b.type === "p") return `<p>${esc(b.text)}</p>`;

        if (b.type === "ul") {
          const items = Array.isArray(b.items) ? b.items : [];
          return `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
        }

        if (b.type === "quote") {
          return `
            <blockquote class="blockquote-custom">
              <i class="fas fa-quote-left"></i>
              <p>${esc(b.text)}</p>
              <footer>${esc(b.footer || "")}</footer>
            </blockquote>`;
        }

        return "";
      })
      .join("");
  }

  /* Highlight category đang xem ở sidebar (cần sidebar có .category-menu a[data-category]) */
  function setActiveSidebarCategory(category) {
    // Xoá active cũ
    document.querySelectorAll(".category-menu li").forEach((li) => li.classList.remove("active"));

    const links = document.querySelectorAll(".category-menu a[data-category]");
    const catNorm = normalizeText(category);

    // Tìm link có data-category trùng category bài viết
    for (const a of links) {
      if (normalizeText(a.dataset.category) === catNorm) {
        a.closest("li")?.classList.add("active");
        return;
      }
    }

    // Nếu không match được → fallback về "Tất cả"
    const allLink =
      document.querySelector('.category-menu a[data-category="all"]') ||
      document.querySelector('.category-menu a[data-category="Tất cả"]') ||
      document.querySelector('.category-menu a[data-category="tat-ca"]');

    allLink?.closest("li")?.classList.add("active");
  }

  /* Gán text vào element theo id (dùng cho title/date/author/category) */
  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? "";
  }

  /* Gán HTML vào element theo id (dùng cho post-content) */
  function setHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html ?? "";
  }

  /* Gán src/alt cho ảnh đại diện bài viết (post-image) */
  function setImg(id, src, alt) {
    const el = document.getElementById(id);
    if (el && el.tagName === "IMG") {
      el.src = src || "";
      if (alt != null) el.alt = alt;
    }
  }

  /* Trường hợp không có id hoặc không tìm thấy bài → hiển thị thông báo */
  function renderNotFound() {
    setText("post-title", "Không tìm thấy bài viết");
    setHtml("post-content", `<div class="alert alert-warning">Bài viết không tồn tại.</div>`);
    setActiveSidebarCategory("all");
  }

  /* Render bài viết vào đúng các id trong HTML news-detail */
  function renderPost(post) {
    setText("post-title", post.title);
    setText("post-date", post.date);
    setText("post-author", post.author || "Admin");
    setText("post-category", post.category); // (HTML có data-category nhưng ở đây chỉ set text)
    setImg("post-image", post.image, post.title);
    setHtml("post-content", renderContent(post.content));

    // Highlight danh mục tương ứng ở sidebar
    setActiveSidebarCategory(post.category);
  }

  /* Tìm bài theo id trong window.newsData */
  function findPostById(id) {
    const data = getData();
    return data.find((p) => p && p.id === id);
  }

  /* Hàm này dành cho load-sidebar.js gọi sau khi sidebar.html được inject vào DOM.
     Nếu load-sidebar.js KHÔNG gọi window.onSidebarInjectedForDetail?.() thì phần active category có thể không chạy đúng.
  */
  window.onSidebarInjectedForDetail = function () {
    const id = getIdFromUrl();

    // Nếu id không hợp lệ → active "all"
    if (!Number.isFinite(id)) {
      setActiveSidebarCategory("all");
      return;
    }

    // Nếu có bài → active theo category, không có → active all
    const post = findPostById(id);
    if (post) setActiveSidebarCategory(post.category);
    else setActiveSidebarCategory("all");
  };

  /* Chạy khi trang load xong HTML */
  document.addEventListener("DOMContentLoaded", () => {
    const id = getIdFromUrl();

    // Không có id hợp lệ → not found
    if (!Number.isFinite(id)) {
      renderNotFound();
      return;
    }

    // Tìm bài theo id
    const post = findPostById(id);
    if (!post) {
      renderNotFound();
      return;
    }

    // Render bài viết
    renderPost(post);

    /* =========================================================
       PHẦN BÌNH LUẬN (comments)
       - Form: #news-comments
       - List: #comments-list
       - Lưu theo key: comments_<id> trong localStorage
       ========================================================= */

    const commentForm = document.getElementById("news-comments");
    const commentsList = document.getElementById("comments-list");

    // Đọc bình luận đã lưu trước đó
    let comments = JSON.parse(localStorage.getItem(`comments_${id}`)) || [];

    /* Render danh sách bình luận ra HTML */
    function renderComments() {
      // Nếu chưa có bình luận → hiện text gợi ý
      if (comments.length === 0) {
        commentsList.innerHTML =
          '<div class="text-center text-muted py-4">Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nghĩ!</div>';
        return;
      }

      // Có bình luận → map ra HTML từng comment-item
      commentsList.innerHTML = comments
        .map((c) => {
          // Avatar: lấy chữ cái đầu của tên
          const firstLetter = c.name ? c.name.charAt(0).toUpperCase() : "?";

          return `
            <div class="comment-item">
              <div class="comment-avatar">${firstLetter}</div>
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-author">${esc(c.name)}</span>
                  <span class="comment-date"><i class="far fa-clock me-1"></i>${c.date}</span>
                </div>
                <div class="comment-text">${esc(c.text)}</div>
              </div>
            </div>`;
        })
        .join("");
    }

    // Render bình luận lần đầu khi vào trang
    renderComments();

    /* Khi submit form bình luận */
    commentForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Lấy dữ liệu từ form
      const name = document.querySelector(".comment-name").value.trim();
      const email = document.querySelector(".comment-email").value.trim(); // hiện chưa hiển thị ra UI, chỉ lưu
      const text = document.querySelector(".comment-text").value.trim();

      // Bắt buộc có name + text
      if (!name || !text) {
        alert("Vui lòng điền đầy đủ tên và nội dung bình luận!");
        return;
      }

      // Tạo bình luận mới
      const newComment = {
        name,
        email,
        text,
        date: new Date().toLocaleDateString("vi-VN"),
      };

      // Thêm vào mảng comments
      comments.push(newComment);

      // Lưu lại vào localStorage theo bài viết (comments_<id>)
      localStorage.setItem(`comments_${id}`, JSON.stringify(comments));

      // Render lại UI
      renderComments();

      // Reset form sau khi gửi
      commentForm.reset();

      // Cuộn tới bình luận mới nhất (bình luận vừa gửi)
      setTimeout(() => {
        const lastComment = commentsList.querySelector(".comment-item:last-child");
        if (lastComment) {
          lastComment.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100);
    });
  });
})();
