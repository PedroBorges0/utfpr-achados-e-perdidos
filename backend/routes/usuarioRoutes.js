    // backend/routes/usuarioRoutes.js (VERSÃO FINAL E ESTÁVEL)

    const express = require('express');
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken'); 
    const Usuario = require('../models/Usuario');
    const auth = require('../middleware/auth'); 

    
    const multer = require('multer'); 
    const path = require('path');
    const fs = require('fs');
    

    const router = express.Router();

    const getJwtSecret = () => (process.env.JWT_SECRET || 'fallback_secret_for_dev_mode').trim();
    const UPLOADS_DIR = path.join(__dirname, '../uploads/avatares');

    if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    
    const storage = multer.diskStorage({
        destination: (req, file, cb) => { cb(null, UPLOADS_DIR); },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); 
            const ext = path.extname(file.originalname);
            cb(null, 'avatar-' + uniqueSuffix + ext);
        },
    });
    const upload = multer({ storage });


    router.post('/cadastro', async (req, res) => {
        try {
            const { nome, email, senha } = req.body;
            const usuarioExistente = await Usuario.findOne({ where: { email } });
            if (usuarioExistente) return res.status(400).json({ msg: 'Email já cadastrado.' });
            const salt = await bcrypt.genSalt(10);
            const senhaCriptografada = await bcrypt.hash(senha, salt);
            await Usuario.create({ nome, email, senha: senhaCriptografada });
            res.status(201).json({ msg: 'Usuário cadastrado com sucesso!' });
        } catch (err) {
            console.error('Erro no cadastro:', err);
            res.status(500).json({ msg: 'Erro no servidor.' });
        }
    });


    
    router.post('/login', async (req, res) => {
        try {
            const { email, senha } = req.body;
            const usuario = await Usuario.findOne({ where: { email } });
            if (!usuario) return res.status(404).json({ msg: 'Credenciais inválidas.' });

            const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
            if (!senhaCorreta) return res.status(401).json({ msg: 'Credenciais inválidas.' });
            
            const userId = usuario.id_usuario; 
            const jwtSecret = getJwtSecret();
            const token = jwt.sign({ id: userId, nome: usuario.nome }, jwtSecret, { expiresIn: '24h' });

            const usuarioDados = { id: userId, nome: usuario.nome, email: usuario.email };
            return res.status(200).json({ msg: 'Login bem-sucedido!', token, usuario: usuarioDados });

        } catch (err) {
            console.error('Erro no login (após sucesso de senha):', err);
            res.status(500).json({ msg: 'Erro no servidor.' });
        }
    });


    
    router.get('/me', auth, async (req, res) => {
        try {
            const idUsuarioLogado = req.usuario.id; 
            const usuario = await Usuario.findByPk(idUsuarioLogado, {
                attributes: ['id_usuario', 'nome', 'email', 'telefone', 'tipo', 'ativo', 'avatar_url']
            });
            if (!usuario) return res.status(404).json({ msg: 'Usuário não encontrado.' });
            res.status(200).json(usuario);
        } catch (err) {
            console.error('Erro ao buscar perfil:', err);
            res.status(500).json({ msg: 'Erro no servidor ao buscar perfil.' });
        }
    });


    
    router.put('/me', auth, upload.single('avatar'), async (req, res) => { 
        try {
            const idUsuarioLogado = req.usuario.id; 
            const { nome, email, telefone, senha } = req.body;
            
            const novoAvatar = req.file ? req.file.filename : null; 
            const usuario = await Usuario.findByPk(idUsuarioLogado);

            if (!usuario) {
                if (novoAvatar) fs.unlinkSync(path.join(UPLOADS_DIR, novoAvatar));
                return res.status(404).json({ msg: 'Usuário não encontrado.' });
            }
            
            const dadosAtualizados = {};
            
            
            if (nome && nome.trim() !== '') dadosAtualizados.nome = nome;
            if (email && email.trim() !== '') dadosAtualizados.email = email;
            
            
            if (telefone || telefone === '') dadosAtualizados.telefone = telefone; 
            
            
            if (senha) {
                const salt = await bcrypt.genSalt(10);
                dadosAtualizados.senha = await bcrypt.hash(senha, salt);
            }
            
            
            if (novoAvatar) {
                if (usuario.avatar_url && fs.existsSync(path.join(UPLOADS_DIR, usuario.avatar_url))) {
                    fs.unlinkSync(path.join(UPLOADS_DIR, usuario.avatar_url));
                }
                dadosAtualizados.avatar_url = novoAvatar;
            }

            await usuario.update(dadosAtualizados);

            
            const perfilAtualizado = {
                id_usuario: usuario.id_usuario, nome: usuario.nome, email: usuario.email,
                telefone: usuario.telefone, avatar_url: usuario.avatar_url,
            };

            res.status(200).json({ msg: 'Perfil atualizado com sucesso!', usuario: perfilAtualizado });

        } catch (err) {
            if (req.file) fs.unlinkSync(path.join(UPLOADS_DIR, req.file.filename)); 
            const errorMessage = err.message || 'Erro de servidor desconhecido.';
            
            if (errorMessage.includes('unique constraint')) {
                return res.status(400).json({ msg: 'Erro: Este e-mail já está em uso por outro usuário.' });
            }
            
            console.error('Erro ao atualizar perfil:', err);
            res.status(500).json({ msg: 'Erro ao atualizar perfil.' });
        }
    });


    module.exports = router;