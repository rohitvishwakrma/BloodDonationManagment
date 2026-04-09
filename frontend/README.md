BloodBank-React/                         <-- Root folder
│
├── backend/                             <-- Node.js backend
│   ├── config/
│   │   ├── db.js
│   │   ├── passport.js
│   │   └── constants.js
│   ├── models/
│   │   ├── donorModel.js
│   │   ├── bankModel.js
│   │   ├── adminModel.js
│   │   ├── campModel.js
│   │   ├── donationModel.js
│   │   └── inventoryModel.js
│   ├── controllers/
│   │   ├── donorController.js
│   │   ├── bankController.js
│   │   ├── adminController.js
│   │   ├── campController.js
│   │   └── authController.js
│   ├── routes/
│   │   ├── donorRoutes.js
│   │   ├── bankRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── campRoutes.js
│   │   ├── availabilityRoutes.js
│   │   └── authRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   └── helpers.js
│   ├── views/                          <-- EJS files (temporary)
│   │   ├── partials/
│   │   │   ├── header.ejs
│   │   │   └── footer.ejs
│   │   ├── home.ejs
│   │   ├── donor_login.ejs
│   │   ├── donor_signup.ejs
│   │   ├── donor_dashboard.ejs
│   │   ├── blood_bank_login.ejs
│   │   ├── blood_bank_registration.ejs
│   │   ├── blood_bank_dashboard.ejs
│   │   ├── admin_login.ejs
│   │   ├── admin_signup.ejs
│   │   ├── admin_dashboard.ejs
│   │   ├── camp_registration.ejs
│   │   ├── camp_search.ejs
│   │   ├── blood_availability.ejs
│   │   ├── about.ejs
│   │   ├── FAQs.ejs
│   │   └── contact.ejs
│   ├── public/                         <-- Static files (CSS, JS)
│   │   ├── css/
│   │   │   ├── style.css
│   │   │   ├── donor.css
│   │   │   ├── bank.css
│   │   │   └── header_footer.css
│   │   ├── js/
│   │   │   ├── script.js
│   │   │   └── bankscript.js
│   │   └── images/
│   ├── .env
│   ├── .gitignore
│   ├── database.js
│   ├── index.js
│   └── package.json
│
├── frontend/                           <-- React app
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Navbar.jsx
│   │   │   ├── donor/
│   │   │   │   ├── DonorDashboard.jsx
│   │   │   │   ├── DonorLogin.jsx
│   │   │   │   ├── DonorSignup.jsx
│   │   │   │   └── DonorProfile.jsx
│   │   │   ├── bank/
│   │   │   │   ├── BankDashboard.jsx
│   │   │   │   ├── BankLogin.jsx
│   │   │   │   ├── BankRegistration.jsx
│   │   │   │   └── BankProfile.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   ├── AdminSignup.jsx
│   │   │   │   └── ManageBanks.jsx
│   │   │   ├── camp/
│   │   │   │   ├── CampRegistration.jsx
│   │   │   │   ├── CampSearch.jsx
│   │   │   │   └── CampList.jsx
│   │   │   └── common/
│   │   │       ├── BloodAvailability.jsx
│   │   │       ├── Loader.jsx
│   │   │       ├── Alert.jsx
│   │   │       └── PrivateRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── FAQs.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── donorService.js
│   │   │   ├── bankService.js
│   │   │   ├── adminService.js
│   │   │   └── authService.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── utils/
│   │   │   └── constants.js
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── routes.jsx
│   │   └── index.css
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── database/
│   └── bloodbank.sql
│
├── .gitignore
└── README.md

# Blood Bank Management System

A complete Blood Bank Management System with React frontend and Node.js backend.

## Features

###  Admin Panel
- Admin Login/Signup
- Approve/Reject Blood Banks
- Approve/Reject Blood Donation Camps
- Dashboard with Statistics

###  Donor Panel
- Donor Registration/Login
- Donor Dashboard
- Search Blood Banks by Location
- Request Blood Donation
- Donation History
- Profile Management

### 🏦 Blood Bank Panel
- Bank Registration
- Bank Login
- Blood Inventory Management
- Donation Request Management
- Approve/Complete Donations
- Profile Management

###  Camp Management
- Camp Registration
- Search Camps by Location/Date
- Admin Approval System

###  Blood Availability
- Search Blood Stock by Location and Blood Group
- Real-time Inventory Status

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Remix Icons
- CSS3 (Responsive Design)

### Backend
- Node.js
- Express.js
- MySQL
- JWT/Passport Authentication
- Bcrypt for Password Hashing

## Project Structure

## Installation

### Prerequisites
- Node.js (v14+)
- MySQL (v8+)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm run dev