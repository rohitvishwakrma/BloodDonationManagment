const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { isBankAdmin } = require('../middleware/auth');
const { getBankById, createBank, updateBank, updateBankStatus } = require('../models/bankModel');
const { getPendingDonations, approveDonation, completeDonation, getDonationsByBank } = require('../models/donationModel');
const { getBloodStockSummary, updateInventory } = require('../models/inventoryModel');
const { getBankAdminByBankId, updateBankAdminPassword } = require('../models/bankAdminModel');
const { getAllDonors } = require('../models/donorModel');
const db = require('../config/db');

// ============ API ROUTES (For React) ============

// Bank Registration API
router.post('/register', async (req, res) => {
    try {
        let {
            Blood_Bank_Name, Hospital_Name, Category, Person_Name, Email, Contact_No,
            Licence_No, License_Issue, License_Expiry, Website, No_Beds, state, district,
            Address, Pincode, Donor_Type, Donation_Type, Component_Type, Bag_Type, TTI_Type
        } = req.body;
        
        // Handle arrays
        Donor_Type = Array.isArray(Donor_Type) ? Donor_Type.join(', ') : Donor_Type;
        Donation_Type = Array.isArray(Donation_Type) ? Donation_Type.join(', ') : Donation_Type;
        Component_Type = Array.isArray(Component_Type) ? Component_Type.join(', ') : Component_Type;
        Bag_Type = Array.isArray(Bag_Type) ? Bag_Type.join(', ') : Bag_Type;
        TTI_Type = Array.isArray(TTI_Type) ? TTI_Type.join(', ') : TTI_Type;
        
        const bankData = {
            Blood_Bank_Name, Hospital_Name, Category, Person_Name, Email, Contact_No,
            Licence_No, License_Issue, License_Expiry, Website, No_Beds, state, district,
            Address, Pincode, Donor_Type, Donation_Type, Component_Type, Bag_Type, TTI_Type
        };
        
        const bankId = await createBank(bankData);
        res.json({ success: true, message: 'Bank registered successfully', bankId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Bank Login API
router.post('/login', (req, res, next) => {
    passport.authenticate('bank_local', (err, user, info) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        
        req.logIn(user, (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            const { password, ...userData } = user;
            res.json({ success: true, user: userData });
        });
    })(req, res, next);
});

// Bank Dashboard API
router.get('/dashboard', isBankAdmin, async (req, res) => {
    try {
        const bank = await getBankById(req.user.bank_id);
        const pending = await getPendingDonations(req.user.bank_id);
        const inventory = await getBloodStockSummary(req.user.bank_id);
        const donors = await getAllDonors();
        const donations = await getDonationsByBank(req.user.bank_id);
        
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
        res.status(500).json({ success: false, message: err.message });
    }
});

// Approve Donation API
router.post('/donation/approve/:donation_id', isBankAdmin, async (req, res) => {
    try {
        await approveDonation(req.params.donation_id, req.body.donation_date, req.body.donation_time);
        res.json({ success: true, message: 'Donation approved successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Complete Donation API
router.post('/donation/complete/:donation_id/:bank_id/:donor_id', isBankAdmin, async (req, res) => {
    try {
        const [donor] = await db.query('SELECT bloodgroup FROM donor WHERE id = ?', [req.params.donor_id]);
        await completeDonation(
            req.params.donation_id, 
            req.params.bank_id, 
            req.params.donor_id, 
            donor[0].bloodgroup, 
            new Date().toISOString().split('T')[0]
        );
        res.json({ success: true, message: 'Donation completed successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update Donor Blood Group API
router.put('/donor/:donor_id/blood-group/:blood_group', isBankAdmin, async (req, res) => {
    try {
        await db.query('UPDATE donor SET bloodgroup = ? WHERE id = ?', [req.params.blood_group, req.params.donor_id]);
        res.json({ success: true, message: 'Blood group updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update Bank Profile API
router.put('/profile/:bank_id', isBankAdmin, async (req, res) => {
    try {
        await updateBank(req.params.bank_id, req.body);
        
        if (req.body.password && req.body.password === req.body.re_password) {
            const hashed = await bcrypt.hash(req.body.password, 10);
            await updateBankAdminPassword(req.params.bank_id, hashed);
        }
        
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get Inventory API
router.get('/inventory', isBankAdmin, async (req, res) => {
    try {
        const inventory = await getBloodStockSummary(req.user.bank_id);
        res.json({ success: true, data: inventory });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get Donations API
router.get('/donations', isBankAdmin, async (req, res) => {
    try {
        const donations = await getDonationsByBank(req.user.bank_id);
        res.json({ success: true, data: donations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Bank Logout API
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

module.exports = router;