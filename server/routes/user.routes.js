const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { moi, rechercher, deposer } = require('../controllers/user.controller');

const router = express.Router();

// GET /api/users/moi — profil, stats et historique de l'utilisateur connecté
router.get('/moi', requireAuth, moi);

// GET /api/users/rechercher?email=... — trouver un destinataire pour un transfert
router.get('/rechercher', requireAuth, rechercher);

// POST /api/users/deposer — dépôt de démonstration
router.post('/deposer', requireAuth, deposer);

module.exports = router;
