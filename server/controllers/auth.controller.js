const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function genererCode() {
  return String(Math.floor(100000 + Math.random() * 900000)); // code à 6 chiffres
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
      verifie: true, // pas de service SMS/email branché : compte actif immédiatement
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

async function verifierCompte(req, res, next) {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email et code requis' });
    }

    const user = await User.findOne({ email }).select('+codeVerification +codeVerificationExpire');
    if (!user) {
      return res.status(404).json({ error: 'Compte introuvable' });
    }

    if (user.verifie) {
      return res.status(400).json({ error: 'Ce compte est déjà vérifié' });
    }

    if (!user.codeVerification || user.codeVerification !== code) {
      return res.status(400).json({ error: 'Code invalide' });
    }

    if (user.codeVerificationExpire < new Date()) {
      return res.status(400).json({ error: 'Code expiré, demandez-en un nouveau' });
    }

    user.verifie = true;
    user.codeVerification = undefined;
    user.codeVerificationExpire = undefined;
    await user.save();

    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, nom: user.nom, email: user.email, pays: user.pays, devise: user.devise },
    });
  } catch (err) {
    next(err);
  }
}

async function renvoyerCode(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Compte introuvable' });
    }
    if (user.verifie) {
      return res.status(400).json({ error: 'Ce compte est déjà vérifié' });
    }

    const code = genererCode();
    user.codeVerification = code;
    user.codeVerificationExpire = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    console.log(`📩 Nouveau code de vérification pour ${user.email} : ${code}`);
    res.json({ message: 'Un nouveau code a été envoyé.' });
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

    if (!user.verifie) {
      return res.status(403).json({ error: 'Compte non vérifié', code: 'NON_VERIFIE', email: user.email });
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

module.exports = { inscription, connexion, verifierCompte, renvoyerCode };
