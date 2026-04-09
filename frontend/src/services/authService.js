import API from './api'

export const getCurrentUser = () => API.get('/api/current-user')
export const logout = () => API.post('/api/logout')
export const checkAuth = () => API.get('/api/auth/status')