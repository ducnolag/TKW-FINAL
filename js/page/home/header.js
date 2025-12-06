document.addEventListener("htmlIncluded", function () {
  // ===== AUTH STATE MANAGEMENT =====
  function checkAuthState() {
    const currentUser = sessionStorage.getItem("currentUser");
    const loggedInSection = document.getElementById("loggedInSection");
    const authDropdown = document.getElementById("authDropdown");
    const usernameDisplay = document.getElementById("usernameDisplay");

    console.log("Checking auth state:", currentUser ? "Logged in" : "Logged out");

    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (loggedInSection) {
        loggedInSection.classList.add("show");
      }
      if (authDropdown) {
        authDropdown.classList.remove("show");
      }
      if (usernameDisplay) {
        usernameDisplay.textContent = user.username;
      }
      console.log("Showing logged-in section");
    } else {
      if (loggedInSection) {
        loggedInSection.classList.remove("show");
      }
      if (authDropdown) {
        authDropdown.classList.add("show");
      }
      console.log("Showing auth dropdown");
    }
  }

  // Logout function
  function logout() {
    if (confirm("Bạn có chắc muốn đăng xuất?")) {
      sessionStorage.removeItem("currentUser");
      checkAuthState();
      // Redirect to home page
      window.location.href = "../index.htm";
    }
  }

  // Setup logout button event listener
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  // Check auth state on page load
  checkAuthState();

  // Listen for storage changes from other tabs
  window.addEventListener("storage", function(e) {
    if (e.key === "currentUser") {
      checkAuthState();
    }
  });

  // ===== SCROLL EFFECT =====
  window.addEventListener("scroll", function () {
    const header = document.querySelector(".header-main");
    if (header && window.scrollY > 50) {
      header.classList.add("scrolled");
    } else if (header) {
      header.classList.remove("scrolled");
    }
  });

  // ===== MOBILE MENU =====
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