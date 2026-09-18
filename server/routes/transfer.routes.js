const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { creerTransfert, listerTransferts } = require('../controllers/transfer.controller');

const router = express.Router();

router.post('/', requireAuth, creerTransfert);
router.get('/', requireAuth, listerTransferts);

module.exports = router;
