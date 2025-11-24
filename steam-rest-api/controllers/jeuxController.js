const express = require('express');
const router = express.Router();
const jeuxService = require('../services/jeuxService');

router.get('/', async (req, res) => {
  try {
    const jeux = await jeuxService.getAllJeux();
    res.json(jeux);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const jeu = await jeuxService.getJeux(req.params.id);
    if (jeu) {
      res.status(200).json(jeu);
    } else {
      res.status(404).json(null);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const nouveauJeu = await jeuxService.createJeu(req.body);
    res.status(201).json(nouveauJeu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const jeu = await jeuxService.updateJeu(req.params.id, req.body);
    res.json(jeu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await jeuxService.deleteJeu(req.params.id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Jeu non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  // Dans jeuxController.js, ajoute :
router.get('/utilisateurs/:id/jeux', async (req, res) => {
  try {
    const jeux = await jeuxService.getJeuxByUtilisateur(req.params.id);
    res.json(jeux);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
});

module.exports = router;