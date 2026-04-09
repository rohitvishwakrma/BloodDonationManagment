const bcrypt = require('bcryptjs');
const { getDashboardStats, createAdmin, getAdminByLogin } = require('../models/adminModel');
const { getAllBanks, updateBankStatus } = require('../models/bankModel');
const { getAllCamps, updateCampStatus } = require('../models/campModel');
const { initializeInventory } = require('../models/inventoryModel');
const db = require('../config/db');

// Admin Signup
const adminSignup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if admin exists
        const existing = await getAdminByLogin(email);
        if (existing) {
            return res.status(400).json({ success: false, message: 'Admin already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await createAdmin(username, email, hashedPassword);
        
        res.json({ success: true, message: 'Admin created successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Admin Dashboard
const adminDashboard = async (req, res) => {
    try {
        const stats = await getDashboardStats();
        const banks = await getAllBanks();
        const camps = await getAllCamps();
        res.json({ success: true, data: { stats, banks, camps } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Accept Bank
const acceptBank = async (req, res) => {
    try {
        const bankId = req.params.bank_id;
        
        await updateBankStatus(bankId, 'accepted');
        
        const [bankRows] = await db.query('SELECT * FROM bank WHERE bank_id = ?', [bankId]);
        const bank = bankRows[0];
        
        const defaultPassword = 'Bank@123';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        await db.query('INSERT INTO bank_admin (username, password, bank_id) VALUES (?, ?, ?)', 
            [bank.Email, hashedPassword, bankId]);
        
        const conn = await db.getConnection();
        await initializeInventory(bankId, conn);
        conn.release();
        
        res.json({ success: true, message: 'Bank accepted successfully', tempPassword: defaultPassword });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Reject Bank
const rejectBank = async (req, res) => {
    try {
        await db.query('DELETE FROM bank WHERE bank_id = ?', [req.params.bank_id]);
        res.json({ success: true, message: 'Bank rejected successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Accept Camp
const acceptCamp = async (req, res) => {
    try {
        await updateCampStatus(req.params.camp_id, 'accepted');
        res.json({ success: true, message: 'Camp accepted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Reject Camp
const rejectCamp = async (req, res) => {
    try {
        await db.query('DELETE FROM blood_camp WHERE camp_id = ?', [req.params.camp_id]);
        res.json({ success: true, message: 'Camp rejected successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { 
    adminSignup, 
    adminDashboard, 
    acceptBank, 
    rejectBank, 
    acceptCamp, 
    rejectCamp 
};