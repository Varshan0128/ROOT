// src/components/Navbar.tsx
import React, { useState, useEffect, MouseEvent } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

type NavbarProps = {
  onNavigate?: (id: string) => void;
};

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "core-services", label: "Core Services" },
  { id: "hired-ai", label: "Hired AI" },
  { id: "workflow", label: "Workflow" },
];

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // use smooth scroll and set hash-less focus
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        try {
          el.setAttribute("tabindex", "-1");
          (el as HTMLElement).focus();
        } catch {}
      }, 400);
    }
    setActive(id);
    if (onNavigate) onNavigate(id);
  };

  const handleNavClick = (e: MouseEvent, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navTo(id);
  };

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`} role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <Link to="/" className="logo" onClick={(e) => handleNavClick(e, "home")}>
          Root
        </Link>

        <nav className={`nav-links ${mobileMenuOpen ? "active" : ""}`} aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-link ${active === item.id ? "active" : ""}`}
              onClick={(e) => handleNavClick(e, item.id)}
            >
              {item.label}
            </a>
          ))}

          <div className="nav-buttons">
            <a
              href="#get-early-access"
              className="btn btn-primary"
              onClick={(e) => handleNavClick(e, "get-early-access")}
            >
              Get Early Access
            </a>

            <a
              href="#contact"
              className="btn btn-outline"
              onClick={(e) => handleNavClick(e, "contact")}
            >
              Contact
            </a>
          </div>
        </nav>

        <button
          className={`hamburger ${mobileMenuOpen ? "active" : ""}`}
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
