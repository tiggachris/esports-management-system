# Esports Management System

A comprehensive web application for managing esports tournaments, teams, and matches. Built with Express.js, Node.js, EJS, and MongoDB.

## Features

- Tournament Management
  - Create and manage tournaments
  - Track tournament status (upcoming, ongoing, completed)
  - Associate teams and matches with tournaments

- Team Management
  - Create and manage teams
  - Register players with roles
  - Upload team logos
  - Track team participation in tournaments

- Match Scheduling
  - Schedule matches between teams
  - Update match status and scores
  - Track match history

- Dashboard
  - Overview of system statistics
  - Quick access to important information
  - Recent activities and upcoming events

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/esports_db
   SESSION_SECRET=your-secret-key-change-this-in-production
   PORT=3000
   ```

4. Create required directories:
   ```bash
   mkdir -p public/images/teams
   ```

5. Start the application:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

6. Access the application at `http://localhost:3000`

## Project Structure

```
esports-management-system/
├── models/             # Database models
├── routes/            # Route handlers
├── views/             # EJS templates
├── public/            # Static files
│   ├── css/          # Stylesheets
│   ├── js/           # Client-side JavaScript
│   └── images/       # Uploaded images
├── app.js            # Application entry point
├── package.json      # Project dependencies
└── README.md         # Project documentation
```

## Technologies Used

- **Backend:**
  - Express.js - Web framework
  - Node.js - Runtime environment
  - MongoDB - Database
  - Mongoose - ODM for MongoDB

- **Frontend:**
  - EJS - Templating engine
  - Bootstrap - CSS framework
  - Font Awesome - Icons

- **Additional Tools:**
  - Multer - File upload handling
  - Express Session - Session management
  - Moment.js - Date handling
  - Bcrypt - Password hashing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email [tiggachris95@gmail.com](mailto:tiggachris95@gmail.com) or create an issue in the repository.
