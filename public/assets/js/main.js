/* === Compatibility wrapper for Vite/React dev server ===
   This exposes a safe initializer and a light fallback reveal
   so your preloader/curtain animation runs when loaded via /assets/js/main.js
*/

(function () {
  // expose an init function that your app can call
  window.initMyAnimations = function initMyAnimations() {
    try {
      // if the original script already exposes a function name, call it.
      // common names used by older builds: startPreloader, initPreloader, initAnimations
      if (typeof window.startPreloader === "function") {
        window.startPreloader();
        return;
      }
      if (typeof window.initPreloader === "function") {
        window.initPreloader();
        return;
      }
      if (typeof window.initAnimations === "function") {
        window.initAnimations();
        return;
      }

      // FALLBACK: gently open curtains and reveal content (non-destructive)
      // this will mimic the 'vertical opening' and show the site content.
      var top = document.querySelector(".top-curtain");
      var bottom = document.querySelector(".bottom-curtain");
      var pre = document.querySelector(".preloader-container");
      var site = document.querySelector(".site-content");

      // Add classes with small delays to mirror original timing
      if (pre) pre.style.transition = "opacity .6s ease";
      if (top) top.classList.remove("open");
      if (bottom) bottom.classList.remove("open");

      // show preloader briefly, then open curtains and reveal
      setTimeout(function () {
        if (top) top.classList.add("open");
        if (bottom) bottom.classList.add("open");
      }, 400); // wait 400ms then open curtains

      setTimeout(function () {
        if (pre) pre.style.opacity = "0";
        if (site) site.classList.add("main-content-visible");
        // ensure body scroll is enabled
        document.body.classList.remove("no-scroll");
        // remove preloader from pointer events
        if (pre) pre.style.pointerEvents = "none";
      }, 1600); // after curtains open, reveal content

      return;
    } catch (err) {
      console.error("initMyAnimations error:", err);
    }
  };

  // Auto-run when script loads if DOM is already ready or when it becomes ready
  function tryAutoRun() {
    if (typeof window.initMyAnimations === "function") {
      // small delay to allow Vite to mount DOM nodes
      setTimeout(function () {
        try {
          window.initMyAnimations();
        } catch (e) {
          console.error("auto initMyAnimations failed:", e);
        }
      }, 80);
    }
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    tryAutoRun();
  } else {
    window.addEventListener("DOMContentLoaded", tryAutoRun);
  }
})();
