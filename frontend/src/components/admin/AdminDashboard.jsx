import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAdminDashboard, acceptBank, rejectBank, acceptCamp, rejectCamp } from '../../services/api'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('banks')
  const [banks, setBanks] = useState([])
  const [camps, setCamps] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  // const fetchDashboard = async () => {
  //   setLoading(true)
  //   try {
  //     const res = await getAdminDashboard()
  //     const dashboardData = res.data.data || res.data
  //     setBanks(dashboardData.banks || [])
  //     setCamps(dashboardData.camps || [])
  //     setStats(dashboardData.stats || {})
  //   } catch (err) {
  //     console.error('Dashboard error:', err)
  //   } finally {
  //     setLoading(false)
  //   }
  // }
const fetchDashboard = async () => {
    setLoading(true)
    try {
        const res = await getAdminDashboard()
        const dashboardData = res.data.data || res.data
        console.log('Banks from API:', dashboardData.banks)  // ✅ Add this
        console.log('Bank Actions:', dashboardData.banks?.map(b => ({ name: b.Blood_Bank_Name, action: b.Action })))  // ✅ Add this
        setBanks(dashboardData.banks || [])
        setCamps(dashboardData.camps || [])
        setStats(dashboardData.stats || {})
    } catch (err) {
        console.error('Dashboard error:', err)
    } finally {
        setLoading(false)
    }
}
  const handleAcceptBank = async (bankId) => {
    if (window.confirm('Are you sure you want to accept this blood bank?')) {
      await acceptBank(bankId)
      fetchDashboard()
    }
  }

  const handleRejectBank = async (bankId) => {
    if (window.confirm('Are you sure you want to reject this blood bank?')) {
      await rejectBank(bankId)
      fetchDashboard()
    }
  }

  const handleAcceptCamp = async (campId) => {
    if (window.confirm('Are you sure you want to accept this camp?')) {
      await acceptCamp(campId)
      fetchDashboard()
    }
  }

  const handleRejectCamp = async (campId) => {
    if (window.confirm('Are you sure you want to reject this camp?')) {
      await rejectCamp(campId)
      fetchDashboard()
    }
  }

  const pendingBanks = banks.filter(b => 
    b.Action === 'N/A' || b.Action === 'pending' || b.action === 'pending'
  )
  const pendingCamps = camps.filter(c => 
    c.Action === 'N/A' || c.Action === 'pending' || c.action === 'pending'
  )

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-dashboard-box" style={{ textAlign: 'center', padding: '100px' }}>
          <i className="ri-loader-4-line ri-spin" style={{ fontSize: '48px', color: '#BF222B' }}></i>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-box">
        <div className="admin-header">
          <h2>
            <i className="ri-admin-line"></i> Admin Dashboard
          </h2>
          <button onClick={() => window.location.href = '/'} className="admin-logout-btn">
            <i className="ri-logout-box-r-line"></i> Log Out
          </button>
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <h3><i className="ri-user-line"></i> Total Donors</h3>
            <p>{stats.totalDonors || 0}</p>
          </div>
          <div className="admin-stat-card">
            <h3><i className="ri-bank-line"></i> Total Banks</h3>
            <p>{stats.totalBanks || 0}</p>
          </div>
          <div className="admin-stat-card">
            <h3><i className="ri-time-line"></i> Pending Banks</h3>
            <p>{stats.pendingBanks || 0}</p>
          </div>
          <div className="admin-stat-card">
            <h3><i className="ri-calendar-line"></i> Total Camps</h3>
            <p>{stats.totalCamps || 0}</p>
          </div>
        </div>

        <div className="admin-nav">
          <button 
            onClick={() => setActiveTab('banks')} 
            className={`admin-nav-item ${activeTab === 'banks' ? 'active' : ''}`}
          >
            <i className="ri-bank-line"></i> Blood Bank Applications ({pendingBanks.length})
          </button>
          <button 
            onClick={() => setActiveTab('camps')} 
            className={`admin-nav-item ${activeTab === 'camps' ? 'active' : ''}`}
          >
            <i className="ri-campground-line"></i> Camp Applications ({pendingCamps.length})
          </button>
        </div>

        <div className="admin-details">
          {activeTab === 'banks' && (
            <>
              {pendingBanks.length === 0 ? (
                <div className="admin-empty-state">
                  <i className="ri-checkbox-circle-line"></i>
                  <p>No pending blood bank applications</p>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Bank ID</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Email</th>
                      <th>State</th>
                      <th>District</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingBanks.map((bank) => (
                      <tr key={bank.bank_id}>
                        <td>{bank.bank_id}</td>
                        <td>{bank.Blood_Bank_Name}</td>
                        <td>{bank.Category}</td>
                        <td>{bank.Email}</td>
                        <td>{bank.state}</td>
                        <td>{bank.district}</td>
                        <td>
                          <div className="admin-button-container">
                            <button onClick={() => handleAcceptBank(bank.bank_id)} className="admin-accept-btn">
                              <i className="ri-check-line"></i> Accept
                            </button>
                            <button onClick={() => handleRejectBank(bank.bank_id)} className="admin-reject-btn">
                              <i className="ri-close-line"></i> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {activeTab === 'camps' && (
            <>
              {pendingCamps.length === 0 ? (
                <div className="admin-empty-state">
                  <i className="ri-checkbox-circle-line"></i>
                  <p>No pending camp applications</p>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Camp ID</th>
                      <th>Organization</th>
                      <th>Camp Name</th>
                      <th>Email</th>
                      <th>Date</th>
                      <th>State</th>
                      <th>District</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingCamps.map((camp) => (
                      <tr key={camp.camp_id}>
                        <td>{camp.camp_id}</td>
                        <td>{camp.organization_type}</td>
                        <td>{camp.camp_name}</td>
                        <td>{camp.organizer_email_id}</td>
                        <td>{new Date(camp.camp_date).toDateString()}</td>
                        <td>{camp.State || camp.state}</td>
                        <td>{camp.District || camp.district}</td>
                        <td>
                          <div className="admin-button-container">
                            <button onClick={() => handleAcceptCamp(camp.camp_id)} className="admin-accept-btn">
                              <i className="ri-check-line"></i> Accept
                            </button>
                            <button onClick={() => handleRejectCamp(camp.camp_id)} className="admin-reject-btn">
                              <i className="ri-close-line"></i> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard