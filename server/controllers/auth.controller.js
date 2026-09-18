const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

async function inscription(req, res, next) {
  try {
    const { nom, email, motDePasse, pays, devise } = req.body;

    if (!nom || !email || !motDePasse || !pays) {
      return res.status(400).json({ error: 'Champs manquants' });
    }

    const existant = await User.findOne({ email });
    if (existant) {
      return res.status(409).json({ error: 'Un compte existe déjà avec cet email' });
    }

    const hash = await bcrypt.hash(motDePasse, 10);
    const user = await User.create({
      nom,
      email,
      motDePasse: hash,
      pays,
      devise: devise || 'XOF',
    });

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, nom: user.nom, email: user.email, pays: user.pays, devise: user.devise },
    });
  } catch (err) {
    next(err);
  }
}

async function connexion(req, res, next) {
  try {
    const { email, motDePasse } = req.body;

    const user = await User.findOne({ email }).select('+motDePasse');
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const valide = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!valide) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, nom: user.nom, email: user.email, pays: user.pays, devise: user.devise },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { inscription, connexion };
