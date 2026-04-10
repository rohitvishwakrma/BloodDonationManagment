const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { isAdmin } = require('../middleware/auth');
const { getDashboardStats } = require('../models/adminModel');
const { getAllBanks, updateBankStatus, deleteBank } = require('../models/bankModel');
const { getAllCamps, updateCampStatus, deleteCamp } = require('../models/campModel');
const { initializeInventory } = require('../models/inventoryModel');
const db = require('../config/db');

// ============ ADMIN LOGIN API ============
router.post('/login', (req, res, next) => {
    console.log('📨 Admin login request:', req.body);
    
    passport.authenticate('admin-local', (err, user, info) => {
        if (err) {
            console.log('❌ Auth error:', err);
            return res.status(500).json({ success: false, message: err.message });
        }
        
        if (!user) {
            console.log('❌ Invalid credentials');
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        
        req.logIn(user, (err) => {
            if (err) {
                console.log('❌ Login error:', err);
                return res.status(500).json({ success: false, message: err.message });
            }
            
            console.log('✅ Login successful:', user.email || user.username);
            const { password, ...userData } = user;
            res.json({ success: true, user: userData });
        });
    })(req, res, next);
});

// ============ ADMIN SIGNUP API ============
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if admin exists
        const [existing] = await db.query('SELECT * FROM admin WHERE email = ? OR username = ?', [email, username]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Admin already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO admin (username, email, password) VALUES (?, ?, ?)', 
            [username, email, hashedPassword]);
        
        res.json({ success: true, message: 'Admin created successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ ADMIN DASHBOARD API ============
router.get('/dashboard', isAdmin, async (req, res) => {
    try {
        const stats = await getDashboardStats();
        const banks = await getAllBanks();
        const camps = await getAllCamps();
        res.json({ success: true, data: { stats, banks, camps } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ ACCEPT BANK API ============
router.post('/acceptBloodBank/:bank_id', isAdmin, async (req, res) => {
    try {
        const bankId = req.params.bank_id;
        
        // Update bank status to accepted
        await updateBankStatus(bankId, 'accepted');
        
        // Get bank details
        const [bankRows] = await db.query('SELECT * FROM bank WHERE bank_id = ?', [bankId]);
        const bank = bankRows[0];
        
        if (bank) {
            // Create bank admin with default password
            const defaultPassword = 'Bank@123';
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);
            await db.query('INSERT INTO bank_admin (username, password, bank_id) VALUES (?, ?, ?)', 
                [bank.Email, hashedPassword, bankId]);
            
            // Initialize inventory
            const conn = await db.getConnection();
            await initializeInventory(bankId, conn);
            conn.release();
        }
        
        res.json({ success: true, message: 'Bank accepted successfully' });
    } catch (err) {
        console.error('Accept bank error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ REJECT BANK API ============
router.post('/rejectBloodBank/:bank_id', isAdmin, async (req, res) => {
    try {
        const bankId = req.params.bank_id;
        await updateBankStatus(bankId, 'rejected');
        res.json({ success: true, message: 'Bank rejected successfully' });
    } catch (err) {
        console.error('Reject bank error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ ACCEPT CAMP API ============
router.post('/acceptCamp/:camp_id', isAdmin, async (req, res) => {
    try {
        const campId = req.params.camp_id;
        await updateCampStatus(campId, 'accepted');
        res.json({ success: true, message: 'Camp accepted successfully' });
    } catch (err) {
        console.error('Accept camp error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ REJECT CAMP API ============
router.post('/rejectCamp/:camp_id', isAdmin, async (req, res) => {
    try {
        const campId = req.params.camp_id;
        await updateCampStatus(campId, 'rejected');
        res.json({ success: true, message: 'Camp rejected successfully' });
    } catch (err) {
        console.error('Reject camp error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ GET ALL BANKS API ============
router.get('/banks', isAdmin, async (req, res) => {
    try {
        const banks = await getAllBanks();
        res.json({ success: true, data: banks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ GET ALL CAMPS API ============
router.get('/camps', isAdmin, async (req, res) => {
    try {
        const camps = await getAllCamps();
        res.json({ success: true, data: camps });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ ADMIN LOGOUT API ============
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// ============ CHECK DB API (Debug) ============
router.get('/check-db', async (req, res) => {
    try {
        const [admins] = await db.query('SELECT id, username, email FROM admin');
        res.json({ success: true, admins });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

module.exports = router;