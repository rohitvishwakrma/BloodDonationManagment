const db = require('../config/db');

// Get bank admin by username
const getBankAdminByUsername = async (username) => {
    const [rows] = await db.query('SELECT * FROM bank_admin WHERE username = ?', [username]);
    return rows[0];
};

// Get bank admin by bank ID
const getBankAdminByBankId = async (bankId) => {
    const [rows] = await db.query('SELECT * FROM bank_admin WHERE bank_id = ?', [bankId]);
    return rows[0];
};

// Create bank admin
const createBankAdmin = async (username, hashedPassword, bankId) => {
    const [result] = await db.query(
        'INSERT INTO bank_admin (username, password, bank_id) VALUES (?, ?, ?)',
        [username, hashedPassword, bankId]
    );
    return result.insertId;
};

// Update bank admin password
const updateBankAdminPassword = async (bankId, hashedPassword) => {
    const [result] = await db.query(
        'UPDATE bank_admin SET password = ? WHERE bank_id = ?',
        [hashedPassword, bankId]
    );
    return result.affectedRows;
};

// Delete bank admin
const deleteBankAdmin = async (bankId) => {
    const [result] = await db.query('DELETE FROM bank_admin WHERE bank_id = ?', [bankId]);
    return result.affectedRows;
};

module.exports = {
    getBankAdminByUsername,
    getBankAdminByBankId,
    createBankAdmin,
    updateBankAdminPassword,
    deleteBankAdmin
};