const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Tournament = require('../models/Tournament');

// Get all matches with tournament and team details
router.get('/', async (req, res) => {
    try {
        const matches = await Match.find()
            .populate('tournament')
            .populate('team1')
            .populate('team2')
            .populate('winner')
            .sort({ scheduledTime: -1 });

        res.render('matches/index', { matches });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Get match details by ID
router.get('/:id', async (req, res) => {
    try {
        const match = await Match.findById(req.params.id)
            .populate('tournament')
            .populate('team1')
            .populate('team2')
            .populate('winner');

        if (!match) {
            return res.status(404).render('error', { error: 'Match not found' });
        }

        res.render('matches/details', { match });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

module.exports = router;
