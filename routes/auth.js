const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Signup page
router.get('/signup', (req, res) => {
    res.render('signup');
});

// Login post
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.render('login', { error: 'Invalid email or password' });
        }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render('login', { error: 'Invalid email or password' });
        }
        
        req.session.userId = user._id;
        res.redirect('/');
    } catch (error) {
        res.render('login', { error: 'An error occurred during login' });
    }
});

// Signup post
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.render('signup', { error: 'Username or email already exists' });
        }
        
        // Create new user
        const user = new User({ username, email, password });
        await user.save();
        
        req.session.userId = user._id;
        res.redirect('/');
    } catch (error) {
        res.render('signup', { error: 'An error occurred during signup' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = { router, isAuthenticated };
