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

        // Get upcoming matches (only scheduled matches)
        const upcomingMatches = await Match.find({ status: 'scheduled' })
            .sort({ scheduledTime: 1 })
            .limit(5)
            .populate('tournament team1 team2');

        // Get top teams (based on wins)
        const topTeams = await Match.aggregate([
            { $match: { status: 'completed' } },
            { $group: {
                _id: '$winner',
                wins: { $sum: 1 }
            }},
            { $lookup: {
                from: 'teams',
                localField: '_id',
                foreignField: '_id',
                as: 'team'
            }},
            { $unwind: '$team' },
            { $project: {
                _id: 1,
                name: '$team.name',
                logo: '$team.logo',
                wins: 1,
                tournamentCount: { $size: '$team.tournaments' }
            }},
            { $sort: { wins: -1 } },
            { $limit: 6 }
        ]);

        // Get system stats
        const stats = await Promise.all([
            Tournament.countDocuments(),
            Team.countDocuments(),
            Match.countDocuments()
        ]);

        res.render('dashboard', {
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
        console.error('Dashboard Error:', error);
        res.status(500).render('error', { error });
    }
});

module.exports = router;
