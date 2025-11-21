// FrontHero.tsx
import React from "react";
import "./front-hero.css";

interface FrontHeroProps {
  /**
   * When true, the CTA will open the static form directly (use when hero is inside the Get Early Access section).
   */
  openDirectly?: boolean;
  /**
   * When true, hero becomes full width (no outer container). Inner content stays aligned to --max-width so it lines up with footer.
   */
  fullWidth?: boolean;
}

const FrontHero: React.FC<FrontHeroProps> = ({ openDirectly = false, fullWidth = false }) => {
  const handleCTAClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // If configured to open directly, open the static form in a new tab
    if (openDirectly) {
      window.open("/early-access-form.html", "_blank", "noopener,noreferrer");
      return;
    }

    // Otherwise try to scroll to the early-access section
    const target = document.getElementById("get-early-access");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        target.setAttribute("tabindex", "-1");
        (target as HTMLElement).focus({ preventScroll: true });
      }, 500);
      return;
    }

    // Fallback - open the static form
    window.open("/public/early-access-form.html", "_blank", "noopener,noreferrer");

  };

  return (
    <section
      className={fullWidth ? "front-hero front-hero--full" : "front-hero container"}
      role="region"
      aria-labelledby="front-hero-title"
    >
      <section
  className="ea-hero-section"
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    flexDirection: "column",
    padding: "40px 20px",
  }}
>

  <h1
    style={{
      fontSize: "clamp(2rem, 4vw, 3.2rem)",
      fontWeight: "800",
      color: "#fff",
      marginBottom: "16px",
    }}
  >
    Join the Future of Intelligent Innovation
  </h1>

  <p
    style={{
      maxWidth: "900px",
      margin: "0 auto 28px",
      color: "#ddd",
      lineHeight: "1.6",
      fontSize: "1.1rem",
    }}
  >
    Be among the first to experience our upcoming launches — including Hired AI.
    Early access members get exclusive insights, beta invites, and direct
    mentorship from the Root team.
  </p>

  {/* CTA CENTER FIXED */}
  <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
  <button
  onClick={handleCTAClick}
  className="ea-btn-orange"
  style={{
    background: "linear-gradient(180deg, #ff8b3d 0%, #ff6f17 100%)",
    color: "#fff",
    padding: "14px 32px",
    borderRadius: "999px",
    fontWeight: 700,
    fontSize: "1.05rem",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 18px 40px rgba(255,122,32,0.22), 0 6px 20px rgba(0,0,0,0.25)"
  }}
>
  Get Early Access
</button>

</div>


</section>

    </section>
  );
};

export default FrontHero;
