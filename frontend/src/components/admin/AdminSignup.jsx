import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminSignup } from '../../services/api'

const AdminSignup = () => {
  const [formData, setFormData] = useState({ username: '', password: '', confirm_password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match')
      return
    }
    try {
      await adminSignup(formData)
      navigate('/admin/login')
    } catch (err) {
      setError('Signup failed')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.signupContainer}>
        <h2>Admin Signup</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
          <input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          <input type="password" placeholder="Confirm Password" onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })} required />
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f4f4' },
  signupContainer: { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', width: '300px' },
  error: { color: 'red', textAlign: 'center', marginTop: '10px' }
}

export default AdminSignup