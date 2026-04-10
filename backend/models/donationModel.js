const db = require('../config/db');

// Get all donations for a bank
const getDonationsByBank = async (bankId) => {
    const [rows] = await db.query(
        `SELECT d.*, donor.name as donor_name, donor.bloodgroup, donor.phone
         FROM donation d
         JOIN donor ON d.donor_id = donor.id
         WHERE d.bank_id = ?
         ORDER BY d.application_date DESC`,
        [bankId]
    );
    return rows;
};

// Get pending donations for a bank
const getPendingDonations = async (bankId) => {
    const [rows] = await db.query(
        `SELECT d.*, donor.name as donor_name, donor.bloodgroup
         FROM donation d
         JOIN donor ON d.donor_id = donor.id
         WHERE d.bank_id = ? AND d.status = 'pending'`,
        [bankId]
    );
    return rows;
};

// Approve donation
const approveDonation = async (donationId, donationDate, donationTime) => {
    const [result] = await db.query(
        'UPDATE donation SET donation_date = ?, donation_time = ?, status = "approved" WHERE id = ?',
        [donationDate, donationTime, donationId]
    );
    return result.affectedRows;
};

// Complete donation
const completeDonation = async (donationId, bankId, donorId, bloodGroup, donationDate) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        
        await connection.query('UPDATE donation SET status = "completed" WHERE id = ?', [donationId]);
        await connection.query('UPDATE donor SET total_donation = total_donation + 1 WHERE id = ?', [donorId]);
        
        const expiryDate = new Date(donationDate);
        expiryDate.setDate(expiryDate.getDate() + 42);
        
        await connection.query(
            'INSERT INTO donation_history (bank_id, donor_id, donation_id, blood_group, donation_date, expiry_date) VALUES (?, ?, ?, ?, ?, ?)',
            [bankId, donorId, donationId, bloodGroup, donationDate, expiryDate.toISOString().split('T')[0]]
        );
        
        await connection.query(
            `INSERT INTO inventory (bank_id, bloodgroup, quantity, last_updated_date) 
             VALUES (?, ?, 1, CURDATE()) 
             ON DUPLICATE KEY UPDATE quantity = quantity + 1, last_updated_date = CURDATE()`,
            [bankId, bloodGroup]
        );
        
        await connection.commit();
        return true;
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

module.exports = {
    getDonationsByBank,
    getPendingDonations,
    approveDonation,
    completeDonation
};