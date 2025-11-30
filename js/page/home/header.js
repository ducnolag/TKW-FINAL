document.addEventListener("htmlIncluded", function () {
      // Scroll effect
      window.addEventListener("scroll", function () {
        const header = document.querySelector(".header-main");
        if (header && window.scrollY > 50) {
          header.classList.add("scrolled");
        } else if (header) {
          header.classList.remove("scrolled");
        }
      });

      // Auth state management
      const accountBtn = document.getElementById("accountBtn");
      const logoutBtn = document.getElementById("logoutBtn");
      const authDropdown = document.getElementById("authDropdown");

      // Simulate user logged in state (change this based on your actual auth state)
      let isLoggedIn = true; // Set to true to show logged in state initially

      function updateAuthUI() {
        if (isLoggedIn) {
          // User is logged in - show "Tài khoản" and "Thoát"
          if (accountBtn) accountBtn.style.display = "flex";
          if (logoutBtn) logoutBtn.style.display = "flex";
          if (authDropdown) authDropdown.style.display = "none";
        } else {
          // User is logged out - show "Đăng nhập" and "Đăng ký"
          if (accountBtn) accountBtn.style.display = "none";
          if (logoutBtn) logoutBtn.style.display = "none";
          if (authDropdown) authDropdown.style.display = "flex";
        }
      }

      // Initial UI state
      updateAuthUI();

      // Logout button click handler
      if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
          e.preventDefault();
          isLoggedIn = false;
          updateAuthUI();
          // Here you can add actual logout logic (clear session, redirect, etc.)
        });
      }

      // Mobile Menu Toggle
      const mobileToggle = document.getElementById("mobileToggle");
      const mobileMenu = document.getElementById("mobileMenu");
      const mobileClose = document.getElementById("mobileClose");
      const mobileOverlay = document.getElementById("mobileOverlay");

      function openMobileMenu() {
        if (mobileMenu) mobileMenu.classList.add("active");
        if (mobileOverlay) mobileOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
      }

      function closeMobileMenu() {
        if (mobileMenu) mobileMenu.classList.remove("active");
        if (mobileOverlay) mobileOverlay.classList.remove("active");
        document.body.style.overflow = "";
      }

      if (mobileToggle) {
        mobileToggle.addEventListener("click", openMobileMenu);
      }

      if (mobileClose) {
        mobileClose.addEventListener("click", closeMobileMenu);
      }

      if (mobileOverlay) {
        mobileOverlay.addEventListener("click", closeMobileMenu);
      }

      // Close menu on escape key
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          closeMobileMenu();
        }
      });
});