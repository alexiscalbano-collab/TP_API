const express = require('express');
const router = express.Router();
const achatsService = require('../services/achatsService');

router.get('/', async (req, res) => {
  try {
    const achats = await achatsService.getAllAchats();
    res.json(achats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/achats', async (req, res) => {
  try {
    const achats = await achatsService.getAchatsByUtilisateur(req.params.id);
    res.json(achats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const achat = await achatsService.createAchat(req.body);
    res.status(201).json(achat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
