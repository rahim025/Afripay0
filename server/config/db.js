const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️  MONGODB_URI non défini — le serveur démarre sans base de données.');
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connecté à MongoDB');
  } catch (err) {
    console.error('❌ Échec de connexion à MongoDB :', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
