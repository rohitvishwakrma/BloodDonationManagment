const { body, validationResult } = require('express-validator');

const validateDonorSignup = [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 characters'),
    body('phone').isLength({ min: 10, max: 10 }).withMessage('Phone must be 10 digits')
];

const validateBankRegistration = [
    body('Email').isEmail().withMessage('Valid email required'),
    body('Contact_No').isLength({ min: 10, max: 10 }).withMessage('Contact must be 10 digits')
];

const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.xhr || req.headers.accept?.includes('application/json')) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        req.flash('message', errors.array()[0].msg);
        return res.redirect('back');
    }
    next();
};

module.exports = { validateDonorSignup, validateBankRegistration, checkValidation };