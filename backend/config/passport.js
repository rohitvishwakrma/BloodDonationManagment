const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('./db');

passport.serializeUser((user, done) => {
    done(null, { id: user.id, role: user.role });
});

passport.deserializeUser(async (data, done) => {
    try {
        let user;
        if (data.role === 'admin') {
            const [rows] = await db.query('SELECT * FROM admin WHERE id = ?', [data.id]);
            user = rows[0];
            if (user) user.role = 'admin';
        } else if (data.role === 'donor') {
            const [rows] = await db.query('SELECT * FROM donor WHERE id = ?', [data.id]);
            user = rows[0];
            if (user) user.role = 'donor';
        } else if (data.role === 'bank_admin') {
            const [rows] = await db.query('SELECT * FROM bank_admin WHERE id = ?', [data.id]);
            user = rows[0];
            if (user) user.role = 'bank_admin';
        }
        done(null, user || false);
    } catch (err) {
        done(err, false);
    }
});

// ============ ADMIN STRATEGY - PERMANENT FIX ============
passport.use('admin-local', new LocalStrategy(
    async (emailOrUsername, password, done) => {
        try {
            console.log('🔐 Login attempt:', emailOrUsername);
            
            // Find admin by email or username
            let [rows] = await db.query('SELECT * FROM admin WHERE email = ? OR username = ?', [emailOrUsername, emailOrUsername]);
            
            if (rows.length === 0) {
                console.log('❌ Admin not found');
                return done(null, false);
            }
            
            const admin = rows[0];
            console.log('✅ Admin found:', admin.email);
            
            // Permanent password check - Works for both hashed and plain text
            let isMatch = false;
            
            // Check if password is hashed (starts with $2a$ or $2b$)
            if (admin.password.startsWith('$2a$') || admin.password.startsWith('$2b$')) {
                // Hashed password - use bcrypt compare
                isMatch = await bcrypt.compare(password, admin.password);
                console.log('🔐 BCrypt compare result:', isMatch);
            } else {
                // Plain text password - direct compare (for backward compatibility)
                isMatch = (password === admin.password);
                console.log('🔐 Direct compare result:', isMatch);
            }
            
            if (isMatch) {
                admin.role = 'admin';
                console.log('✅ Login successful:', admin.email);
                return done(null, admin);
            }
            
            console.log('❌ Password mismatch');
            return done(null, false);
            
        } catch (err) {
            console.error('❌ Strategy error:', err);
            return done(err);
        }
    }
));

// ============ DONOR STRATEGY ============
passport.use('donor-local', new LocalStrategy(
    async (email, password, done) => {
        try {
            const [rows] = await db.query('SELECT * FROM donor WHERE email = ?', [email]);
            if (rows.length === 0) return done(null, false);
            
            let isMatch = false;
            if (rows[0].password.startsWith('$2a$') || rows[0].password.startsWith('$2b$')) {
                isMatch = await bcrypt.compare(password, rows[0].password);
            } else {
                isMatch = (password === rows[0].password);
            }
            
            if (isMatch) {
                rows[0].role = 'donor';
                return done(null, rows[0]);
            }
            return done(null, false);
        } catch (err) {
            return done(err);
        }
    }
));

// ============ BANK ADMIN STRATEGY ============
passport.use('bank_local', new LocalStrategy(
    async (email, password, done) => {
        try {
            const [rows] = await db.query('SELECT * FROM bank_admin WHERE username = ?', [email]);
            if (rows.length === 0) return done(null, false);
            
            let isMatch = false;
            if (rows[0].password.startsWith('$2a$') || rows[0].password.startsWith('$2b$')) {
                isMatch = await bcrypt.compare(password, rows[0].password);
            } else {
                isMatch = (password === rows[0].password);
            }
            
            if (isMatch) {
                rows[0].role = 'bank_admin';
                return done(null, rows[0]);
            }
            return done(null, false);
        } catch (err) {
            return done(err);
        }
    }
));

module.exports = passport;