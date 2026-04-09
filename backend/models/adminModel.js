const db = require('../config/db');

// Get admin by email or username
const getAdminByLogin = async (login) => {
    const [rows] = await db.query(
        'SELECT * FROM admin WHERE email = ? OR username = ?', 
        [login, login]
    );
    return rows[0];
};

// Get admin by ID
const getAdminById = async (id) => {
    const [rows] = await db.query('SELECT * FROM admin WHERE id = ?', [id]);
    return rows[0];
};

// Create admin
const createAdmin = async (username, email, password) => {
    const [result] = await db.query(
        'INSERT INTO admin (username, email, password) VALUES (?, ?, ?)',
        [username, email, password]
    );
    return result.insertId;
};

// Get dashboard stats
const getDashboardStats = async () => {
    const [donors] = await db.query('SELECT COUNT(*) as count FROM donor');
    const [banks] = await db.query("SELECT COUNT(*) as count FROM bank WHERE Action = 'accepted'");
    const [pendingBanks] = await db.query("SELECT COUNT(*) as count FROM bank WHERE Action = 'pending'");
    const [camps] = await db.query("SELECT COUNT(*) as count FROM blood_camp");
    return { 
        totalDonors: donors[0].count, 
        totalBanks: banks[0].count, 
        pendingBanks: pendingBanks[0].count, 
        totalCamps: camps[0].count 
    };
};

module.exports = { getAdminByLogin, getAdminById, createAdmin, getDashboardStats };