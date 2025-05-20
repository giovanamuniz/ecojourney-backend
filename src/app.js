const express = require('express');
const dailyGoalRoutes = require('./routes/dailyGoalRoutes');
const cors = require('cors');
const helmet = require('helmet');
const suggestionRoutes = require('./routes/suggestionRoutes');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/api/daily-goals', dailyGoalRoutes);
app.use('/api', userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erro interno');
});

app.get('/', (req, res) => {
  res.send('API EcoJourney Online!');
});

app.use('/api', suggestionRoutes);

module.exports = app; 
