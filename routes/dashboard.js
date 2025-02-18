const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const Match = require('../models/Match');
const Team = require('../models/Team');

router.get('/', async (req, res) => {
    try {
        // Get counts and stats
        const stats = await Promise.all([
            Tournament.countDocuments({ status: 'upcoming' }),
            Tournament.countDocuments({ status: 'ongoing' }),
            Tournament.countDocuments({ status: 'completed' }),
            Match.countDocuments({ status: 'scheduled' }),
            Team.countDocuments()
        ]);

        // Get upcoming matches
        const upcomingMatches = await Match.find({ status: 'scheduled' })
            .populate('team1 team2 tournament')
            .sort({ scheduledTime: 1 })
            .limit(5);

        // Get ongoing tournaments
        const ongoingTournaments = await Tournament.find({ status: 'ongoing' })
            .populate('teams')
            .limit(3);

        res.render('dashboard', {
            stats: {
                upcomingTournaments: stats[0],
                ongoingTournaments: stats[1],
                completedTournaments: stats[2],
                scheduledMatches: stats[3],
                totalTeams: stats[4]
            },
            upcomingMatches,
            ongoingTournaments
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).render('error', { error });
    }
});

module.exports = router;
