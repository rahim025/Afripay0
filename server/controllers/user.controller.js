const User = require('../models/User');
const Transaction = require('../models/Transaction');

async function moi(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

    const transactions = await Transaction.find({
      $or: [{ expediteur: user._id }, { destinataire: user._id }],
    }).sort({ createdAt: -1 }).limit(50);

    let totalEnvoye = 0;
    let totalRecu = 0;
    transactions.forEach((t) => {
      if (String(t.expediteur) === String(user._id)) totalEnvoye += t.montantEnvoye;
      if (String(t.destinataire) === String(user._id)) totalRecu += t.montantRecu;
    });

    res.json({
      user: { id: user._id, nom: user.nom, email: user.email, pays: user.pays, devise: user.devise, solde: user.solde, createdAt: user.createdAt },
      stats: {
        totalEnvoye,
        totalRecu,
        nombreTransactions: transactions.length,
      },
      transactions: transactions.map((t) => ({
        id: t._id,
        sens: String(t.expediteur) === String(user._id) ? 'envoye' : 'recu',
        montantEnvoye: t.montantEnvoye,
        deviseEnvoyee: t.deviseEnvoyee,
        montantRecu: t.montantRecu,
        deviseRecue: t.deviseRecue,
        statut: t.statut,
        date: t.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
}

// Recherche d'un destinataire par email, pour préparer un transfert
async function rechercher(req, res, next) {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email requis' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ error: 'Aucun utilisateur avec cet email' });

    res.json({ user: { id: user._id, nom: user.nom, pays: user.pays, devise: user.devise } });
  } catch (err) {
    next(err);
  }
}

// Dépôt de démonstration — à remplacer par une vraie intégration de paiement
async function deposer(req, res, next) {
  try {
    const { montant } = req.body;
    if (!montant || montant <= 0) {
      return res.status(400).json({ error: 'Montant invalide' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

    user.solde += Number(montant);
    await user.save();

    res.json({ message: 'Dépôt effectué (démonstration)', solde: user.solde });
  } catch (err) {
    next(err);
  }
}

module.exports = { moi, rechercher, deposer };
