import React, { useState } from 'react'
import { searchCamps } from '../../services/api'
import './CampSearch.css'

const CampSearch = () => {
  const [formData, setFormData] = useState({ state: '', district: '', camp_date: '' })
  const [camps, setCamps] = useState([])
  const [loading, setLoading] = useState(false)
  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await searchCamps(formData)
      setCamps(res.data.camp_details || [])
    } catch (err) {
      console.error(err)
      alert('Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="camp-search-container">
      <div className="camp-search-box">
        <h2>
          <i className="ri-calendar-event-line"></i> Blood Donation Camp Time Table
        </h2>
        <div className="camp-search-section">
          <h3>
            <i className="ri-search-line"></i> Search Camp Timetable
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="camp-search-form-row">
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
              <input 
                type="date" 
                min={today} 
                onChange={(e) => setFormData({ ...formData, camp_date: e.target.value })} 
                required 
              />
              <button type="submit" className="camp-search-btn" disabled={loading}>
                {loading ? <><i className="ri-loader-4-line ri-spin"></i> Searching...</> : <><i className="ri-search-line"></i> Search</>}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="camp-search-results">
        {camps.length === 0 ? (
          <div className="camp-search-empty">
            <i className="ri-inbox-line"></i>
            <p>No Records Found</p>
          </div>
        ) : (
          <table className="camp-search-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Category</th>
                <th>Camp Name</th>
                <th>Contact Info.</th>
                <th>Camp Date</th>
                <th>Address</th>
                <th>State</th>
                <th>District</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {camps.map((camp, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{camp.organization_type}</td>
                  <td>{camp.camp_name}</td>
                  <td>
                    <i className="ri-mail-line"></i> {camp.organizer_email_id}<br />
                    <i className="ri-phone-line"></i> {camp.organizer_mobile_no}
                   </td>
                  <td>{new Date(camp.camp_date).toDateString()}</td>
                  <td>{camp.camp_address}</td>
                  <td>{camp.State}</td>
                  <td>{camp.District}</td>
                  <td><i className="ri-time-line"></i> {camp.start_time} - {camp.end_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default CampSearch