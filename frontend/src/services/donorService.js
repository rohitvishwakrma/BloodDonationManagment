import API from './api'

export const donorLogin = (data) => API.post('/donor/login', data)
export const donorSignup = (data) => API.post('/donor/signup', data)
export const getDonorDashboard = () => API.get('/donor/dashboard')
export const updateDonor = (id, data) => API.post(`/donor/dashboard/update/${id}`, data)
export const searchBanksByLocation = (data) => API.post('/donor/bankdetails', data)
export const donateRequest = (bankId, donorId) => API.get(`/donor/dashboard/donate/${bankId}/${donorId}`)
export const dropRequest = (donorId) => API.get(`/donor/dashboard/drop_request/${donorId}`)