const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        const { password, ...user } = req.user;
        res.json({ isAuthenticated: true, user, role: req.user.role });
    } else {
        res.json({ isAuthenticated: false, user: null });
    }
});

router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

router.get('/current-user', (req, res) => {
    if (req.isAuthenticated()) {
        const { password, ...user } = req.user;
        res.json({ success: true, user });
    } else {
        res.json({ success: false, user: null });
    }
});

module.exports = router;