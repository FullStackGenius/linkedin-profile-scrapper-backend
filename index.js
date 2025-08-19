const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const sequelize = require('./config/db');
require('./models/User'); 


const authRoutes = require('./routes/authRoutes');
const app = express();
const port = process.env.PORT;


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);


app.use(express.static(path.join(__dirname, 'public')));


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