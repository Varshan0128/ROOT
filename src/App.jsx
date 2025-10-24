// src/App.jsx
import React, { useEffect } from "react";
import "./index.css";               // your base app CSS (already in src)

// small helper to load legacy non-module scripts
function loadScript(src, { async = false } = {}) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.async = async;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load " + src));
    document.body.appendChild(s);
  });
}

export default function App() {
  useEffect(() => {
    async function init() {
      try {
        // optionally load GSAP if your legacy script expects it
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js");
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js");
        // load your legacy/main.js from src/assets/js via Vite dev server path
        await loadScript("/src/assets/js/main.js");
        // call compatibility init
        if (typeof window.initMyAnimations === "function") {
          window.initMyAnimations();
        } else {
          console.info("Legacy script loaded (no initMyAnimations found).");
        }
      } catch (err) {
        console.error("Script load error:", err);
      }
    }
    init();

    // Ensure above-the-fold content is visible immediately
    const showIntro = () => {
      document.querySelectorAll('.intro-anim').forEach(el => el.classList.add('in'));
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    };
    // Run once after mount
    showIntro();
    // Fallback after load
    window.addEventListener('load', showIntro, { once: true });
    return () => {
      window.removeEventListener('load', showIntro);
    };
  }, []);

  return (
    <>
      {/* Background gradient layers (CSS-driven) */}
      <div className="bg-layer layer-1" aria-hidden="true"></div>
      <div className="bg-layer layer-2" aria-hidden="true"></div>
      <div className="bg-layer layer-3 bg-grad-bottom" aria-hidden="true"></div>

      {/* Fluid FX / preloader hooks */}
      <div id="fluid-container" aria-hidden="true"></div>

      {/* Preloader */}
      <div className="preloader-container" role="status" aria-live="polite">
        <img src="/favicon.svg" alt="ROOT logo" className="preloader-img" />
        <div className="progress-bar-container" aria-label="Loading">
          <div className="progress-bar"></div>
        </div>
      </div>

      {/* Curtains */}
      <div className="curtain top-curtain" aria-hidden="true"></div>
      <div className="curtain bottom-curtain" aria-hidden="true"></div>

      <div className="site-content">
        {/* Header / Navigation */}
        <header className="site-header" id="top">
          <div className="container nav-wrapper">
            <a href="#top" className="logo" aria-label="ROOT home">
              <img src="/favicon.svg" alt="ROOT logo" className="logo-img intro-anim" />
              <span className="sr-only">ROOT</span>
            </a>
            <nav className="site-nav" aria-label="Primary">
              <ul id="nav-menu">
                <li><a href="#top">Home</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#products">AI Mentor</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#projects">Success</a></li>
                <li><a href="#early-access" className="btn btn-glow btn-small ea-track">Early Access</a></li>
                <li><a href="#contact" className="btn btn-primary btn-small">Contact</a></li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Journey overlay messages & progress */}
        <div className="journey-progress" aria-hidden="true"><div className="journey-progress__bar" aria-hidden="true"></div></div>
        <section className="journey-overlay" aria-label="Guidance messages">
          <p className="journey-msg" data-stage="rejection">Not selected? It happens.</p>
          <p className="journey-msg" data-stage="hope">Every challenge brings you closer.</p>
          <p className="journey-msg" data-stage="almost">You’re almost there.</p>
          <p className="journey-msg" data-stage="acceptance">Congratulations, you belong here!</p>
        </section>

        {/* Hero */}
        <section className="hero" aria-label="Hero">
          <div className="hero-content container">
            <h1 className="headline intro-anim in">Hired AI – Your AI Career Companion</h1>
            <p className="subhead intro-anim delay-1 in">Grow Bold. Build Smart. Start at Root.</p>
            <p className="subhead intro-anim delay-2 in" style={{ maxWidth: 820, marginTop: 8 }}>
              We empower students and job seekers with AI-powered tools to create professional resumes, prepare for interviews, discover jobs, build portfolios, and follow personalized learning paths.
            </p>
            <div className="hero-ctas intro-anim delay-2 in" style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <a href="#early-access" className="btn btn-glow ea-track" aria-label="Jump to Early Access form">Get Early Access</a>
              <a href="#contact" className="btn btn-primary">Get Started</a>
            </div>
          </div>
          <div className="hero-gradient" aria-hidden="true"></div>
        </section>

        {/* Early Access */}
        <section className="section" id="early-access" aria-label="Early Access">
          <div className="container">
            <div className="ea-hero">
              <h2 className="ea-title">Be the First to Try It</h2>
              <p className="ea-subline">Sign up now to get exclusive early access.</p>
              <form id="ea-sheet-form" className="ea-form" noValidate style={{ margin: "12px 0 0" }} data-script-url="https://script.google.com/macros/s/AKfycbx3gSTAciVCHK-HnXw3MUijf60AvWuWUErH4LaAsmvWMkAgxEQyIgOip6WX6V_gAxuO/exec">
                <label className="sr-only" htmlFor="ea-name">Name</label>
                <input id="ea-name" name="name" className="ea-input" type="text" placeholder="Your name" required />
                <label className="sr-only" htmlFor="ea-email">Email</label>
                <input id="ea-email" name="email" className="ea-input" type="email" placeholder="Enter your email" required />
                <button id="ea-submit" className="btn btn-glow ea-btn" type="submit">Join Waitlist</button>
                <p id="ea-success" className="ea-success" role="status" aria-live="polite" hidden>Thanks! You’re on the list.</p>
                <p id="ea-error" className="ea-error" role="alert" hidden>Something went wrong. Please try again.</p>
              </form>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="section">
          <div className="container">
            <h2>About Root</h2>
            <div className="card" style={{ padding: 22 }}>
              <h3 style={{ margin: "0 0 12px" }}>Our Story</h3>
              <p className="subhead" style={{ margin: "0 0 6px" }}>
                Root was founded with a simple vision: to <em>bridge the gap between education and employment</em>. Many students and fresh graduates face challenges in creating strong resumes, preparing for interviews, and finding the right opportunities. With Hired AI, we solve these challenges using artificial intelligence — making career growth smarter, faster, and easier.
              </p>
            </div>
            <h3 style={{ margin: "20px 0 12px" }}>Our Values</h3>
            <div className="grid four">
              <div className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28 }}>✨</div>
                <h4>Innovation</h4>
                <p>Building smart, AI-driven solutions</p>
              </div>
              <div className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28 }}>🌍</div>
                <h4>Accessibility</h4>
                <p>Making career tools available to everyone</p>
              </div>
              <div className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28 }}>📈</div>
                <h4>Growth</h4>
                <p>Helping individuals achieve their goals</p>
              </div>
              <div className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28 }}>🤝</div>
                <h4>Trust</h4>
                <p>Creating reliable and transparent solutions</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="section alt">
          <div className="container">
            <h2>Core Services</h2>
            <div className="grid three cards">
              <article className="card">
                <div className="card-icon gradient-a">📄</div>
                <h3>AI Resume Builder</h3>
                <p>Create ATS-friendly resumes in minutes.</p>
              </article>
              <article className="card">
                <div className="card-icon gradient-b">🎤</div>
                <h3>Mock Interview Prep</h3>
                <p>Practice with AI and get real-time feedback.</p>
              </article>
              <article className="card">
                <div className="card-icon gradient-c">🔎</div>
                <h3>Smart Job Discovery</h3>
                <p>Upload your resume and get job matches instantly.</p>
              </article>
              <article className="card">
                <div className="card-icon gradient-a">📚</div>
                <h3>Learning Path</h3>
                <p>Step-by-step skill-building roadmap for career growth.</p>
              </article>
              <article className="card">
                <div className="card-icon gradient-b">🗂️</div>
                <h3>Portfolio Builder</h3>
                <p>Showcase projects, certifications, and achievements in one place.</p>
              </article>
            </div>
          </div>
        </section>

        {/* Products / Hired AI Services */}
        <section id="products" className="section">
          <div className="container">
            <h2>Hired AI Services</h2>
            <div className="grid two">
              <div className="card" style={{ padding: 18 }}>
                <h3 style={{ margin: "0 0 10px" }}>Our Features</h3>
                <ul className="bullets">
                  <li><strong>AI Resume Builder</strong> — Quickly create ATS-friendly resumes with smart templates designed to impress recruiters.</li>
                  <li><strong>Interview Prep</strong> — Practice with AI-powered mock interviews (text & voice) and get instant feedback on answers, confidence, and body language.</li>
                  <li><strong>Job Discovery</strong> — Upload your resume and instantly receive curated job opportunities that match your skills and location.</li>
                  <li><strong>Learning Path</strong> — A personalized roadmap that guides you through technical, soft skills, and interview preparation — tailored to your career goals.</li>
                  <li><strong>Portfolio Builder</strong> — Easily build a professional portfolio showcasing your projects, certifications, and achievements in one shareable profile.</li>
                </ul>
              </div>
              <div className="card" style={{ padding: 18 }}>
                <h3 style={{ margin: "0 0 10px" }}>How It Works (The Core Flow)</h3>
                <ol className="bullets" style={{ listStyle: "decimal", paddingLeft: 22 }}>
                  <li>Upload your details</li>
                  <li>AI builds your resume and portfolio</li>
                  <li>Prepare with mock interviews</li>
                  <li>Follow your learning path to improve skills</li>
                  <li>Discover and apply to jobs</li>
                </ol>
                <a href="#contact" className="btn btn-primary" style={{ marginTop: 10, display: "inline-block" }}>Build My Resume</a>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section id="projects" className="section">
          <div className="container">
            <h2>Success Stories</h2>
            <div className="grid two cards">
              <article className="card">
                <p style={{ fontStyle: "italic", fontSize: "1.1rem" }}>
                  "Hired AI helped me build my resume and land my first job in 3 weeks."
                </p>
                <p style={{ marginTop: 6 }}>— Student User</p>
              </article>
              <article className="card">
                <p style={{ fontStyle: "italic", fontSize: "1.1rem" }}>
                  "The AI mock interviews boosted my confidence before my campus placements."
                </p>
                <p style={{ marginTop: 6 }}>— College Graduate</p>
              </article>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section id="faqs" className="section alt">
          <div className="container">
            <h2>Frequently Asked Questions</h2>
            <div className="card" style={{ padding: 18 }}>
              <details>
                <summary>Is Hired AI free to use?</summary>
                <p>Yes, you can start building resumes and practicing interviews instantly. Premium features are available through our paid tiers.</p>
              </details>
              <details>
                <summary>Can I download my resume?</summary>
                <p>Yes, resumes created using our builder can be instantly downloaded in professional PDF format, optimized for printing and emailing.</p>
              </details>
              <details>
                <summary>How does AI interview prep work?</summary>
                <p>Our AI asks real-world, tailored interview questions and uses machine learning to provide instant feedback on your answers, confidence, and voice tone.</p>
              </details>
              <details>
                <summary>What is the Learning Path feature?</summary>
                <p>It’s a personalized roadmap that analyzes your resume and target jobs to help you build the precise technical and soft skills you need for your career.</p>
              </details>
              <details>
                <summary>What is the Portfolio Builder?</summary>
                <p>A seamless digital profile creator that lets you showcase your projects, certifications, and achievements in one shareable, professional profile link.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section">
          <div className="container grid two">
            <div>
              <h2>Contact</h2>
              <p>We’d love to hear from you! Reach out for partnerships, support, or feedback.</p>
              <div className="contact-cards">
                <a className="contact-card" href="mailto:root96623@gmail.com"><span>root96623@gmail.com</span></a>
                <a className="contact-card" href="tel:+10000000000"><span>+1 (000) 000‑0000</span></a>
                <a className="contact-card" href="https://linkedin.com/company/start-at-root" target="_blank" rel="noopener"><span>LinkedIn — start-at-root</span></a>
                <a className="contact-card" href="https://www.instagram.com/start_at_root?igsh=MWVpeWdqdWFzMnZjbQ==" target="_blank" rel="noopener"><span>Instagram — @start_at_root</span></a>
                <a className="contact-card" href="https://twitter.com" target="_blank" rel="noopener"><span>Twitter</span></a>
              </div>
            </div>
            <form id="contact-form" className="contact-form" action="https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID" method="POST" aria-label="Contact form" noValidate>
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" placeholder="Your name" required />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="you@company.com" required />
              </div>
              <div className="field full">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={4} placeholder="Tell us about your project" required></textarea>
              </div>
              <button className="btn btn-primary" type="submit">Send Message</button>
              <p className="form-note">We typically reply within 1–2 business days.</p>
              <p id="contact-success" className="ea-success" role="status" aria-live="polite" hidden>Thanks! Your message has been sent.</p>
              <p id="contact-error" className="ea-error" role="alert" hidden>Something went wrong. Please try again.</p>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="site-footer">
          <div className="container footer-inner">
            <div className="foot-left">
              <img src="/favicon.svg" alt="ROOT logo" className="logo-img" />
            </div>
            <div className="foot-right">
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                <a href="#early-access" className="btn btn-glow btn-small ea-track" aria-label="Get Early Access section">Early Access</a>
                <span aria-hidden="true">|</span>
                <a href="#faqs" className="to-top">FAQs</a>
                <span aria-hidden="true">|</span>
                <a href="#top" className="to-top">Back to top ↑</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}