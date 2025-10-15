// backend/routes/itemRoutes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware de segurança JWT

// --- Importação dos Modelos ---
const Item = require('../models/Item');
const Usuario = require('../models/Usuario');
const Categoria = require('../models/Categoria');
const Localizacao = require('../models/Localizacao');
const StatusItem = require('../models/StatusItem');

// =========================================================
// ROTA 1: CRIAR NOVO ITEM (POST - PROTEGIDA)
// =========================================================
// POST /api/itens
router.post('/', auth, async (req, res) => {
    try {
        // ID do usuário logado vem do token JWT
        const idUsuarioLogado = req.usuario.id;

        const {
            titulo,
            descricao,
            caracteristicas,
            id_categoria,
            id_localizacao_encontrado,
            data_encontrado
        } = req.body;

        const novoItem = await Item.create({
            titulo,
            descricao,
            caracteristicas,
            id_categoria,
            id_localizacao_encontrado,
            id_usuario_cadastrou: idUsuarioLogado,
            data_encontrado,
        });

        res.status(201).json({
            msg: 'Item registrado com sucesso!',
            item: { id_item: novoItem.id_item, titulo: novoItem.titulo, data_encontrado: novoItem.data_encontrado }
        });

    } catch (err) {
        console.error('Erro ao registrar item:', err);
        res.status(500).json({ msg: 'Erro no servidor ao registrar item.', details: err.message });
    }
});


// =========================================================
// ROTA 2: LISTAR TODOS OS ITENS (GET - PÚBLICA)
// =========================================================
// GET /api/itens
router.get('/', async (req, res) => {
    try {
        const itens = await Item.findAll({
            order: [['id_item', 'DESC']],
            include: [
                { model: Categoria, as: 'Categoria', attributes: ['nome'] },
                { model: Localizacao, as: 'LocalEncontrado', attributes: ['nome'] },
                { model: StatusItem, as: 'StatusAtual', attributes: ['descricao', 'cor_hex'] },
                { model: Usuario, as: 'CadastradoPor', attributes: ['nome', 'email'] }
            ]
        });

        res.status(200).json(itens);

    } catch (err) {
        console.error('Erro ao listar itens:', err);
        res.status(500).json({ msg: 'Erro no servidor ao listar itens.', details: err.message });
    }
});


// =========================================================
// ROTA 3: BUSCAR ITEM POR ID (GET - PÚBLICA)
// =========================================================
// GET /api/itens/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Item.findByPk(id, {
            include: [
                { model: Categoria, as: 'Categoria', attributes: ['nome'] },
                { model: Localizacao, as: 'LocalEncontrado', attributes: ['nome'] },
                { model: StatusItem, as: 'StatusAtual', attributes: ['descricao', 'cor_hex'] },
                { model: Usuario, as: 'CadastradoPor', attributes: ['nome', 'email'] }
            ]
        });

        if (!item) {
            return res.status(404).json({ msg: 'Item não encontrado.' });
        }

        res.status(200).json(item);

    } catch (err) {
        console.error(`Erro ao buscar item ${req.params.id}:`, err);
        res.status(500).json({ msg: 'Erro no servidor ao buscar item.' });
    }
});


// =========================================================
// ROTA 4: ATUALIZAR UM ITEM (PUT - PROTEGIDA)
// =========================================================
// PUT /api/itens/:id
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const idUsuarioLogado = req.usuario.id;

        const item = await Item.findByPk(id);

        if (!item) {
            return res.status(404).json({ msg: 'Item não encontrado.' });
        }

        if (item.id_usuario_cadastrou !== idUsuarioLogado) {
            return res.status(403).json({ msg: 'Acesso negado. Você só pode atualizar itens que você cadastrou.' });
        }

        const dadosAtualizados = req.body;

        await item.update(dadosAtualizados);

        res.status(200).json({ msg: 'Item atualizado com sucesso!', item });

    } catch (err) {
        console.error(`Erro ao atualizar item ${req.params.id}:`, err);
        res.status(500).json({ msg: 'Erro no servidor ao atualizar item.' });
    }
});


// =========================================================
// ROTA 5: DELETAR UM ITEM (DELETE - PROTEGIDA)
// =========================================================
// DELETE /api/itens/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const idUsuarioLogado = req.usuario.id;

        const item = await Item.findByPk(id);

        if (!item) {
            return res.status(404).json({ msg: 'Item não encontrado.' });
        }

        if (item.id_usuario_cadastrou !== idUsuarioLogado) {
            return res.status(403).json({ msg: 'Acesso negado. Você só pode deletar itens que você cadastrou.' });
        }

        await item.destroy();

        res.status(200).json({ msg: 'Item deletado com sucesso!' });

    } catch (err) {
        console.error(`Erro ao deletar item ${req.params.id}:`, err);
        res.status(500).json({ msg: 'Erro no servidor ao deletar item.' });
    }
});

module.exports = router;