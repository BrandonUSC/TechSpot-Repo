import React from 'react';
import { Link } from 'react-router-dom';

// Footer component shown at the bottom of each page on the website
const Footer = () => {

  // Contains things like contact info, social media links etc.
  return (
    <footer style={{ backgroundColor: '#1a1a2e', borderTop: '3px solid #e8453c' }} className="text-white py-3 px-4 mt-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

          {/* Left: Name */}
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-cpu-fill" style={{ color: '#e8453c', fontSize: '1.2rem' }}></i>
            <span className="fw-bold" style={{ fontSize: '1.4rem' }}>TechSpot</span>
          </div>

          {/* Right: Contact Button and Socials */}
          <div className="d-flex align-items-center gap-3">
            <Link to="/about" className="btn btn-outline-light btn-sm">
              <i className="bi bi-envelope me-1"></i> Contact Us
            </Link>
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer"
              className="text-white" style={{ fontSize: '1.1rem', opacity: 0.8 }}>
              <i className="bi bi-facebook"></i>
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer"
              className="text-white" style={{ fontSize: '1.1rem', opacity: 0.8 }}>
              <i className="bi bi-instagram"></i>
            </a>
            <a href="https://x.com/" target="_blank" rel="noreferrer"
              className="text-white" style={{ fontSize: '1.1rem', opacity: 0.8 }}>
              <i className="bi bi-twitter-x"></i>
            </a>
          </div>

        </div>

        {/* Bottom line: copyright */}
        <div className="text-center mt-2" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
          © 2026 TechSpot. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;