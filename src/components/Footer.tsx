import React from "react";
import "./footer.css";

export default function Footer(): JSX.Element {
  return (
    <footer id="contact" className="ha-footer" role="contentinfo">
      <div className="ha-footer__inner">
        
        {/* Left column */}
        <div className="ha-footer__left">
          <h3 className="ha-footer__title">Hired AI</h3>
          <p className="ha-footer__muted">Produced by Root</p>
          <p className="ha-footer__meta">© 2024 Root. All rights reserved.</p>
          <p className="ha-footer__desc">Helping students and job seekers grow with AI.</p>
        </div>

        {/* Right column */}
        <div className="ha-footer__right">
          <h4 className="ha-footer__title small">Connect with Us</h4>

          <ul className="ha-social-list">
            <li>
              <a
                href="https://www.linkedin.com/company/start-at-root/"
                target="_blank"
                rel="noopener noreferrer"
                className="ha-social-link"
                aria-label="LinkedIn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4.98 3.5C4.98 4.6 4.1 5.5 2.98 5.5C1.86 5.5 1 4.6 1 3.5C1 2.4 1.86 1.5 2.98 1.5C4.1 1.5 4.98 2.4 4.98 3.5Z" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M1 8.5H5.95V23H1V8.5Z" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M9.5 8.5H14.2V10.5H14.3C15.05 9.2 16.9 8 19.3 8C23.05 8 24 10.4 24 14.2V23H18.05V14.7C18.05 12.7 17.9 10.2 15 10.2C12.1 10.2 11.6 12.4 11.6 14.5V23H5.95V8.5H9.5Z" stroke="currentColor" strokeWidth="1.4"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            </li>

            <li>
              <a
                href="https://www.instagram.com/rootai.in?igsh=aG40a2F1czZtcGtl"
                target="_blank"
                rel="noopener noreferrer"
                className="ha-social-link"
                aria-label="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.4" />
                  <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M17.5 6.5H17.51" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                <span>Instagram</span>
              </a>
            </li>

            <li>
              <a className="ha-social-link" href="mailto:rootaisolutions@gmail.com" aria-label="Email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M2 6.5H22V18.5H2V6.5Z" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M2 6.5L12 13.5L22 6.5" stroke="currentColor" strokeWidth="1.4"/>
                </svg>
                <span>rootaisolutions@gmail.com</span>
              </a>
            </li>

            <li>
              <a className="ha-social-link" href="tel:+917603865862" aria-label="Phone">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M22 16.92V20C22 20.55 21.55 21 21 21C10.5 21 3 13.5 3 3C3 2.45 3.45 2 4 2H7.09C7.58 2 8 2.33 8.19 2.8L9.5 6.5C9.64 6.86 9.58 7.27 9.34 7.59L7.79 9.79C8.89 12.3 11.7 15.09 14.21 16.19L16.41 14.64C16.73 14.4 17.14 14.34 17.5 14.48L21.2 15.8C21.67 15.99 22 16.41 22 16.9V16.92Z" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
                <span>+91 76038 65862</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="ha-footer__bottom">
        <p>Root — Where Ideas Grow Into Intelligent Products</p>
        <p className="small">Crafted with ❤️ by <strong>Root Team</strong>.</p>
      </div>
    </footer>
  );
}
