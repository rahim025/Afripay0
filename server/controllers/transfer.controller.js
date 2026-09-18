const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Taux fictifs — à remplacer par une vraie API de taux de change
const TAUX_FICTIFS = {
  XOF_GHS: 0.021,
  XOF_NGN: 2.45,
  XOF_KES: 0.28,
  XOF_XOF: 1,
};

function getTaux(deviseSource, deviseCible) {
  const cle = `${deviseSource}_${deviseCible}`;
  return TAUX_FICTIFS[cle] || 1;
}

async function creerTransfert(req, res, next) {
  try {
    const { destinataireId, montant, deviseCible } = req.body;
    const expediteurId = req.userId;

    const expediteur = await User.findById(expediteurId);
    const destinataire = await User.findById(destinataireId);

    if (!expediteur || !destinataire) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    if (expediteur.solde < montant) {
      return res.status(400).json({ error: 'Solde insuffisant' });
    }

    const taux = getTaux(expediteur.devise, deviseCible);
    const montantRecu = montant * taux;

    const transaction = await Transaction.create({
      expediteur: expediteur._id,
      destinataire: destinataire._id,
      montantEnvoye: montant,
      deviseEnvoyee: expediteur.devise,
      montantRecu,
      deviseRecue: deviseCible,
      tauxApplique: taux,
      statut: 'complete',
    });

    expediteur.solde -= montant;
    destinataire.solde += montantRecu;
    await expediteur.save();
    await destinataire.save();

    res.status(201).json({ transaction });
  } catch (err) {
    next(err);
  }
}

async function listerTransferts(req, res, next) {
  try {
    const transactions = await Transaction.find({
      $or: [{ expediteur: req.userId }, { destinataire: req.userId }],
    }).sort({ createdAt: -1 });

    res.json({ transactions });
  } catch (err) {
    next(err);
  }
}

module.exports = { creerTransfert, listerTransferts };
