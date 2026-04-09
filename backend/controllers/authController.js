const authStatus = (req, res) => {
    if (req.isAuthenticated()) {
        const { password, ...user } = req.user;
        res.json({ isAuthenticated: true, user, role: req.user.role });
    } else {
        res.json({ isAuthenticated: false, user: null });
    }
};

const logout = (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
};

module.exports = { authStatus, logout };