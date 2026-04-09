const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(401).json({ success: false, message: 'Please login' });
    }
    req.flash('message', 'Please login');
    res.redirect('/');
};

const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user?.role === 'admin') return next();
    res.redirect('/admin/login');
};

const isDonor = (req, res, next) => {
    if (req.isAuthenticated() && req.user?.role === 'donor') return next();
    res.redirect('/donor/login');
};

const isBankAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user?.role === 'bank_admin') return next();
    res.redirect('/bank/login');
};

module.exports = { isAuthenticated, isAdmin, isDonor, isBankAdmin };