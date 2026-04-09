import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { updateDonor, getDonorDashboard } from '../../services/api'
import './DonorProfile.css'

const DonorProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    name: '', email: '', phone: '', address: '', bloodgroup: '', total_donation: 0
  })
  const [passwordData, setPasswordData] = useState({ password: '', re_password: '' })
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await getDonorDashboard()
      setProfile(res.data.user || {})
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
      }
      await updateDonor(user.id, updateData)
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
    <div className="donor-profile-container">
      <div className="donor-profile-header">
        <h2>
          <i className="ri-user-heart-line"></i> Donor Profile
        </h2>
        <p>Manage your personal information and account settings</p>
      </div>

      {message.text && (
        <div className={`donor-profile-message ${message.type}`}>
          <i className={`ri-${message.type === 'success' ? 'checkbox-circle' : 'error-warning'}-line`}></i>
          {' '}{message.text}
        </div>
      )}

      <div className="donor-profile-info">
        <div className="donor-profile-info-card">
          <i className="ri-droplet-line"></i>
          <p>Blood Group</p>
          <div className="value">{profile.bloodgroup || 'N/A'}</div>
        </div>
        <div className="donor-profile-info-card">
          <i className="ri-heart-line"></i>
          <p>Total Donations</p>
          <div className="value">{profile.total_donation || 0}</div>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="donor-profile-form">
        <div className="donor-profile-form-group">
          <label><i className="ri-user-line"></i> Full Name</label>
          <input 
            type="text" 
            value={profile.name || ''} 
            onChange={(e) => setProfile({ ...profile, name: e.target.value })} 
            required 
          />
        </div>

        <div className="donor-profile-form-group">
          <label><i className="ri-mail-line"></i> Email Address</label>
          <input 
            type="email" 
            value={profile.email || ''} 
            onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
            required 
          />
        </div>

        <div className="donor-profile-form-group">
          <label><i className="ri-phone-line"></i> Mobile Number</label>
          <input 
            type="tel" 
            value={profile.phone || ''} 
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })} 
            maxLength="10" 
          />
        </div>

        <div className="donor-profile-form-group">
          <label><i className="ri-map-pin-line"></i> Address</label>
          <textarea 
            value={profile.address || ''} 
            onChange={(e) => setProfile({ ...profile, address: e.target.value })} 
            rows="3"
            placeholder="Your full address"
          />
        </div>

        <div className="donor-profile-divider">
          <hr />
          <h3><i className="ri-key-line"></i> Change Password</h3>
          <hr />
        </div>

        <div className="donor-profile-password-section">
          <div className="donor-profile-form-group">
            <label><i className="ri-lock-line"></i> New Password</label>
            <input 
              type="password" 
              value={passwordData.password} 
              onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })} 
              placeholder="Enter new password (leave blank to keep current)"
            />
          </div>

          <div className="donor-profile-form-group">
            <label><i className="ri-checkbox-circle-line"></i> Confirm Password</label>
            <input 
              type="password" 
              value={passwordData.re_password} 
              onChange={(e) => setPasswordData({ ...passwordData, re_password: e.target.value })} 
              placeholder="Re-enter new password"
            />
          </div>
        </div>

        <button type="submit" className="donor-profile-btn" disabled={loading}>
          {loading ? (
            <><i className="ri-loader-4-line ri-spin"></i> Updating...</>
          ) : (
            <><i className="ri-save-line"></i> Update Profile</>
          )}
        </button>
      </form>
    </div>
  )
}

export default DonorProfile