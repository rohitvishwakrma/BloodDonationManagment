import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/" />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />
  }

  return children
}

export default PrivateRoute