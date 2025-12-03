// backend/routes/localizacaoRoutes.js
const express = require('express');
const router = express.Router();
const Localizacao = require('../models/Localizacao'); // Importa o Modelo Localizacao

// Rota pública para listar todas as localizações
// GET /api/localizacoes
router.get('/', async (req, res) => {
    try {
        // Busca todos os registros, selecionando apenas o ID e o Nome
        const localizacoes = await Localizacao.findAll({ 
            attributes: ['id_localizacao', 'nome'], 
            order: [['nome', 'ASC']] 
        });
        
        res.status(200).json(localizacoes);

    } catch (error) {
        console.error("Erro ao buscar localizações:", error);
        res.status(500).json({ msg: 'Erro no servidor ao buscar localizações.' });
    }
});

module.exports = router;