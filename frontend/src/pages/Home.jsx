import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const [activeBlood, setActiveBlood] = useState('A+')
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = ['/home7.png', '/header8.png', '/header9.png']
  const bloodTypes = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-']
  
  const bloodInfo = {
    'A+': { donate: 'A+, AB+', receive: 'A+, A-, O+, O-' },
    'B+': { donate: 'B+, AB+', receive: 'B+, B-, O+, O-' },
    'AB+': { donate: 'AB+', receive: 'Everyone' },
    'O+': { donate: 'O+, A+, B+, AB+', receive: 'O+, O-' },
    'A-': { donate: 'A+, A-, AB+, AB-', receive: 'A-, O-' },
    'B-': { donate: 'B+, B-, AB+, AB-', receive: 'B-, O-' },
    'AB-': { donate: 'AB+, AB-', receive: 'AB-, A-, B-, O-' },
    'O-': { donate: 'Everyone', receive: 'O-' }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      {/* Slider */}
      <div style={styles.sliderContainer}>
        <div style={{ ...styles.slider, transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide, index) => (
            <img key={index} src={slide} alt={`Slide ${index + 1}`} style={styles.slideImg} />
          ))}
        </div>
        <div style={styles.dotContainer}>
          {slides.map((_, index) => (
            <div
              key={index}
              style={{ ...styles.dot, backgroundColor: currentSlide === index ? '#c0392b' : 'rgba(0,0,0,0.5)' }}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Link Container */}
      <div style={styles.linkContainer}>
        <Link to="/availability" style={{ ...styles.linkBox, backgroundColor: 'brown' }}>Search Blood Availability</Link>
        <Link to="/bank/registration" style={{ ...styles.linkBox, backgroundColor: '#2891C0' }}>Register Blood Bank</Link>
        <Link to="/camp/search" style={{ ...styles.linkBox, backgroundColor: 'green' }}>Search Donation Camp</Link>
        <Link to="/donor/login" style={{ ...styles.linkBox, backgroundColor: '#384cf3' }}>Donor Login</Link>
        <Link to="/camp/registration" style={{ ...styles.linkBox, backgroundColor: 'orange' }}>Register Blood Camp</Link>
      </div>

      {/* Blood Compatibility Table */}
      <div style={styles.tableContainer}>
        <div style={styles.tablePart}>
          <div style={styles.tableBox}>
            <h2 style={styles.title}>Compatible Blood Type Donors</h2>
            <div style={styles.bloodButtons}>
              {bloodTypes.map(type => (
                <button
                  key={type}
                  style={{ ...styles.bloodBtn, backgroundColor: activeBlood === type ? '#BF222B' : 'white', color: activeBlood === type ? 'white' : 'black' }}
                  onClick={() => setActiveBlood(type)}
                >
                  {type}
                </button>
              ))}
            </div>
            <div style={styles.cardContainer}>
              <h3 style={styles.cardTitle}>{activeBlood} Blood Type</h3>
              <p><strong>Donate Blood To:</strong> {bloodInfo[activeBlood].donate}</p>
              <p><strong>Receive Blood From:</strong> {bloodInfo[activeBlood].receive}</p>
            </div>
          </div>
          <div style={styles.tableImg}>
            <img src="/blood.webp" alt="Blood" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  sliderContainer: { width: '100vw', height: '70vh', overflow: 'hidden', position: 'relative' },
  slider: { display: 'flex', width: '100%', height: '70vh', transition: 'transform 1s ease-in-out' },
  slideImg: { width: '100vw', height: '70vh', objectFit: 'cover' },
  dotContainer: { position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' },
  dot: { width: '12px', height: '12px', borderRadius: '50%', cursor: 'pointer' },
  linkContainer: { display: 'flex', justifyContent: 'center', gap: '20px', padding: '30px', flexWrap: 'wrap' },
  linkBox: { padding: '15px 25px', borderRadius: '8px', color: 'white', textDecoration: 'none', fontWeight: 'bold' },
  tableContainer: { padding: '30px' },
  tablePart: { display: 'flex', gap: '30px', backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
  tableBox: { flex: 1, padding: '30px' },
  title: { textAlign: 'center', marginBottom: '20px', color: '#BF222B' },
  bloodButtons: { display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' },
  bloodBtn: { width: '60px', height: '60px', borderRadius: '50%', border: '1px solid red', cursor: 'pointer', fontWeight: 'bold' },
  cardContainer: { backgroundColor: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 0 16px lightgreen', lineHeight: '1.8' },
  cardTitle: { color: '#c0392b', marginBottom: '15px' },
  tableImg: { width: '40%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }
}

export default Home