// backend/routes/localizacaoRoutes.js
const express = require('express');
const router = express.Router();
const Localizacao = require('../models/Localizacao'); 


router.get('/', async (req, res) => {
    try {
        
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