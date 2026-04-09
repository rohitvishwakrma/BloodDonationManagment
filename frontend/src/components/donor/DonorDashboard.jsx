import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getDonorDashboard, updateDonor, searchBanksByLocation, donateRequest, dropRequest } from '../../services/api'
import './DonorDashboard.css'

const DonorDashboard = () => {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [donationData, setDonationData] = useState([])
  const [banks, setBanks] = useState([])
  const [searchResult, setSearchResult] = useState([])
  const [location, setLocation] = useState({ state: '', district: '' })
  const [profile, setProfile] = useState({})

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await getDonorDashboard()
      console.log('Dashboard API Response:', res.data) 
      setDonationData(res.data.donationData || [])
      setBanks(res.data.banks || [])
      setProfile(res.data.user || {})
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      await updateDonor(user.id, profile)
      alert('Profile updated successfully')
      fetchDashboard()
    } catch (err) {
      alert('Update failed')
    }
  }

  const handleSearchBanks = async (e) => {
    e.preventDefault()
    try {
      const res = await searchBanksByLocation(location)
      setSearchResult(res.data.bankdata || [])
    } catch (err) {
      console.error(err)
    }
  }

  const handleDonate = async (bankId) => {
    if (window.confirm('Are you sure you want to donate to this bank?')) {
      await donateRequest(bankId, user.id)
      fetchDashboard()
    }
  }

  const handleDropRequest = async (donorId) => {
    if (window.confirm('Are you sure you want to drop this request?')) {
      await dropRequest(donorId)
      fetchDashboard()
    }
  }

  return (
    <div className="donor-dashboard-container">
      <div className="donor-sidebar">
        <h2>🩸 Donor Dashboard</h2>
        <ul>
          <li onClick={() => setActiveSection('dashboard')}>
            <i className="fa-solid fa-chart-line"></i> Dashboard
          </li>
          <li onClick={() => setActiveSection('donation-history')}>
            <i className="fa-solid fa-clock-rotate-left"></i> Donation History
          </li>
          <li onClick={() => setActiveSection('donation-repository')}>
            <i className="fa-solid fa-hand-holding-heart"></i> Donation Request
          </li>
          <li onClick={() => setActiveSection('profile')}>
            <i className="fa-solid fa-user-circle"></i> Profile
          </li>
        </ul>
      </div>
      
      <div className="donor-content">
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <section>
            <div className="donor-welcome">
              <h2>Welcome, {profile.name} 👋</h2>
            </div>
            <div className="donor-overview">
              <div className="donor-card">
                <h3>🩸 Blood Type</h3>
                <p>{profile.bloodgroup}</p>
              </div>
              <div className="donor-card">
                <h3>📊 Total Donations</h3>
                <p>{profile.total_donation || 0}</p>
              </div>
            </div>
            <div className="donor-table-container">
              <h3>📋 Recent Donation Requests</h3>
              <table className="donor-table">
                <thead>
                  <tr>
                    <th>Application Date</th>
                    <th>Bank Name</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {donationData.filter(d => d.status === 'pending' || d.status === 'approved').length === 0 ? (
                    <tr><td colSpan="4">No pending requests</td></tr>
                  ) : (
                    donationData.filter(d => d.status === 'pending' || d.status === 'approved').map((d, i) => (
                      <tr key={i}>
                        <td>{new Date(d.application_date).toDateString()}</td>
                        <td>{d.Blood_Bank_Name}</td>
                        <td><span className={`status-${d.status}`}>{d.status}</span></td>
                        <td>
                          <button onClick={() => handleDropRequest(d.donor_id)} className="donor-drop-btn">
                            Drop Request
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Donation History Section */}
        {activeSection === 'donation-history' && (
          <section>
            <div className="donor-table-container">
              <h3>📜 Donation History</h3>
              <table className="donor-table">
                <thead>
                  <tr>
                    <th>Donation Date</th>
                    <th>Blood Group</th>
                    <th>Bank Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {donationData.filter(d => d.status === 'completed').length === 0 ? (
                    <tr><td colSpan="4">No donation history found</td></tr>
                  ) : (
                    donationData.filter(d => d.status === 'completed').map((d, i) => (
                      <tr key={i}>
                        <td>{new Date(d.donation_date).toDateString()}</td>
                        <td>{d.blood_type}</td>
                        <td>{d.Blood_Bank_Name}</td>
                        <td><span className="status-completed">✓ Completed</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Donation Request Section */}
        {activeSection === 'donation-repository' && (
          <section>
            <form onSubmit={handleSearchBanks} className="donor-search-form">
              <select onChange={(e) => setLocation({ ...location, state: e.target.value })} required>
                <option value="">Select State</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
              </select>
              <select onChange={(e) => setLocation({ ...location, district: e.target.value })} required>
                <option value="">Select District</option>
                <option value="Bhopal">Bhopal</option>
                <option value="Indore">Indore</option>
                <option value="Jabalpur">Jabalpur</option>
              </select>
              <button type="submit" className="donor-search-btn">
                <i className="fa-solid fa-search"></i> Search Banks
              </button>
            </form>
            <div className="donor-table-container">
              <h3>🏦 Available Blood Banks</h3>
              <table className="donor-table">
                <thead>
                  <tr>
                    <th>Bank Name</th>
                    <th>Category</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(searchResult.length > 0 ? searchResult : banks).map((bank, i) => (
                    <tr key={i}>
                      <td>{bank.Blood_Bank_Name}</td>
                      <td>{bank.Category}</td>
                      <td>{bank.Email}</td>
                      <td>{bank.Contact_No}</td>
                      <td>{bank.Address}</td>
                      <td>
                        <button onClick={() => handleDonate(bank.bank_id)} className="donor-donate-btn">
                          <i className="fa-solid fa-heart"></i> Donate Here!
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <section>
            <form onSubmit={handleUpdateProfile} className="donor-profile-form">
              <h3 style={{ marginBottom: '20px', color: '#BF222B' }}>Edit Profile</h3>
              <label>
                Email
                <input type="email" value={profile.email || ''} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </label>
              <label>
                Name
                <input type="text" value={profile.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </label>
              <label>
                Mobile
                <input type="text" value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </label>
              <label>
                Address
                <input type="text" value={profile.address || ''} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
              </label>
              <button type="submit" className="donor-update-btn">
                <i className="fa-solid fa-save"></i> Update Profile
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  )
}

export default DonorDashboard