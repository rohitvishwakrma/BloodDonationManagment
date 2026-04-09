import React, { useState, useEffect } from 'react'
import { getBankDashboard, updateBank } from '../../services/api'
import './BankProfile.css'

const BankProfile = () => {
  const [profile, setProfile] = useState({
    Blood_Bank_Name: '', Email: '', Hospital_Name: '', Contact_No: '', Address: '', bank_id: ''
  })
  const [passwordData, setPasswordData] = useState({ password: '', re_password: '' })
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await getBankDashboard()
      setProfile(res.data.bankdata || {})
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    
    if (passwordData.password && passwordData.password !== passwordData.re_password) {
      setMessage({ text: 'Passwords do not match!', type: 'error' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
      return
    }
    
    setLoading(true)
    try {
      const updateData = { ...profile }
      if (passwordData.password) {
        updateData.password = passwordData.password
        updateData.re_password = passwordData.re_password
      }
      await updateBank(profile.bank_id, updateData)
      setMessage({ text: 'Profile updated successfully!', type: 'success' })
      setPasswordData({ password: '', re_password: '' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch (err) {
      setMessage({ text: 'Update failed. Please try again.', type: 'error' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bank-profile-container">
      <div className="bank-profile-header">
        <h2><i className="fa-solid fa-building"></i> Bank Profile</h2>
        <p>Manage your blood bank information and credentials</p>
      </div>

      {message.text && (
        <div className={`bank-profile-message ${message.type}`}>
          <i className={`fa-solid ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          {' '}{message.text}
        </div>
      )}

      <div className="bank-profile-info">
        <div className="bank-profile-info-card">
          <i className="fa-solid fa-droplet"></i>
          <p>Blood Bank ID: {profile.bank_id || 'N/A'}</p>
        </div>
        <div className="bank-profile-info-card">
          <i className="fa-solid fa-calendar"></i>
          <p>Member Since: {new Date().getFullYear()}</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="bank-profile-form">
        <div className="bank-profile-form-group">
          <label><i className="fa-solid fa-hospital-user"></i> Blood Bank Name</label>
          <input 
            type="text" 
            value={profile.Blood_Bank_Name || ''} 
            onChange={(e) => setProfile({ ...profile, Blood_Bank_Name: e.target.value })} 
            required 
          />
        </div>

        <div className="bank-profile-form-group">
          <label><i className="fa-solid fa-envelope"></i> Email Address</label>
          <input 
            type="email" 
            value={profile.Email || ''} 
            onChange={(e) => setProfile({ ...profile, Email: e.target.value })} 
            required 
          />
        </div>

        <div className="bank-profile-form-group">
          <label><i className="fa-solid fa-building"></i> Parent Hospital Name</label>
          <input 
            type="text" 
            value={profile.Hospital_Name || ''} 
            onChange={(e) => setProfile({ ...profile, Hospital_Name: e.target.value })} 
          />
        </div>

        <div className="bank-profile-form-group">
          <label><i className="fa-solid fa-phone"></i> Contact Number</label>
          <input 
            type="tel" 
            value={profile.Contact_No || ''} 
            onChange={(e) => setProfile({ ...profile, Contact_No: e.target.value })} 
            maxLength="10" 
          />
        </div>

        <div className="bank-profile-form-group">
          <label><i className="fa-solid fa-location-dot"></i> Address</label>
          <textarea 
            value={profile.Address || ''} 
            onChange={(e) => setProfile({ ...profile, Address: e.target.value })} 
            rows="3"
            placeholder="Full address of blood bank"
          />
        </div>

        <div className="bank-profile-divider">
          <hr />
          <h3><i className="fa-solid fa-key"></i> Change Password</h3>
          <hr />
        </div>

        <div className="bank-profile-password-section">
          <div className="bank-profile-form-group">
            <label><i className="fa-solid fa-lock"></i> New Password</label>
            <input 
              type="password" 
              value={passwordData.password} 
              onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })} 
              placeholder="Enter new password (leave blank to keep current)"
            />
          </div>

          <div className="bank-profile-form-group">
            <label><i className="fa-solid fa-check-circle"></i> Confirm Password</label>
            <input 
              type="password" 
              value={passwordData.re_password} 
              onChange={(e) => setPasswordData({ ...passwordData, re_password: e.target.value })} 
              placeholder="Re-enter new password"
            />
          </div>
        </div>

        <button type="submit" className="bank-profile-btn" disabled={loading}>
          {loading ? (
            <><i className="fa-solid fa-spinner fa-spin"></i> Updating...</>
          ) : (
            <><i className="fa-solid fa-save"></i> Update Profile</>
          )}
        </button>
      </form>
    </div>
  )
}

export default BankProfile