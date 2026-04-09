const express = require('express');
const router = express.Router();
const { createCamp, searchCamps, getAcceptedCamps } = require('../models/campModel');
const db = require('../config/db');

// ============ API ROUTES (For React) ============

// Register Camp API
router.post('/register', async (req, res) => {
    try {
        const {
            Organization_Type, Organization_Name, Organizer_Name, Organizer_Mobile_No,
            Organizer_Email_Id, Camp_Date, Camp_Name, Camp_Address, State, District,
            Start_Time, End_Time
        } = req.body;
        
        const campData = {
            Organization_Type, Organization_Name, Organizer_Name, Organizer_Mobile_No,
            Organizer_Email_Id, Camp_Date, Camp_Name, Camp_Address, State, District,
            Start_Time, End_Time
        };
        
        const campId = await createCamp(campData);
        res.json({ success: true, message: 'Camp registered successfully', campId });
    } catch (err) {
        console.error('Camp registration error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Search Camp API
router.post('/search', async (req, res) => {
    try {
        const { state, district, camp_date } = req.body;
        console.log('Searching camps:', { state, district, camp_date });
        
        const [rows] = await db.query(
            `SELECT * FROM blood_camp 
             WHERE State = ? AND District = ? AND Camp_Date = ? AND Action = 'accepted'`,
            [state, district, camp_date]
        );
        
        res.json({ success: true, camp_details: rows });
    } catch (err) {
        console.error('Camp search error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get All Accepted Camps API
router.get('/camps', async (req, res) => {
    try {
        const camps = await getAcceptedCamps();
        res.json({ success: true, data: camps });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;