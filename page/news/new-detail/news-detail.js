(function () {
  function esc(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

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

  function getIdFromUrl() {
    const raw = new URLSearchParams(location.search).get("id");
    const id = Number(raw);
    return Number.isFinite(id) ? id : NaN;
  }

  function getData() {
    return Array.isArray(window.newsData) ? window.newsData : [];
  }

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

  function setActiveSidebarCategory(category) {
    document.querySelectorAll(".category-menu li").forEach((li) => li.classList.remove("active"));

    const links = document.querySelectorAll(".category-menu a[data-category]");
    const catNorm = normalizeText(category);

    for (const a of links) {
      if (normalizeText(a.dataset.category) === catNorm) {
        a.closest("li")?.classList.add("active");
        return;
      }
    }

    const allLink =
      document.querySelector('.category-menu a[data-category="all"]') ||
      document.querySelector('.category-menu a[data-category="Tất cả"]') ||
      document.querySelector('.category-menu a[data-category="tat-ca"]');

    allLink?.closest("li")?.classList.add("active");
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? "";
  }

  function setHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html ?? "";
  }

  function setImg(id, src, alt) {
    const el = document.getElementById(id);
    if (el && el.tagName === "IMG") {
      el.src = src || "";
      if (alt != null) el.alt = alt;
    }
  }

  function renderNotFound() {
    setText("post-title", "Không tìm thấy bài viết");
    setHtml("post-content", `<div class="alert alert-warning">Bài viết không tồn tại.</div>`);
    setActiveSidebarCategory("all");
  }

  function renderPost(post) {
    setText("post-title", post.title);
    setText("post-date", post.date);
    setText("post-author", post.author || "Admin");
    setText("post-category", post.category);
    setImg("post-image", post.image, post.title);
    setHtml("post-content", renderContent(post.content));

    setActiveSidebarCategory(post.category);
  }

  function findPostById(id) {
    const data = getData();
    return data.find((p) => p && p.id === id);
  }

  window.onSidebarInjectedForDetail = function () {
    const id = getIdFromUrl();
    if (!Number.isFinite(id)) {
      setActiveSidebarCategory("all");
      return;
    }

    const post = findPostById(id);
    if (post) setActiveSidebarCategory(post.category);
    else setActiveSidebarCategory("all");
  };

  document.addEventListener("DOMContentLoaded", () => {
    const id = getIdFromUrl();
    if (!Number.isFinite(id)) {
      renderNotFound();
      return;
    }

    const post = findPostById(id);
    if (!post) {
      renderNotFound();
      return;
    }

    renderPost(post);

    // Xử lý form bình luận
    const commentForm = document.getElementById("news-comments");
    const commentsList = document.getElementById("comments-list");
    let comments = JSON.parse(localStorage.getItem(`comments_${id}`)) || [];

    // Hiển thị bình luận đã lưu
function renderComments() {
  if (comments.length === 0) {
    commentsList.innerHTML = '<div class="text-center text-muted py-4">Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nghĩ!</div>';
    return;
  }

  commentsList.innerHTML = comments
    .map((c) => {
        // Lấy chữ cái đầu của tên để làm avatar
        const firstLetter = c.name ? c.name.charAt(0).toUpperCase() : '?';
        
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

    // Render bình luận ban đầu
    renderComments();

    // Xử lý gửi bình luận
    commentForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.querySelector(".comment-name").value.trim();
      const email = document.querySelector(".comment-email").value.trim();
      const text = document.querySelector(".comment-text").value.trim();

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

      // Thêm vào danh sách
      comments.push(newComment);

      // Lưu vào localStorage
      localStorage.setItem(`comments_${id}`, JSON.stringify(comments));

      // Render lại
      renderComments();

      // Reset form
      commentForm.reset();

      // Scroll đến bình luận vừa gửi
      setTimeout(() => {
        const lastComment = commentsList.querySelector(".comment-item:last-child");
        if (lastComment) {
          lastComment.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100);
    });
  });
})();
