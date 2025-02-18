const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    logo: {
        type: String,  // URL to the logo image
        default: '/images/default-team-logo.png'
    },
    players: [{
        name: {
            type: String,
            required: true
        },
        gameId: {
            type: String,
            required: true
        },
        role: {
            type: String
        },
        joinDate: {
            type: Date,
            default: Date.now
        }
    }],
    tournaments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament'
    }],
    matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Team', teamSchema);
