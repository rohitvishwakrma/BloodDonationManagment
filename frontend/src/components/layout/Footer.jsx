import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3><i className="ri-user-heart-line"></i> Looking For Blood</h3>
            <ul>
              <li><Link to="/availability"><i className="ri-search-line"></i> Blood Availability</Link></li>
              <li><Link to="/camp/search"><i className="ri-user-heart-line"></i> Search Donation Camp</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3><i className="ri-heart-line"></i> Want To Donate Blood</h3>
            <ul>
              <li><Link to="/donor/login"><i className="ri-user-line"></i> Donor Login</Link></li>
              <li><Link to="/donor/signup"><i className="ri-user-add-line"></i> Register as Donor</Link></li>
              <li><Link to="/camp/search"><i className="ri-map-pin-line"></i> Find Donation Camps</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3><i className="ri-bank-line"></i> Blood Bank</h3>
            <ul>
              <li><Link to="/bank/login"><i className="ri-login-box-line"></i> Bank Login</Link></li>
              <li><Link to="/bank/registration"><i className="ri-add-line"></i> Register Blood Bank</Link></li>
              <li><Link to="/camp/registration"><i className="ri-flag-line"></i> Register Blood Camp</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3><i className="ri-information-line"></i> About Us</h3>
            <ul>
              <li><Link to="/about"><i className="ri-question-line"></i> About Rakt Daan</Link></li>
              <li><Link to="/faqs"><i className="ri-question-answer-line"></i> FAQs</Link></li>
              <li><Link to="/contact"><i className="ri-mail-send-line"></i> Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Single Image */}
        <div className="footer-images">
          <img src="/blood.svg" alt="Blood Logo" className="footer-img" />
        </div>

        <div className="footer-bottom">
          <p>© 2025 Rakt Daan. All rights reserved.</p>
          <p>Developed with
            <a href="https://www.linkedin.com/in/rohit-vishwakarma-915143288/">
              <i className="ri-heart-fill color=red"></i>
              </a>  <Link to={"https://github.com/rohitvishwakrma/BloodDonationManagment"}> by Rohit Vishwakarma</Link></p>
        </div>
      </div>
    </footer>
  )
}

export default Footer