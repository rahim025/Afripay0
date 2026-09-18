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

🟡 Squelette — routes d'authentification, profil utilisateur et transfert en place (avec taux de change fictifs), à connecter au frontend et à enrichir.
