const db = require('../config/db');

// ============ GET ALL BANKS ============
const getAllBanks = async () => {
    const [rows] = await db.query('SELECT * FROM bank');
    return rows;
};

// ============ GET ACCEPTED BANKS ============
const getAcceptedBanks = async () => {
    const [rows] = await db.query("SELECT * FROM bank WHERE Action = 'accepted'");
    return rows;
};

// ============ GET PENDING BANKS ============
const getPendingBanks = async () => {
    const [rows] = await db.query("SELECT * FROM bank WHERE Action = 'pending'");
    return rows;
};

// ============ GET BANK BY ID ============
const getBankById = async (bankId) => {
    const [rows] = await db.query('SELECT * FROM bank WHERE bank_id = ?', [bankId]);
    return rows[0];
};

// ============ CREATE BANK REGISTRATION ============
const createBank = async (data) => {
    const { 
        Blood_Bank_Name, Hospital_Name, Category, Person_Name, Email, 
        Contact_No, Licence_No, License_Issue, License_Expiry, Website, 
        No_Beds, state, district, Address, Pincode,
        Donor_Type, Donation_Type, Component_Type, Bag_Type, TTI_Type
    } = data;
    
    // Handle empty dates
    const licenseIssue = License_Issue && License_Issue !== '' ? License_Issue : null;
    const licenseExpiry = License_Expiry && License_Expiry !== '' ? License_Expiry : null;
    const noBeds = No_Beds && No_Beds !== '' ? parseInt(No_Beds) : null;
    
    const [result] = await db.query(
        `INSERT INTO bank (
            Blood_Bank_Name, Hospital_Name, Category, Person_Name, Email, 
            Conatct_No, Licence_No, License_Issue, License_Expiry, Website, 
            No_Beds, state, district, Address, Pincode,
            Donor_Type, Donation_Type, Component_Type, Bag_Type, TTI_Type, Action
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
            Blood_Bank_Name || '', Hospital_Name || '', Category || '', Person_Name || '', Email || '', 
            Contact_No || '', Licence_No || '', licenseIssue, licenseExpiry, Website || '', 
            noBeds, state || '', district || '', Address || '', Pincode || '',
            Donor_Type || '', Donation_Type || '', Component_Type || '', Bag_Type || '', TTI_Type || ''
        ]
    );
    return result.insertId;
};

// ============ UPDATE BANK PROFILE ============
const updateBank = async (bankId, data) => {
    const { Email, Blood_Bank_Name, Hospital_Name, Contact_No, Address } = data;
    const [result] = await db.query(
        'UPDATE bank SET Email = ?, Blood_Bank_Name = ?, Hospital_Name = ?, Conatct_No = ?, Address = ? WHERE bank_id = ?',
        [Email, Blood_Bank_Name, Hospital_Name, Contact_No, Address, bankId]
    );
    return result.affectedRows;
};

// ============ UPDATE BANK STATUS (ACCEPT/REJECT) ============
const updateBankStatus = async (bankId, status) => {
    const [result] = await db.query(
        'UPDATE bank SET Action = ? WHERE bank_id = ?',
        [status, bankId]
    );
    return result.affectedRows;
};

// ============ DELETE BANK ============
const deleteBank = async (bankId) => {
    const [result] = await db.query('DELETE FROM bank WHERE bank_id = ?', [bankId]);
    return result.affectedRows;
};

module.exports = {
    getAllBanks,
    getAcceptedBanks,
    getPendingBanks,
    getBankById,
    createBank,
    updateBank,
    updateBankStatus,
    deleteBank
};