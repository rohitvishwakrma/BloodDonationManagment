require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Database
const db = require('./config/db');
// Routes
const adminRoutes = require('./routes/adminRoutes');
const donorRoutes = require('./routes/donorRoutes');
const bankRoutes = require('./routes/bankRoutes');
const campRoutes = require('./routes/campRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

app.use((req, res, next) => {
    res.locals.message = req.flash('message');
    res.locals.user = req.user || null;
    next();
});

// ============ API ROUTES ONLY (No EJS) ============
app.use('/api/auth', authRoutes);

// For React - Serve JSON responses only
app.use('/admin', adminRoutes);
app.use('/donor', donorRoutes);
app.use('/bank', bankRoutes);
app.use('/camp', campRoutes);
app.use('/availability', availabilityRoutes);

// Simple route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Blood Bank API is running', status: 'success' });
});

// API Routes
app.get('/api/current-user', (req, res) => {
    if (req.user) {
        const { password, ...user } = req.user;
        res.json({ success: true, user });
    } else {
        res.json({ success: false, user: null });
    }
});

app.post('/api/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📡 API is ready for React frontend`);
});