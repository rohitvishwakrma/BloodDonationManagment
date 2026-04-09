const hashPassword = async (password, bcrypt) => {
    return await bcrypt.hash(password, 10);
};

const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
};

const calculateExpiryDate = (donationDate) => {
    const expiry = new Date(donationDate);
    expiry.setDate(expiry.getDate() + 42);
    return expiry.toISOString().split('T')[0];
};

module.exports = { hashPassword, formatDate, calculateExpiryDate };