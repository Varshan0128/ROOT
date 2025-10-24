// src/assets/js/main.js
// Compatibility wrapper — if your older build exposes init/start functions
(function () {
    function revealFallback() {
      var top = document.querySelector(".top-curtain");
      var bottom = document.querySelector(".bottom-curtain");
      var pre = document.querySelector(".preloader-container");
      var site = document.querySelector(".site-content");
  
      if (pre) pre.style.transition = "opacity .6s ease";
      if (top) top.classList.remove("open");
      if (bottom) bottom.classList.remove("open");
  
      setTimeout(function () {
        if (top) top.classList.add("open");
        if (bottom) bottom.classList.add("open");
      }, 400);
  
      setTimeout(function () {
        if (pre) pre.style.opacity = "0";
        if (site) site.classList.add("main-content-visible");
        document.body.classList.remove("no-scroll");
        if (pre) pre.style.pointerEvents = "none";
      }, 1600);
    }
  
    window.initMyAnimations = function initMyAnimations() {
      try {
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
        // fallback reveal
        revealFallback();
      } catch (err) {
        console.error("initMyAnimations error:", err);
        revealFallback();
      }
    };
  
    // auto-run shortly after DOM ready (safe for Vite)
    function tryAutoRun() {
      setTimeout(function () {
        if (typeof window.initMyAnimations === "function") {
          try {
            window.initMyAnimations();
          } catch (e) {
            console.error("auto initMyAnimations failed:", e);
          }
        }
      }, 80);
    }
  
    if (document.readyState === "complete" || document.readyState === "interactive") {
      tryAutoRun();
    } else {
      window.addEventListener("DOMContentLoaded", tryAutoRun);
    }
  })();
  