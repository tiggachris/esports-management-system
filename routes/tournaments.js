const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const Team = require('../models/Team');
const multer = require('multer');
const path = require('path');

// Tournament list
router.get('/', async (req, res) => {
    try {
        const tournaments = await Tournament.find()
            .populate('teams')
            .sort({ startDate: -1 });
        res.render('tournaments/index', { tournaments });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Create tournament form
router.get('/create', async (req, res) => {
    try {
        const teams = await Team.find().sort('name');
        res.render('tournaments/create', { teams });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Create tournament
router.post('/', async (req, res) => {
    try {
        const {
            name,
            game,
            startDate,
            endDate,
            prizePool,
            description,
            rules,
            teams
        } = req.body;

        const tournament = new Tournament({
            name,
            game,
            startDate,
            endDate,
            prizePool,
            description,
            rules,
            teams: teams || []
        });

        await tournament.save();

        // Update selected teams with the tournament
        if (teams && teams.length > 0) {
            await Team.updateMany(
                { _id: { $in: teams } },
                { $push: { tournaments: tournament._id } }
            );
        }

        res.redirect('/tournaments');
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Tournament details
router.get('/:id', async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id)
            .populate('teams')
            .populate({
                path: 'matches',
                populate: {
                    path: 'team1 team2 winner'
                }
            });
        
        if (!tournament) {
            return res.status(404).render('error', { error: 'Tournament not found' });
        }

        res.render('tournaments/details', { tournament });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Update tournament status
router.post('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        await Tournament.findByIdAndUpdate(req.params.id, { status });
        res.redirect(`/tournaments/${req.params.id}`);
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

module.exports = router;
