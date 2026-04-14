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
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    fetchDashboard()
  }, [])

  
  const fetchDashboard = async () => {
    try {
        const res = await getDonorDashboard()
        console.log('Full Response:', res)
        console.log('Response data:', res.data)
        
        // Fix: Check response structure
        const responseData = res.data.data || res.data
        console.log('User Data:', responseData.user)
        console.log('Donation History:', responseData.donationHistory)
        console.log('Banks:', responseData.banks)
        
        setDonationData(responseData.donationHistory || [])
        setBanks(responseData.banks || [])
        setProfile(responseData.user || {})
    } catch (err) {
        console.error('Dashboard error:', err)
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
    if (!location.state || !location.district) {
      alert('Please select both state and district')
      return
    }
    
    setSearching(true)
    try {
      console.log('Sending location:', location)
      const res = await searchBanksByLocation(location)
      console.log('API Response:', res.data)
      
      // Fix: Get banks data from response
      let banksData = []
      if (res.data.data) {
        banksData = res.data.data
      } else if (res.data.bankdata) {
        banksData = res.data.bankdata
      } else if (Array.isArray(res.data)) {
        banksData = res.data
      }
      
      console.log('Banks data:', banksData)
      setSearchResult(banksData)
      
      if (banksData.length === 0) {
        alert('No banks found in this location')
      }
    } catch (err) {
      console.error('Search error:', err)
      alert('Failed to search banks')
    } finally {
      setSearching(false)
    }
  }

  const handleDonate = async (bankId) => {
    if (window.confirm('Are you sure you want to donate to this bank?')) {
      try {
        await donateRequest({ bank_id: bankId, donor_id: user.id })
        alert('Donation request sent successfully!')
        fetchDashboard()
      } catch (err) {
        alert('Failed to send request')
      }
    }
  }

  const handleDropRequest = async (donorId) => {
    if (window.confirm('Are you sure you want to drop this request?')) {
      await dropRequest(donorId)
      fetchDashboard()
    }
  }

  const pendingRequests = donationData.filter(d => d.status === 'pending' || d.status === 'approved')
  const completedDonations = donationData.filter(d => d.status === 'completed')
  
  // Display banks - search result or all banks
  const displayBanks = searchResult.length > 0 ? searchResult : banks

  return (
    <div className="donor-dashboard-container">
      <div className="donor-sidebar">
        <h2>Donor Dashboard</h2>
        <ul>
          <li onClick={() => setActiveSection('dashboard')}>Dashboard</li>
          <li onClick={() => setActiveSection('donation-history')}>Donation History</li>
          <li onClick={() => setActiveSection('donation-repository')}>Donation Request</li>
          <li onClick={() => setActiveSection('profile')}>Profile</li>
        </ul>
      </div>
      
      <div className="donor-content">
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <section>
            <div className="donor-welcome">
              <h2>Welcome, {profile.name}</h2>
            </div>
            <div className="donor-overview">
              <div className="donor-card">
                <h3>Blood Type</h3>
                <p>{profile.bloodgroup}</p>
              </div>
              <div className="donor-card">
                <h3>Total Donations</h3>
                <p>{profile.total_donation || 0}</p>
              </div>
            </div>
            <div className="donor-table-container">
              <h3>Recent Donation Requests</h3>
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
                  {pendingRequests.length === 0 ? (
                    <tr><td colSpan="4" style={{textAlign: 'center'}}>No pending requests</td></tr>
                  ) : (
                    pendingRequests.map((d, i) => (
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
              <h3>Donation History</h3>
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
                  {completedDonations.length === 0 ? (
                    <tr><td colSpan="4" style={{textAlign: 'center'}}>No donation history found</td></tr>
                  ) : (
                    completedDonations.map((d, i) => (
                      <tr key={i}>
                        <td>{new Date(d.donation_date).toDateString()}</td>
                        <td>{d.blood_type}</td>
                        <td>{d.Blood_Bank_Name}</td>
                        <td><span className="status-completed">Completed</span></td>
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
              <select 
                value={location.state}
                onChange={(e) => setLocation({ ...location, state: e.target.value, district: '' })} 
                required
              >
                <option value="">Select State</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
              </select>
              <select 
                value={location.district}
                onChange={(e) => setLocation({ ...location, district: e.target.value })} 
                required
                disabled={!location.state}
              >
                <option value="">Select District</option>
                <option value="Bhopal">Bhopal</option>
                <option value="Indore">Indore</option>
                <option value="Jabalpur">Jabalpur</option>
                <option value="Gwalior">Gwalior</option>
                <option value="Ujjain">Ujjain</option>
              </select>
              <button type="submit" className="donor-search-btn" disabled={searching}>
                {searching ? 'Searching...' : 'Search Banks'}
              </button>
            </form>
            <div className="donor-table-container">
              <h3>Available Blood Banks</h3>
              {displayBanks.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '40px' }}>
                  {searchResult.length === 0 && location.state && location.district 
                    ? 'No banks found in this location' 
                    : 'Please search for banks in your area'}
                </p>
              ) : (
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
                    {displayBanks.map((bank, i) => (
                      <tr key={i}>
                        <td>{bank.Blood_Bank_Name}</td>
                        <td>{bank.Category}</td>
                        <td>{bank.Email}</td>
                        <td>{bank.Contact_No || bank.Conatct_No || 'N/A'}</td>
                        <td>{bank.Address}</td>
                        <td>
                          <button onClick={() => handleDonate(bank.bank_id)} className="donor-donate-btn">
                            Donate Here
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <section>
            <form onSubmit={handleUpdateProfile} className="donor-profile-form">
              <h3>Edit Profile</h3>
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
                Update Profile
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  )
}

export default DonorDashboard