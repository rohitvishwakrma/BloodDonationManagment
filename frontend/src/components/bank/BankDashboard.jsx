import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getBankDashboard, updateBank, approveDonation, completeDonation } from '../../services/api'
import './BankDashboard.css'

const BankDashboard = () => {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [bankData, setBankData] = useState({})
  const [donors, setDonors] = useState([])
  const [donations, setDonations] = useState([])
  const [inventory, setInventory] = useState({})
  const [profile, setProfile] = useState({})
  const [selectedDate, setSelectedDate] = useState({})
  const [selectedTime, setSelectedTime] = useState({})

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await getBankDashboard()
      const dashboardData = res.data.data || res.data
      
      setBankData(dashboardData.bankdata || {})
      setDonors(dashboardData.donordata || [])
      setDonations(dashboardData.donationdata || [])
      setInventory(dashboardData.bloodInventory || {})
      setProfile(dashboardData.bankdata || {})
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      await updateBank(bankData.bank_id, profile)
      alert('Profile updated successfully')
      fetchDashboard()
    } catch (err) {
      alert('Update failed')
    }
  }

  const handleApproveDonation = async (donationId, date, time) => {
    if (!date || !time) {
      alert('Please select donation date and time')
      return
    }
    if (window.confirm('Approve this donation?')) {
      await approveDonation(donationId, { donation_date: date, donation_time: time })
      fetchDashboard()
    }
  }

  const handleCompleteDonation = async (donationId, bankId, donorId) => {
    if (window.confirm('Complete this donation?')) {
      await completeDonation(donationId, bankId, donorId)
      fetchDashboard()
    }
  }

  const totalBloodUnits = () => {
    if (!inventory) return 0
    let total = 0
    for (let key in inventory) {
      if (inventory.hasOwnProperty(key)) {
        total += Number(inventory[key]) || 0
      }
    }
    return total
  }

  const pendingDonations = donations.filter(d => d.status === 'pending')
  const approvedDonations = donations.filter(d => d.status === 'approved')

  return (
    <div className="bank-dashboard-container">
      <div className="bank-sidebar">
        <h3><i className="ri-droplet-line" style={{ color: '#f9aa33' }}></i> Blood Bank Dashboard</h3>
        <ul>
          <li onClick={() => setActiveSection('dashboard')}>
            <i className="ri-dashboard-line" style={{ color: '#f9aa33' }}></i> Dashboard
          </li>
          <li onClick={() => setActiveSection('blood-inventory')}>
            <i className="ri-flask-line" style={{ color: '#f9aa33' }}></i> Blood Inventory
          </li>
          <li onClick={() => setActiveSection('upcoming-donation')}>
            <i className="ri-calendar-check-line" style={{ color: '#f9aa33' }}></i> Upcoming Donation
          </li>
          <li onClick={() => setActiveSection('donation-repository')}>
            <i className="ri-hand-heart-line" style={{ color: '#f9aa33' }}></i> Donation Request
          </li>
          <li onClick={() => setActiveSection('profile')}>
            <i className="ri-user-settings-line" style={{ color: '#f9aa33' }}></i> Profile
          </li>
        </ul>
      </div>

      <div className="bank-content">
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <div>
            <div className="bank-welcome">
              <h2><i className="ri-bank-line" style={{ color: '#BF222B' }}></i> {bankData.Blood_Bank_Name}</h2>
              <p><i className="ri-map-pin-line" style={{ color: '#BF222B' }}></i> {bankData.Address}</p>
            </div>
            <div className="bank-stats">
              <div className="bank-stat-card">
                <h3><i className="ri-droplet-line" style={{ color: '#BF222B' }}></i> Total Blood Units</h3>
                <p>{totalBloodUnits()} units</p>
              </div>
              <div className="bank-stat-card">
                <h3><i className="ri-calendar-line" style={{ color: '#BF222B' }}></i> Upcoming Donations</h3>
                <p>{approvedDonations.length}</p>
              </div>
              <div className="bank-stat-card">
                <h3><i className="ri-time-line" style={{ color: '#BF222B' }}></i> Pending Requests</h3>
                <p>{pendingDonations.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Blood Inventory Section */}
        {activeSection === 'blood-inventory' && (
          <div className="bank-table-container">
            <h3><i className="ri-bar-chart-line" style={{ color: '#BF222B' }}></i> Blood Inventory Stock</h3>
            {inventory && Object.keys(inventory).length > 0 ? (
              <table className="bank-table">
                <thead>
                  <tr>
                    <th>Blood Type</th>
                    <th>Available Units</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(inventory).map(([key, value]) => (
                    <tr key={key}>
                      <td><strong>{key}</strong></td>
                      <td>{value} units</td>
                      <td>{new Date().toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="bank-empty-state"><i className="ri-inbox-line"></i> No inventory data available</p>
            )}
          </div>
        )}

        {/* Upcoming Donation Section */}
        {activeSection === 'upcoming-donation' && (
          <div className="bank-table-container">
            <h3><i className="ri-calendar-event-line" style={{ color: '#BF222B' }}></i> Approved Donation Requests</h3>
            {approvedDonations.length === 0 ? (
              <p className="bank-empty-state"><i className="ri-inbox-line"></i> No approved donations</p>
            ) : (
              <table className="bank-table">
                <thead>
                  <tr>
                    <th>Donor Name</th>
                    <th>Blood Group</th>
                    <th>Donation Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedDonations.map((d, i) => {
                    const donor = donors.find(don => don.id === d.donor_id)
                    return (
                      <tr key={i}>
                        <td>{donor?.name}</td>
                        <td><span className="status-approved">{donor?.bloodgroup}</span></td>
                        <td>{d.donation_date ? new Date(d.donation_date).toDateString() : 'Not scheduled'}</td>
                        <td>
                          <button 
                            onClick={() => handleCompleteDonation(d.id, bankData.bank_id, d.donor_id)} 
                            className="bank-complete-btn"
                          >
                            <i className="ri-check-line"></i> Complete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Donation Repository Section */}
        {activeSection === 'donation-repository' && (
          <div className="bank-table-container">
            <h3><i className="ri-list-check-line" style={{ color: '#BF222B' }}></i> Pending Donation Requests</h3>
            {pendingDonations.length === 0 ? (
              <p className="bank-empty-state"><i className="ri-inbox-line"></i> No pending requests</p>
            ) : (
              <table className="bank-table">
                <thead>
                  <tr>
                    <th>Donor Name</th>
                    <th>Blood Group</th>
                    <th>Request Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingDonations.map((d, i) => {
                    const donor = donors.find(don => don.id === d.donor_id)
                    return (
                      <tr key={i}>
                        <td>{donor?.name}</td>
                        <td><span className="status-pending">{donor?.bloodgroup}</span></td>
                        <td>{new Date(d.application_date).toDateString()}</td>
                        <td>
                          <div className="bank-action-input">
                            <input 
                              type="date" 
                              onChange={(e) => setSelectedDate({ ...selectedDate, [d.id]: e.target.value })}
                              min={new Date().toISOString().split('T')[0]}
                            />
                            <input 
                              type="time" 
                              onChange={(e) => setSelectedTime({ ...selectedTime, [d.id]: e.target.value })}
                            />
                            <button 
                              onClick={() => handleApproveDonation(d.id, selectedDate[d.id], selectedTime[d.id])} 
                              className="bank-approve-btn"
                            >
                              <i className="ri-thumb-up-line"></i> Approve
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="bank-profile-form">
            <form onSubmit={handleUpdateProfile}>
              <h3><i className="ri-edit-line" style={{ color: '#BF222B' }}></i> Edit Bank Profile</h3>
              <label>
                <i className="ri-mail-line" style={{ color: '#BF222B' }}></i> Email
                <input type="email" value={profile.Email || ''} onChange={(e) => setProfile({ ...profile, Email: e.target.value })} />
              </label>
              <label>
                <i className="ri-bank-line" style={{ color: '#BF222B' }}></i> Bank Name
                <input type="text" value={profile.Blood_Bank_Name || ''} onChange={(e) => setProfile({ ...profile, Blood_Bank_Name: e.target.value })} />
              </label>
              <label>
                <i className="ri-hospital-line" style={{ color: '#BF222B' }}></i> Hospital Name
                <input type="text" value={profile.Hospital_Name || ''} onChange={(e) => setProfile({ ...profile, Hospital_Name: e.target.value })} />
              </label>
              <label>
                <i className="ri-phone-line" style={{ color: '#BF222B' }}></i> Mobile Number
                <input type="text" value={profile.Contact_No || ''} onChange={(e) => setProfile({ ...profile, Contact_No: e.target.value })} />
              </label>
              <label>
                <i className="ri-map-pin-line" style={{ color: '#BF222B' }}></i> Address
                <input type="text" value={profile.Address || ''} onChange={(e) => setProfile({ ...profile, Address: e.target.value })} />
              </label>
              <button type="submit" className="bank-update-btn">
                <i className="ri-save-line"></i> Update Profile
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default BankDashboard