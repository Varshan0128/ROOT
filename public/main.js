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

// Form submission handler
document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const notes = document.getElementById('notes').value.trim();
      const msg = document.getElementById('msg');

      if (!name || !email) { 
        msg.textContent = 'Please enter name and email.'; 
        return; 
      }

      msg.textContent = 'Sending...';
      try {
        const response = await fetch('http://localhost:3001/api/early-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, notes })
        });
        
        const result = await response.json();
        
        if (result.status === 'ok') {
          msg.textContent = 'Thanks! We received your request.';
          document.getElementById('name').value = '';
          document.getElementById('email').value = '';
          document.getElementById('phone').value = '';
          document.getElementById('notes').value = '';
        } else {
          msg.textContent = 'Error: ' + (result.message || 'Unknown error occurred');
        }
      } catch (error) {
        console.error('Error:', error);
        msg.textContent = 'Network error - please try again later.';
      }
    });
  }
});
