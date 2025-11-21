import React from "react";
import smokeBg from "../assets/hero-smoke.jpg";
import "./hero.css";

const Hero: React.FC = () => {
  return (
    <section className="ha-hero" style={{ backgroundImage: `url(${smokeBg})` }}>
      <div className="ha-hero-overlay" />
      <div className="ha-hero-inner">
        <h1 className="ha-hero-title">Hired AI — Your AI Career Companion</h1>
        <p className="ha-hero-sub">Grow Bold. Build Smart.</p>
        <p className="ha-hero-desc">
          Start your AI-powered career journey with personalized guidance, skill development, and job matching that adapts to your goals.
        </p>
        <div className="ha-hero-ctas">
          <a href="#get-early-access" className="btn btn-cta">Get Early Access</a>
          <a href="#products" className="btn btn-dark">Get Started</a>
        </div>
      </div>

      <div className="ha-hero-about">
        <h3>About Root</h3>
        <p>
          Root is your foundation for a confident career journey. Learn industry-ready skills, build a portfolio, and prepare for interviews with personalized guidance.
        </p>
      </div>
    </section>
  );
};

export default Hero;
