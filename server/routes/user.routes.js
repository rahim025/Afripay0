const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const User = require('../models/User');

const router = express.Router();

// GET /api/users/moi — profil de l'utilisateur connecté
router.get('/moi', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
