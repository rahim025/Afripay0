const express = require('express');
const { inscription, connexion, verifierCompte, renvoyerCode } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/inscription', inscription);
router.post('/connexion', connexion);
router.post('/verifier', verifierCompte);
router.post('/renvoyer-code', renvoyerCode);

module.exports = router;
