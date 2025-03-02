const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Tournament = require('../models/Tournament');
const Team = require('../models/Team');

// Match schedule list
router.get('/', async (req, res) => {
    try {
        const matches = await Match.find({})
            .populate('tournament team1 team2')
            .sort({ scheduledTime: 1 });

        // Group matches by date
        const groupedMatches = matches.reduce((groups, match) => {
            const date = new Date(match.scheduledTime).toLocaleDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(match);
            return groups;
        }, {});

        res.render('schedule/index', { groupedMatches });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Create match form
router.get('/create', async (req, res) => {
    try {
        const tournaments = await Tournament.find({ status: { $ne: 'completed' } }).sort('name');
        const teams = await Team.find().sort('name');
        res.render('schedule/create', { tournaments, teams });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Create match
router.post('/', async (req, res) => {
    try {
        const {
            tournament,
            team1,
            team2,
            scheduledTime,
            matchType
        } = req.body;

        const match = new Match({
            tournament,
            team1,
            team2,
            scheduledTime,
            matchType,
            status: 'scheduled'
        });

        await match.save();

        // Add match to tournament
        await Tournament.findByIdAndUpdate(tournament, {
            $push: { matches: match._id }
        });

        // Add match to teams
        await Team.updateMany(
            { _id: { $in: [team1, team2] } },
            { $push: { matches: match._id } }
        );

        res.redirect('/schedule');
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Update match status
router.post('/:id/status', async (req, res) => {
    try {
        const match = await Match.findById(req.params.id).populate('team1 team2');
        const { status, winner } = req.body;
        
        const updateData = {
            status
        };

        if (status === 'completed') {
            // Set winner based on team selection
            if (winner === 'team1') {
                updateData.winner = match.team1._id;
            } else if (winner === 'team2') {
                updateData.winner = match.team2._id;
            }
        }

        await Match.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/schedule');
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

module.exports = router;
