(function () {
  const mq = window.matchMedia("(max-width: 576px)"); //

  /**
   * Hàm khởi tạo cho từng nút Accordion riêng biệt
   * Giúp xử lý cả trường hợp thiếu ID hoặc aria-controls
   */
  function setupAccordion(btn) {
    if (btn.dataset.initialized === "true") return;
    btn.dataset.initialized = "true";

    // Tìm panel: Ưu tiên qua ID, nếu không thấy thì tìm phần tử anh em kế tiếp
    const getPanel = (button) => {
      const id = button.getAttribute("aria-controls");
      let panel = id ? document.getElementById(id) : null;
      if (!panel) {
        // Tìm phần tử có class footer_panel nằm ngay sau hoặc trong cùng khối cha
        panel = button.nextElementSibling;
        if (!panel || !panel.classList.contains('footer_panel')) {
          panel = button.parentElement.querySelector('.footer_panel');
        }
      }
      return panel;
    };

    const panel = getPanel(btn);
    const ico = btn.querySelector(".footer_acc-ico");

    const updateState = (forceExpand) => {
      const isMobile = mq.matches;
      // Nếu là Desktop thì luôn mở, nếu Mobile thì dựa theo trạng thái forceExpand hoặc aria-expanded hiện tại
      const shouldExpand = !isMobile ? true : (forceExpand !== undefined ? forceExpand : btn.getAttribute("aria-expanded") === "true");

      btn.setAttribute("aria-expanded", String(shouldExpand));
      if (panel) {
        panel.classList.toggle("open", shouldExpand); //
      }
      if (ico) {
        ico.textContent = shouldExpand ? "–" : "+";
      }
    };

    // Sự kiện Click cho Mobile
    btn.addEventListener("click", (e) => {
      if (!mq.matches) return;
      e.preventDefault();
      const currentState = btn.getAttribute("aria-expanded") === "true";
      updateState(!currentState);
    });

    // Khởi tạo trạng thái ban đầu: Desktop mở, Mobile đóng
    updateState(!mq.matches);

    // Lắng nghe thay đổi kích thước màn hình
    window.addEventListener("resize", () => {
      if (!mq.matches) updateState(true);
      else updateState(false);
    });
  }

  // --- QUAN TRỌNG: MutationObserver để theo dõi toàn bộ phần tử mới ---
  const observer = new MutationObserver(() => {
    const allButtons = document.querySelectorAll(".footer_acc");
    if (allButtons.length > 0) {
      allButtons.forEach(btn => setupAccordion(btn));
    }
  });

  // Theo dõi sự thay đổi của body để bắt kịp các thành phần nạp async
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Chạy thử ngay lập tức cho các phần tử đã có sẵn
  document.querySelectorAll(".footer_acc").forEach(btn => setupAccordion(btn));
})();