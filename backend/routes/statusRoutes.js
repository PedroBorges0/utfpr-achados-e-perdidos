const express = require('express');
const router = express.Router();
const StatusItem = require('../models/StatusItem');

// GET /api/statusitens
router.get('/', async (req, res) => {
  try {
    const status = await StatusItem.findAll({
      attributes: ['id_status', 'descricao', 'cor_hex'],
      order: [['id_status', 'ASC']],
    });
    res.status(200).json(status);
  } catch (error) {
    console.error(' Erro ao listar status:', error);
    res.status(500).json({ msg: 'Erro no servidor ao buscar status.' });
  }
});

module.exports = router;