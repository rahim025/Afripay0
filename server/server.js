require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const transferRoutes = require('./routes/transfer.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

// --- Middlewares globaux ---
app.use(cors());
app.use(express.json());

// --- Connexion à la base de données ---
connectDB();

// --- Routes ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'afripay-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transfers', transferRoutes);

// --- 404 ---
app.use((req, res) => {
  res.status(404).json({ error: 'Route introuvable' });
});

// --- Gestion d'erreurs centralisée ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Erreur serveur' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`AfriPay API démarrée sur le port ${PORT}`);
});
