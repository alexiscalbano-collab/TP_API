const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// Import des controllers
const utilisateurController = require('./controllers/utilisateurController');
const bibliothequeJeuxController = require('./controllers/bibliothequeJeuxController');
const jeuxController = require('./controllers/jeuxController');
const achatsController = require('./controllers/achatsController');

// ROUTES =====================================

// Utilisateurs
app.use('/utilisateurs', utilisateurController);

// Jeux
app.use('/jeux', jeuxController);

// Achats
app.use('/achats', achatsController);


// ROUTE RACINE ===============================
app.get('/', (req, res) => {
  res.json({
    message: '🎮 Steam REST Application - Node.js + PostgreSQL',
    version: '1.0.0',
    architecture: 'Repository → Service → Controller',
    endpoints: {
      utilisateurs: {
        'GET /utilisateurs': 'Liste tous les utilisateurs',
        'GET /utilisateurs/:id': 'Récupère un utilisateur',
        'POST /utilisateurs': 'Crée un utilisateur',
        'PUT /utilisateurs/:id': 'Met à jour un utilisateur',
        'DELETE /utilisateurs/:id': 'Supprime un utilisateur'
      },
      jeux: {
        'GET /jeux': 'Liste tous les jeux',
        'GET /jeux/:id': 'Récupère un jeu',
        'POST /jeux': 'Crée un jeu',
        'PUT /jeux/:id': 'Met à jour un jeu',
        'DELETE /jeux/:id': 'Supprime un jeu'
      },
      bibliotheque: {
         'GET /utilisateurs':'Bibliothèque d’un utilisateur',
        'POST /utilisateurs': 'Ajoute un jeu à la bibliothèque',
        'PUT /utilisateurs/:id': 'Met à jour un jeu dans la bibliothèque',
        'DELETE /utilisateurs/:id': 'Supprime un jeu de la bibliothèque'
      },
      achats: {
        'GET /achats': 'Liste tous les achats',
        'GET /utilisateurs/:id/achats': 'Liste les achats d’un utilisateur',
        'POST /achats': 'Enregistre un achat'
      }
    }
  });
});

// Démarrage du serveur =======================
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🎮 Steam REST Application - Node.js + PostgreSQL');
  console.log('='.repeat(60));
  console.log(`📡 Serveur démarré sur: http://localhost:${PORT}`);
  console.log(`🔗 CORS activé pour: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  console.log(`📚 Documentation: http://localhost:${PORT}/`);
  console.log(`💾 Base de données: PostgreSQL`);
  console.log('='.repeat(60) + '\n');
});

module.exports = app;
