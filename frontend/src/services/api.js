import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Add response interceptor for better error handling
API.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
    }
)

// ============ AUTH APIS ============
export const getCurrentUser = () => API.get('/api/current-user')
export const logout = () => API.post('/api/logout')

// ============ DONOR APIS ============
export const donorLogin = (data) => API.post('/donor/login', data)
export const donorSignup = (data) => API.post('/donor/signup', data)
export const getDonorDashboard = () => API.get('/donor/dashboard')
export const updateDonor = (id, data) => API.put(`/donor/profile/${id}`, data)
export const searchBanksByLocation = (data) => API.post('/donor/banks/search', data)
export const donateRequest = (data) => API.post('/donor/donation-request', data)
export const dropRequest = (donorId) => API.delete(`/donor/donation-request/${donorId}`)
export const getDonationHistory = () => API.get('/donor/donation-history')
export const getAllBanks = () => API.get('/donor/banks')

// ============ BANK APIS ============
export const bankLogin = (data) => API.post('/bank/login', data)
export const bankRegister = (data) => API.post('/bank/register', data)
export const getBankDashboard = () => API.get('/bank/dashboard')
export const updateBank = (bankId, data) => API.put(`/bank/profile/${bankId}`, data)
export const approveDonation = (donationId, data) => API.post(`/bank/donation/approve/${donationId}`, data)
export const completeDonation = (donationId, bankId, donorId) => API.post(`/bank/donation/complete/${donationId}/${bankId}/${donorId}`)
export const updateDonorBloodGroup = (donorId, bloodGroup) => API.put(`/bank/donor/${donorId}/blood-group/${bloodGroup}`)
export const getBankInventory = () => API.get('/bank/inventory')
export const getBankDonations = () => API.get('/bank/donations')

// ============ ADMIN APIS ============
export const adminLogin = (data) => API.post('/admin/login', data)
export const adminSignup = (data) => API.post('/admin/signup', data)
export const getAdminDashboard = () => API.get('/admin/dashboard')
export const acceptBank = (bankId) => API.post(`/admin/acceptBloodBank/${bankId}`)
export const rejectBank = (bankId) => API.post(`/admin/rejectBloodBank/${bankId}`)
export const acceptCamp = (campId) => API.post(`/admin/acceptCamp/${campId}`)
export const rejectCamp = (campId) => API.post(`/admin/rejectCamp/${campId}`)
export const getAllBanksAdmin = () => API.get('/admin/banks')
export const getAllCampsAdmin = () => API.get('/admin/camps')

// ============ CAMP APIS ============
export const campRegister = (data) => API.post('/camp/register', data)
export const searchCamps = (data) => API.post('/camp/search', data)
export const getAllCamps = () => API.get('/camp/camps')

// ============ AVAILABILITY APIS ============
export const searchBloodStock = (data) => API.post('/availability/search', data)
export const getBloodGroups = () => API.get('/availability/blood-groups')
export const getStates = () => API.get('/availability/states')
export const getDistricts = (state) => API.get(`/availability/districts/${state}`)

export default API