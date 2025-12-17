document.addEventListener("DOMContentLoaded", () => {
  fetch("sidebar.html")
    .then(r => {
      if (!r.ok) throw new Error("không load được sidebar.html");
      return r.text();
    })
    .then(html => {
      const el = document.getElementById("sidebar-container");
      if (!el) throw new Error("không thấy #sidebar-container trong news.html");
      el.innerHTML = html;

      // bind event search + category sau khi sidebar đã được inject
      if (typeof window.bindSidebarEvents === "function") {
        window.bindSidebarEvents();
      }
    })
    .catch(console.error);
});
