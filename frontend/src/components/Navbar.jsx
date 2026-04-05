import React from 'react'
import { Link } from 'react-router-dom'

// navbar component shown at the top of each page on the website
const Navbar = () => {
    // Contains links to the home page, about us page, profile page, and shopping cart
  return (
    <nav style={{ backgroundColor: '#1a1a2e', borderBottom: '3px solid #e8453c' }} className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand fw-bold text-white d-flex align-items-center gap-2" to="/" style={{ fontSize: '1.4rem', letterSpacing: '0.5px' }}>
          <i className="bi bi-cpu-fill" style={{ color: '#e8453c', fontSize: '1.2rem' }}></i>
          TechSpot
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list text-white" style={{ fontSize: '1.5rem' }}></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-1 align-items-center">
            <li className="nav-item">
              <Link className="nav-link text-white px-3 py-2 rounded" to="/"
                style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                <i className="bi bi-house me-1"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white px-3 py-2 rounded" to="/about"
                style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                <i className="bi bi-info-circle me-1"></i> About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white px-3 py-2 rounded" to="/profile"
                style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                <i className="bi bi-person me-1"></i> Profile
              </Link>
            </li>
            <li className="nav-item ms-2">
              <Link className="nav-link px-3 py-2 rounded text-white fw-semibold" to="/cart"
                style={{ backgroundColor: '#e8453c', fontSize: '0.9rem' }}>
                <i className="bi bi-cart3 me-1"></i> Cart
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar