(function () {
  const mq = window.matchMedia("(max-width: 576px)");
  const accs = document.querySelectorAll(".footer_acc");

  function setDesktopOpen() {
    if (!mq.matches) {
      accs.forEach(btn => {
        const id = btn.getAttribute("aria-controls");
        if (!id) return;
        const panel = document.getElementById(id);
        const ico = btn.querySelector(".footer_acc-ico");
        btn.setAttribute("aria-expanded", "true");
        if (panel) panel.classList.add("open");
        if (ico) ico.textContent = "–";
      });
    }
  }

  function setMobileClosed() {
    if (mq.matches) {
      accs.forEach(btn => {
        const id = btn.getAttribute("aria-controls");
        if (!id) return;
        const panel = document.getElementById(id);
        const ico = btn.querySelector(".footer_acc-ico");
        btn.setAttribute("aria-expanded", "false");
        if (panel) panel.classList.remove("open");
        if (ico) ico.textContent = "+";
      });
    }
  }

  accs.forEach(btn => {
    btn.addEventListener("click", () => {
      if (!mq.matches) return;
      const id = btn.getAttribute("aria-controls");
      if (!id) return;

      const panel = document.getElementById(id);
      const ico = btn.querySelector(".footer_acc-ico");
      const expanded = btn.getAttribute("aria-expanded") === "true";

      btn.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.classList.toggle("open", !expanded);
      if (ico) ico.textContent = expanded ? "+" : "–";
    });
  });

  setDesktopOpen();
  setMobileClosed();
  window.addEventListener("resize", () => {
    setDesktopOpen();
    setMobileClosed();
  });
})();