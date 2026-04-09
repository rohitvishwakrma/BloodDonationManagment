import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { adminLogin } from '../../services/api'
import './AdminLogin.css'

const AdminLogin = () => {
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
      const response = await adminLogin(formData)
      
      if (response.data.success) {
        login(response.data.user)
        navigate('/admin/dashboard')
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
    <div className="admin-login-page">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <i className="ri-shield-user-line"></i>
          </div>
          <h2>Admin Login</h2>
          <p className="admin-login-subtitle">Access the admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-input-group">
            <label><i className="ri-user-line"></i> User Email / Username</label>
            <input 
              type="email" 
              placeholder="Enter your email or username"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
              required 
            />
          </div>
          
          <div className="admin-login-input-group">
            <label><i className="ri-lock-line"></i> Password</label>
            <input 
              type="password" 
              placeholder="Enter your password"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              required 
            />
          </div>
          
          {error && (
            <div className="admin-login-error">
              <i className="ri-error-warning-line"></i>
              <span>{error}</span>
            </div>
          )}
          
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? (
              <><i className="ri-loader-4-line ri-spin"></i> Logging in...</>
            ) : (
              <><i className="ri-login-box-line"></i> Login</>
            )}
          </button>
        </form>
        
        <div className="admin-login-footer">
          <Link to="/">
            <i className="ri-home-line"></i> Return back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin