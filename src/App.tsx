// src/App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import ShaderHero from "./components/ui/animated-shader-hero";
import FrontHero from "./components/FrontHero";
import Footer from "./components/Footer";
import "./index.css"; // Your global CSS

// Replace this when you have a deployed Google Apps Script web app
const GOOGLE_APPS_SCRIPT_URL = "http://localhost:3001/api/early-access";

const SECTION_IDS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "core-services", label: "Core Services" },
  { id: "hired-ai", label: "Hired AI" },
  { id: "workflow", label: "Workflow" },
  { id: "get-early-access", label: "Get Early Access" },
];

const App: React.FC = () => {
  // active id setter (we don't need the current value here)
  const [, setActiveId] = useState<string>("home");

  // Replace the existing "smooth scroll / reveal animation" useEffect with this version
useEffect(() => {
  // Smooth scroll behavior
  try {
    document.documentElement.style.scrollBehavior = "smooth";
  } catch (e) {
    /* ignore */
  }

  // Clear the hash from URL on initial load to prevent auto-scrolling
  if (window.location.hash) {
    window.history.replaceState(null, "", " ");
  }

  // Sections for reveal and active link observer
  const sections =
    SECTION_IDS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];

  // SAFETY: if no sections found, nothing to do
  if (!sections.length) return;

  // Reveal animation (prefers-reduced-motion safe)
  const prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Add base 'reveal' class + reset any inline transitionDelay
  sections.forEach((sec) => {
    sec.classList.add("reveal");
    sec.style.transitionDelay = ""; // clear any old inline delays
  });

  if (!prefersReduced) {
    // We'll use an IntersectionObserver and apply a small stagger based on the section's index.
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // compute index-based stagger using the sections array
            const idx = Math.max(0, sections.indexOf(entry.target as HTMLElement));
            // stagger: 120ms per item (adjust as you like)
            const delayMs = idx * 120;
            // apply inline transition-delay so each section animates slightly after previous
            (entry.target as HTMLElement).style.transitionDelay = `${delayMs}ms`;
            // add visible class
            entry.target.classList.add("reveal--visible");
            // stop observing this entry
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    sections.forEach((s) => revealObserver.observe(s));
    return () => revealObserver.disconnect();
  } else {
    // if reduced motion, mark visible immediately (no animation/stagger)
    sections.forEach((sec) => sec.classList.add("reveal--visible"));
  }
}, []);

  const handleNavigateTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  };

  return (
    // Important: Router wrapper so Navbar Link components work correctly
    <Router>
      <div className="w-full relative min-h-screen flex flex-col">
        <ShaderHero
          className="fixed inset-0 -z-10"
          hideContent
          trustBadge={{ text: "HiredAI - Your AI Career Companion" }}
          headline={{ line1: "", line2: "" }}
          subtitle=""
        />

        <Navbar onNavigate={handleNavigateTo} />

        <main className="flex-1 relative z-10 px-4 sm:px-6 lg:px-8 py-8">
          {/* ----- HERO (updated) ----- */}
          <section
            id="home"
            aria-label="Home"
            className="min-h-[78vh] lg:min-h-[86vh] flex items-center"
            style={{ paddingTop: 28, paddingBottom: 28 }} // small padding so hero doesn't touch navbar visually
          >
            <div className="max-w-6xl w-full mx-auto px-6 lg:px-10">
              <div className="text-center">
                {/* Big headline */}
                <h1
                  className="font-extrabold text-white"
                  style={{
                    fontSize: "clamp(2.6rem, 6.2vw, 4.8rem)",
                    lineHeight: 1.02,
                    marginBottom: 12,
                    textShadow: "0 10px 36px rgba(0,0,0,0.45)",
                  }}
                >
                  Hired AI — Your AI Career Companion
                </h1>

                {/* Taglines */}
                <div style={{ maxWidth: 920, margin: "0 auto" }}>
                  <p
                    className="text-[rgba(255,255,255,0.95)] font-semibold"
                    style={{ marginTop: 8, marginBottom: 6 }}
                  >
                    Grow Bold. Build Smart.
                  </p>

                  <p
                    className="text-[rgba(255,255,255,0.9)] font-medium"
                    style={{ marginBottom: 8 }}
                  >
                    Start at Root.
                  </p>

                  <p
                    className="mx-auto text-[rgba(255,255,255,0.88)]"
                    style={{ maxWidth: 820, marginTop: 10, lineHeight: 1.7 }}
                  >
                    Start your AI-powered career journey with personalized guidance,
                    skill development, and job matching that adapts to your goals.
                  </p>
                </div>

                {/* CTAs */}
                <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
                 <button
  onClick={() => handleNavigateTo("get-early-access")}
  className="rounded-full px-8 py-3 font-semibold shadow-2xl"
  style={{
    background: "linear-gradient(180deg, #ff9a3d 0%, #ff7a20 100%)",
    color: "#fff",
    border: "none",
    boxShadow:
      "0 18px 40px rgba(255,122,32,0.22), 0 8px 18px rgba(0,0,0,0.35)",
  }}
>
  Get Early Access
</button>


                  <button
                    onClick={() => handleNavigateTo("about")}
                    className="rounded-full px-8 py-3 font-semibold shadow-lg"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.08)",
                      backdropFilter: "blur(6px)",
                    }}
                    aria-label="Get Started"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ----- ABOUT ----- */}
          <section id="about" aria-label="About Root" className="max-w-6xl mx-auto py-12">
            <div className="section-box">
              <h2 className="text-3xl font-bold mb-4">About Root</h2>
              <p className="text-lg leading-relaxed mb-4">
                Root is a next-gen innovation lab building AI-powered platforms that solve real-world problems across education, employment,
                and enterprise.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                From helping students land their first job to empowering professionals to grow smarter, Root builds ecosystems — not just apps.
                We believe in blending technology with purpose — every product we craft is designed to educate, empower, and evolve.
              </p>
              <h3 className="text-xl font-semibold mt-6">Our Vision</h3>
              <p className="mt-2">
                To make AI personal, practical, and powerful — for everyone. Root exists to bridge the gap between human potential and intelligent
                technology.
              </p>
            </div>
          </section>

          {/* ----- CORE SERVICES ----- */}
          <section id="core-services" aria-label="Core Services" className="max-w-6xl mx-auto py-12">
            <div className="section-box">
              <h2 className="text-4xl font-extrabold mb-6">Core Services</h2>
              <p className="mb-6">
                Root builds next-generation AI tools designed to guide you from learning to earning. Our core services form the foundation of your
                digital growth experience.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <article className="p-6 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                  <h3 className="text-xl font-semibold">AI Resume Builder</h3>
                  <p className="mt-2">Create ATS-friendly resumes in minutes with role-optimized templates and keyword-based optimization suggestions.</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Role-specific scoring and improvement tips</li>
                    <li>One-click PDF/DOCX export</li>
                    <li>ATS compliance checker</li>
                  </ul>
                </article>

                <article className="p-6 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                  <h3 className="text-xl font-semibold">Mock Interview Prep</h3>
                  <p className="mt-2">Practice interviews using text or voice modes and receive AI-driven feedback on your responses, confidence, and tone.</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Live scoring for technical and behavioral quality</li>
                    <li>Voice feedback with pacing suggestions</li>
                    <li>AI mentor for follow-up improvement</li>
                  </ul>
                </article>

                <article className="p-6 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                  <h3 className="text-xl font-semibold">Job Discovery</h3>
                  <p className="mt-2">Get curated job opportunities that perfectly align with your skills, experience, and preferred location.</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Resume-based job matching</li>
                    <li>Smart filters for company, role, and location</li>
                    <li>AI recommendations based on your skill graph</li>
                  </ul>
                </article>

                <article className="p-6 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                  <h3 className="text-xl font-semibold">Learning Path</h3>
                  <p className="mt-2">Receive a personalized career roadmap tailored to your dream job.</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Technical + soft skills planner</li>
                    <li>Real-time progress tracking</li>
                    <li>Continuous feedback with AI Mentor</li>
                  </ul>
                </article>

                <article className="p-6 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                  <h3 className="text-xl font-semibold">Portfolio Builder</h3>
                  <p className="mt-2">Transform your profile into a digital portfolio showcasing your achievements, certifications, and projects.</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Custom portfolio templates</li>
                    <li>Editable and shareable public link</li>
                    <li>Integrated resume + project showcase</li>
                  </ul>
                </article>
              </div>
            </div>
          </section>

          {/* ----- HIRED AI ----- */}
          <section id="hired-ai" aria-label="Hired AI Services" className="max-w-6xl mx-auto py-12">
            <div className="section-box">
              <h2 className="text-3xl font-bold mb-4">Hired AI Services</h2>
              <p className="mb-4">Root’s flagship product, Hired AI, is your all-in-one AI career companion that helps you build, train, and land your dream job.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Our Features</h3>
                  <ul className="list-disc pl-6">
                    <li><strong>AI Resume Builder</strong> — Quickly create ATS-friendly resumes designed to impress recruiters.</li>
                    <li><strong>Interview Prep</strong> — Practice with AI-powered mock interviews (text & voice).</li>
                    <li><strong>Job Discovery</strong> — Upload your resume and instantly receive curated job opportunities.</li>
                    <li><strong>Learning Path</strong> — A personalized roadmap that guides you.</li>
                    <li><strong>Portfolio Builder</strong> — Build a professional online portfolio.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">How It Works — The Core Flow</h3>
                  <ol className="list-decimal pl-6">
                    <li>Upload Your Details</li>
                    <li>AI Builds Your Resume & Portfolio</li>
                    <li>Prepare With Mock Interviews</li>
                    <li>Follow Your Learning Path</li>
                    <li>Discover & Apply to Jobs</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>

          {/* ----- WORKFLOW ----- */}
          <section id="workflow" aria-label="Workflow" className="max-w-6xl mx-auto py-12">
            <div className="section-box">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="mb-4">Hired AI simplifies your entire career journey into five smart steps:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Upload Your Details</strong> — Start by adding your personal info, education, and experience.</li>
                <li><strong>AI Builds Your Resume & Portfolio</strong> — Our AI generates a polished, ATS-optimized resume.</li>
                <li><strong>Prepare With Mock Interviews</strong> — Practice with AI Mentor — get instant feedback.</li>
                <li><strong>Follow Your Learning Path</strong> — Receive personalized recommendations.</li>
                <li><strong>Discover & Apply to Jobs</strong> — Get AI-suggested jobs from top companies.</li>
              </ol>
            </div>
          </section>

          {/* Polished hero INSIDE the Get Early Access section. (LEFT UNCHANGED) */}
          <section id="get-early-access" aria-label="Get Early Access" className="py-12">
            <FrontHero openDirectly={true} />
          </section>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
