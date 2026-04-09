import React, { useState, useEffect } from 'react'
import { searchCamps } from '../../services/api'
import './CampList.css'

const CampList = () => {
  const [camps, setCamps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCamps()
  }, [])

  const fetchCamps = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const res = await searchCamps({ state: 'Madhya Pradesh', district: 'Bhopal', camp_date: today })
      setCamps(res.data.camp_details || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="camp-list-loader">
        <div className="camp-list-spinner"></div>
        <p>Loading camps...</p>
      </div>
    )
  }

  return (
    <div className="camp-list-container">
      <div className="camp-list-header">
        <h2>
          <i className="ri-campground-line"></i> Upcoming Blood Donation Camps
        </h2>
        <p>Find and join blood donation camps near you</p>
      </div>

      {camps.length === 0 ? (
        <div className="camp-list-empty">
          <i className="ri-inbox-line"></i>
          <p>No camps found in your area</p>
        </div>
      ) : (
        <div className="camp-list-table-container">
          <table className="camp-list-table">
            <thead>
              <tr>
                <th><i className="ri-hospital-line"></i> Camp Name</th>
                <th><i className="ri-group-line"></i> Organization</th>
                <th><i className="ri-calendar-line"></i> Date</th>
                <th><i className="ri-map-pin-line"></i> Address</th>
                <th><i className="ri-time-line"></i> Time</th>
                <th><i className="ri-phone-line"></i> Contact</th>
              </tr>
            </thead>
            <tbody>
              {camps.map((camp, i) => (
                <tr key={i}>
                  <td>{camp.camp_name}</td>
                  <td>{camp.organization_type}</td>
                  <td>{new Date(camp.camp_date).toDateString()}</td>
                  <td>{camp.camp_address}</td>
                  <td>{camp.start_time} - {camp.end_time}</td>
                  <td>{camp.organizer_mobile_no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default CampList