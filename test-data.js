// Sample test data
const testTeam = {
    name: "Test Team",
    logo: "/images/teams/default-team-logo.png",
    players: [
        {
            name: "Player 1",
            gameId: "PLAYER001",
            role: "Captain",
            joinDate: new Date()
        }
    ]
};

const testTournament = {
    name: "Test Tournament",
    game: "Test Game",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    status: "upcoming",
    prizePool: 1000,
    description: "Test tournament description",
    rules: "Test tournament rules"
};

module.exports = { testTeam, testTournament };
