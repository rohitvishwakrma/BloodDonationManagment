import API from './api'

export const adminLogin = (data) => API.post('/admin/login', data)
export const adminSignup = (data) => API.post('/admin/signup', data)
export const getAdminDashboard = () => API.get('/admin/dashboard')
export const acceptBank = (bankId) => API.get(`/admin/acceptBloodBank/${bankId}`)
export const rejectBank = (bankId) => API.get(`/admin/rejectBloodBank/${bankId}`)
export const acceptCamp = (campId) => API.get(`/admin/acceptCamp/${campId}`)
export const rejectCamp = (campId) => API.get(`/admin/rejectCamp/${campId}`)