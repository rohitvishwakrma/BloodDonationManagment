import React, { useState, useEffect } from 'react'
import { getAdminDashboard, acceptBank, rejectBank } from '../../services/api'

const ManageBanks = () => {
  const [banks, setBanks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanks()
  }, [])

  const fetchBanks = async () => {
    try {
      const res = await getAdminDashboard()
      setBanks(res.data.banks || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (bankId) => {
    if (window.confirm('Accept this bank?')) {
      await acceptBank(bankId)
      fetchBanks()
    }
  }

  const handleReject = async (bankId) => {
    if (window.confirm('Reject this bank?')) {
      await rejectBank(bankId)
      fetchBanks()
    }
  }

  if (loading) return <div style={styles.loader}>Loading...</div>

  return (
    <div style={styles.container}>
      <h2>Manage Blood Banks</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Bank Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>State</th>
            <th>District</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((bank) => (
            <tr key={bank.bank_id}>
              <td>{bank.bank_id}</td>
              <td>{bank.Blood_Bank_Name}</td>
              <td>{bank.Email}</td>
              <td>{bank.Contact_No}</td>
              <td>{bank.state}</td>
              <td>{bank.district}</td>
              <td style={{ color: bank.Action === 'accepted' ? 'green' : bank.Action === 'rejected' ? 'red' : 'orange' }}>
                {bank.Action || 'Pending'}
              </td>
              <td>
                {bank.Action !== 'accepted' && bank.Action !== 'rejected' && (
                  <div style={styles.buttonGroup}>
                    <button onClick={() => handleAccept(bank.bank_id)} style={styles.acceptBtn}>Accept</button>
                    <button onClick={() => handleReject(bank.bank_id)} style={styles.rejectBtn}>Reject</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  container: { padding: '20px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  buttonGroup: { display: 'flex', gap: '10px' },
  acceptBtn: { backgroundColor: '#28a745', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  rejectBtn: { backgroundColor: '#dc3545', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  loader: { textAlign: 'center', padding: '50px' }
}

export default ManageBanks