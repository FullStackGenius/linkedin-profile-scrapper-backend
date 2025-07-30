const express = require('express');
const cors = require('cors');

require('dotenv').config();
const sequelize = require('./config/db');
require('./models/User'); 
require('./models/LinkedInProfile'); 

const authRoutes = require('./routes/authRoutes');
const app = express();
const port = process.env.PORT;


// Middleware
// app.use(cors());
app.use(cors({
  origin: 'https://linkedin-profile-scrapper-frontend.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
   credentials: true
}));


app.use(express.json());

// Routes
app.use('/api', authRoutes);




async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync({ force: false });
    console.log('Database synced');

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Unable to connect to database:', err);
  }
}

startServer();