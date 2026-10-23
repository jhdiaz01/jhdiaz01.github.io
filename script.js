document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("site-nav");
  if (!menuToggle || !nav) return;

  const SWIPE_THRESHOLD = 60;
  const isMenuOpen = () => nav.classList.contains("open");

  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuToggle.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Toggle navigation");
  }

  // Toggle button (the only toggle handler, so it can't cancel itself out)
  menuToggle.addEventListener("click", () => setMenu(!isMenuOpen()));

  // Close after choosing a link
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

  // Tap/click anywhere outside the menu and toggle closes it
  document.addEventListener("click", (e) => {
    if (isMenuOpen() && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
      setMenu(false);
    }
  });

  // Escape key closes it
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isMenuOpen()) setMenu(false);
  });

  // Swipe anywhere closes it
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener("touchend", (e) => {
    if (!isMenuOpen()) return;
    const dx = Math.abs(e.changedTouches[0].screenX - touchStartX);
    const dy = Math.abs(e.changedTouches[0].screenY - touchStartY);
    if (Math.max(dx, dy) > SWIPE_THRESHOLD) setMenu(false);
  }, { passive: true });

  // Hide header on scroll down, show on scroll up; close the menu while scrolling down
  let prevScrollPos = window.pageYOffset;
  window.addEventListener("scroll", () => {
    const currentScrollPos = window.pageYOffset;
    if (prevScrollPos > currentScrollPos) {
      if (header) header.style.top = "0";
    } else {
      if (header) header.style.top = "-80px";
      if (isMenuOpen()) setMenu(false);
    }
    prevScrollPos = currentScrollPos;
  }, { passive: true });
});
