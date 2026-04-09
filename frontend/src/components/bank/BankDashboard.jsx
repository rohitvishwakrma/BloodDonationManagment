import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getBankDashboard, updateBank, approveDonation, completeDonation } from '../../services/api'

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
      setBankData(res.data.bankdata || {})
      setDonors(res.data.donordata || [])
      setDonations(res.data.donationdata || [])
      setInventory(res.data.bloodInventory || {})
      setProfile(res.data.bankdata || {})
    } catch (err) {
      console.error(err)
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

  const totalBloodUnits = Object.values(inventory).reduce((a, b) => a + (b || 0), 0)

  return (
    <div className="bank-dashboard-container">
      <div className="bank-sidebar">
        <h3>🩸 Blood Bank Dashboard</h3>
        <ul>
          <li onClick={() => setActiveSection('dashboard')}>
            <i className="fa-solid fa-chart-pie"></i> Dashboard
          </li>
          <li onClick={() => setActiveSection('blood-inventory')}>
            <i className="fa-solid fa-droplet"></i> Blood Inventory
          </li>
          <li onClick={() => setActiveSection('upcoming-donation')}>
            <i className="fa-solid fa-calendar-check"></i> Upcoming Donation
          </li>
          <li onClick={() => setActiveSection('donation-repository')}>
            <i className="fa-solid fa-hand-holding-heart"></i> Donation Request
          </li>
          <li onClick={() => setActiveSection('profile')}>
            <i className="fa-solid fa-user-edit"></i> Profile
          </li>
        </ul>
      </div>

      <div className="bank-content">
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <section>
            <div className="bank-welcome">
              <h2>🏦 {bankData.Blood_Bank_Name}</h2>
              <p><i className="fa-solid fa-location-dot"></i> {bankData.Address}</p>
            </div>
            <div className="bank-stats">
              <div className="bank-stat-card">
                <h3>🩸 Total Blood Units</h3>
                <p>{totalBloodUnits} units</p>
              </div>
              <div className="bank-stat-card">
                <h3>📅 Upcoming Donations</h3>
                <p>{donations.filter(d => d.status === 'approved').length}</p>
              </div>
              <div className="bank-stat-card">
                <h3>⏳ Pending Requests</h3>
                <p>{donations.filter(d => d.status === 'pending').length}</p>
              </div>
            </div>
          </section>
        )}

        {/* Blood Inventory Section */}
        {activeSection === 'blood-inventory' && (
          <section>
            <div className="bank-table-container">
              <h3>📊 Blood Inventory Stock</h3>
              <table className="bank-table inventory-table">
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
                      <td>{value || 0} units</td>
                      <td>{new Date().toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Upcoming Donation Section */}
        {activeSection === 'upcoming-donation' && (
          <section>
            <div className="bank-table-container">
              <h3>📋 Approved Donation Requests</h3>
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
                  {donations.filter(d => d.status === 'approved').map((d, i) => {
                    const donor = donors.find(don => don.id === d.donor_id)
                    return (
                      <tr key={i}>
                        <td>{donor?.name}</td>
                        <td><span className="status-approved">{donor?.bloodgroup}</span></td>
                        <td>{new Date(d.donation_date).toDateString()}</td>
                        <td>
                          <button 
                            onClick={() => handleCompleteDonation(d.id, bankData.bank_id, d.donor_id)} 
                            className="bank-complete-btn"
                          >
                            <i className="fa-solid fa-check-circle"></i> Complete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Donation Repository Section */}
        {activeSection === 'donation-repository' && (
          <section>
            <div className="bank-table-container">
              <h3>📝 Pending Donation Requests</h3>
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
                  {donations.filter(d => d.status === 'pending').map((d, i) => {
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
                              <i className="fa-solid fa-thumbs-up"></i> Approve
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <section>
            <form onSubmit={handleUpdateProfile} className="bank-profile-form">
              <h3 style={{ marginBottom: '20px', color: '#BF222B' }}>✏️ Edit Bank Profile</h3>
              <label>
                <i className="fa-solid fa-envelope"></i> Email
                <input type="email" value={profile.Email || ''} onChange={(e) => setProfile({ ...profile, Email: e.target.value })} />
              </label>
              <label>
                <i className="fa-solid fa-building"></i> Bank Name
                <input type="text" value={profile.Blood_Bank_Name || ''} onChange={(e) => setProfile({ ...profile, Blood_Bank_Name: e.target.value })} />
              </label>
              <label>
                <i className="fa-solid fa-hospital"></i> Hospital Name
                <input type="text" value={profile.Hospital_Name || ''} onChange={(e) => setProfile({ ...profile, Hospital_Name: e.target.value })} />
              </label>
              <label>
                <i className="fa-solid fa-phone"></i> Mobile Number
                <input type="text" value={profile.Contact_No || ''} onChange={(e) => setProfile({ ...profile, Contact_No: e.target.value })} />
              </label>
              <label>
                <i className="fa-solid fa-location-dot"></i> Address
                <input type="text" value={profile.Address || ''} onChange={(e) => setProfile({ ...profile, Address: e.target.value })} />
              </label>
              <button type="submit" className="bank-update-btn">
                <i className="fa-solid fa-save"></i> Update Profile
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  )
}

export default BankDashboard