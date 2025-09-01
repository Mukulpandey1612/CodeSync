import React from 'react';
import { useNavigate } from 'react-router-dom';
import './landing.css';

function Landing() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/join');
  };

  return (
    <div className="landing-container">
      <div className="container">
        <div className="landing-header">
          <div className="landing-logo">
            {/* <div className="logo-icon">&lt;&gt;</div> */}
            <span>&lt;CodeSync&gt;</span>
          </div>
          <h1 className="main-title">
            Collaboration in Perfect Sync
          </h1> 
          <p className="subtitle">
            Seamlessly combine collaboration, security, and AI-powered assistance in one powerful platform. <br/> Built for 
            teams that want to build smarter, faster, and better.
          </p>
          <button className="landing-cta-button" onClick={handleGetStarted}>
            Get Started 
          </button>
        </div>

        {/* === Features Section === */}
        <div className="features">
          <h2 className="features-title">Why CodeSync?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Real-time Collaboration</h3>
              <p>Edit code simultaneously with your team, with instant updates and no delays.</p>
            </div>
            <div className="feature-card">
              <h3>Secure Collaboration</h3>
              <p>Collaborate safely with unique session keys that ensure only invited users can join.</p>
            </div>
            <div className="feature-card">
              <h3>Multi-language Support</h3>
              <p>Write, debug, and run code in multiple programming languages seamlessly.</p>
            </div>
            <div className="feature-card">
              <h3>AI Assistant</h3>
              <p>Boost productivity with an integrated AI that helps debug, explain code, and suggest improvements in real time.</p>
            </div>
          </div>
        </div>
      </div>

  <footer className="footer">
  <p>© 2025 Mukul Pandey. All rights reserved.</p>
  <div className="footer-links">
    <a href="mailto:mukulvpandey@gmail.com" target="_blank" rel="noopener noreferrer">
      Email
    </a>
    <span> | </span>
    <a href="https://github.com/Mukulpandey1612" target="_blank" rel="noopener noreferrer">
      GitHub
    </a>
    <span> | </span>
    <a href="https://www.linkedin.com/in/https://www.linkedin.com/in/mukul-pandey-097883290/" target="_blank" rel="noopener noreferrer">
      LinkedIn
    </a>
  </div>
</footer>

    </div>
  );
}

export default Landing;
