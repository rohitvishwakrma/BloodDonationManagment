const { createCamp, searchCamps } = require('../models/campModel');

let camp_details = [];

const campRegistration = async (req, res) => {
    await createCamp(req.body);
    res.redirect('/camp/registration');
};

const searchCamp = async (req, res) => {
    camp_details = await searchCamps(req.body.state, req.body.district, req.body.camp_date);
    res.redirect('/camp/searchCamp');
};

module.exports = { campRegistration, searchCamp, camp_details };