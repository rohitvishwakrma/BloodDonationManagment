import React from 'react'
import './About.css'

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        {/* Hero Section */}
        <div className="about-hero">
          <h1>
            <i className="ri-heart-pulse-line"></i>
            Welcome to Rakt Daan
          </h1>
          <p>Transforming blood donation and retrieval services through innovative technology</p>
        </div>

        {/* Our Purpose */}
        <div className="about-card">
          <h2>
            <i className="ri-flag-line"></i>
            Our Purpose
          </h2>
          <p>In today's fast-paced world, timely access to blood can be a matter of life and death. Rakt Daan addresses this critical need by offering a streamlined, digital solution that connects patients with blood banks and donors swiftly. Our platform is designed to make the process of requesting and donating blood as straightforward and accessible as possible.</p>
        </div>

        {/* Key Features */}
        <div className="about-card">
          <h2>
            <i className="ri-star-line"></i>
            Key Features
          </h2>
          <ul className="features-list">
            <li>
              <i className="ri-database-line"></i>
              <div>
                <strong>Real-Time Blood Availability</strong>
                <p>Rakt Daan integrates directly with local blood banks, providing real-time updates on blood stock levels. This ensures that patients and healthcare providers have immediate access to accurate information regarding the availability of different blood types.</p>
              </div>
            </li>
            <li>
              <i className="ri-mail-send-line"></i>
              <div>
                <strong>Efficient Blood Donation Requests</strong>
                <p>Our platform allows patients, caregivers, and healthcare providers to submit blood requests online. This system facilitates a quick and organized response from donors and blood banks, reducing wait times and improving overall efficiency.</p>
              </div>
            </li>
            <li>
              <i className="ri-information-line"></i>
              <div>
                <strong>Comprehensive Blood Camp Information</strong>
                <p>Stay informed about upcoming blood donation drives and blood camps organized in your area. By providing details about these events, we encourage community participation and support the continuous need for blood donations.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Our Mission */}
        <div className="about-card about-mission">
          <h2>
            <i className="ri-rocket-line"></i>
            Our Mission
          </h2>
          <p>Rakt Daan is committed to enhancing the accessibility of blood donation and transfusion services through innovative technology. Our mission is to create a responsive and reliable resource that can be accessed during emergencies and routine needs alike. We aim to bridge the gap between those who need blood and those who can give it, making a tangible difference in critical situations.</p>
          <p>By leveraging the power of technology, Rakt Daan aspires to build a supportive network that not only addresses immediate blood needs but also fosters a culture of altruism and community support. Join us in our mission to save lives and make blood donation a more accessible and impactful process for everyone involved.</p>
        </div>

        {/* Stats Section */}
        <div className="about-stats">
          <div className="stat-card">
            <i className="ri-user-heart-line"></i>
            <h3>10,000+</h3>
            <p>Active Donors</p>
          </div>
          <div className="stat-card">
            <i className="ri-bank-line"></i>
            <h3>500+</h3>
            <p>Blood Banks</p>
          </div>
          <div className="stat-card">
            <i className="ri-campground-line"></i>
            <h3>1,000+</h3>
            <p>Donation Camps</p>
          </div>
          <div className="stat-card">
            <i className="ri-heart-line"></i>
            <h3>50,000+</h3>
            <p>Lives Saved</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About