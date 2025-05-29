const app = require('./src/app');

const PORT = process.env.PORT || 4040;

app.listen(PORT,'0.0.0.0', () => {
  console.log(`Servidor rodando${PORT}`);
});
