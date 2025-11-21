// Integration Test File
// This file demonstrates how to integrate the component into your existing Vite project

import React from 'react';
import Hero from './components/animated-shader-hero.integration';
import './components/animated-shader-hero.integration.css';

// Example integration into your existing App component
export const IntegrationExample: React.FC = () => {
  return (
    <div>
      {/* Your existing app content */}
      <Hero
        trustBadge={{
          text: "HiredAI - Your AI Career Companion",
          icons: ["🚀", "⭐"]
        }}
        headline={{
          line1: "Grow Bold",
          line2: "Build Smart"
        }}
        subtitle="Start your AI-powered career journey with personalized guidance, skill development, and job matching that adapts to your goals."
        buttons={{
          primary: {
            text: "Start Your Journey",
            onClick: () => {
              console.log('Starting career journey...');
              // Add your navigation logic here
            }
          },
          secondary: {
            text: "Learn More",
            onClick: () => {
              console.log('Learning more...');
              // Add your navigation logic here
            }
          }
        }}
        className="custom-hero-class"
      />
      
      {/* Rest of your app content */}
    </div>
  );
};

// Alternative: Replace your existing hero section
export const ReplaceExistingHero: React.FC = () => {
  return (
    <Hero
      trustBadge={{
        text: "Trusted by forward-thinking teams.",
        icons: ["✨"]
      }}
      headline={{
        line1: "Launch Your",
        line2: "Workflow Into Orbit"
      }}
      subtitle="Supercharge productivity with AI-powered automation and integrations built for the next generation of teams — fast, seamless, and limitless."
      buttons={{
        primary: {
          text: "Get Started for Free",
          onClick: () => console.log('Get Started clicked!')
        },
        secondary: {
          text: "Explore Features",
          onClick: () => console.log('Explore Features clicked!')
        }
      }}
    />
  );
};

export default IntegrationExample;
