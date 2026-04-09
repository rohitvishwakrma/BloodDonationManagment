const { createBank, getBankById } = require('../models/bankModel');
const { getPendingDonations } = require('../models/donationModel');
const { getBloodStockSummary } = require('../models/inventoryModel');

const bankRegistration = async (req, res) => {
    try {
        await createBank(req.body);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.redirect('/bank/Registration');
    }
};

const bankDashboard = async (req, res) => {
    try {
        const bank = await getBankById(req.user.bank_id);
        const pending = await getPendingDonations(req.user.bank_id);
        const inventory = await getBloodStockSummary(req.user.bank_id);
        res.render('blood_bank_dashboard', { bankdata: bank, pendingDonations: pending, bloodInventory: inventory });
    } catch (err) {
        console.error(err);
        res.redirect('/bank/login');
    }
};

module.exports = { bankRegistration, bankDashboard };