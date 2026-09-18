const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    expediteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destinataire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    montantEnvoye: { type: Number, required: true },
    deviseEnvoyee: { type: String, required: true },
    montantRecu: { type: Number, required: true },
    deviseRecue: { type: String, required: true },
    tauxApplique: { type: Number, required: true },
    statut: {
      type: String,
      enum: ['en_attente', 'complete', 'echoue'],
      default: 'en_attente',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
