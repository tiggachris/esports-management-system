require('dotenv').config();
const mongoose = require('mongoose');
const Team = require('./models/Team');
const Tournament = require('./models/Tournament');

async function initializeDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/esports_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        await Team.deleteMany({});
        await Tournament.deleteMany({});
        console.log('Cleared existing data');

        // Create test team
        const team = await Team.create(testTeam);
        console.log('Created test team:', team.name);

        // Create test tournament
        const tournament = await Tournament.create({
            ...testTournament,
            teams: [team._id]
        });
        console.log('Created test tournament:', tournament.name);

        // Update team with tournament reference
        await Team.findByIdAndUpdate(team._id, {
            $push: { tournaments: tournament._id }
        });
        console.log('Updated team with tournament reference');

        console.log('Database initialization completed successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

initializeDatabase();
