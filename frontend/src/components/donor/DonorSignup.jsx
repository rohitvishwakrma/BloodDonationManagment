import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { donorSignup } from '../../services/api'
import './DonorSignup.css'

const DonorSignup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '', age: '', aadhar: '', father_name: '', gender: '', bloodgroup: '',
    email: '', phone: '', address: '', pin: '', password: '', re_password: ''
  })
  const [captcha, setCaptcha] = useState('')
  const [captchaText, setCaptchaText] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const generateCaptcha = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars[Math.floor(Math.random() * chars.length)]
    }
    setCaptchaText(result)
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (captcha !== captchaText) {
      setError('Invalid Captcha')
      generateCaptcha()
      setCaptcha('')
      return
    }
    
    if (formData.password !== formData.re_password) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      await donorSignup(formData)
      navigate('/donor/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="donor-signup-page">
      <div className="donor-signup-container">
        <div className="donor-signup-header">
          <h1>
            <i className="ri-user-add-line"></i> Donor Registration
          </h1>
          <p>Join the mission to save lives by donating blood</p>
        </div>

        <form onSubmit={handleSubmit} className="donor-signup-form">
          <div className="donor-signup-grid">
            <div className="donor-signup-field">
              <label><i className="ri-user-line"></i> Full Name <span className="required-star">*</span></label>
              <input type="text" name="name" placeholder="Enter your full name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>

            <div className="donor-signup-field">
              <label><i className="ri-calendar-line"></i> Age <span className="required-star">*</span></label>
              <input type="number" name="age" maxLength="2" placeholder="Enter your age" onChange={(e) => setFormData({ ...formData, age: e.target.value })} required />
            </div>

            <div className="donor-signup-field">
              <label><i className="ri-id-card-line"></i> Aadhar Number <span className="required-star">*</span></label>
              <input type="text" name="aadhar" maxLength="12" placeholder="Enter 12-digit Aadhar number" onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })} required />
            </div>

            <div className="donor-signup-field">
              <label><i className="ri-user-line"></i> Father's Name <span className="required-star">*</span></label>
              <input type="text" name="father_name" placeholder="Enter father's name" onChange={(e) => setFormData({ ...formData, father_name: e.target.value })} required />
            </div>

            <div className="donor-signup-field">
              <label><i className="ri-gender-line"></i> Gender <span className="required-star">*</span></label>
              <select name="gender" onChange={(e) => setFormData({ ...formData, gender: e.target.value })} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="donor-signup-field">
              <label><i className="ri-droplet-line"></i> Blood Group <span className="required-star">*</span></label>
              <select name="bloodgroup" onChange={(e) => setFormData({ ...formData, bloodgroup: e.target.value })} required>
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="donor-signup-field">
              <label><i className="ri-mail-line"></i> Email Address <span className="required-star">*</span></label>
              <input type="email" name="email" placeholder="Enter your email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>

            <div className="donor-signup-field">
              <label><i className="ri-phone-line"></i> Mobile Number <span className="required-star">*</span></label>
              <input type="tel" name="phone" maxLength="10" placeholder="Enter 10-digit mobile number" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
            </div>

            <div className="donor-signup-field full-width">
              <label><i className="ri-map-pin-line"></i> Address <span className="required-star">*</span></label>
              <input type="text" name="address" placeholder="Enter your complete address" onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
            </div>

            <div className="donor-signup-field">
              <label><i className="ri-mail-line"></i> Pincode <span className="required-star">*</span></label>
              <input type="text" name="pin" maxLength="6" placeholder="Enter 6-digit pincode" onChange={(e) => setFormData({ ...formData, pin: e.target.value })} required />
            </div>

            <div className="donor-signup-field"></div>

            <div className="donor-signup-field full-width donor-signup-password">
              <div className="donor-signup-field">
                <label><i className="ri-lock-line"></i> Password <span className="required-star">*</span></label>
                <input type="password" name="password" placeholder="Create a password (min 6 characters)" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              </div>

              <div className="donor-signup-field">
                <label><i className="ri-checkbox-circle-line"></i> Confirm Password <span className="required-star">*</span></label>
                <input type="password" name="re_password" placeholder="Confirm your password" onChange={(e) => setFormData({ ...formData, re_password: e.target.value })} required />
              </div>
            </div>
          </div>

          {/* Captcha */}
          <div className="donor-signup-captcha">
            <div className="captcha-box">
              <div className="captcha-text">{captchaText}</div>
              <div className="captcha-refresh" onClick={generateCaptcha}>
                <i className="ri-refresh-line"></i>
              </div>
            </div>
            <div className="captcha-input">
              <input 
                type="text" 
                value={captcha} 
                onChange={(e) => setCaptcha(e.target.value)} 
                maxLength="6" 
                placeholder="Enter captcha code" 
                required 
              />
            </div>
          </div>

          {error && (
            <div className="donor-signup-error">
              <i className="ri-error-warning-line"></i>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="donor-signup-btn" disabled={loading}>
            {loading ? (
              <><i className="ri-loader-4-line ri-spin"></i> Registering...</>
            ) : (
              <><i className="ri-user-add-line"></i> Create Account</>
            )}
          </button>

          <div className="donor-signup-login-link">
            <Link to="/donor/login">
              <i className="ri-login-box-line"></i> Already have an account? Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DonorSignup