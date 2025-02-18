const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    tournament: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
        required: true
    },
    team1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    team2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    scheduledTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    score: {
        team1: {
            type: Number,
            default: 0
        },
        team2: {
            type: Number,
            default: 0
        }
    },
    matchType: {
        type: String,
        enum: ['qualifier', 'quarter-final', 'semi-final', 'final'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Match', matchSchema);
