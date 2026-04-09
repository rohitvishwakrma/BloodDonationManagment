import React, { useState } from 'react'
import './FAQs.css'

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const faqs = [
    { q: "What is Rakt Daan?", a: "Rakt Daan is an online platform designed to connect patients in need of blood with local blood banks and donors. Our goal is to make blood donation and retrieval more accessible by providing real-time information on blood availability and facilitating easy blood requests." },
    { q: "How does Rakt Daan work?", a: "Rakt Daan connects patients, healthcare providers, and blood banks through a user-friendly online interface. Patients can request blood directly from the platform, while blood banks can update their available stock. We also provide information about upcoming blood donation camps to encourage community participation." },
    { q: "How can I request blood through Rakt Daan?", a: "To request blood, simply visit our website and fill out the blood request form. Provide details such as the blood type required, quantity, and any additional information relevant to your situation. Your request will be forwarded to the nearest blood banks, and they will respond to you as soon as possible." },
    { q: "How can I donate blood through Rakt Daan?", a: "If you wish to donate blood, you can register on our platform as a donor. Once registered, you will receive notifications about blood donation camps and urgent requests for blood in your area. You can choose to participate in these drives or respond to specific requests based on your availability." },
    { q: "Is there a fee to use Rakt Daan?", a: "No, Rakt Daan is completely free for both donors and patients. We aim to facilitate blood donation and requests without any cost to users." },
    { q: "How do I register as a donor?", a: "To register as a donor, visit the registration page on our website and provide your details, including name, contact information, and blood type. You may also need to provide some additional information about your health and eligibility to donate blood." },
    { q: "Who can donate blood?", a: "Healthy individuals aged 18-65 years, weighing at least 50kg, with normal blood pressure and no serious medical conditions can donate blood. We recommend consulting with our medical team for specific eligibility criteria." },
    { q: "How often can I donate blood?", a: "You can donate whole blood every 90 days (3 months). For platelet donation, you can donate every 14 days, up to 24 times per year." },
    { q: "Is blood donation safe?", a: "Yes, blood donation is completely safe. All needles and equipment used are sterile and disposable. Donors are screened by medical professionals before donation to ensure their safety." }
  ]

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="faqs-page">
      <div className="faqs-container">
        <div className="faqs-header">
          <h1>
            <i className="ri-question-answer-line"></i>
            Frequently Asked Questions
          </h1>
          <p>Find answers to common questions about blood donation</p>
        </div>

        {/* Search Bar */}
        <div className="faq-search">
          <input 
            type="text" 
            placeholder="Search your question..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* FAQs List */}
        {filteredFaqs.length === 0 ? (
          <div className="no-results">
            <i className="ri-search-line"></i>
            <p>No questions found matching your search.</p>
          </div>
        ) : (
          filteredFaqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <h3>
                  <i className="ri-question-line"></i>
                  {faq.q}
                </h3>
                <i className={`ri-arrow-down-s-line faq-icon`}></i>
              </div>
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default FAQs