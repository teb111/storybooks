// we are basically setting all of our routes in here

const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
// @desc login/landingPage
// @route  GET /

router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    });
});

// Description-- Dashboard
// Route == GET "/dashboard"    

router.get('/dashboard', ensureAuth, (req, res) => {
    res.render('dashboard', {
        name: req.name.firstName,
    });
});

module.exports = router;