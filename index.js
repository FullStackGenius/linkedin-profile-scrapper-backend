const express = require('express');
const cors = require('cors');

require('dotenv').config();
const sequelize = require('./config/db');
require('./models/User'); 
require('./models/LinkedInProfile'); 

const authRoutes = require('./routes/authRoutes');
const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);




async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync({ force: false });
    console.log('Database synced');

    if (process.env.NODE_ENV !== 'production') {
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    }
  } catch (err) {
    console.error('Unable to connect to database:', err);
  }
}

// Start server in development, but not when deployed to Vercel
if (process.env.NODE_ENV !== 'production') {
  startServer();
}

// Export the Express app for Vercel
module.exports = app;