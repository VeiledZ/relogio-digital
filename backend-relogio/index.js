require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const Alarme = require('./models/Alarm');

const app = express();
const PORT = process.env.PORT || 3000;

// Conecta ao MongoDB
connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>
  res.send('API do Relógio Digital está funcionando! 🚀')
);

// Rotas que agora usam o banco de dados
app.get('/alarmes', async (req, res) => {
  const alarmes = await Alarme.find().sort('-createdAt');
  res.json(alarmes);
});

app.post('/alarmes', async (req, res) => {
  const { horario } = req.body;
  if (!horario)
    return res.status(400).json({ erro: 'Horário é obrigatório' });
  const novo = await Alarme.create({ horario });
  res.status(201).json(novo);
});

app.delete('/alarmes/:id', async (req, res) => {
  await Alarme.findByIdAndDelete(req.params.id);
  res.json({ sucesso: true });
});

app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);
