const express = require('express');
const router = express.Router();
const { searchBloodAvailability } = require('../models/inventoryModel');

// ============ API ROUTES (For React) ============

// Search Blood Availability API
router.post('/search', async (req, res) => {
    try {
        const { state, district, blood_group } = req.body;
        
        // Validate input
        if (!state || !district || !blood_group) {
            return res.status(400).json({ 
                success: false, 
                message: 'State, district, and blood group are required' 
            });
        }
        
        const inventory = await searchBloodAvailability(state, district, blood_group);
        
        // Group by bank
        const banks = [];
        const bankMap = new Map();
        
        inventory.forEach(item => {
            if (!bankMap.has(item.bank_id)) {
                bankMap.set(item.bank_id, {
                    bank_id: item.bank_id,
                    Blood_Bank_Name: item.Blood_Bank_Name,
                    Address: item.Address,
                    Contact_No: item.Contact_No,
                    Email: item.Email,
                    Category: item.Category
                });
                banks.push(bankMap.get(item.bank_id));
            }
        });
        
        res.json({ 
            success: true, 
            data: { 
                banks, 
                inventory,
                totalBanks: banks.length,
                totalUnits: inventory.reduce((sum, item) => sum + (item.quantity || 0), 0)
            } 
        });
    } catch (err) {
        console.error('Error in blood stock search:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get Blood Groups List API
router.get('/blood-groups', (req, res) => {
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    res.json({ success: true, data: bloodGroups });
});

// Get States List API (for dropdown)
router.get('/states', (req, res) => {
    const states = ['Madhya Pradesh'];
    res.json({ success: true, data: states });
});

// Get Districts by State API
router.get('/districts/:state', (req, res) => {
    const districts = [
        'Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain',
        'Sagar', 'Ratlam', 'Rewa', 'Satna', 'Hoshangabad',
        'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashok Nagar'
    ];
    res.json({ success: true, data: districts });
});

module.exports = router;