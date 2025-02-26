const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB with error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/esports_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB successfully');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/esports_db',
        ttl: 24 * 60 * 60 // Session TTL (1 day)
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Routes
const { router: authRouter, isAuthenticated } = require('./routes/auth');
app.use('/', authRouter);

// Protected routes - require authentication
app.use('/', isAuthenticated, require('./routes/index'));
app.use('/dashboard', isAuthenticated, require('./routes/dashboard'));
app.use('/tournaments', require('./routes/tournaments'));
app.use('/teams', require('./routes/teams'));
app.use('/schedule', require('./routes/schedule'));
app.use('/settings', require('./routes/settings'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: err });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
