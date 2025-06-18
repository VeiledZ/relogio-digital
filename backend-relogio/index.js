const express = require('express');
const cors = require('cors');
const connectDB = require('./db'); // ou onde está a conexão Mongo

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão DB
connectDB().catch(console.error);

// Rotas da API
app.get('/', (req, res) =>
  res.send('API do Relógio Digital está funcionando! 🚀')
);

let alarmes = [];
app.get('/alarmes', (req, res) => res.json(alarmes));
app.post('/alarmes', (req, res) => { /* ... */ });
app.delete('/alarmes/:id', (req, res) => { /* ... */ });

// Opcional: para servir frontend (caso tenha)

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req,res) => {
  if(!req.originalUrl.startsWith('/alarmes')) {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  }
});

// Inicializa servidor
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
