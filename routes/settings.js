const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const User = require('../models/user');
const { isAuthenticated } = require('./auth');

// Settings page
router.get('/', isAuthenticated, async (req, res) => {
    try {
        // Get user from session
        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.redirect('/login');
        }

        // You can add more settings as needed
        const settings = {
            appName: 'Esports Management System',
            defaultGameTypes: ['MOBA', 'FPS', 'Battle Royale', 'Card Game', 'Fighting'],
            matchTypes: ['qualifier', 'quarter-final', 'semi-final', 'final'],
            timeZone: 'UTC',
            dateFormat: 'MM/DD/YYYY',
            maxTeamSize: 10,
            maxTournamentTeams: 32
        };

        res.render('settings/index', { settings, user });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Update settings
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/login');
        }

        const { username, email, password } = req.body;

        // Update user profile
        user.username = username;
        user.email = email;
        
        // Only update password if a new one is provided
        if (password && password.trim() !== '') {
            user.password = password;
        }

        await user.save();
        res.redirect('/settings');
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

module.exports = router;
