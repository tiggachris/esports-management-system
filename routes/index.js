const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const Match = require('../models/Match');
const Team = require('../models/Team');

router.get('/', async (req, res) => {
    try {
        // Get recent tournaments
        const recentTournaments = await Tournament.find()
            .sort({ startDate: -1 })
            .limit(3)
            .populate('teams');

        // Get upcoming matches
        const upcomingMatches = await Match.find({ status: 'scheduled' })
            .sort({ scheduledTime: 1 })
            .limit(5)
            .populate('tournament team1 team2');

        // Get top teams (based on number of tournaments)
        const topTeams = await Team.aggregate([
            {
                $project: {
                    name: 1,
                    logo: 1,
                    tournamentCount: { $size: "$tournaments" }
                }
            },
            { $sort: { tournamentCount: -1 } },
            { $limit: 6 }
        ]);

        // Get system stats
        const stats = await Promise.all([
            Tournament.countDocuments(),
            Team.countDocuments(),
            Match.countDocuments()
        ]);

        res.render('index', {
            recentTournaments,
            upcomingMatches,
            topTeams,
            stats: {
                tournaments: stats[0],
                teams: stats[1],
                matches: stats[2]
            }
        });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

module.exports = router;
