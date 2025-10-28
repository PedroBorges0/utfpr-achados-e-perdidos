// backend/routes/itemroutes.js
const express = require('express');
const router = express.Router(); 
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');


const Item = require('../models/Item');
const Usuario = require('../models/Usuario');
const Categoria = require('../models/Categoria');
const Localizacao = require('../models/Localizacao');
const StatusItem = require('../models/StatusItem');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nomeArquivo = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, nomeArquivo);
  }
});
const upload = multer({ storage });


router.post('/', auth, upload.single('imagem'), async (req, res) => {
  try {
    const idUsuarioLogado = req.usuario.id;

    const {
      titulo,
      descricao,
      caracteristicas,
      id_categoria,
      id_localizacao_encontrado,
      id_status, 
      data_encontrado
    } = req.body;

    const imagem = req.file ? req.file.filename : null;

    const novoItem = await Item.create({
      titulo,
      descricao,
      caracteristicas,
      id_categoria,
      id_localizacao_encontrado,
      id_status: id_status || 1, 
      id_usuario_cadastrou: idUsuarioLogado,
      data_encontrado,
      imagem,
    });

    res.status(201).json({
      msg: '✅ Item registrado com sucesso!',
      item: {
        id_item: novoItem.id_item,
        titulo: novoItem.titulo,
        id_status: novoItem.id_status,
        data_encontrado: novoItem.data_encontrado,
        imagem: novoItem.imagem
      }
    });

  } catch (err) {
    console.error('Erro ao registrar item:', err);
    res.status(500).json({ msg: 'Erro no servidor ao registrar item.', details: err.message });
  }
});

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

module.exports = router;