import React from 'react'
import './Contact.css'

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Message sent successfully! We will get back to you soon.')
  }

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>
            <i className="ri-mail-send-line"></i> Contact Us
          </h1>
          <p>We'd love to hear from you. Get in touch with us!</p>
        </div>

        <div className="contact-content">
          {/* Contact Info Cards */}
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <i className="ri-map-pin-line"></i>
              <h3>Visit Us</h3>
              <p>MANIT Bhopal<br />Madhya Pradesh, 462003</p>
            </div>
            <div className="contact-info-card">
              <i className="ri-mail-line"></i>
              <h3>Email Us</h3>
              <p><a href="mailto:rohitvishwakarma02198@gmail.com">rohitvishwakarma02198@gmail.com</a></p>
            </div>
            <div className="contact-info-card">
              <i className="ri-phone-line"></i>
              <h3>Call Us</h3>
              <p><a href="tel:+919696891706">+91 96968 91706</a></p>
            </div>
          </div>

          {/* Team Section */}
          <div className="contact-team">
            <h2><i className="ri-team-line"></i> Our Team</h2>
            <div className="team-grid">
              <div className="team-card">
                <div className="team-icon">
                  <i className="ri-user-star-line"></i>
                </div>
                <h4>Rohit Vishwakarma</h4>
                <p>2320403155</p>
              </div>
              <div className="team-card">
                <div className="team-icon">
                  <i className="ri-user-line"></i>
                </div>
                <h4>Vinay Sharma</h4>
                <p>2320403147</p>
              </div>
              <div className="team-card">
                <div className="team-icon">
                  <i className="ri-user-line"></i>
                </div>
                <h4>Praveen Arya</h4>
                <p>2320403103</p>
              </div>
              <div className="team-card">
                <div className="team-icon">
                  <i className="ri-user-line"></i>
                </div>
                <h4>Anil Kumar</h4>
                <p>2320403257</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <h3><i className="ri-chat-new-line"></i> Send us a Message</h3>
            <form onSubmit={handleSubmit} className="contact-form">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <input type="text" placeholder="Subject" className="full-width" />
              <textarea placeholder="Your Message" required className="full-width"></textarea>
              <button type="submit" className="contact-submit-btn">
                <i className="ri-send-plane-line"></i> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact