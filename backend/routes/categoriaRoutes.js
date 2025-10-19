// backend/routes/categoriaRoutes.js
const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');

router.get('/', async (req, res) => {
    try {
        const categorias = await Categoria.findAll({ 
            attributes: ['id_categoria', 'nome'], 
            order: [['nome', 'ASC']] 
        });
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor ao buscar categorias.' });
    }
});
module.exports = router;