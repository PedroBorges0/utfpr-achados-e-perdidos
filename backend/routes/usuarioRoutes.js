// backend/routes/usuarioRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Importado JWT
const Usuario = require('../models/Usuario');

const router = express.Router();

// Rota de Cadastro de Usuário
// POST /api/usuarios/cadastro
router.post('/cadastro', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ msg: 'Email já cadastrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        await Usuario.create({
            nome,
            email,
            senha: senhaCriptografada
        });

        res.status(201).json({ msg: 'Usuário cadastrado com sucesso!' });

    } catch (err) {
        console.error('Erro no cadastro:', err);
        res.status(500).json({ msg: 'Erro no servidor.' });
    }
});


// Rota para login de usuário
// POST /api/usuarios/login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ msg: 'Credenciais inválidas.' });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ msg: 'Credenciais inválidas.' });
        }
        
        // ------------------------------------------------------------------
        // --- DEBUG: EXIBE O OBJETO RETORNADO PARA VER SE O ID ESTÁ CORRETO
        console.log('Objeto do Usuário retornado do DB:', usuario.toJSON());
        // ------------------------------------------------------------------

        // Tenta identificar qual é o ID real: id_usuario ou id
        const userId = usuario.id_usuario || usuario.id; 
        
        if (!userId) {
             // Este erro só ocorre se o Sequelize não retornar a PK
            console.error('Sequelize não retornou a Chave Primária (id_usuario ou id).');
            return res.status(500).json({ msg: 'Erro de mapeamento da chave primária.' });
        }

        // --- GERAÇÃO DO TOKEN ---
        // backend/routes/usuarioRoutes.js - NA ROTA DE LOGIN

// ...
        // 1. Garante que JWT_SECRET é uma string limpa. Se for undefined, usa uma string vazia (que falhará, mas com erro claro).
        const jwtSecret = (process.env.JWT_SECRET || 'fallback_secret').trim();
        
        // --- GERAÇÃO DO TOKEN ---
        const token = jwt.sign(
            { id: usuario.id_usuario, nome: usuario.nome },
            jwtSecret, // Usa a chave limpa
            { expiresIn: '24h' }
        );
// ...
        // Prepara os dados para o cliente
        const usuarioDados = {
            id: userId, // Usa o userId
            nome: usuario.nome,
            email: usuario.email
        };

        // 3. Login bem-sucedido! Envia o token e os dados
        return res.status(200).json({ 
            msg: 'Login bem-sucedido!', 
            token, 
            usuario: usuarioDados
        });

    } catch (err) {
        // Agora, o console.error vai capturar qualquer erro na lógica ou no JWT
        console.error('Erro no login (após sucesso de senha):', err);
        res.status(500).json({ msg: 'Erro no servidor.' });
    }
});

module.exports = router;