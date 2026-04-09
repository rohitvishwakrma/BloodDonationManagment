const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    
    if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(500).json({ success: false, message: err.message || 'Server Error' });
    }
    
    req.flash('message', err.message || 'Something went wrong');
    res.redirect('back');
};

module.exports = errorHandler;