// backend/routes/itemRoutes.js — versão final com upload e status funcionando
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configuração do multer para salvar imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

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
router.post('/', auth, upload.single('imagem'), async (req, res) => {
  try {
    console.log('📦 BODY RECEBIDO:', req.body);
    console.log('📎 FILE RECEBIDO:', req.file);

    const idUsuarioLogado = req.usuario.id;

    // Dados vindos do FormData
    const {
      titulo,
      descricao,
      caracteristicas,
      id_categoria,
      id_localizacao_encontrado,
      id_status,
      data_encontrado,
    } = req.body;

    // Verificação básica
    if (!titulo || !descricao || !id_categoria || !id_localizacao_encontrado || !id_status) {
      return res.status(400).json({ msg: 'Campos obrigatórios ausentes no formulário.' });
    }

    // Caminho da imagem, se enviada
    const imagem = req.file ? req.file.filename : null;

    // Criação do item
    const novoItem = await Item.create({
      titulo,
      descricao,
      caracteristicas,
      id_categoria,
      id_localizacao_encontrado,
      id_usuario_cadastrou: idUsuarioLogado,
      id_status,
      data_encontrado,
      imagem,
    });

    res.status(201).json({
      msg: 'Item registrado com sucesso!',
      item: {
        id_item: novoItem.id_item,
        titulo: novoItem.titulo,
        data_encontrado: novoItem.data_encontrado,
        imagem: novoItem.imagem,
      },
    });
  } catch (err) {
    console.error('❌ Erro ao registrar item:', err);
    res.status(500).json({
      msg: 'Erro no servidor ao registrar item.',
      details: err.message,
    });
  }
});

// =========================================================
// ROTA 2: BUSCAR ITENS DO USUÁRIO LOGADO (GET /meus-itens)
// =========================================================
router.get('/meus-itens', auth, async (req, res) => {
  try {
    const idUsuarioLogado = req.usuario.id;

    const meusItens = await Item.findAll({
      where: { id_usuario_cadastrou: idUsuarioLogado },
      order: [['id_item', 'DESC']],
      include: [
        { model: Categoria, as: 'Categoria', attributes: ['nome'] },
        { model: Localizacao, as: 'LocalEncontrado', attributes: ['nome'] },
        { model: StatusItem, as: 'StatusAtual', attributes: ['descricao', 'cor_hex'] },
      ],
    });

    res.status(200).json(meusItens);
  } catch (err) {
    console.error('Erro ao buscar meus itens:', err);
    res.status(500).json({ msg: 'Erro ao buscar seus itens.', details: err.message });
  }
});

// =========================================================
// ROTA 3: LISTAR TODOS OS ITENS (GET - PÚBLICA)
// =========================================================
router.get('/', async (req, res) => {
  try {
    const itens = await Item.findAll({
      order: [['id_item', 'DESC']],
      include: [
        { model: Categoria, as: 'Categoria', attributes: ['nome'] },
        { model: Localizacao, as: 'LocalEncontrado', attributes: ['nome'] },
        { model: StatusItem, as: 'StatusAtual', attributes: ['descricao', 'cor_hex'] },
        { model: Usuario, as: 'CadastradoPor', attributes: ['nome', 'email'] },
      ],
    });

    res.status(200).json(itens);
  } catch (err) {
    console.error('Erro ao listar itens:', err);
    res.status(500).json({ msg: 'Erro no servidor ao listar itens.', details: err.message });
  }
});

// =========================================================
// ROTA 4: BUSCAR ITEM POR ID (GET - PÚBLICA)
// =========================================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByPk(id, {
      include: [
        { model: Categoria, as: 'Categoria', attributes: ['nome'] },
        { model: Localizacao, as: 'LocalEncontrado', attributes: ['nome'] },
        { model: StatusItem, as: 'StatusAtual', attributes: ['descricao', 'cor_hex'] },
        { model: Usuario, as: 'CadastradoPor', attributes: ['nome', 'email'] },
      ],
    });

    if (!item) return res.status(404).json({ msg: 'Item não encontrado.' });

    res.status(200).json(item);
  } catch (err) {
    console.error(`Erro ao buscar item ${req.params.id}:`, err);
    res.status(500).json({ msg: 'Erro no servidor ao buscar item.' });
  }
});

module.exports = router;