const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { isDonor } = require('../middleware/auth');
const { 
    getDonorById, 
    updateDonor, 
    getDonationHistory, 
    createDonationRequest, 
    searchBanksByLocation,
    getDonorByEmail,
    createDonor
} = require('../models/donorModel');
const { getAcceptedBanks } = require('../models/bankModel');
const db = require('../config/db');

// ============ DONOR SIGNUP API ============
router.post('/signup', async (req, res) => {
    try {
        let { 
            name, age, gender, bloodgroup, email, phone, address, 
            password, aadhar, father_name, pin 
        } = req.body;
        
        const existing = await getDonorByEmail(email);
        if (existing) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const donorId = await createDonor({ 
            name, age, gender, bloodgroup, email, phone, address, 
            password: hashedPassword,
            aadhar: aadhar || null,
            father_name: father_name || null,
            pin: pin || null
        });
        
        res.json({ success: true, message: 'Donor registered successfully', donorId });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ DONOR LOGIN API ============
router.post('/login', (req, res, next) => {
    console.log('📨 Donor login request:', req.body);
    
    passport.authenticate('donor-local', (err, user, info) => {
        if (err) {
            console.log('❌ Auth error:', err);
            return res.status(500).json({ success: false, message: err.message });
        }
        
        if (!user) {
            console.log('❌ Invalid credentials');
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        req.logIn(user, (err) => {
            if (err) {
                console.log('❌ Login error:', err);
                return res.status(500).json({ success: false, message: err.message });
            }
            
            console.log('✅ Donor login successful:', user.email);
            const { password, ...userData } = user;
            res.json({ success: true, user: userData });
        });
    })(req, res, next);
});

// ============ DONOR DASHBOARD API ============
router.get('/dashboard', isDonor, async (req, res) => {
    try {
        const user = await getDonorById(req.user.id);
        const donationHistory = await getDonationHistory(req.user.id);
        const banks = await getAcceptedBanks();
        
        res.json({ 
            success: true, 
            data: { 
                user, 
                donationHistory, 
                banks 
            } 
        });
    } catch (err) {
        console.error('Dashboard error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ UPDATE DONOR PROFILE API ============
router.put('/profile/:id', isDonor, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, address, password, re_password } = req.body;
        
        if (password && password !== re_password) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }
        
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await updateDonor(id, { name, phone, address, password: hashedPassword });
        } else {
            await updateDonor(id, { name, phone, address });
        }
        
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ SEARCH BANKS BY LOCATION API ============
router.post('/banks/search', isDonor, async (req, res) => {
    try {
        const { state, district } = req.body;
        console.log('Searching banks:', { state, district });
        
        const banks = await searchBanksByLocation(state, district);
        res.json({ success: true, data: banks });
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ CREATE DONATION REQUEST API ============
router.post('/donation-request', isDonor, async (req, res) => {
    try {
        const { bank_id, donor_id } = req.body;
        console.log('Donation request received:', { bank_id, donor_id });
        
        const [existing] = await db.query(
            'SELECT * FROM donation WHERE donor_id = ? AND bank_id = ? AND status = "pending"',
            [donor_id, bank_id]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Donation request already pending' });
        }
        
        await createDonationRequest(donor_id, bank_id);
        res.json({ success: true, message: 'Donation request sent successfully' });
    } catch (err) {
        console.error('Donation request error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ DROP DONATION REQUEST API ============
router.delete('/donation-request/:donor_id', isDonor, async (req, res) => {
    try {
        await db.query('DELETE FROM donation WHERE donor_id = ? AND status = "pending"', [req.params.donor_id]);
        res.json({ success: true, message: 'Donation request cancelled' });
    } catch (err) {
        console.error('Drop request error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ GET DONATION HISTORY API ============
router.get('/donation-history', isDonor, async (req, res) => {
    try {
        const history = await getDonationHistory(req.user.id);
        res.json({ success: true, data: history });
    } catch (err) {
        console.error('History error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ GET ALL BANKS API ============
router.get('/banks', isDonor, async (req, res) => {
    try {
        const banks = await getAcceptedBanks();
        res.json({ success: true, data: banks });
    } catch (err) {
        console.error('Get banks error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ DONOR LOGOUT API ============
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

module.exports = router;