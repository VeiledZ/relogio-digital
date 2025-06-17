const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Banco de dados em memória (simples)
let alarmes = [];

// Rotas
app.get('/alarmes', (req, res) => {
  res.json(alarmes);
});

app.post('/alarmes', (req, res) => {
  const { horario } = req.body;
  if (!horario) return res.status(400).json({ erro: 'Horário é obrigatório' });

  const novoAlarme = { id: Date.now(), horario };
  alarmes.push(novoAlarme);

  res.status(201).json(novoAlarme);
});

app.delete('/alarmes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  alarmes = alarmes.filter((a) => a.id !== id);
  res.json({ sucesso: true });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
