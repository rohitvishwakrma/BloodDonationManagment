const db = require('../config/db');

// Get all banks
const getAllBanks = async () => {
    const [rows] = await db.query('SELECT * FROM bank');
    return rows;
};

// Get accepted banks
const getAcceptedBanks = async () => {
    const [rows] = await db.query("SELECT * FROM bank WHERE Action = 'accepted'");
    return rows;
};

// Get bank by ID
const getBankById = async (bankId) => {
    const [rows] = await db.query('SELECT * FROM bank WHERE bank_id = ?', [bankId]);
    return rows[0];
};

// Create bank registration - FIXED COLUMN COUNT
// const createBank = async (data) => {
//     const { 
//         Blood_Bank_Name, Hospital_Name, Category, Person_Name, Email, 
//         Contact_No, Licence_No, License_Issue, License_Expiry, Website, 
//         No_Beds, state, district, Address, Pincode,
//         Donor_Type, Donation_Type, Component_Type, Bag_Type, TTI_Type
//     } = data;
    
//     // Count: 20 columns and 20 values
//     const [result] = await db.query(
//         `INSERT INTO bank (
//             Blood_Bank_Name, Hospital_Name, Category, Person_Name, Email, 
//             Conatct_No, Licence_No, License_Issue, License_Expiry, Website, 
//             No_Beds, state, district, Address, Pincode,
//             Donor_Type, Donation_Type, Component_Type, Bag_Type, TTI_Type
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//             Blood_Bank_Name, Hospital_Name, Category, Person_Name, Email, 
//             Contact_No, Licence_No, License_Issue, License_Expiry, Website, 
//             No_Beds, state, district, Address, Pincode,
//             Donor_Type, Donation_Type, Component_Type, Bag_Type, TTI_Type
//         ]
//     );
//     return result.insertId;
// };

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
            Donor_Type, Donation_Type, Component_Type, Bag_Type, TTI_Type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            Blood_Bank_Name || '', Hospital_Name || '', Category || '', Person_Name || '', Email || '', 
            Contact_No || '', Licence_No || '', licenseIssue, licenseExpiry, Website || '', 
            noBeds, state || '', district || '', Address || '', Pincode || '',
            Donor_Type || '', Donation_Type || '', Component_Type || '', Bag_Type || '', TTI_Type || ''
        ]
    );
    return result.insertId;
};
// Update bank
const updateBank = async (bankId, data) => {
    const { Email, Blood_Bank_Name, Hospital_Name, Contact_No, Address } = data;
    const [result] = await db.query(
        'UPDATE bank SET Email = ?, Blood_Bank_Name = ?, Hospital_Name = ?, Conatct_No = ?, Address = ? WHERE bank_id = ?',
        [Email, Blood_Bank_Name, Hospital_Name, Contact_No, Address, bankId]
    );
    return result.affectedRows;
};

// Update bank status
const updateBankStatus = async (bankId, status) => {
    const [result] = await db.query(
        'UPDATE bank SET Action = ? WHERE bank_id = ?',
        [status, bankId]
    );
    return result.affectedRows;
};

// Delete bank
const deleteBank = async (bankId) => {
    const [result] = await db.query('DELETE FROM bank WHERE bank_id = ?', [bankId]);
    return result.affectedRows;
};

module.exports = {
    getAllBanks,
    getAcceptedBanks,
    getBankById,
    createBank,
    updateBankStatus,
    deleteBank,
    updateBank
};