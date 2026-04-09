import API from './api'

export const bankLogin = (data) => API.post('/bank/login', data)
export const bankRegister = (data) => API.post('/bank/submition', data)
export const getBankDashboard = () => API.get('/bank/dashboard')
export const updateBank = (bankId, data) => API.post(`/bank/dashboard/update/${bankId}`, data)
export const approveDonation = (donationId, data) => API.post(`/bank/donation/approve/${donationId}`, data)
export const completeDonation = (donationId, bankId, donorId) => API.get(`/bank/dashboard/donation_history/${donationId}/${bankId}/${donorId}`)
export const updateDonorBloodGroup = (donorId, bloodGroup) => API.get(`/bank/dashboard/update_blood_group/${donorId}/${bloodGroup}`)