import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { campRegister } from '../../services/api'
import './CampRegistration.css'

const CampRegistration = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    Organization_Type: '', Organization_Name: '', Camp_Name: '', Camp_Address: '', Organizer_Name: '',
    Organizer_Mobile_No: '', Organizer_Email_Id: '', Camp_Date: '', State: '', District: '', Start_Time: '', End_Time: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await campRegister(formData)
      alert('Camp registered successfully!')
      navigate('/')
    } catch (err) {
      alert('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="camp-reg-page">
      <div className="camp-reg-container">
        <div className="camp-reg-header">
          <h3>
            <i className="ri-campground-line"></i> Camp Registration
          </h3>
          <p>Register your blood donation camp to reach more donors</p>
        </div>

        <form onSubmit={handleSubmit} className="camp-reg-form">
          <div className="camp-reg-form-grid">
            <div className="camp-reg-field">
              <label><i className="ri-folder-chart-line"></i> Category <span className="required-star">*</span></label>
              <select name="Organization_Type" onChange={(e) => setFormData({ ...formData, Organization_Type: e.target.value })} required>
                <option value="">Select type</option>
                <option value="Govt">Govt</option>
                <option value="Private">Private</option>
                <option value="Charitable">Charitable</option>
              </select>
            </div>

            <div className="camp-reg-field">
              <label><i className="ri-building-line"></i> Organization Name</label>
              <input type="text" name="Organization_Name" onChange={(e) => setFormData({ ...formData, Organization_Name: e.target.value })} />
            </div>

            <div className="camp-reg-field">
              <label><i className="ri-hospital-line"></i> Camp Name <span className="required-star">*</span></label>
              <input type="text" name="Camp_Name" onChange={(e) => setFormData({ ...formData, Camp_Name: e.target.value })} required />
            </div>

            <div className="camp-reg-field">
              <label><i className="ri-map-pin-line"></i> Camp Address <span className="required-star">*</span></label>
              <input type="text" name="Camp_Address" onChange={(e) => setFormData({ ...formData, Camp_Address: e.target.value })} required />
            </div>

            <div className="camp-reg-field">
              <label><i className="ri-user-line"></i> Organizer Name <span className="required-star">*</span></label>
              <input type="text" name="Organizer_Name" onChange={(e) => setFormData({ ...formData, Organizer_Name: e.target.value })} required />
            </div>

            <div className="camp-reg-field">
              <label><i className="ri-phone-line"></i> Organizer Mobile No <span className="required-star">*</span></label>
              <input type="text" name="Organizer_Mobile_No" maxLength="10" onChange={(e) => setFormData({ ...formData, Organizer_Mobile_No: e.target.value })} required />
            </div>

            <div className="camp-reg-field">
              <label><i className="ri-mail-line"></i> Organizer Email Id <span className="required-star">*</span></label>
              <input type="email" name="Organizer_Email_Id" onChange={(e) => setFormData({ ...formData, Organizer_Email_Id: e.target.value })} required />
            </div>

            <div className="camp-reg-field">
              <label><i className="ri-calendar-line"></i> Camp Date <span className="required-star">*</span></label>
              <input type="date" name="Camp_Date" min={today} onChange={(e) => setFormData({ ...formData, Camp_Date: e.target.value })} required />
            </div>

            <div className="camp-reg-field">
              <label><i className="ri-map-line"></i> State <span className="required-star">*</span></label>
              <select name="State" onChange={(e) => setFormData({ ...formData, State: e.target.value })} required>
                <option value="">Select State</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
              </select>
            </div>

            <div className="camp-reg-field">
              <label><i className="ri-map-pin-line"></i> District <span className="required-star">*</span></label>
              <select name="District" onChange={(e) => setFormData({ ...formData, District: e.target.value })} required>
                <option value="">Select District</option>
                <option value="Bhopal">Bhopal</option>
                <option value="Indore">Indore</option>
                <option value="Jabalpur">Jabalpur</option>
              </select>
            </div>

            <div className="camp-reg-field">
              <label><i className="ri-time-line"></i> Start Time <span className="required-star">*</span></label>
              <input type="time" name="Start_Time" onChange={(e) => setFormData({ ...formData, Start_Time: e.target.value })} required />
            </div>

            <div className="camp-reg-field">
              <label><i className="ri-time-line"></i> End Time <span className="required-star">*</span></label>
              <input type="time" name="End_Time" onChange={(e) => setFormData({ ...formData, End_Time: e.target.value })} required />
            </div>
          </div>

          <button type="submit" className="camp-reg-submit-btn" disabled={loading}>
            {loading ? <><i className="ri-loader-4-line ri-spin"></i> Registering...</> : <><i className="ri-send-plane-line"></i> Submit Registration</>}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CampRegistration