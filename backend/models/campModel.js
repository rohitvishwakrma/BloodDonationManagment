const db = require('../config/db');

// Create new camp
const createCamp = async (data) => {
    console.log('Creating camp with data:', data);
    
    const { 
        Organization_Type = 'Charitable',
        Organization_Name = '',
        Organizer_Name = '',
        Organizer_Mobile_No = '',
        Organizer_Email_Id = '',
        Camp_Date = '',
        Camp_Name = '',
        Camp_Address = '',
        State = '',
        District = '',
        Start_Time = null,
        End_Time = null
    } = data;
    
    const [result] = await db.query(
        `INSERT INTO blood_camp (
            organization_type, organization_name, organizer_name, Organizer_Mobile_No,
            Organizer_Email_Id, Camp_Date, Camp_Name, camp_address, State, District,
            start_time, end_time, Action
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
            Organization_Type, Organization_Name, Organizer_Name, Organizer_Mobile_No,
            Organizer_Email_Id, Camp_Date, Camp_Name, Camp_Address, State, District,
            Start_Time, End_Time
        ]
    );
    return result.insertId;
};

// Search camps (only accepted)
const searchCamps = async (state, district, campDate) => {
    console.log('Searching camps:', { state, district, campDate });
    
    const [rows] = await db.query(
        `SELECT * FROM blood_camp 
         WHERE State = ? AND District = ? AND Camp_Date = ? AND Action = 'accepted'`,
        [state, district, campDate]
    );
    return rows;
};

// Get all camps
const getAllCamps = async () => {
    const [rows] = await db.query('SELECT * FROM blood_camp');
    return rows;
};

// Get accepted camps only
const getAcceptedCamps = async () => {
    const [rows] = await db.query("SELECT * FROM blood_camp WHERE Action = 'accepted'");
    return rows;
};

// Get pending camps only
const getPendingCamps = async () => {
    const [rows] = await db.query("SELECT * FROM blood_camp WHERE Action = 'pending'");
    return rows;
};

// Update camp status (accept/reject)
const updateCampStatus = async (campId, status) => {
    const [result] = await db.query(
        'UPDATE blood_camp SET Action = ? WHERE camp_id = ?',
        [status, campId]
    );
    return result.affectedRows;
};

// Delete camp (if needed)
const deleteCamp = async (campId) => {
    const [result] = await db.query('DELETE FROM blood_camp WHERE camp_id = ?', [campId]);
    return result.affectedRows;
};

module.exports = { 
    createCamp, 
    searchCamps, 
    getAllCamps, 
    getAcceptedCamps,
    getPendingCamps,
    updateCampStatus, 
    deleteCamp 
};