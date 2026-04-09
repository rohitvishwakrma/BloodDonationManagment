import React, { useState } from 'react'
import { searchBloodStock } from '../../services/api'
import './BloodAvailability.css'

const BloodAvailability = () => {
  const [formData, setFormData] = useState({ state: '', district: '', blood_group: '' })
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await searchBloodStock(formData)
      const inventoryData = res.data.data?.inventory || res.data.inventory_details || []
      setInventory(inventoryData)
      if (inventoryData.length === 0) {
        alert('No blood stock available for selected criteria')
      }
    } catch (err) {
      console.error('Search error:', err)
      alert('Search failed. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="blood-availability-container">
      <div className="blood-availability-box">
        <h2><i className="ri-droplet-line"></i> Blood Stock Availability</h2>
        <div className="blood-availability-search">
          <h3><i className="ri-search-line"></i> Search Blood Stock</h3>
          <form onSubmit={handleSubmit}>
            <div className="blood-availability-form-row">
              <select onChange={(e) => setFormData({ ...formData, state: e.target.value })} required>
                <option value="">Select State</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
              </select>
              <select onChange={(e) => setFormData({ ...formData, district: e.target.value })} required>
                <option value="">Select District</option>
                <option value="Bhopal">Bhopal</option>
                <option value="Indore">Indore</option>
                <option value="Jabalpur">Jabalpur</option>
              </select>
              <select onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })} required>
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
              <button type="submit" className="blood-availability-search-btn" disabled={loading}>
                {loading ? <><i className="ri-loader-4-line ri-spin"></i> Searching...</> : <><i className="ri-search-line"></i> Search</>}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="blood-availability-results">
        {inventory.length === 0 ? (
          <div className="blood-availability-empty">
            <i className="ri-inbox-line"></i>
            <p>No data found. Please search.</p>
          </div>
        ) : (
          <table className="blood-availability-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Blood Bank Name</th>
                <th>Address</th>
                <th>Contact</th>
                <th>Blood Group</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{item.Blood_Bank_Name}</td>
                  <td>{item.Address}</td>
                  <td>{item.Contact_No || item.Conatct_No}</td>
                  <td><strong>{item.bloodgroup}</strong></td>
                  <td>
                    <span className={item.quantity > 10 ? 'quantity-available' : item.quantity > 0 ? 'quantity-low' : 'quantity-out'}>
                      {item.quantity} units
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default BloodAvailability