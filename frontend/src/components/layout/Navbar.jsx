import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const dropdownRef = useRef(null)

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setMobileOpen(false)
  }

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/blood.svg" alt="Logo" className="logo-img" />
        <p className="logo-text">Rakt Daan</p>
      </div>

      {/* Desktop Menu */}
      <div className="desktop-menu">
        <div className="dropdown" ref={dropdownRef}>
          <button className="dropdown-btn" onClick={() => toggleDropdown('dashboard')}>
            Dashboard <i className="ri-arrow-down-s-line"></i>
          </button>
          <div className={`dropdown-content ${openDropdown === 'dashboard' ? 'show' : ''}`}>
            <Link to="/"><i className="ri-home-line"></i> Home</Link>
            <Link to="/about"><i className="ri-information-line"></i> About</Link>
            <Link to="/faqs"><i className="ri-question-answer-line"></i> FAQs</Link>
            <Link to="/contact"><i className="ri-mail-line"></i> Contact</Link>
          </div>
        </div>

        <Link to="/availability" className="nav-link"><i className="ri-search-line"></i> Search Blood</Link>

        <div className="dropdown">
          <button className="dropdown-btn" onClick={() => toggleDropdown('donate')}>
            Donate Blood <i className="ri-arrow-down-s-line"></i>
          </button>
          <div className={`dropdown-content ${openDropdown === 'donate' ? 'show' : ''}`}>
            <Link to="/camp/search"><i className="ri-campground-line"></i> Search Donation Camp</Link>
            <Link to="/donor/login"><i className="ri-user-line"></i> Donor Login</Link>
          </div>
        </div>

        <div className="dropdown">
          <button className="dropdown-btn" onClick={() => toggleDropdown('bank')}>
            Blood Bank <i className="ri-arrow-down-s-line"></i>
          </button>
          <div className={`dropdown-content ${openDropdown === 'bank' ? 'show' : ''}`}>
            <Link to="/bank/login"><i className="ri-login-box-line"></i> Bank Login</Link>
            <Link to="/bank/registration"><i className="ri-add-line"></i> Register Bank</Link>
          </div>
        </div>

        <div className="dropdown">
          <button className="dropdown-btn" onClick={() => toggleDropdown('camp')}>
            Blood Camp <i className="ri-arrow-down-s-line"></i>
          </button>
          <div className={`dropdown-content ${openDropdown === 'camp' ? 'show' : ''}`}>
            <Link to="/camp/registration"><i className="ri-flag-line"></i> Register Camp</Link>
          </div>
        </div>

        <Link to="/admin/login" className="nav-link"><i className="ri-shield-user-line"></i> Admin</Link>

        {user && (
          <div className="user-section">
            <span className="welcome-text">Welcome, {user.name || user.username}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
        <i className="ri-menu-line"></i>
      </button>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setMobileOpen(false)}><i className="ri-home-line"></i> Home</Link>
        <Link to="/about" onClick={() => setMobileOpen(false)}><i className="ri-information-line"></i> About</Link>
        <Link to="/faqs" onClick={() => setMobileOpen(false)}><i className="ri-question-answer-line"></i> FAQs</Link>
        <Link to="/contact" onClick={() => setMobileOpen(false)}><i className="ri-mail-line"></i> Contact</Link>
        <Link to="/availability" onClick={() => setMobileOpen(false)}><i className="ri-search-line"></i> Blood Availability</Link>
        <Link to="/camp/search" onClick={() => setMobileOpen(false)}><i className="ri-search-line"></i> Search Camp</Link>
        <Link to="/donor/login" onClick={() => setMobileOpen(false)}><i className="ri-user-line"></i> Donor Login</Link>
        <Link to="/bank/login" onClick={() => setMobileOpen(false)}><i className="ri-login-box-line"></i> Bank Login</Link>
        <Link to="/bank/registration" onClick={() => setMobileOpen(false)}><i className="ri-add-line"></i> Register Bank</Link>
        <Link to="/camp/registration" onClick={() => setMobileOpen(false)}><i className="ri-flag-line"></i> Register Camp</Link>
        <Link to="/admin/login" onClick={() => setMobileOpen(false)}><i className="ri-shield-user-line"></i> Admin Login</Link>
        {user && <button onClick={handleLogout}><i className="ri-logout-box-r-line"></i> Logout</button>}
      </div>
    </nav>
  )
}

export default Navbar