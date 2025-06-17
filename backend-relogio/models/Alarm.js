const mongoose = require('mongoose');

const AlarmeSchema = new mongoose.Schema({
  horario: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Alarme', AlarmeSchema);
