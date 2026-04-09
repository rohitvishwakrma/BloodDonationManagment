const db = require('../config/db');

// Get donor by email
const getDonorByEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM donor WHERE email = ?', [email]);
    return rows[0];
};

// Get donor by ID
const getDonorById = async (id) => {
    const [rows] = await db.query('SELECT id, name, email, bloodgroup, phone, address, aadhar FROM donor WHERE id = ?', [id]);
    return rows[0];
};

// Create donor - ADDED aadhar and father_name
const createDonor = async (data) => {
    const { name, age, gender, bloodgroup, email, phone, address, password, aadhar, father_name } = data;
    
    const [result] = await db.query(
        `INSERT INTO donor (name, age, gender, bloodgroup, email, phone, address, password, aadhar, father_name) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, age, gender, bloodgroup, email, phone, address, password, aadhar || null, father_name || null]
    );
    return result.insertId;
};

// Update donor
const updateDonor = async (id, data) => {
    const { name, phone, address, password } = data;
    
    if (password) {
        const [result] = await db.query(
            'UPDATE donor SET name = ?, phone = ?, address = ?, password = ? WHERE id = ?',
            [name, phone, address, password, id]
        );
        return result.affectedRows;
    } else {
        const [result] = await db.query(
            'UPDATE donor SET name = ?, phone = ?, address = ? WHERE id = ?',
            [name, phone, address, id]
        );
        return result.affectedRows;
    }
};

// Get donation history
const getDonationHistory = async (donorId) => {
    const [rows] = await db.query(
        `SELECT d.*, b.Blood_Bank_Name 
         FROM donation d 
         JOIN bank b ON d.bank_id = b.bank_id 
         WHERE d.donor_id = ?`,
        [donorId]
    );
    return rows;
};

// Create donation request
const createDonationRequest = async (donorId, bankId) => {
    const [result] = await db.query(
        'INSERT INTO donation (bank_id, donor_id) VALUES (?, ?)',
        [bankId, donorId]
    );
    return result.insertId;
};

// Search banks by location
const searchBanksByLocation = async (state, district) => {
    console.log('Searching for - State:', state, 'District:', district); // Debug
    
    const [rows] = await db.query(
        "SELECT * FROM bank WHERE state = ? AND district = ? AND Action = 'accepted'",
        [state, district]
    );
    
    console.log('Found banks:', rows.length); // Debug
    return rows;
};

module.exports = {
    getDonorByEmail,
    getDonorById,
    createDonor,
    updateDonor,
    getDonationHistory,
    createDonationRequest,
    searchBanksByLocation
};