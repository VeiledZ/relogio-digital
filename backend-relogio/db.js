const mongoose = require('mongoose');

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('✅ Conectado ao MongoDB');
}

module.exports = connectDB;
