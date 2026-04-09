import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { bankLogin } from '../../services/api'
import './BankLogin.css'

const BankLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await bankLogin(formData)
      
      if (response.data.success) {
        login(response.data.user)
        navigate('/bank/dashboard')
      } else {
        setError(response.data.message || 'Invalid credentials')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bank-login-page">
      <div className="bank-login-wrapper">
        {/* Left Side - Form */}
        <div className="bank-login-form-side">
          <h1>🏦 Blood Bank Login</h1>
          <p className="bank-login-subtitle">Access your blood bank dashboard</p>
          
          <form onSubmit={handleSubmit} className="bank-login-form">
            <div className="bank-login-input-group">
              <label><i className="fa-solid fa-envelope"></i> User Email</label>
              <input 
                type="email" 
                placeholder="Enter your registered email"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                required 
              />
            </div>
            
            <div className="bank-login-input-group">
              <label><i className="fa-solid fa-lock"></i> Password</label>
              <input 
                type="password" 
                placeholder="Enter your password"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                required 
              />
            </div>
            
            {error && <div className="bank-login-error">{error}</div>}
            
            <button type="submit" className="bank-login-btn" disabled={loading}>
              {loading ? (
                <><i className="fa-solid fa-spinner fa-spin"></i> Logging in...</>
              ) : (
                <><i className="fa-solid fa-arrow-right-to-bracket"></i> Login</>
              )}
            </button>
          </form>
          
          <div className="bank-login-links">
            <Link to="/bank/registration">
              <i className="fa-solid fa-building"></i> Register Here For New Blood Bank
            </Link>
            <Link to="/">
              <i className="fa-solid fa-home"></i> Go To Home
            </Link>
          </div>
        </div>
        
        {/* Right Side - Info Panel */}
        <div className="bank-login-info-side">
          <div className="bank-login-icon">
            <i className="fa-solid fa-hand-holding-heart"></i>
          </div>
          <h2>Welcome to Rakt Daan</h2>
          <p>India's most trusted blood donation platform</p>
          
          <ul className="bank-login-features">
            <li><i className="fa-solid fa-check-circle"></i> Manage blood inventory</li>
            <li><i className="fa-solid fa-check-circle"></i> Track donation requests</li>
            <li><i className="fa-solid fa-check-circle"></i> Update blood stock in real-time</li>
            <li><i className="fa-solid fa-check-circle"></i> Approve or reject donations</li>
            <li><i className="fa-solid fa-check-circle"></i> View complete donation history</li>
            <li><i className="fa-solid fa-check-circle"></i> Generate reports</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BankLogin