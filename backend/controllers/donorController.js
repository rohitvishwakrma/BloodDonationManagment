const bcrypt = require('bcryptjs');
const { createDonor, getDonorByEmail, getDonorById, updateDonor, getDonationHistory, createDonationRequest, searchBanksByLocation } = require('../models/donorModel');

const donorSignup = async (req, res) => {
    try {
        const { name, age, gender, bloodgroup, email, phone, address, password } = req.body;
        const existing = await getDonorByEmail(email);
        if (existing) {
            req.flash('message', 'Email already exists');
            return res.redirect('/donor/signup');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await createDonor({ name, age, gender, bloodgroup, email, phone, address, password: hashedPassword });
        res.redirect('/donor/login');
    } catch (err) {
        console.error(err);
        res.redirect('/donor/signup');
    }
};

const donorLogin = (req, res) => {
    res.render('donor_login');
};

const donorDashboard = async (req, res) => {
    try {
        const user = await getDonorById(req.user.id);
        const history = await getDonationHistory(req.user.id);
        const banks = await require('../models/bankModel').getAcceptedBanks();
        res.render('donor_dashboard', { user, donationHistory: history, banks, bankdata: [] });
    } catch (err) {
        console.error(err);
        res.redirect('/donor/login');
    }
};

module.exports = { donorSignup, donorLogin, donorDashboard };