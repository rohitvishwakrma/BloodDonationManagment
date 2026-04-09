import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bankRegister } from '../../services/api'
import './BankRegistration.css'

const BankRegistration = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    Blood_Bank_Name: '', Hospital_Name: '', Category: '', Person_Name: '', Email: '', Contact_No: '',
    Licence_No: '', License_Issue: '', License_Expiry: '', Website: '', No_Beds: '',
    state: '', district: '', Address: '', Pincode: '',
    Donor_Type: [], Donation_Type: [], Component_Type: [], Bag_Type: [], TTI_Type: []
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked ? [...prev[name], value] : prev[name].filter(v => v !== value)
      }))
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Prepare data with proper date handling
    const submitData = {
      ...formData,
      License_Issue: formData.License_Issue || null,
      License_Expiry: formData.License_Expiry || null,
      No_Beds: formData.No_Beds || null,
      Website: formData.Website || null,
      Hospital_Name: formData.Hospital_Name || null,
      // Convert arrays to comma separated strings
      Donor_Type: formData.Donor_Type.join(', '),
      Donation_Type: formData.Donation_Type.join(', '),
      Component_Type: formData.Component_Type.join(', '),
      Bag_Type: formData.Bag_Type.join(', '),
      TTI_Type: formData.TTI_Type.join(', ')
    }
    
    setLoading(true)
    try {
      await bankRegister(submitData)
      alert('Bank registered successfully! Admin will verify your request.')
      navigate('/')
    } catch (err) {
      console.error('Registration error:', err)
      alert('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bank-reg-container">
      {/* Step Indicator */}
      <div className="bank-reg-step-indicator">
        <div className="bank-reg-step">
          <div className={`bank-reg-step-number ${step === 1 ? 'active' : ''}`}>1</div>
          <span className={`bank-reg-step-text ${step === 1 ? 'active' : ''}`}>Bank Information</span>
        </div>
        <div className="bank-reg-step">
          <div className={`bank-reg-step-number ${step === 2 ? 'active' : ''}`}>2</div>
          <span className={`bank-reg-step-text ${step === 2 ? 'active' : ''}`}>Donation Information</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bank-reg-nav">
        <button 
          onClick={() => setStep(1)} 
          className={`bank-reg-nav-btn ${step === 1 ? 'active' : 'inactive'}`}
        >
          <i className="ri-bank-line"></i> Blood Bank Information
        </button>
        <button 
          onClick={() => setStep(2)} 
          className={`bank-reg-nav-btn ${step === 2 ? 'active' : 'inactive'}`}
        >
          <i className="ri-droplet-line"></i> Donation Information
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bank-reg-form">
        {step === 1 && (
          <div>
            <fieldset className="bank-reg-fieldset">
              <legend><i className="ri-bank-fill"></i> Blood Bank Details</legend>
              <div className="bank-reg-form-group">
                <label>Blood Bank Name <span className="bank-reg-required">*</span>
                  <input type="text" name="Blood_Bank_Name" onChange={handleChange} required />
                </label>
                <label>Parent Hospital Name
                  <input type="text" name="Hospital_Name" onChange={handleChange} />
                </label>
                <label>Category <span className="bank-reg-required">*</span>
                  <select name="Category" onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="Govt">Govt</option>
                    <option value="Private">Private</option>
                    <option value="Charitable">Charitable</option>
                  </select>
                </label>
                <label>Contact Person Name <span className="bank-reg-required">*</span>
                  <input type="text" name="Person_Name" onChange={handleChange} required />
                </label>
                <label>Email Id <span className="bank-reg-required">*</span>
                  <input type="email" name="Email" onChange={handleChange} required />
                </label>
                <label>Contact No. <span className="bank-reg-required">*</span>
                  <input type="text" name="Contact_No" maxLength="10" onChange={handleChange} required />
                </label>
                <label>Licence No <span className="bank-reg-required">*</span>
                  <input type="text" name="Licence_No" onChange={handleChange} required />
                </label>
                <label>License Issue Date <span className="bank-reg-required">*</span>
                  <input type="date" name="License_Issue" onChange={handleChange} required />
                </label>
                <label>License Expiry Date <span className="bank-reg-required">*</span>
                  <input type="date" name="License_Expiry" onChange={handleChange} required />
                </label>
                <label>Website URL
                  <input type="text" name="Website" onChange={handleChange} placeholder="https://" />
                </label>
                <label>No of Beds
                  <input type="number" name="No_Beds" onChange={handleChange} placeholder="Total beds" />
                </label>
              </div>
            </fieldset>

            <fieldset className="bank-reg-fieldset">
              <legend><i className="ri-map-pin-line"></i> Blood Bank Address</legend>
              <div className="bank-reg-form-group">
                <label>State <span className="bank-reg-required">*</span>
                  <select name="state" onChange={handleChange} required>
                    <option value="">Select State</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                  </select>
                </label>
                <label>District <span className="bank-reg-required">*</span>
                  <select name="district" onChange={handleChange} required>
                    <option value="">Select District</option>
                    <option value="Bhopal">Bhopal</option>
                    <option value="Indore">Indore</option>
                    <option value="Jabalpur">Jabalpur</option>
                    <option value="Gwalior">Gwalior</option>
                  </select>
                </label>
                <label>Address <span className="bank-reg-required">*</span>
                  <input type="text" name="Address" onChange={handleChange} required />
                </label>
                <label>Pincode <span className="bank-reg-required">*</span>
                  <input type="text" name="Pincode" maxLength="6" onChange={handleChange} required />
                </label>
              </div>
            </fieldset>

            <button type="button" onClick={() => setStep(2)} className="bank-reg-next-btn">
              Next <i className="ri-arrow-right-line"></i> Continue to Donation Info
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <fieldset className="bank-reg-fieldset">
              <legend><i className="ri-user-heart-line"></i> Donor Type</legend>
              <div className="bank-reg-checkbox-group">
                <label><input type="checkbox" name="Donor_Type" value="Voluntary" onChange={handleChange} /> <i className="ri-heart-line"></i> Voluntary</label>
                <label><input type="checkbox" name="Donor_Type" value="Family" onChange={handleChange} /> <i className="ri-group-line"></i> Family</label>
                <label><input type="checkbox" name="Donor_Type" value="Replacement External" onChange={handleChange} /> <i className="ri-repeat-line"></i> Replacement External</label>
                <label><input type="checkbox" name="Donor_Type" value="Directed" onChange={handleChange} /> <i className="ri-user-star-line"></i> Directed</label>
              </div>
            </fieldset>

            <fieldset className="bank-reg-fieldset">
              <legend><i className="ri-syringe-line"></i> Donation Type</legend>
              <div className="bank-reg-checkbox-group">
                <label><input type="checkbox" name="Donation_Type" value="Plasmapheresis" onChange={handleChange} /> <i className="ri-flask-line"></i> Plasmapheresis</label>
                <label><input type="checkbox" name="Donation_Type" value="Plateletpheresis" onChange={handleChange} /> <i className="ri-microscope-line"></i> Plateletpheresis</label>
                <label><input type="checkbox" name="Donation_Type" value="Whole Blood" onChange={handleChange} /> <i className="ri-droplet-line"></i> Whole Blood</label>
              </div>
            </fieldset>

            <fieldset className="bank-reg-fieldset">
              <legend><i className="ri-vial-line"></i> Component Type</legend>
              <div className="bank-reg-checkbox-group">
                <label><input type="checkbox" name="Component_Type" value="Packed Red Blood Cells" onChange={handleChange} /> <i className="ri-cell-line"></i> Packed Red Blood Cells</label>
                <label><input type="checkbox" name="Component_Type" value="Fresh Frozen Plasma" onChange={handleChange} /> <i className="ri-snowflake-line"></i> Fresh Frozen Plasma</label>
                <label><input type="checkbox" name="Component_Type" value="Whole Blood" onChange={handleChange} /> <i className="ri-droplet-line"></i> Whole Blood</label>
                <label><input type="checkbox" name="Component_Type" value="Plasma" onChange={handleChange} /> <i className="ri-water-flash-line"></i> Plasma</label>
              </div>
            </fieldset>

            <fieldset className="bank-reg-fieldset">
              <legend><i className="ri-shopping-bag-line"></i> Bag Type</legend>
              <div className="bank-reg-checkbox-group">
                <label><input type="checkbox" name="Bag_Type" value="Single (350/450ml)" onChange={handleChange} /> <i className="ri-checkbox-blank-circle-line"></i> Single (350/450ml)</label>
                <label><input type="checkbox" name="Bag_Type" value="Double (350/450ml)" onChange={handleChange} /> <i className="ri-checkbox-blank-circle-line"></i> Double (350/450ml)</label>
                <label><input type="checkbox" name="Bag_Type" value="Triple (350ml)" onChange={handleChange} /> <i className="ri-checkbox-blank-circle-line"></i> Triple (350ml)</label>
                <label><input type="checkbox" name="Bag_Type" value="Quadruple (450 ml)" onChange={handleChange} /> <i className="ri-checkbox-blank-circle-line"></i> Quadruple (450 ml)</label>
              </div>
            </fieldset>

            <fieldset className="bank-reg-fieldset">
              <legend><i className="ri-test-tube-line"></i> TTI Type</legend>
              <div className="bank-reg-checkbox-group">
                <label><input type="checkbox" name="TTI_Type" value="HIV 1&2" onChange={handleChange} /> <i className="ri-virus-line"></i> HIV 1&2</label>
                <label><input type="checkbox" name="TTI_Type" value="Hepatitis-B" onChange={handleChange} /> <i className="ri-liver-line"></i> Hepatitis-B</label>
                <label><input type="checkbox" name="TTI_Type" value="Hepatitis-C" onChange={handleChange} /> <i className="ri-liver-line"></i> Hepatitis-C</label>
                <label><input type="checkbox" name="TTI_Type" value="Malaria" onChange={handleChange} /> <i className="ri-bug-line"></i> Malaria</label>
              </div>
            </fieldset>

            <button type="submit" className="bank-reg-submit-btn" disabled={loading}>
              {loading ? <><i className="ri-loader-4-line ri-spin"></i> Submitting...</> : <><i className="ri-check-line"></i> Submit Registration</>}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default BankRegistration