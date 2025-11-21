import React from 'react';
import './HomeHero.css';

const HomeHero = () => {
  return (
    <div className="home-hero">
      <div className="home-hero__content">
        <h1 className="home-hero__title">Hired AI - Your AI Career Companion</h1>
        <h2 className="home-hero__subtitle">
          Grow Bold. <span className="text-orange">Build Smart.</span>
        </h2>
        <p className="home-hero__tagline">Start at Root</p>
        <p className="home-hero__description">
          Start your AI-powered career journey with personalized guidance, skill development, 
          and job matching that adapts to your goals.
        </p>
        <div className="home-hero__ctas">
          <button className="btn btn-primary" onClick={() => {
            const el = document.getElementById('get-early-access');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}>Get Early Access</button>
          <button className="btn btn-outline">Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
