
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); 

const Item = require('../models/Item');
const Usuario = require('../models/Usuario');
const Categoria = require('../models/Categoria');
const Localizacao = require('../models/Localizacao');
const StatusItem = require('../models/StatusItem');

const UPLOADS_DIR = path.join(__dirname, '../uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
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
            data_encontrado,
        } = req.body;

        
        const imagem = req.file ? req.file.filename : null;

        
        if (!titulo || !descricao || !id_categoria || !id_localizacao_encontrado || !id_status) {
            if (imagem) fs.unlinkSync(path.join(UPLOADS_DIR, imagem)); 
            return res.status(400).json({ msg: 'Campos obrigatórios ausentes no formulário.' });
        }

        const novoItem = await Item.create({
            titulo,
            descricao,
            caracteristicas,
            id_categoria: parseInt(id_categoria), 
            id_localizacao_encontrado: parseInt(id_localizacao_encontrado), 
            id_usuario_cadastrou: idUsuarioLogado,
            id_status: parseInt(id_status),
            data_encontrado,
            imagem,
        });

        res.status(201).json({
            msg: 'Item registrado com sucesso!',
            item: { id_item: novoItem.id_item, titulo: novoItem.titulo, imagem: novoItem.imagem },
        });
    } catch (err) {
        if (req.file) fs.unlinkSync(path.join(UPLOADS_DIR, req.file.filename));
        console.error('❌ Erro ao registrar item:', err);
        res.status(500).json({
            msg: 'Erro no servidor ao registrar item.',
            details: err.message,
        });
    }
});


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


router.put('/:id', auth, upload.single('imagem'), async (req, res) => {
    try {
        const { id } = req.params;
        const idUsuarioLogado = req.usuario.id;
        
        const { titulo, descricao, id_categoria, id_localizacao_encontrado, id_status } = req.body;
        const novaImagem = req.file ? req.file.filename : null;

        const item = await Item.findByPk(id);

        if (!item) {
            if (novaImagem) fs.unlinkSync(path.join(UPLOADS_DIR, novaImagem));
            return res.status(404).json({ msg: 'Item não encontrado.' });
        }

        if (item.id_usuario_cadastrou !== idUsuarioLogado) {
            if (novaImagem) fs.unlinkSync(path.join(UPLOADS_DIR, novaImagem));
            return res.status(403).json({ msg: 'Acesso negado. Você só pode atualizar itens que você cadastrou.' });
        }
        
        if (novaImagem && item.imagem) {
            const oldImagePath = path.join(UPLOADS_DIR, item.imagem);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }
        
       
        const dadosAtualizados = {
            ...req.body,
            id_categoria: parseInt(id_categoria),
            id_localizacao_encontrado: parseInt(id_localizacao_encontrado),
            id_status: parseInt(id_status),
            imagem: novaImagem || item.imagem, 
        };

        await item.update(dadosAtualizados);

        res.status(200).json({ msg: 'Item atualizado com sucesso!', item });
    } catch (err) {
        if (req.file) fs.unlinkSync(path.join(UPLOADS_DIR, req.file.filename));
        console.error(`Erro ao atualizar item ${req.params.id}:`, err);
        res.status(500).json({ msg: 'Erro no servidor ao atualizar item.' });
    }
});



router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const idUsuarioLogado = req.usuario.id;

        const item = await Item.findByPk(id);

        if (!item) return res.status(404).json({ msg: 'Item não encontrado.' });

        if (item.id_usuario_cadastrou !== idUsuarioLogado) {
            return res.status(403).json({ msg: 'Acesso negado. Você só pode deletar itens que você cadastrou.' });
        }
        
        
        if (item.imagem) {
            const imagePath = path.join(UPLOADS_DIR, item.imagem);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await item.destroy();

        res.status(200).json({ msg: 'Item deletado com sucesso!' });
    } catch (err) {
        console.error(`Erro ao deletar item ${req.params.id}:`, err);
        res.status(500).json({ msg: 'Erro no servidor ao deletar item.' });
    }
});

module.exports = router;