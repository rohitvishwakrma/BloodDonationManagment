import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Layout Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import FAQs from './pages/FAQs'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// Donor Components
import DonorLogin from './components/donor/DonorLogin'
import DonorSignup from './components/donor/DonorSignup'
import DonorDashboard from './components/donor/DonorDashboard'

// Bank Components
import BankLogin from './components/bank/BankLogin'
import BankRegistration from './components/bank/BankRegistration'
import BankDashboard from './components/bank/BankDashboard'

// Admin Components
import AdminLogin from './components/admin/AdminLogin'
import AdminSignup from './components/admin/AdminSignup'
import AdminDashboard from './components/admin/AdminDashboard'

// Camp Components
import CampRegistration from './components/camp/CampRegistration'
import CampSearch from './components/camp/CampSearch'

// Common Components
import BloodAvailability from './components/common/BloodAvailability'
import PrivateRoute from './components/common/PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/availability" element={<BloodAvailability />} />

          {/* Donor Routes */}
          <Route path="/donor/login" element={<DonorLogin />} />
          <Route path="/donor/signup" element={<DonorSignup />} />
          <Route path="/donor/dashboard" element={
            <PrivateRoute role="donor">
              <DonorDashboard />
            </PrivateRoute>
          } />

          {/* Bank Routes */}
          <Route path="/bank/login" element={<BankLogin />} />
          <Route path="/bank/registration" element={<BankRegistration />} />
          <Route path="/bank/dashboard" element={
            <PrivateRoute role="bank_admin">
              <BankDashboard />
            </PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/dashboard" element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          } />

          {/* Camp Routes */}
          <Route path="/camp/registration" element={<CampRegistration />} />
          <Route path="/camp/search" element={<CampSearch />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  )
}

export default App