
import React, { useState } from "react";
import { Link } from "react-router-dom";
import hero from "./assets/herobg.png";
import "./HowItWorks.css";
import logo from "./assets/cn.png";

const steps = [
  {
    number: "01",
    title: "Choose your area",
    description: "Select your district and Assembly constituency.",
    icon: "📍",
  },
  {
    number: "02",
    title: "Verify your identity",
    description:
      "Complete the identity verification step. Your verification details will be kept separate from public summaries.",
    icon: "🔐",
  },
  {
    number: "03",
    title: "Tell us where the issue is",
    description:
      "Enter your locality or a nearby landmark. You do not need to provide your full address.",
    icon: "🗺️",
  },
  {
    number: "04",
    title: "Share your inputs",
    description:
      "Select a category and describe a concern or suggestion. You can submit up to five inputs per month and include a possible solution if you wish.",
    icon: "💬",
  },
  {
    number: "05",
    title: "Review and submit",
    description:
      "Check your entries before submitting. You will receive a reference number for your submission.",
    icon: "📋",
  },
];

export default function Howwork() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="how-page">

      {/* Navbar */}
      <header className="topbar">
        <div className="brand">
          <img src={logo} alt="CityNeeds Logo" className="logo" />
        </div>

        {/* Hamburger Button */}
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="how-navigation"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Navigation Links */}
        <nav
          id="how-navigation"
          className={`nav ${menuOpen ? "nav-open" : ""}`}
        >
          <Link to="/#priorities" onClick={closeMenu}>
            Priorities
          </Link>

          <Link
            to="/how-it-works"
            className="active"
            onClick={closeMenu}
          >
            How it works
          </Link>

          <Link to="/#submit" onClick={closeMenu}>
            Submit feedback
          </Link>

          <select
            className="lang"
            aria-label="Select language"
            defaultValue="en"
            onChange={closeMenu}
          >
            <option value="en">English</option>
            <option value="pa">Punjabi</option>
          </select>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className="how-hero"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(5, 37, 43, 0.88) 0%,
              rgba(5, 48, 52, 0.68) 48%,
              rgba(5, 48, 52, 0.25) 100%
            ),
            url(${hero})
          `,
        }}
      >
        <div className="how-container how-hero-content">
          <span className="how-eyebrow">
            CITYNEEDS COMMUNITY REPORTER
          </span>

          <h1>How It Works</h1>

          <p>
            Citizens know best what their City Needs. CityNeeds
            Community Reporter gives residents a simple way to
            share the concerns and ideas that matter in their
            neighbourhood. Your input helps create a clearer
            picture of local priorities.
          </p>

          <div className="how-hero-bottom">
            <span>Every voice matters.</span>
            <span>Every input counts.</span>
          </div>
        </div>
      </section>

      {/* Participation Steps */}
      <section className="how-steps-section">
        <div className="how-container">

          <div className="how-section-heading">
            <span className="how-eyebrow">GETTING STARTED</span>
            <h2>How to Participate</h2>
            <p>Five simple steps to make your voice heard.</p>
          </div>

          <div className="how-steps-grid">
            {steps.map((step) => (
              <div className="how-step-card" key={step.number}>
                <div className="how-step-top">
                  <span className="how-step-number">
                    {step.number}
                  </span>

                  <span className="how-step-icon">
                    {step.icon}
                  </span>
                </div>

                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>

          {/* Languages */}
          <div className="how-language-card">
            <div className="how-language-icon">🌐</div>

            <div>
              <h3>Speak in Your Language</h3>

              <p>
                You may share your inputs in Punjabi or English.
              </p>

              <div className="how-language-tags">
                <span>ਪੰਜਾਬੀ</span>
                <span>English</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* What Happens Next */}
      <section className="how-next-section">
        <div className="how-container">

          <div className="how-next-card">
            <div className="how-next-content">
              <span className="how-eyebrow">
                AFTER YOUR SUBMISSION
              </span>

              <h2>What happens next?</h2>

              <p>
                We review and group submissions by constituency.
                A monthly newsletter summarising the inputs
                received will be made available in the public
                domain and sent to the relevant offices.
              </p>

              <p>
                Public summaries will not include your personal
                verification details.
              </p>
            </div>

            <div className="how-next-visual">
              <div className="how-next-icon">📊</div>

              <h3>Your Voice</h3>
              <div className="how-next-arrow">↓</div>

              <h3>Community Insights</h3>
              <div className="how-next-arrow">↓</div>

              <h3>Monthly Newsletter</h3>
            </div>
          </div>

        </div>
      </section>

      {/* Disclaimer */}
      <section className="how-disclaimer-section">
        <div className="how-container">

          <div className="how-disclaimer">
            <div className="how-disclaimer-icon">ⓘ</div>

            <div>
              <h3>Disclaimer</h3>

              <p>
                CityNeeds Community Reporter is a platform for
                collecting and sharing citizens’ concerns and
                suggestions. CityNeeds is not an NGO or a
                complaints-resolution service. We cannot guarantee
                that a complaint will be resolved or that a
                suggestion will be implemented.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="how-footer">
        <div className="how-container">
          <span>© CityNeeds Community Reporter</span>
          <span>Every voice matters. Every input counts.</span>
        </div>
      </footer>

    </div>
  );
}
