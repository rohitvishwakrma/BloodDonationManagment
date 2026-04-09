import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { donorLogin } from '../../services/api'

const DonorLogin = () => {
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
      const response = await donorLogin(formData)
      
      if (response.data.success) {
        login(response.data.user)
        navigate('/donor/dashboard')
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
    <div className="donor-login-container">
      <div className="donor-login-box">
        <h2 className="donor-login-title">Donor Login</h2>
        {error && <p className="donor-login-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="donor-login-input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
              required 
            />
          </div>
          <div className="donor-login-input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              required 
            />
          </div>
          <button type="submit" disabled={loading} className="donor-login-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="donor-login-signup-link">
          Don't have an account? <Link to="/donor/signup">Sign up here</Link>
        </p>
        <p className="donor-login-home-link">
          <Link to="/">Back to Home</Link>
        </p>
      </div>
    </div>
  )
}

export default DonorLogin