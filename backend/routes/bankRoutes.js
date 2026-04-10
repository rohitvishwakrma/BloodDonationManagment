const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { isBankAdmin } = require('../middleware/auth');
const { getBankById, createBank, updateBank, updateBankStatus } = require('../models/bankModel');
const { getPendingDonations, approveDonation, completeDonation, getDonationsByBank } = require('../models/donationModel');
const { getBloodStockSummary } = require('../models/inventoryModel');
const { updateBankAdminPassword } = require('../models/bankAdminModel');
const { getAllDonors } = require('../models/donorModel');
const db = require('../config/db');

// ============ BANK LOGIN API ============
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('🏦 Bank login attempt:', { username, password });
        
        const [rows] = await db.query('SELECT * FROM bank_admin WHERE username = ?', [username]);
        
        if (rows.length === 0) {
            console.log('❌ Bank admin not found');
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const admin = rows[0];
        const isMatch = await bcrypt.compare(password, admin.password);
        console.log('🔐 Password match:', isMatch);
        
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        req.login(admin, (err) => {
            if (err) {
                console.error('❌ Login error:', err);
                return res.status(500).json({ success: false, message: err.message });
            }
            
            const { password: _, ...userData } = admin;
            userData.role = 'bank_admin';
            console.log('✅ Bank login successful:', username);
            res.json({ success: true, user: userData });
        });
    } catch (err) {
        console.error('❌ Bank login error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ BANK DASHBOARD API ============
router.get('/dashboard', isBankAdmin, async (req, res) => {
    try {
        console.log('📊 Dashboard requested for bank:', req.user.bank_id);
        
        const bank = await getBankById(req.user.bank_id);
        const pending = await getPendingDonations(req.user.bank_id);
        const inventory = await getBloodStockSummary(req.user.bank_id);
        const donors = await getAllDonors();
        const donations = await getDonationsByBank(req.user.bank_id);
        
        console.log('📋 Pending donations count:', pending.length);
        console.log('📋 Total donations count:', donations.length);
        
        res.json({ 
            success: true, 
            data: { 
                bankdata: bank, 
                pendingDonations: pending, 
                bloodInventory: inventory,
                donordata: donors,
                donationdata: donations
            } 
        });
    } catch (err) {
        console.error('❌ Dashboard error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ BANK REGISTRATION API ============
router.post('/register', async (req, res) => {
    try {
        const bankId = await createBank(req.body);
        res.json({ success: true, message: 'Bank registered successfully', bankId });
    } catch (err) {
        console.error('❌ Registration error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ APPROVE DONATION API ============
router.post('/donation/approve/:donation_id', isBankAdmin, async (req, res) => {
    try {
        const { donation_id } = req.params;
        const { donation_date, donation_time } = req.body;
        
        console.log('✅ Approving donation:', donation_id);
        
        await approveDonation(donation_id, donation_date, donation_time);
        res.json({ success: true, message: 'Donation approved successfully' });
    } catch (err) {
        console.error('❌ Approve error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ COMPLETE DONATION API ============
router.post('/donation/complete/:donation_id/:bank_id/:donor_id', isBankAdmin, async (req, res) => {
    try {
        const { donation_id, bank_id, donor_id } = req.params;
        
        console.log('✅ Completing donation:', { donation_id, bank_id, donor_id });
        
        const [donor] = await db.query('SELECT bloodgroup FROM donor WHERE id = ?', [donor_id]);
        const bloodGroup = donor[0]?.bloodgroup;
        
        await completeDonation(
            donation_id, 
            bank_id, 
            donor_id, 
            bloodGroup, 
            new Date().toISOString().split('T')[0]
        );
        
        res.json({ success: true, message: 'Donation completed successfully' });
    } catch (err) {
        console.error('❌ Complete error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ UPDATE BANK PROFILE API ============
router.put('/profile/:bank_id', isBankAdmin, async (req, res) => {
    try {
        const { bank_id } = req.params;
        
        await updateBank(bank_id, req.body);
        
        if (req.body.password && req.body.password === req.body.re_password) {
            const hashed = await bcrypt.hash(req.body.password, 10);
            await updateBankAdminPassword(bank_id, hashed);
        }
        
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (err) {
        console.error('❌ Profile update error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ GET INVENTORY API ============
router.get('/inventory', isBankAdmin, async (req, res) => {
    try {
        const inventory = await getBloodStockSummary(req.user.bank_id);
        res.json({ success: true, data: inventory });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ GET DONATIONS API ============
router.get('/donations', isBankAdmin, async (req, res) => {
    try {
        const donations = await getDonationsByBank(req.user.bank_id);
        res.json({ success: true, data: donations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ BANK LOGOUT API ============
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

module.exports = router;