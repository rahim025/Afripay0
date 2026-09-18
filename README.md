# AfriPay

Envoyer et recevoir de l'argent partout en Afrique, avec conversion automatique dans la monnaie du destinataire.

Projet repris de zéro avec une structure claire : site vitrine séparé de l'API backend.

## Structure

```
afripay/
├── client/          Site vitrine (HTML/CSS/JS, sans dépendance)
│   ├── index.html
│   ├── inscription.html
│   └── icon.svg
└── server/          API backend (Node.js/Express + MongoDB)
    ├── server.js
    ├── config/
    ├── controllers/
    ├── models/
    ├── middleware/
    └── routes/
```

## Démarrer le backend en local

```bash
cd server
cp .env.example .env   # puis renseigner MONGODB_URI et JWT_SECRET
npm install
npm run dev
```

L'API démarre sur `http://localhost:5000`. Vérifier qu'elle tourne avec `GET /api/health`.

## Démarrer le frontend en local

Ouvrir simplement `client/index.html` dans un navigateur.

## Déploiement

- **Frontend** : GitHub Pages ou Netlify (dossier `client/`).
- **Backend** : Render, avec une base MongoDB Atlas (variables d'environnement `MONGODB_URI` et `JWT_SECRET` à définir dans le dashboard).

## Statut

🟡 En cours — flux complet inscription → vérification par code → connexion → tableau de bord, connecté au backend. Taux de change toujours fictifs, pas de vraie passerelle de paiement (dépôt de démonstration uniquement), pas de service SMS/email réel (le code de vérification est loggé côté serveur).
