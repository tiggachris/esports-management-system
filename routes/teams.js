const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Match = require('../models/Match');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/teams');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'team-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
});

// Team list
router.get('/', async (req, res) => {
    try {
        const teams = await Team.find()
            .populate('tournaments')
            .sort('name');

        // Get wins for each team
        const teamWins = await Match.aggregate([
            { 
                $match: { 
                    status: 'completed',
                    winner: { $ne: null }
                } 
            },
            { 
                $group: {
                    _id: '$winner',
                    wins: { $sum: 1 }
                }
            }
        ]);

        // Create a map of team wins
        const winsMap = {};
        teamWins.forEach(item => {
            if (item._id) {
                winsMap[item._id.toString()] = item.wins;
            }
        });

        // Add wins to team objects
        teams.forEach(team => {
            team.wins = winsMap[team._id.toString()] || 0;
        });

        res.render('teams/index', { teams });
    } catch (error) {
        console.error('Team List Error:', error);
        res.status(500).render('error', { error });
    }
});

// Create team form
router.get('/create', (req, res) => {
    res.render('teams/create');
});

// Create team
router.post('/', upload.single('logo'), async (req, res) => {
    try {
        const { name, players } = req.body;
        
        // Parse players data from form
        const parsedPlayers = Array.isArray(players) ? players.map(player => ({
            name: player.name,
            gameId: player.gameId,
            role: player.role
        })) : [];

        const team = new Team({
            name,
            logo: req.file ? `/images/teams/${req.file.filename}` : undefined,
            players: parsedPlayers
        });

        await team.save();
        res.redirect('/teams');
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Team details
router.get('/:id', async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate('tournaments')
            .populate('matches');
        
        if (!team) {
            return res.status(404).render('error', { error: 'Team not found' });
        }

        // Get team's wins
        const wins = await Match.countDocuments({
            status: 'completed',
            winner: team._id
        });

        team.wins = wins || 0;

        res.render('teams/details', { team });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Add player to team
router.post('/:id/players', async (req, res) => {
    try {
        const { name, gameId, role } = req.body;
        
        await Team.findByIdAndUpdate(req.params.id, {
            $push: {
                players: { name, gameId, role }
            }
        });

        res.redirect(`/teams/${req.params.id}`);
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Remove player from team
router.delete('/:teamId/players/:playerId', async (req, res) => {
    try {
        await Team.findByIdAndUpdate(req.params.teamId, {
            $pull: {
                players: { _id: req.params.playerId }
            }
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
