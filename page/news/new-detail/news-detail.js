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
  });
})();
