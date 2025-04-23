const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api', userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erro interno');
});


app.get('/', (req, res) => {
  res.send('API EcoJourney Online!');
});


const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
