const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const app = express();

const userRoutes = require('./routes/userRoutes');
const dailyGoalRoutes = require('./routes/dailyGoalRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');
const habitRoutes = require('./routes/habitRoutes');

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/habits', habitRoutes);
app.use('/api/daily-goals', dailyGoalRoutes);
app.use('/api', userRoutes);


app.use('/api', suggestionRoutes); 

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erro interno');
});


module.exports = app; 
