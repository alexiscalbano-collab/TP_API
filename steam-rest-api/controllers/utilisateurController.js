const express = require('express');
const router = express.Router();
const utilisateurService = require('../services/utilisateurService');
const bibliothequeJeuxService = require('../services/bibliothequeJeuxService'); // ✔ manquait !

// =====================
// ROUTES UTILISATEURS
// =====================

router.get('/', async (req, res) => {
  try {
    const utilisateurs = await utilisateurService.getAllUtilisateurs();
    res.json(utilisateurs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const utilisateur = await utilisateurService.getUtilisateur(req.params.id);
    if (utilisateur) {
      res.status(200).json(utilisateur);
    } else {
      res.status(404).json(null);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const nouvelUtilisateur = await utilisateurService.createUtilisateur(req.body);
    res.status(201).json(nouvelUtilisateur);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const utilisateur = await utilisateurService.updateUtilisateur(req.params.id, req.body);
    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await utilisateurService.deleteUtilisateur(req.params.id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// ROUTES BIBLIOTHÈQUE
// =====================

// GET bibliothèque jeux d'un utilisateur
router.get('/:iduser/bibliothequejeux', async (req, res) => {
  try {
    const bibliotheque = await bibliothequeJeuxService.getBibliothequeJeuxByUtilisateurId(
      req.params.iduser
    );
    res.json(bibliotheque);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT mise à jour
router.put('/:iduser/bibliothequejeux/:idjeu', async (req, res) => {
  try {
    const bj = await bibliothequeJeuxService.updateBibliothequeJeuxByUtilisateurIdAndJeuxId(
      req.params.iduser,
      req.params.idjeu, // ✔ CORRIGÉ (avant: idJeux)
      req.body
    );

    if (bj === null) {
      return res.status(404).send();
    }

    res.status(200).json(bj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE suppression
router.delete('/:iduser/bibliothequejeux/:idjeu', async (req, res) => {
  try {
    const bj = await bibliothequeJeuxService.removeBibliothequeJeuxByUtilisateurIdAndJeuxId(
      req.params.iduser,
      req.params.idjeu // ✔ CORRIGÉ
    );

    if (bj === null) {
      return res.status(404).send();
    }

    res.status(200).json(bj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST ajout jeu
router.post('/:iduser/bibliothequejeux/:idjeu', async (req, res) => {
  try {
    const bj = await bibliothequeJeuxService.addJeuToBibliotheque(
      req.params.iduser,
      req.params.idjeu // ✔ CORRIGÉ
    );

    if (bj === null) {
      return res.status(400).json({ error: 'Le jeu est déjà dans la bibliothèque' });
    }

    res.status(201).json(bj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
