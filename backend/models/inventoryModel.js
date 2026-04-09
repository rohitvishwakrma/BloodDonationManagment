const db = require('../config/db');

const searchBloodAvailability = async (state, district, bloodGroup) => {
    try {
        const [rows] = await db.query(
            `SELECT i.*, b.Blood_Bank_Name, b.Address, b.Conatct_No as Contact_No, b.Category, b.Email
             FROM inventory i 
             JOIN bank b ON i.bank_id = b.bank_id 
             WHERE b.state = ? AND b.district = ? AND i.bloodgroup = ? AND i.quantity > 0`,
            [state, district, bloodGroup]
        );
        return rows;
    } catch (err) {
        console.error('Search error:', err);
        return [];
    }
};

const getBloodStockSummary = async (bankId) => {
    const [rows] = await db.query('SELECT bloodgroup, quantity FROM inventory WHERE bank_id = ?', [bankId]);
    return rows;
};

const initializeInventory = async (bankId, connection) => {
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    for (const group of bloodGroups) {
        await connection.query('INSERT INTO inventory (bank_id, bloodgroup, quantity) VALUES (?, ?, 0)', [bankId, group]);
    }
};

module.exports = { searchBloodAvailability, getBloodStockSummary, initializeInventory };